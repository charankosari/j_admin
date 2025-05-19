// next.config.js
module.exports = {
  // ensure you still export all your pages…
  async rewrites() {
    return [
      {
        source: '/:path*',    // any URL
        destination: '/',     // serve your index.html
      },
    ];
  },
}
