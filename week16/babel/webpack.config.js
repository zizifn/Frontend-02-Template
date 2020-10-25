const path = require('path');
module.exports = {
    entry: "./demo.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'custom-output-name.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use:
                {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }

            }
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({ template: './src/index.html' })
        // new VueLoaderPlugin(),
        // new CopyPlugin({
        //     patterns: [
        //         { from: 'src/*.html', to: '[name].[ext]' }
        //     ],
        // })
    ]
};