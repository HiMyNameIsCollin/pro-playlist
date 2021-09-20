module.exports = {
    images: {
      domains: ['https://source.unsplash.com/random'],
    },
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

