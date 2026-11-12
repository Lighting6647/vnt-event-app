import { Client } from 'ssh2';

const config = {
  host: '119.59.116.130',
  port: 22,
  username: 'root',
  password: 'Md7_]8=No2+^',
  readyTimeout: 30000,
};

function runRemoteCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`\n⚙️ [REMOTE EXEC]: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let stdout = '';
      let stderr = '';
      stream
        .on('close', (code) => {
          if (code === 0) resolve(stdout);
          else resolve(stdout || stderr);
        })
        .on('data', (data) => {
          stdout += data;
          process.stdout.write(data);
        })
        .stderr.on('data', (data) => {
          stderr += data;
          process.stderr.write(data);
        });
    });
  });
}

async function configureDomainNginx() {
  const conn = new Client();
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect(config);
  });

  console.log('✅ Connected. Setting up Domain Routing & Installing Certbot...');

  // Install Certbot for Let's Encrypt SSL
  await runRemoteCommand(conn, 'DEBIAN_FRONTEND=noninteractive apt-get install -y certbot python3-certbot-nginx');

  const domainConf = `
# 1. Main Concert App (stage-hubs.com, www.stage-hubs.com, and direct IP)
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name stage-hubs.com www.stage-hubs.com 119.59.116.130;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\$host;
        proxy_cache_bypass \\$http_upgrade;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;
    }

    location /tour/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\$host;
        proxy_cache_bypass \\$http_upgrade;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}

# 2. Dedicated Tour App Subdomain (tour.stage-hubs.com)
server {
    listen 80;
    listen [::]:80;
    server_name tour.stage-hubs.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\$host;
        proxy_cache_bypass \\$http_upgrade;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;

        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
`.trim();

  await runRemoteCommand(conn, `cat << 'EOF' > /etc/nginx/sites-available/default\n${domainConf}\nEOF`);
  await runRemoteCommand(conn, 'nginx -t');
  await runRemoteCommand(conn, 'systemctl reload nginx');

  console.log('\n🎉 Nginx Domain Routing & Certbot are fully prepared!');
  conn.end();
}

configureDomainNginx().catch(console.error);
