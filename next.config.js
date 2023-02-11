/* eslint-disable @typescript-eslint/no-var-requires */

const withTM = require('next-transpile-modules')([]);

module.exports = withTM({
  async redirects() {
    return [
      {
        source: '/',
        destination: `/home`,
        permanent: true,
      },
    ];
  },
  swcMinify: false,
  trailingSlash: true,
  env: {
    HOST_API_KEY: 'https://minimal-assets-api.vercel.app',
    NEXT_CHUNK_CHUNK_UPLOAD: 'https://devapi.aws.gardenoflove.co/graphql/',
    NEXT_UPLOAD_URL: 'https://devapi.aws.gardenoflove.co/',
  },
  images: {
    domains: [
      'static.kino.de',
      'www.teahub.io',
      'static.tvtropes.org',
      'via.placeholder.com',
      '95.216.218.153',
      'media0.giphy.com',
      'media1.giphy.com',
      'media2.giphy.com',
      'media3.giphy.com',
      'media4.giphy.com',
      'www.amazom.com',
      'ugc-destination-bucket24.s3.amazonaws.com',
      'microsoft.com',
      'galeriakatowicka.eu',
      'amazon.com',
      'res.cloudinary.com',
    ],
  },
});
