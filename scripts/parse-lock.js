const fs = require('fs');
const path = 'package-lock.json';
let s = '';
try {
  s = fs.readFileSync(path, 'utf8');
  JSON.parse(s);
  console.log('VALID_JSON');
} catch (e) {
  const msg = e && e.message ? e.message : String(e);
  const posMatch = msg.match(/in JSON at position (\d+)/i) || msg.match(/position\s*(\d+)/i) || msg.match(/at position (\d+)/i);
  if (posMatch) {
    const pos = Number(posMatch[1]);
    const before = s.slice(0, pos);
    const lines = before.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    console.error(msg);
    console.error(`LINE:${line} COLUMN:${col}`);
    // print surrounding lines for context
    const fileLines = s.split('\n');
    const start = Math.max(0, line - 3);
    const end = Math.min(fileLines.length, line + 2);
    for (let i = start; i < end; i++) {
      const ln = i + 1;
      console.error((ln === line ? '>' : ' ') + ln.toString().padStart(5) + ': ' + fileLines[i]);
    }
    process.exit(1);
  } else {
    console.error(msg);
    process.exit(1);
  }
}
