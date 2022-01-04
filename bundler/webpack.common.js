const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const devMode = process.env.NODE_ENV !== "production";
const path = require('path')


//precise le nom des pages html dans ce array ON MET LE MEME NOM POUR UN JS ET UN HTML
let htmlPageNames = ['index', "atelier1", "atelier2"];
let multipleHtmlPlugins = htmlPageNames.map(name => {
    return new HtmlWebpackPlugin({
        template: `./src/${name}.html`, // relative path to the HTML files
        filename: `${name}.html`, // output HTML files
        chunks: [`${name}`], // respective JS files
        minify: true,
    })
});

const plugins = [
    new CopyWebpackPlugin({
        patterns: [
            {
                from: path.resolve(__dirname, '../static'),
                noErrorOnMissing: true
            }
        ]
    }),
    new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: "index.html",
        chunks: ["index"],
        minify: true
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css'
    }),
    new webpack.HotModuleReplacementPlugin()
].concat(multipleHtmlPlugins)

module.exports = {
    // liste des fichiers js MEME NOM QUE LES HTML
    entry: {
        index: './src/script.js',
        atelier1: './src/atelier1.js',
        atelier2: './src/atelier2.js',
    },
    output:
    {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'source-map',
    target: 'web',
    plugins: plugins,
    module:
    {
        rules:
            [
                // HTML
                {
                    test: /\.(html)$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: { // Disables attributes processing 
                                sources: false,
                            },
                        }
                    ],
                },

                // JS
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use:
                        [
                            'babel-loader'
                        ]
                },

                // SCSS
                {
                    test: /\.scss$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            // options: {
                            //     hot: process.env.NODE_ENV === 'development'
                            // }
                        },
                        "css-loader",
                        "postcss-loader",
                        "sass-loader",
                    ],
                },

                // CSS
                {
                    test: /\.css$/,
                    use:
                        [
                            'css-loader'
                        ]
                },

                // Images
                {
                    test: /\.(jpg|png|gif|svg)$/,
                    use:
                        [
                            {
                                loader: 'file-loader',
                                options:
                                {
                                    outputPath: 'images/'
                                }
                            }
                        ]
                },

                // Videos
                {
                    test: /\.(mp4|webm)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'assets/videos/'
                            }
                        },
                    ]
                },

                // Fonts
                {
                    test: /\.(ttf|otf|eot|woff|woff2|json)$/,
                    use:
                        [
                            {
                                loader: 'file-loader',
                                options:
                                {
                                    outputPath: 'fonts/'
                                }
                            }
                        ]
                },

                // Shaders
                {
                    test: /\.(glsl|vs|fs|vert|frag)$/,
                    exclude: /node_modules/,
                    use: [
                        'raw-loader'
                    ]
                }
            ]
    },
}