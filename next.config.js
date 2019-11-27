const path = require('path')
const withPlugins = require('next-compose-plugins')

require('dotenv-load')()

const publicRuntimeConfig = { }
const serverRuntimeConfig = { }

Object.entries(process.env).forEach(([ key, value ]) => {
  if (key.startsWith('PUBLIC_')) {
    publicRuntimeConfig[key] = value
  } else if (key.startsWith('SERVER_')) {
    serverRuntimeConfig[key] = value
  }
})

module.exports = withPlugins([
  [
    require('@zeit/next-stylus'),
    {
      stylusLoaderOptions: {
        include: [ __dirname, __dirname + '/node_modules' ],
        use: [ require('stylus-less')({ cache: false }) ],
      },
    }
  ],
  [
    require('@zeit/next-less'),
    {
      lessLoaderOptions: {
        sourceMap: { sourceMapFileInline: true },
      },
    }
  ],
  require('@zeit/next-css'),
  [
    require('next-images'),
    {
      inlineImageLimit: 0
    }
  ],
  [
    require('next-transpile-modules'),
    {
      transpileModules: [
        'redux/es/redux', 'react-redux/es', 'react-redux/es/.*', 'next-redux-wrapper/es6',
        'antd/es/.*', 'rc-.*', 'css-animation/es/*',
        '@billypon/react-utils',
        '@billypon/react-template',
        '@billypon/react-decorator',
        'lodash-es',
      ],
    }
  ],
], {
  publicRuntimeConfig,
  serverRuntimeConfig,

  webpack: ((config, { dev, isServer }) => {
    const { module: { rules }, plugins } = config

    // eslint
    rules.unshift({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: 'eslint-loader',
          options: {
            useEslintrc: true,
            formatter: 'codeframe',
          },
        },
      ],
      enforce: 'pre',
    })

    // pug
    rules.push({
      test: /\.pug$/,
      use: [
        'babel-loader',
        'pug-as-jsx-loader'
      ],
    })

    const transpileModules = plugins.pop()

    if (!dev) {
      const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
      plugins.push(new OptimizeCSSAssetsPlugin())
    }

    plugins.push(transpileModules)

    config.resolve.alias['~'] = path.resolve('.')

    return config
  }),

  devIndicators: {
    autoPrerender: false,
  },
})

const pugLoad = require('pug-load')
const resolvePug = pugLoad.resolve
pugLoad.resolve = function (filename, source, options) {
  if (filename.startsWith('~/')) {
    filename = filename.substr(1)
  }
  return resolvePug.call(this, filename, source, options)
}

const stylusPathCache = require('stylus-loader/lib/pathcache')
const stylusResolvers = stylusPathCache.resolvers
stylusPathCache.resolvers = function () {
  const resolvers = stylusResolvers.apply(this, arguments)
  const resolveStylus = resolvers[0]
  resolvers[0] = function (context, filename) {
    filename = !filename.startsWith('~/') ? filename : filename.substr(2)
    return resolveStylus.call(this, context, filename)
  }
  return resolvers
}
