const {exec} = require('helpers-fn')

void (async function prepare() {
  const [lsResult] = await exec({
    cwd: __dirname,
    command: 'ls',
  })
  const hasDependencies = lsResult.split('\n').includes('node_modules')
  console.log(`hasDependencies`, hasDependencies)
  if (hasDependencies) return
  await exec({
    cwd: __dirname,
    command: 'yarn install',
  })
})()
