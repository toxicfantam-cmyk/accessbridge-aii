import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.join(__dirname, 'server');
const clientDir = path.join(__dirname, 'client');

console.log('====================================================');
console.log('🌉 Starting AccessBridge AI Full-Stack Environment');
console.log('📍 Backend: http://localhost:5001');
console.log('📍 Frontend: http://localhost:5173');
console.log('====================================================\n');

const server = spawn('npm', ['run', 'dev'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true
});

const client = spawn('npm', ['run', 'dev'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\n🛑 Shutting down AccessBridge AI services...');
  server.kill('SIGTERM');
  client.kill('SIGTERM');
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
