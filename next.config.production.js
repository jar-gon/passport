require('dotenv-load')()

const publicRuntimeConfig = { }

Object.entries(process.env)
  .filter(([ key ]) => key.startsWith('PUBLIC_'))
  .forEach(([ key, value ]) => publicRuntimeConfig[key] = value)

module.exports = { publicRuntimeConfig }
