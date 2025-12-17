const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
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
            // 使用 Terser 压缩 JS
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true, // 移除 console.log
                  drop_debugger: true, // 移除 debugger
                  pure_funcs: ['console.log', 'console.info', 'console.debug'], // 移除特定函数
                  passes: 2, // 多次压缩以获得更好的效果
                },
                mangle: {
                  safari10: true, // 修复 Safari 10 的 bug
                },
                output: {
                  comments: false, // 移除注释
                  ascii_only: true, // 只使用 ASCII 字符
                },
              },
              extractComments: false, // 不提取注释到单独文件
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

        // 代码分割优化 - 改进配置以更好地分离大型库
        webpackConfig.optimization.splitChunks = {
          chunks: 'all',
          maxInitialRequests: 30,
          minSize: 20000,
          maxSize: 244000, // 限制单个 chunk 的最大大小，强制分割
          cacheGroups: {
            default: false,
            vendors: false,
            // 将 Three.js 单独分离（大型库，优先级最高）
            three: {
              name: 'three',
              test: /[\\/]node_modules[\\/](three|three\/examples)[\\/]/,
              chunks: 'all',
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },
            // 将 React 相关库分离
            react: {
              name: 'react',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-helmet)[\\/]/,
              chunks: 'all',
              priority: 30,
              enforce: true,
              reuseExistingChunk: true,
            },
            // 将其他 vendor 代码分离
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'all',
              priority: 20,
              minChunks: 1,
              reuseExistingChunk: true,
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
