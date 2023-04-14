// const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
let settings = require('./src/config/settings.js').config
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const version = '1.1.1'

const outDir = 'static/dist/shop_pc/'
const myPlugin = require('./webpackPlugins.js')
function resolve(dir) {
    return path.join(__dirname, dir);
}
function fmtUrl(url = '') {
    return url.replace('.[contenthash:8]', '');
}
let diyPlugins = []
if (process.env.NODE_ENV != 'development') {
    diyPlugins.push(new myPlugin());
}
module.exports = {
    assetsDir: outDir,//放置生成的静态资源
    publicPath: '/',
    filenameHashing: true,//默认控制缓存
    productionSourceMap: false,

    chainWebpack:config => {
        config.plugins.delete('prefetch');
        let filename = '',
                chunkFilename = '';
        // if (process.env.UNI_PLATFORM == 'h5') {
            config.plugins.delete('named-chunks');
            config.plugins.delete('pwa');
            filename = fmtUrl(config.output.store.get('filename')) + '?v=' + version;
            chunkFilename = fmtUrl(config.output.store.get('chunkFilename')) + '?v=' + version;
        // } else {
        //     filename = config.output.store.get('filename') + '?v=' + version;
        //     chunkFilename = config.output.store.get('chunkFilename') + '?v=' + version;
        // }
        config.output.store.set('filename', outDir + filename);
        config.output.store.set('chunkFilename', outDir + chunkFilename);
        config.resolve.alias.set('@', resolve('./src'));
        config.module.
        rule('images').
        test(/\.(png|jpe?g|gif|webp)(\?.*)?$/).
        use('url-loader').
        loader('file-loader').
        options({
            name: outDir + 'image/[name].[ext]' });

        config.module.
        rule('svg').
        test(/\.(svg)(\?.*)?$/).
        use('file-loader').
        loader('file-loader').
        options({
            name: outDir + 'image/[name].[ext]' });

    },
    css: {
        loaderOptions: {
            // 给 sass-loader 传递选项
            sass: {
                // @/ 是 src/ 的别名
                // 所以这里假设你有 `src/variables.sass` 这个文件
                // 注意：在 sass-loader v7 中，这个选项名是 "data"
                prependData: `@import "~@/assets/css/public.scss"`
            },
            // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
            // 因为 `scss` 语法在内部也是由 sass-loader 处理的
            // 但是在配置 `data` 选项的时候
            // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
            // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
            scss: {
                prependData: `@import "~@/assets/css/public.scss";`
            }
        }
    },
    configureWebpack: {
        plugins: [
            // new CopyWebpackPlugin([
            //     {
            //         from: path.resolve(__dirname, './static'),
            //         to: 'static/dist',
            //         ignore: ['.*']
            //     }
            // ]),
            ...diyPlugins
        ],
        externals: {}
    },
    // configureWebpack: config => {
    //     if (process.env.NODE_ENV === "production") {
    //         // 为生产环境修改配置...
    //         config.mode = "production";
    //         config.optimization.minimizer = [
    //             new UglifyJsPlugin({
    //                 uglifyOptions: {
    //                     compress: {
    //                         warnings: false,
    //                         drop_console: true, //console
    //                         drop_debugger: true,
    //                         pure_funcs: ['console.log'] //移除console
    //                     }
    //                 }
    //             })
    //         ]
    //         //打包文件大小配置
    //         config["plugins"] = [...diyPlugins]
    //         config["externals"] = {}
    //     } else {
    //         // 为开发环境修改配置...
    //         config.mode = "development";
    //     }
    // },
    devServer: {
        port: '8080',
        open: true,
        proxy: {
            '/h5/api': {
                target: settings.base_url,
                changeOrigin: true,
                pathRewrite: {'^/api': ''}
            },
            '/api': {
                target: settings.base_url,
                changeOrigin: true,
                pathRewrite: {'^/api': ''}
            }
        }
    }
}
