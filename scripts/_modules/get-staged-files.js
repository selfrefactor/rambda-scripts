const {exec} = require('helpers-fn')

async function getStagedFiles(cwd) {
  const [execResult] = await exec({
    command: 'git diff --staged --diff-filter=ACMR --name-only -z',
    cwd,
  })
  if (!execResult) return []

  return execResult
    .split('\x00')
    .filter(Boolean)
    .map(x => `${cwd}/${x}`)
}

exports.getStagedFiles = getStagedFiles
