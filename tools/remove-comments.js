#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const exts = ['.html', '.js', '.css'];

function stripComments(content, ext) {
  if (ext === '.html') {
    return content.replace(/<!--[\s\S]*?-->/g, '');
  }
  
  
  return content.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
}

function shouldIgnore(name) {
  if (name.startsWith('.')) return true;
  if (name === 'node_modules' || name === '.git') return true;
  return false;
}

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (shouldIgnore(entry.name)) continue;
    if (entry.isDirectory()) {
      walk(full, cb);
    } else {
      cb(full);
    }
  }
}

const projectRoot = process.cwd();
const changedFiles = [];

walk(projectRoot, (filePath) => {
  const rel = path.relative(projectRoot, filePath);
  const ext = path.extname(filePath).toLowerCase();
  if (!exts.includes(ext)) return;
  
  if (filePath.endsWith('.bak')) return;
  
  if (rel === 'tools/remove-comments.js') return;

  try {
    const original = fs.readFileSync(filePath, 'utf8');
    const stripped = stripComments(original, ext);
    if (original !== stripped) changedFiles.push(rel);
    if (!dryRun && original !== stripped) {
      fs.copyFileSync(filePath, filePath + '.bak');
      fs.writeFileSync(filePath, stripped, 'utf8');
    }
  } catch (err) {
    console.error('Error processing', rel, err.message);
  }
});

if (changedFiles.length === 0) {
  console.log(dryRun ? '[DRY-RUN] No files would be changed.' : 'No files changed.');
} else {
  console.log(dryRun ? '[DRY-RUN] Files that would be changed:' : 'Files changed:');
  changedFiles.forEach((f) => console.log(' -', f));
}

console.log(dryRun ? 'Dry run complete.' : `Comments removed. Backups saved as .bak files.`);

