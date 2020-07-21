module.exports = {
    mode: 'development',
    entry: {
        app: './src/app.ts'
    },
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './src',
        port: '8086',
        inline: true,
        hot: true
    },
    resolve: {
        extensions: ['.ts', '.tsx','.js']
    },
    module: {
        rules: [
            {test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/}
        ]
    }
}