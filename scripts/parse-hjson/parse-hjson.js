const {resolve} = require('path')
const {parseHjson} = require('helpers-fn')
const filePath = resolve(__dirname, '../../../rambda/package.hjson')

parseHjson(filePath)