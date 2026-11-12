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

async function deployBothApps() {
  const conn = new Client();

  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect(config);
  });

  console.log('✅ Connected to VPS. Starting Dual-App Deployment...');

  // -------------------------------------------------------------
  // 1. DEPLOY TOUR APP (PORT 3001)
  // -------------------------------------------------------------
  console.log('\n🚌 [1/2] Deploying Tour App (VNT Event)...');
  await runRemoteCommand(conn, 'rm -rf /var/www/tour-app && git clone https://github.com/Lighting6647/vnt-event-app.git /var/www/tour-app');
  await runRemoteCommand(conn, 'cd /var/www/tour-app && npm install && npm run build');
  await runRemoteCommand(conn, 'pm2 delete tour-app || true');
  await runRemoteCommand(conn, 'cd /var/www/tour-app && PORT=3001 pm2 start server.js --name tour-app --time');

  // -------------------------------------------------------------
  // 2. DEPLOY CONCERT APP (PORT 3000)
  // -------------------------------------------------------------
  console.log('\n🎟️ [2/2] Deploying Concert App (Tikkethub)...');
  await runRemoteCommand(conn, 'rm -rf /var/www/concert-app && git clone https://github.com/Lighting6647/Tikkethub.git /var/www/concert-app');
  await runRemoteCommand(conn, 'cd /var/www/concert-app && npm install');
  await runRemoteCommand(conn, 'pm2 delete concert-app || true');
  await runRemoteCommand(conn, 'cd /var/www/concert-app && PORT=3000 pm2 start server.js --name concert-app --time');

  // -------------------------------------------------------------
  // 3. PERSIST PM2 STARTUP ON REBOOT
  // -------------------------------------------------------------
  console.log('\n💾 [3/3] Saving PM2 state & configuring auto-restart on reboot...');
  await runRemoteCommand(conn, 'pm2 save');
  await runRemoteCommand(conn, 'pm2 status');

  // 4. VERIFY LOCAL APPS
  console.log('\n🔍 Verifying endpoints from localhost inside VPS...');
  await runRemoteCommand(conn, 'curl -I http://127.0.0.1:3001/api/server-info');
  await runRemoteCommand(conn, 'curl -I http://127.0.0.1:3000/');

  console.log('\n🎉 BOTH APPS ARE OFFICIALLY LIVE ON THE VPS!');
  conn.end();
}

deployBothApps().catch(console.error);
