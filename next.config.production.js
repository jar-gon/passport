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

module.exports = { publicRuntimeConfig, serverRuntimeConfig }
