# Hosting-Script

## What is `index.js`?

The `index.js` file is the main script for this project. It is designed to automate the process of initializing and launching multiple Discord bot applications, each located in its own subfolder. Here is what it does:

- **Bot Folder Management:**
	- It looks for specific bot folders (Cleaner, Premium, Schedule, Tracker, GCommunity, Filter) in the project directory.
- **Dependency Installation:**
	- For each bot, it checks if `node_modules` exists. If not, it automatically runs `npm install` in that folder to install dependencies, provided that `package.json` and `package-lock.json` are present.
- **Entry File Detection:**
	- It searches for the main entry file for each bot (`index.js` or `src/index.js` for JavaScript, and `index.ts` or `src/index.ts` for TypeScript).
- **Bot Launching:**
	- If the entry file is JavaScript, it uses Node.js to launch the bot with `fork`.
	- If the entry file is TypeScript, it uses `npx ts-node` to launch the bot.
- **Sequential Startup:**
	- Bots are started one after another, with a 5-second delay between each to avoid resource spikes and make logs easier to follow.
- **Logging:**
	- The script provides clear console output for each step, including missing files, dependency installation, and bot startup status.

This script is useful for managing multiple Discord bots in a single environment, ensuring each has its dependencies installed and is started in a controlled, sequential manner.
