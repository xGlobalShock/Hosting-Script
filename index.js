const path = require('node:path');
const fs = require('node:fs');
const { execSync, fork, spawn } = require('child_process');

const botFolders = ['Cleaner', 'Premium', 'Schedule', 'Tracker', 'GCommunity', 'Filter'];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startBotsSequentially() {
  for (const folder of botFolders) {
    const botPath = path.join(__dirname, folder);
    const nodeModulesPath = path.join(botPath, 'node_modules');
    const packageJsonPath = path.join(botPath, 'package.json');
    const packageLockPath = path.join(botPath, 'package-lock.json');
    const scriptInSrcJS = path.join(botPath, 'src', 'index.js');
    const scriptInRootJS = path.join(botPath, 'index.js');
    const scriptInSrcTS = path.join(botPath, 'src', 'index.ts');
    const scriptInRootTS = path.join(botPath, 'index.ts');

    console.log(`\n============================================================\n`);
    console.log(`[${new Date().toLocaleTimeString()}] Initializing App: ${folder}`);
    console.log(`\n============================================================\n`);

    let missing = [];
    if (!fs.existsSync(packageJsonPath)) missing.push('package.json');
    if (!fs.existsSync(packageLockPath)) missing.push('package-lock.json');

    if (missing.length > 0) {
      console.warn(`\n[${new Date().toLocaleTimeString()}] [${folder}] ❌ ｜Missing: ${missing.join(', ')}. Please add them for proper dependency management.`);
      continue;
    }

    if (!fs.existsSync(nodeModulesPath)) {
      console.log(`[${new Date().toLocaleTimeString()}] 📦 ｜Installing ${folder} App dependencies...`);
      try {
        execSync('npm install', { cwd: botPath, stdio: 'inherit' });
          console.log(`[${new Date().toLocaleTimeString()}] ✅ ｜${folder} App Dependencies have been installed.`);
      } catch (err) {
        console.error(`[${new Date().toLocaleTimeString()}] ❌ ｜${folder} App npm install failed:`, err);
        continue;
      }
    } else {
      console.log(`[${new Date().toLocaleTimeString()}] 📦 ｜${folder} App dependencies are already installed.`);
    }

    let scriptPath = null;
    let isTypeScript = false;
    if (fs.existsSync(scriptInSrcJS)) {
      scriptPath = scriptInSrcJS;
    } else if (fs.existsSync(scriptInRootJS)) {
      scriptPath = scriptInRootJS;
    } else if (fs.existsSync(scriptInSrcTS)) {
      scriptPath = scriptInSrcTS;
      isTypeScript = true;
    } else if (fs.existsSync(scriptInRootTS)) {
      scriptPath = scriptInRootTS;
      isTypeScript = true;
    }

    if (!scriptPath) {
      console.warn(`[${new Date().toLocaleTimeString()}] [${folder}] ❌ ｜No entry file found (index.js, src/index.js, index.ts, src/index.ts).`);
      continue;
    }
      
    if (isTypeScript) {
      console.log(`[${new Date().toLocaleTimeString()}] [${folder}] 🚀 ｜Launching TS App: [${folder}]`);
      try {
        spawn('npx', ['ts-node', scriptPath], { cwd: botPath, stdio: 'inherit' });
          console.log(`[${new Date().toLocaleTimeString()}] 🟢 ｜${folder} TS app has started!`);
      } catch (err) {
        console.error(`[${new Date().toLocaleTimeString()}] [${folder}] ❌ ｜Failed to start TypeScript bot:`, err);
      }
    } else {
      console.log(`[${new Date().toLocaleTimeString()}] 🚀 ｜Launching ${folder} App!`);
      try {
        fork(scriptPath, [], { cwd: botPath, stdio: 'inherit' });
          console.log(`[${new Date().toLocaleTimeString()}] 🟢 ｜${folder} app has started!`);
      } catch (err) {
        console.error(`[${new Date().toLocaleTimeString()}] [${folder}] ❌ ｜Failed to start JavaScript bot:`, err);
      }
    }

    console.log(`===================================================================================================`);
    console.log(`[${new Date().toLocaleTimeString()}] [${folder}] ⏳ ｜Waiting 5 seconds before starting next bot...`);
    console.log(`===================================================================================================`);
      
    await sleep(5000);
  }
}

startBotsSequentially();