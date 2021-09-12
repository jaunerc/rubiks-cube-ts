const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    mode: "development",
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: 'src'}
            ]
        })
    ],
    devServer: {
        static: path.join(__dirname, 'dist'),
        port: 9002,
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
