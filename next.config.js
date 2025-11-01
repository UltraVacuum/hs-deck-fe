/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['ts', 'tsx'],
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    // Enable SWC minification for production builds
    swcMinify: true,
    // Enhanced configuration for production optimization
    experimental: {
        // Optimize package imports for better bundle size
        optimizePackageImports: ['@supabase/supabase-js', '@radix-ui/react-icons', 'lucide-react'],
        // Optimize server components
        serverComponentsExternalPackages: ['@supabase/supabase-js'],
    },
    // Optimized webpack configuration
    webpack: (config, { isServer, dev }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            }
        }

        // Optimize chunk splitting for better vendor management
        if (!isServer && !dev) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        priority: -10,
                        chunks: 'all',
                    },
                    react: {
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        name: 'react',
                        priority: 20,
                        chunks: 'all',
                    },
                    ui: {
                        test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
                        name: 'ui',
                        priority: 15,
                        chunks: 'all',
                    },
                    supabase: {
                        test: /[\\/]node_modules[\\/](@supabase)[\\/]/,
                        name: 'supabase',
                        priority: 18,
                        chunks: 'all',
                    },
                },
            }
        }

        return config
    },
    // Image optimization configuration
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    // Production optimizations
    poweredByHeader: false,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
        // Remove React prop types in production for smaller bundles
        reactRemoveProperties: process.env.NODE_ENV === 'production',
    },
    // Generate source maps for production debugging (optional)
    productionBrowserSourceMaps: false,
    trailingSlash: false,
    // Empty rewrites and redirects to prevent issues
    async rewrites() {
        return [];
    },
    async redirects() {
        return [];
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                ],
            },
        ];
    },
}

module.exports = nextConfig