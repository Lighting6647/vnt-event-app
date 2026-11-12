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
          if (code === 0) {
            resolve(stdout);
          } else {
            console.warn(`Command exited with code ${code}`);
            resolve(stdout || stderr);
          }
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

async function provisionVPS() {
  const conn = new Client();

  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect(config);
  });

  console.log('✅ Connected to VPS. Starting Automated Provisioning Pipeline...');

  // 1. Update APT and install essential packages
  await runRemoteCommand(conn, 'DEBIAN_FRONTEND=noninteractive apt-get update -y && apt-get install -y curl git ufw nginx htop build-essential');

  // 2. Install Node.js 22.x LTS
  await runRemoteCommand(conn, 'curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs');
  await runRemoteCommand(conn, 'node -v && npm -v');

  // 3. Install PM2
  await runRemoteCommand(conn, 'npm install -g pm2');

  // 4. Configure UFW Firewall
  await runRemoteCommand(conn, 'ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw allow 3000/tcp && ufw allow 3001/tcp && ufw --force enable');
  await runRemoteCommand(conn, 'ufw status');

  // 5. Create app directories
  await runRemoteCommand(conn, 'mkdir -p /var/www/tour-app /var/www/concert-app');

  console.log('\n🎉 VPS Provisioning Completed Successfully!');
  conn.end();
}

provisionVPS().catch(console.error);
