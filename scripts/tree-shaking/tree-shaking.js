const getFolderSize = require('get-folder-size')
const { resolve } = require('path')
const { exec } = require('helpers-fn')
// const { resolve } = require('fs-extra')
const { replace } = require('rambdax')

const webpackDir = resolve(__dirname,'../tree-shaking-webpack' )
const angularDir = resolve(__dirname,'../tree-shaking-angular' )
const viteDir = resolve(__dirname,'../tree-shaking-vite' )
// confirm to update values

void async function treeShaking(){
  console.log(webpackDir, `webpackDir`)
}()
