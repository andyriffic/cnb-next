/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: 'standalone',
  compiler: {
    styledComponents: true
  },
  webpack(config) {
    config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    publicPath: '/_next/static/',
                    emitFile: true,
                },
            },
        ],
    })
    return config
},
}
