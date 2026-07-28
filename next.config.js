/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    useTypeScriptCli: true,
  },
  compiler: {
    styledComponents: true
  },
  turbopack: {
    rules: {
      '*.{ogg,mp3,wav,mpeg,mpg}': {
        type: 'asset',
      },
    },
  },
}
