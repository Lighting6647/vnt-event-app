/**
 * 190 Concurrent Users Load & Stress Test Suite
 * Tour & Event Management System (VNT Tour App)
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'http://localhost:3001';
const CONCURRENT_USERS = 190;
const DB_PATH = path.join(__dirname, '..', 'data', 'database.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'database.json.stress_bak');

// Helper for HTTP requests
function httpRequest(urlStr, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const start = performance.now();
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        timeout: options.timeout || 15000,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          const latencyMs = performance.now() - start;
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body,
            latencyMs,
          });
        });
      }
    );

    req.on('error', (err) => {
      const latencyMs = performance.now() - start;
      reject({ error: err.message, latencyMs });
    });

    req.on('timeout', () => {
      req.destroy();
      const latencyMs = performance.now() - start;
      reject({ error: 'Request Timeout', latencyMs });
    });

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

function calculateStats(latencies) {
  if (!latencies.length) return { min: 0, max: 0, avg: 0, p95: 0, p99: 0 };
  const sorted = [...latencies].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const avg = sum / sorted.length;
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  return {
    min: min.toFixed(2),
    max: max.toFixed(2),
    avg: avg.toFixed(2),
    p95: p95.toFixed(2),
    p99: p99.toFixed(2),
  };
}

async function runBenchmark() {
  console.log('='.repeat(70));
  console.log(`🚀 STARTING STRESS TEST: ${CONCURRENT_USERS} CONCURRENT USERS`);
  console.log(`🎯 TARGET: ${BASE_URL}`);
  console.log(`⏱️ TIMESTAMP: ${new Date().toISOString()}`);
  console.log('='.repeat(70));

  // Step 0: Backup DB
  if (fs.existsSync(DB_PATH)) {
    fs.copyFileSync(DB_PATH, BACKUP_PATH);
    console.log('💾 Database backed up to:', BACKUP_PATH);
  }

  // -------------------------------------------------------------
  // TEST 1: 190 Concurrent GET /api/participants
  // -------------------------------------------------------------
  console.log(`\n[TEST 1/5] Simulating ${CONCURRENT_USERS} users opening the app at once (GET /api/participants)...`);
  const t1Start = performance.now();
  const t1Promises = Array.from({ length: CONCURRENT_USERS }).map((_, i) =>
    httpRequest(`${BASE_URL}/api/participants`).catch((e) => e)
  );

  const t1Results = await Promise.all(t1Promises);
  const t1TotalTime = performance.now() - t1Start;
  const t1Success = t1Results.filter((r) => r.statusCode === 200);
  const t1Failed = t1Results.filter((r) => r.statusCode !== 200);
  const t1Latencies = t1Results.map((r) => r.latencyMs);
  const t1Stats = calculateStats(t1Latencies);

  console.log(`   ✅ Success: ${t1Success.length}/${CONCURRENT_USERS} (Failures: ${t1Failed.length})`);
  console.log(`   ⏱️ Total Batch Time: ${t1TotalTime.toFixed(2)} ms`);
  console.log(`   📊 Latency: Min: ${t1Stats.min}ms | Avg: ${t1Stats.avg}ms | P95: ${t1Stats.p95}ms | P99: ${t1Stats.p99}ms | Max: ${t1Stats.max}ms`);

  // -------------------------------------------------------------
  // TEST 2: 190 Concurrent GET /api/participants/:id
  // -------------------------------------------------------------
  console.log(`\n[TEST 2/5] Simulating ${CONCURRENT_USERS} users loading their personal digital passes (GET /api/participants/:id)...`);
  const rawDb = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const realIds = rawDb.map((p) => p.id);

  const t2Start = performance.now();
  const t2Promises = Array.from({ length: CONCURRENT_USERS }).map((_, i) => {
    const targetId = realIds[i % realIds.length] || '500';
    return httpRequest(`${BASE_URL}/api/participants/${targetId}`).catch((e) => e);
  });

  const t2Results = await Promise.all(t2Promises);
  const t2TotalTime = performance.now() - t2Start;
  const t2Success = t2Results.filter((r) => r.statusCode === 200);
  const t2Failed = t2Results.filter((r) => r.statusCode !== 200);
  const t2Latencies = t2Results.map((r) => r.latencyMs);
  const t2Stats = calculateStats(t2Latencies);

  console.log(`   ✅ Success: ${t2Success.length}/${CONCURRENT_USERS} (Failures: ${t2Failed.length})`);
  console.log(`   ⏱️ Total Batch Time: ${t2TotalTime.toFixed(2)} ms`);
  console.log(`   📊 Latency: Min: ${t2Stats.min}ms | Avg: ${t2Stats.avg}ms | P95: ${t2Stats.p95}ms | P99: ${t2Stats.p99}ms | Max: ${t2Stats.max}ms`);

  // -------------------------------------------------------------
  // TEST 3: 190 Concurrent SSE Real-Time Connections (/api/stream)
  // -------------------------------------------------------------
  console.log(`\n[TEST 3/5] Connecting ${CONCURRENT_USERS} persistent Server-Sent Events (SSE) clients concurrently (/api/stream)...`);
  const activeSseRequests = [];
  let sseConnectedCount = 0;
  let sseErrorCount = 0;
  const sseStart = performance.now();

  const ssePromises = Array.from({ length: CONCURRENT_USERS }).map((_, i) => {
    return new Promise((resolve) => {
      const url = new URL(`${BASE_URL}/api/stream`);
      const req = http.request(
        {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname,
          method: 'GET',
          headers: {
            Accept: 'text/event-stream',
          },
        },
        (res) => {
          let receivedInitial = false;
          res.on('data', (chunk) => {
            const str = chunk.toString();
            if (str.includes('connected') && !receivedInitial) {
              receivedInitial = true;
              sseConnectedCount++;
              resolve({ success: true, clientIndex: i });
            }
          });
          res.on('error', () => {
            sseErrorCount++;
            resolve({ success: false, clientIndex: i });
          });
        }
      );
      req.on('error', () => {
        sseErrorCount++;
        resolve({ success: false, clientIndex: i });
      });
      activeSseRequests.push(req);
      req.end();
    });
  });

  await Promise.all(ssePromises);
  const sseTotalTime = performance.now() - sseStart;
  console.log(`   ✅ Active SSE Handshakes: ${sseConnectedCount}/${CONCURRENT_USERS} clients connected`);
  console.log(`   ⏱️ Handshake Batch Time: ${sseTotalTime.toFixed(2)} ms`);

  // -------------------------------------------------------------
  // TEST 4: Concurrency Write Storm while 190 SSE clients are receiving live broadcasts
  // -------------------------------------------------------------
  console.log(`\n[TEST 4/5] Concurrency Write Storm: 100 simultaneous score additions while 190 SSE connections are alive...`);
  const t4Start = performance.now();
  const writeCount = 100;
  const t4Promises = Array.from({ length: writeCount }).map((_, i) => {
    const targetId = realIds[i % realIds.length] || '500';
    return httpRequest(
      `${BASE_URL}/api/add-score`,
      { method: 'POST' },
      { id: targetId, points: 5, reason: `Stress Test Iteration ${i}` }
    ).catch((e) => e);
  });

  const t4Results = await Promise.all(t4Promises);
  const t4TotalTime = performance.now() - t4Start;
  const t4Success = t4Results.filter((r) => r.statusCode === 200);
  const t4Failed = t4Results.filter((r) => r.statusCode !== 200);
  const t4Latencies = t4Results.map((r) => r.latencyMs);
  const t4Stats = calculateStats(t4Latencies);

  console.log(`   ✅ Successful Concurrent Writes: ${t4Success.length}/${writeCount} (Failures: ${t4Failed.length})`);
  console.log(`   ⏱️ Total Write Batch Time: ${t4TotalTime.toFixed(2)} ms`);
  console.log(`   📊 Write Latency: Min: ${t4Stats.min}ms | Avg: ${t4Stats.avg}ms | P95: ${t4Stats.p95}ms | P99: ${t4Stats.p99}ms | Max: ${t4Stats.max}ms`);

  // -------------------------------------------------------------
  // TEST 5: Database Integrity & Event Loop Health Check
  // -------------------------------------------------------------
  console.log(`\n[TEST 5/5] Checking Database Integrity and Event Loop Health...`);
  let dbHealthy = false;
  let recordCount = 0;
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    recordCount = parsed.length;
    dbHealthy = Array.isArray(parsed) && recordCount > 0;
  } catch (err) {
    dbHealthy = false;
    console.error('   ❌ Database Corrupted during stress:', err.message);
  }

  // Ping server health
  const healthCheck = await httpRequest(`${BASE_URL}/api/server-info`);
  console.log(`   📦 Database Integrity: ${dbHealthy ? 'PASS (Valid JSON, ' + recordCount + ' records)' : 'FAIL'}`);
  console.log(`   💓 Server Responsive Post-Stress: ${healthCheck.statusCode === 200 ? 'YES (HTTP 200 in ' + healthCheck.latencyMs.toFixed(2) + 'ms)' : 'NO'}`);

  // Disconnect SSE clients
  for (const req of activeSseRequests) {
    try {
      req.destroy();
    } catch {}
  }

  // Restore DB backup
  if (fs.existsSync(BACKUP_PATH)) {
    fs.copyFileSync(BACKUP_PATH, DB_PATH);
    fs.unlinkSync(BACKUP_PATH);
    console.log(`\n🧹 Cleaned up: Database restored to pristine state.`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('🏁 FINAL VERDICT & SUMMARY');
  console.log('='.repeat(70));
  const hasHangs = t1Failed.length > 0 || t2Failed.length > 0 || t4Failed.length > 0 || healthCheck.statusCode !== 200;
  if (!hasHangs) {
    console.log('🎉 RESULT: PASSED! ระบบไม่ค้าง ทำงานลื่นไหล 100% ภายใต้โหลด 190 คนพร้อมกัน');
  } else {
    console.log('⚠️ RESULT: DETECTED BOTTLENECK OR FAILURES');
  }
}

runBenchmark().catch(console.error);
