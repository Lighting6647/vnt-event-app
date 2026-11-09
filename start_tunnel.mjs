import { startTunnel } from 'untun';

async function run() {
  try {
    console.log('Starting Cloudflare tunnel on port 3001...');
    const tunnel = await startTunnel({ port: 3001 });
    const url = await tunnel.getURL();
    console.log('--------------------------------------------------');
    console.log('PUBLIC_TUNNEL_URL: ' + url);
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('Untun error:', err.message);
  }
}

run();
