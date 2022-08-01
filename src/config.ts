/* eslint-disable no-redeclare */
import dotenv from 'dotenv'
import { Logger, Color } from '@nekoteam/logger'
import { existsSync } from 'fs'

dotenv.config({
  path: process.env.NODE_ENV === 'development' && existsSync('.env.development') ? '.env.development' : '.env',
})

const logger = Logger.create('config', Color.Cyan)

function getEnvironmentVariable (name: string): string | undefined
function getEnvironmentVariable (name: string, fallback: string): string
function getEnvironmentVariable (...values: string[]): string | undefined {
  const [name, fallback] = values
  const environmentVariable = process.env[name]

  if (environmentVariable == null) {
    logger.warn(`environment variable "${name}" is not defined. ${fallback ? `using fallback value "${fallback}".` : 'returning undefined.'}`)
  }

  return environmentVariable ?? fallback
}

export default {
  package: {
    name: getEnvironmentVariable('npm_package_name', 'unknown'),
    version: getEnvironmentVariable('npm_package_version', 'unknown'),
  },
  web: {
    host: getEnvironmentVariable('WEB_HOST', '127.0.0.1'),
    port: parseInt(getEnvironmentVariable('WEB_PORT', '3000'), 10),
  },
  callback: {
    secret: getEnvironmentVariable('CALLBACK_SECRET', ''),
    confirmation: getEnvironmentVariable('CALLBACK_CONFIRMATION', ''),
  },
  webhook: {
    url: getEnvironmentVariable('WEBHOOK_URL', ''),
    title: getEnvironmentVariable('WEBHOOK_TITLE', 'New Wall Post'),
    picture: getEnvironmentVariable('WEBHOOK_PICTURE', ''),
    color: getEnvironmentVariable('WEBHOOK_COLOR', '#00ff00'),
  },
}
