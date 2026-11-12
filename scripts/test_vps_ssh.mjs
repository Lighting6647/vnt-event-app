import { Client } from 'ssh2';

const conn = new Client();
const config = {
  host: '119.59.116.130',
  port: 22,
  username: 'root',
  password: 'Md7_]8=No2+^',
  readyTimeout: 20000,
};

console.log('Connecting to VPS:', config.host, '...');

conn
  .on('ready', () => {
    console.log('✅ SSH Connection Ready!');
    conn.exec('uname -a && free -h && df -h && nproc', (err, stream) => {
      if (err) throw err;
      let output = '';
      stream
        .on('close', (code, signal) => {
          console.log('Stream closed with code:', code);
          console.log('--- OUTPUT ---');
          console.log(output);
          console.log('--- END OUTPUT ---');
          conn.end();
        })
        .on('data', (data) => {
          output += data;
        })
        .stderr.on('data', (data) => {
          console.error('STDERR: ' + data);
        });
    });
  })
  .on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
  })
  .connect(config);
