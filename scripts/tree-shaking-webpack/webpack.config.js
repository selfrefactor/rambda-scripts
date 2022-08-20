const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

const FILES = {
    entry: `./src/${process.env.ENTRY}.js`,
    output: `${process.env.ENTRY}.js`,
}
console.log(FILES, `FILES`)

module.exports = {
    entry: FILES.entry,
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    output: {
        filename: FILES.output,
        path: path.resolve(__dirname, 'output'),
    }
};
