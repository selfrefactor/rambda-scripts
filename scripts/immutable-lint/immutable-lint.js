const { resolve } = require('path')
const { exec, log } = require('helpers-fn')

void async function immutableLint(){
  const filePath = resolve(
    __dirname,
    '../../../rambda/files/index.d.ts'
  )
  const cwd = resolve(
    __dirname,
    '../../'
  )

  const command= `node node_modules/eslint/bin/eslint.js -c files/.eslint.config.js ${filePath} --fix`

  await exec({
    cwd,
    command
  })
  log('success', 'big')
}()