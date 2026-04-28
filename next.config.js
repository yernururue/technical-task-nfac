/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Only apply COOP/COEP on play pages where Stockfish may need them.
        // Applying globally breaks Supabase auth and cross-origin API calls.
        source: '/play/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
