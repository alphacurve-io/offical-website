# Cache Optimization Guide / 缓存优化指南

## Problem / 问题

Your JavaScript bundle (`main.e0903950.js`) is 5,021 KiB with only a 4-hour cache TTL. This causes:
- Large initial load time
- Frequent re-downloads on repeat visits
- Poor performance scores

你的 JavaScript 包 (`main.e0903950.js`) 大小为 5,021 KiB，缓存时间只有 4 小时。这导致：
- 初始加载时间长
- 重复访问时需要频繁重新下载
- 性能评分差

## Solutions Implemented / 已实施的解决方案

### 1. Improved Webpack Code Splitting / 改进的 Webpack 代码分割

Updated `craco.config.js` to better split large libraries:
- Three.js is now forced into its own chunk (priority 40)
- React libraries are separated (priority 30)
- Added `maxSize: 244000` to prevent oversized chunks
- Increased `maxInitialRequests` to 30

更新了 `craco.config.js` 以更好地分割大型库：
- Three.js 现在被强制分离到自己的 chunk（优先级 40）
- React 库被分离（优先级 30）
- 添加了 `maxSize: 244000` 以防止过大的 chunk
- 将 `maxInitialRequests` 增加到 30

### 2. Cache Configuration Files / 缓存配置文件

Created two cache configuration files:

#### For Nginx / Nginx 配置
- File: `nginx-cache.conf`
- Static assets with hashes: **1 year cache** (31536000 seconds)
- HTML files: **4 hours cache** (14400 seconds)
- Includes gzip compression settings

#### For Apache / Apache 配置
- File: `.htaccess`
- Same caching strategy as Nginx
- Includes mod_expires and mod_deflate settings

## How to Apply / 如何应用

### Nginx Setup / Nginx 设置

1. Copy the cache configuration to your nginx site config:
```bash
# On your server
sudo cp nginx-cache.conf /etc/nginx/snippets/cache-optimization.conf
```

2. Include it in your site configuration:
```nginx
server {
    listen 80;
    server_name alphacurve.io;
    root /var/www/alphacurve.io/html;
    
    # Include cache optimization
    include /etc/nginx/snippets/cache-optimization.conf;
    
    # ... rest of your config
}
```

3. Test and reload nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Apache Setup / Apache 设置

1. Copy `.htaccess` to your web root:
```bash
# The .htaccess file should be in your build output directory
# It will be copied automatically if placed in the public/ folder
```

2. Ensure mod_expires and mod_headers are enabled:
```bash
sudo a2enmod expires
sudo a2enmod headers
sudo systemctl restart apache2
```

## Expected Results / 预期结果

After applying these changes:

1. **Bundle Size Reduction / 包大小减少**:
   - Three.js will be in a separate chunk (~600KB)
   - Main bundle should be significantly smaller
   - Better code splitting overall

2. **Cache Performance / 缓存性能**:
   - Static assets cached for **1 year** instead of 4 hours
   - Repeat visits will be much faster
   - Better Lighthouse scores for caching

3. **Load Time / 加载时间**:
   - Initial load: Similar (first visit)
   - Repeat visits: **Much faster** (cached assets)

## Verification / 验证

After deployment, check:

1. **Bundle Analysis**:
```bash
npm run build
# Check the build/static/js folder - you should see separate chunks
```

2. **Cache Headers**:
```bash
curl -I https://alphacurve.io/static/js/main.xxxxx.js
# Should show: Cache-Control: public, immutable, max-age=31536000
```

3. **Lighthouse Audit**:
   - Run Lighthouse in Chrome DevTools
   - Check "Uses efficient cache policies" should pass
   - FCP and LCP should improve on repeat visits

## Additional Optimizations / 额外优化

Consider these future improvements:

1. **CDN Integration**: Use a CDN (Cloudflare, AWS CloudFront) for even better caching
2. **Brotli Compression**: Enable Brotli compression (better than gzip)
3. **Service Worker**: Implement a service worker for offline caching
4. **Preloading**: Add resource hints (`<link rel="preload">`) for critical resources

## Notes / 注意事项

- Files with content hashes (e.g., `main.e0903950.js`) are safe to cache for 1 year because the hash changes when content changes
- HTML files should have shorter cache times since they reference the hashed assets
- Always test cache settings in a staging environment first
