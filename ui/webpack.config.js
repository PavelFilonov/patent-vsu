const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const smp = new SpeedMeasurePlugin()

function getStyleLoaders(isProduction, cssLoaderOptions) {
    const loaders = []
    loaders.push({loader: 'style-loader'})
    loaders.push({
        loader: 'css-loader',
        options: cssLoaderOptions || {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]'
        }
    })
    loaders.push({loader: 'less-loader', options: {javascriptEnabled: true}})
    return loaders
}
function getPlugins(isProd, indexFileName, env) {
    const plugins = [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            hash: true,
            filename: indexFileName,
            template: './src/templates/index.ejs',
            favicon: './src/assets/icons/favicon.ico',
            appOptions: JSON.stringify({
                raHost: !!env.raHost ? env.raHost : '',
                branchName: !!env.branchName ? env.branchName : '',
                noSSO: env.noSSO ? 'true' : 'false'
            })
        })
    ]
    return plugins
}
const config = (env = {}, options) => {
    const isProduction = options.mode === 'production'
    const isDev = !isProduction
    const indexFileName = `index.${isProduction ? 'ftl' : 'html'}`
    return {
        entry: './src/index.tsx',
        devtool: isDev ? 'eval' : 'source-map',
        devServer: {
            hot: isDev,
            host: '0.0.0.0',
            port: 8081,
            disableHostCheck: true,
            publicPath: '/ui/',
            historyApiFallback: {
                index: '/ui/'
            },
            proxy: {
                '/api': {
                    target: 'http://backend:8080'
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.(js|css)$/,
                    use: ['source-map-loader'],
                    enforce: 'pre'
                },
                {
                    test: /\.tsx?$/,
                    use: {
                        loader: 'ts-loader'
                    },
                    include: /src/,
                    exclude: [/node_modules/, /(\.test.tsx?$)/, path.resolve(__dirname, 'src', 'tests')]
                },
                {
                    test: /\.less$/,
                    include: [path.resolve(__dirname, 'src')],
                    exclude: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src', 'antd.less')],
                    use: getStyleLoaders(isProduction)
                },
                {
                    test: /antd\.less$/,
                    include: [path.resolve(__dirname, 'src')],
                    use: getStyleLoaders(isProduction, {modules: false})
                },
                {
                    test: /\.(png|jpg|jpeg|gif|woff|woff2)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: file => {
                                return '[path][name].[ext]'
                            }
                        }
                    }
                },
                {
                    test: /\.(eot|ttf|wav|mp3|svg)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: file => {
                                return '[path][name].[ext]'
                            },
                            outputPath: 'assets'
                        }
                    }
                }
            ]
        },
        resolve: {
            alias: {
                exceljs: path.resolve(__dirname, 'node_modules/exceljs/dist/exceljs')
            },
            modules: ['src', 'node_modules'],
            extensions: ['.tsx', '.ts', '.js'],
            symlinks: false
        },
        output: {
            filename: isProduction ? '[name].[hash].js' : '[name].js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins: getPlugins(isProduction, indexFileName, env),
        optimization: {
            splitChunks: {
                cacheGroups: {
                    tesler: {
                        test: /[\\/]node_modules[\\/]@tesler-ui[\\/]core/,
                        name: 'tesler-ui',
                        chunks: 'all'
                    }
                }
            },
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    // sourceMap: true,
                    terserOptions: {
                        ecma: 5,
                        mangle: false,
                        keep_classnames: true
                    }
                })
            ]
        }
    }
}

// module.exports = config
module.exports = smp.wrap(config)
