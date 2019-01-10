var CopyWebpackPlugin = require('copy-webpack-plugin');
const utils = require('./utils');

module.exports = {
    /**
     * 获取devServer的webpack编译配置信息
     * @param {Object} appInfo
     */
    getConfig(appInfo) {
        // 获取app的相关路径信息
        const pathInfo = utils.pathInfo(appInfo, 'devServer');
        // 获取webpack公共配置
        const baseConfig = require('./webpack.base.conf').getConfig(appInfo, pathInfo);

        return {
            // 公共的配置信息
            ...baseConfig.base,
            // 启用source-map
            devtool: 'source-map',
            // 将webpack设置为开发模式
            mode: 'development',
            // 应用打包出口配置
            output: {
                filename: 'js/index.bundle.js', // .[hash:7]
                path: pathInfo.app_dist,
                // 上线该配置需要配置成线上地址
                publicPath: "/"
            },
            plugins: [
                // 公共插件配置
                ...baseConfig.plugins,
                new CopyWebpackPlugin([{
                    from: pathInfo.libs,
                    to: 'libs',
                    ignore: ['.*']
                }])
            ],
            module: {
                rules: [
                    // 公共规则配置
                    ...baseConfig.rules
                ]
            }
        };
    }
};