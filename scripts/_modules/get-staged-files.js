const { execCommand } = require('helpers-fn');

async function getStagedFiles(cwd) {
  const [execResult] = await execCommand({
    command: 'git diff --staged --diff-filter=ACMR --name-only -z',
    cwd,
  });
  if (!execResult) return [];

  return execResult.split('\x00').filter(Boolean);
}

exports.getStagedFiles = getStagedFiles;
