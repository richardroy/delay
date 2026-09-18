const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

for (const [browser, filename] of [
  ['chrome', 'delay.zip'],
  ['firefox', 'delay-firefox.xpi']
]) {
  const directory = path.resolve(__dirname, '..', 'dist', browser);
  const archive = path.resolve(__dirname, '..', '..', filename);
  const temporary = archive + '.tmp.zip';
  try {
    // A fresh archive cannot retain files removed since the previous build.
    fs.rmSync(temporary, { force: true });
    execFileSync('zip', ['-q', '-r', temporary, '.'], { cwd: directory, stdio: 'inherit' });
    fs.renameSync(temporary, archive);
  } finally {
    fs.rmSync(temporary, { force: true });
  }
  console.log(`${browser}: ${archive}`);
}
