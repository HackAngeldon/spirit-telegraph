// Kiro PreToolUse hook: blocks agent writes to real secret files.
// Kiro passes the tool call as JSON on stdin. Exit code 2 blocks the call; 0 allows it.
// Allowed: .env.example. Blocked: .env, .env.local, .env.production, and so on.

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let payload;
  try {
    payload = JSON.parse(raw || '{}');
  } catch {
    process.exit(0); // Not our business if the payload isn't JSON.
  }

  const input = payload && typeof payload.tool_input === 'object' ? payload.tool_input : {};

  // Look only at fields that name a file, so that file *contents* mentioning ".env" don't trigger a block.
  const paths = Object.entries(input)
    .filter(([key, value]) => /path|file|target/i.test(key) && typeof value === 'string')
    .map(([, value]) => value);

  const secretFile = paths.find((p) => {
    const name = p.split(/[\\/]/).pop() ?? '';
    return /^\.env(\..+)?$/.test(name) && name !== '.env.example';
  });

  if (secretFile) {
    process.stderr.write(
      `Blocked: agents may not write ${secretFile}. Add secrets to .env yourself; commit only .env.example.\n`,
    );
    process.exit(2);
  }
  process.exit(0);
});
