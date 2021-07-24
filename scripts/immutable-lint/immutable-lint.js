const { resolve } = require('path')
const { exec, log } = require('helpers-fn')
const { copy } = require('fs-extra')

const WITH_RAMBDAX = process.env.WITH_RAMBDAX === 'ON'

void async function immutableLint(){
  const filePath = resolve(
    __dirname,
    `../../../${WITH_RAMBDAX ? 'rambdax' : 'rambda'}/immutable.d.ts`
  )
  const filePathOrigin = resolve(
    __dirname,
    `../../../${WITH_RAMBDAX ? 'rambdax' : 'rambda'}/index.d.ts`
  )
  await copy(filePathOrigin, filePath)
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
