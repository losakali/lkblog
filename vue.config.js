module.exports = {
    publicPath: "./",
    outputDir: "dist",
    assetsDir: "static",
    indexPath: "index.html",
    css: {
        // 启用 CSS modules
        modules: false,
        // 是否使用css分离插件
        extract: false,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            // 导入scss变量
            scss: {
                //  prependData: `@import "@/assets/variable.scss";`
            },
            postcss: {
                plugins: [
                    //remUnit这个配置项的数值是多少呢？？？ 通常我们是根据设计图来定这个值，原因很简单，便于开发。
                    //假如设计图给的宽度是750，我们通常就会把remUnit设置为75，这样我们写样式时，可以直接按照设计图标注的宽高来1:1还原开发。
                    require('postcss-px2rem')({ remUnit: 16 }), // 换算的基数
                ]
            }
        }
    }
}