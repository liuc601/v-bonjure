const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');

const targetName = 'index';
const templatePath = path.resolve(__dirname, '../core/template.html');

module.exports = {
    // 启用source-map
    devtool: 'inline-source-map',
    // 应用打包入口
    entry: {
        [targetName]: path.resolve(__dirname, `../apps/${targetName}/index.js`)
    },
    // 打包出口
    output: {
        filename: 'js/index.bundle.[hash].js',
        path: path.resolve(__dirname, `../dist/${targetName}`),
        // 上线该配置需要配置成线上地址
        publicPath: "http://localhost:3002"
    },
    // 本地开发服务器配置
    devServer: {
        contentBase: path.resolve(__dirname, `../dist/${targetName}`),
        port: 3002,
        open: true,
        hot: true
    },
    plugins: [
        // 打包前自动清除旧打包文件
        // new CleanWebpackPlugin([targetName], {
        //     root: path.resolve(__dirname, `../dist`),
        //     verbose: true,
        //     dry: false
        // }),
        // 自动生成logo的favicon.ico文件
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, `../apps/${targetName}/logo.png`),
            icons: {
                android: false,
                appleIcon: false,
                appleStartup: false,
                coast: false,
                favicons: true,
                firefox: false,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: false
            }
        }),
        // 生成模板文件
        new HtmlWebpackPlugin({
            title: 'v-bonjour',
            filename: "index.html",
            template: templatePath
        }),
        // 模块热替换配置
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // 剥离样式文件
        new MiniCssExtractPlugin({
            // 输出文件【注意：这里的根路径是module.exports.output.path】
            filename: "css/style.bundle.[hash].css"
        }),
        // 处理*.vue文件
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            // 使用Babel处理js文件
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            // 使用PostCSS处理css文件
            {
                test: /\.css$/,
                use: [
                    // 提取样式为单独的文件
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    // 以<style>标签的形式将css-loader内部的样式注入到html页面
                    // {
                    //     loader: 'style-loader',
                    // },
                    // 以link的形式加载css文件
                    {
                        loader: 'css-loader'
                    },
                    // 使用postcss处理最原始的样式文件
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            // 加载图片
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1,
                        name: "/assets/images/[name].[hash].[ext]"
                    }
                }]
            },
            // 加载字体
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1,
                        name: "/assets/fonts/[name].[hash].[ext]"
                    }
                }]
            },
            // 处理html模板
            {
                test: /\.html$/,
                use: ['html-loader'],
                exclude: /node_modules/
            },
            // 处理.vue文件
            {
                test: /\.vue$/,
                use: ['vue-loader'],
                exclude: /node_modules/
            }
        ]
    }
};