module.exports = {
    images: {
      domains: ['https://source.unsplash.com/random'],
    },
    webpack5: false
  }
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
};

