/* eslint-disable @typescript-eslint/no-var-requires */
const rehypePrism = require('@mapbox/rehype-prism');
const withMdxEnhanced = require('next-mdx-enhanced');
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = withMdxEnhanced({
  layoutPath: 'src/layouts',
  defaultLayout: true,
  fileExtensions: ['md', 'mdx'],
  rehypePlugins: [rehypePrism],
})({
  webpack5: false,
  pageExtensions: ['md', 'mdx', 'tsx'],
  eslint: {
    ignoreDuringBuilds: true,
  },
});
