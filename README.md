# VK2DS Retranslator

Simple TypeScript project to publish posts from [VK](https://vk.com/) (using callback api) to [Discord](https://discord.com/) (using webhooks).

## Introduction

This project was made for node:18-alpine, however it can be used with almost any node version. Please, use `yarn` package manager **instead** of npm / pnpm / any other.

## Config

1. Copy `.env.template` to `.env`
2. Fill required fields
3. Setup VK Callbacks (in group settings) with field `wall_post`
4. Done!

## Building docker image

1. Make sure that docker is installed
2. Run `docker build -t tag .` (replace `tag` with your image name)

## Scripts

- `yarn lint` - run eslint task to check is everything ok
- `yarn dev` - run `src/index.ts` in development mode (using ts-node)
- `yarn build` - build `src/**.ts` files into `dist/**.js`
- `yarn start` - run built `dist/index.js`

## Modules

### Production modules

- `dotenv` - parse .env file
- `@nekoteam/logger` - fancy console logger
- `express` - webserver to handle vk callbacks
- `discord.js` - to publish fancy discord embeds
- `markdown-escape` - escape markdown in some vk messages

### Development modules

- `eslint` - [standardjs](https://standardjs.com/) config with custom rules
- `husky` - git hooks to avoid "style: lint" commits with lint fixes
- `typescript` - used for compiling .ts files
- `ts-node` - used for development

## Contributing

Feel free to open Issues and Pull Requests!

## Known Issues

- Reposting is not supported
- P
