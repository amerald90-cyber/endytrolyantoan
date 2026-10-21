const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

const filesToCheck = new Set();

const srcMatches = html.matchAll(/(?:src|href)="([^"]+)"/g);
for (const m of srcMatches) {
    if (!m[1].startsWith('http') && !m[1].startsWith('#')) {
        filesToCheck.add(m[1]);
    }
}

const cssMatches = css.matchAll(/url\(['"]?([^'")]+)['"]?\)/g);
for (const m of cssMatches) {
    if (!m[1].startsWith('http') && !m[1].startsWith('data:')) {
        filesToCheck.add(m[1]);
    }
}

const jsMatches = js.matchAll(/['"](assets\/[^'"]+)['"]/g);
for (const m of jsMatches) {
    filesToCheck.add(m[1]);
}

console.log('Files referenced:');
let missing = 0;
filesToCheck.forEach(f => {
    const exists = fs.existsSync(f);
    console.log((exists ? '  [OK] ' : '  [MISSING] ') + f);
    if (!exists) missing++;
});

if (missing === 0) {
    console.log('\n>>> ALL REFERENCED ASSETS EXIST! 100% PERFECT! <<<');
} else {
    console.log('\n>>> WARNING:', missing, 'files missing! <<<');
}
