const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  // Note: babel-preset-react-app handles @babel/plugin-proposal-private-property-in-object internally
  // We don't need to manually configure it to avoid 'loose' mode conflicts
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // 生产环境优化
      if (env === 'production') {
        // 优化 JS 压缩
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          // 启用模块连接（Module Concatenation）以减小包大小
          concatenateModules: true,
          // 启用作用域提升（Scope Hoisting）
          usedExports: true,
          minimize: true,
          minimizer: [
            // 使用 Terser 压缩 JS - 更激进的压缩以减少执行时间
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true, // 移除 console.log
                  drop_debugger: true, // 移除 debugger
                  pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.error'], // 移除所有 console 函数
                  passes: 3, // 增加到 3 次压缩以获得更好的效果
                  // 更激进的压缩选项
                  dead_code: true,
                  unused: true,
                  collapse_vars: true,
                  reduce_vars: true,
                  reduce_funcs: true,
                  inline: 2, // 更积极的函数内联
                  keep_fargs: false, // 移除未使用的函数参数
                  keep_fnames: false, // 移除函数名（减少文件大小）
                },
                mangle: {
                  safari10: true, // 修复 Safari 10 的 bug
                  keep_fnames: false, // 混淆函数名以减小文件大小
                  properties: false, // 不混淆属性名（避免破坏代码）
                },
                parse: {
                  ecma: 8, // 支持 ES8
                },
                format: {
                  ecma: 8, // 输出 ES8
                  comments: false, // 移除注释
                  ascii_only: true, // 只使用 ASCII 字符
                  beautify: false, // 不美化代码
                },
              },
              extractComments: false, // 不提取注释到单独文件
              parallel: true, // 启用并行压缩
            }),
            // 使用 CSS Minimizer 压缩 CSS
            new CssMinimizerPlugin({
              minimizerOptions: {
                preset: [
                  'default',
                  {
                    discardComments: { removeAll: true }, // 移除所有注释
                    normalizeWhitespace: true, // 规范化空白
                  },
                ],
              },
            }),
          ],
        };

        // 代码分割优化 - 更激进的策略以减少 vendor.js 大小和执行时间
        webpackConfig.optimization.splitChunks = {
          chunks: 'all',
          // 进一步减少初始请求数量
          maxInitialRequests: 15,
          minSize: 20000,
          // 更小的 maxSize 以强制更细粒度的分割
          maxSize: 150000, // 从 200000 降低到 150000，强制更细粒度分割
          cacheGroups: {
            default: false,
            vendors: false,
            // 将 Three.js 单独分离（大型库，优先级最高）
            three: {
              name: 'three',
              test: /[\\/]node_modules[\\/](three|three\/examples)[\\/]/,
              chunks: 'async', // 只异步加载，不包含在初始包中
              priority: 50,
              enforce: true,
              reuseExistingChunk: true,
            },
            // 将 React 核心库分离（必须同步加载）
            reactCore: {
              name: 'react-core',
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              chunks: 'all',
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },
            // 将 react-helmet-async 单独分离（独立 chunk，但需要同步加载）
            reactHelmet: {
              name: 'react-helmet',
              test: /[\\/]node_modules[\\/]react-helmet-async[\\/]/,
              chunks: 'all', // 同步加载（因为 HelmetProvider 在根组件中）
              priority: 35,
              enforce: true,
              reuseExistingChunk: true,
            },
            // 将 react-router-dom 单独分离（如果使用）
            reactRouter: {
              name: 'react-router',
              test: /[\\/]node_modules[\\/]react-router[\\/]/,
              chunks: 'async', // 异步加载
              priority: 34,
              enforce: true,
              reuseExistingChunk: true,
            },
            // 将其他 vendor 代码进一步分割
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'async', // 优先异步加载，减少初始包大小
              priority: 20,
              minChunks: 1,
              reuseExistingChunk: true,
              // 进一步限制 vendor chunk 大小
              maxSize: 150000,
            },
            // 将 common 代码分离（被多个 chunk 共享的代码）
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        };
      }

      return webpackConfig;
    },
  },
};
