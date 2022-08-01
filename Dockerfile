FROM node:18-alpine AS build

WORKDIR /app

COPY ["package.json", "yarn.lock*", "./"]

RUN yarn

ADD . .

RUN yarn build

FROM node:18-alpine AS production

WORKDIR /app

COPY ["package.json", "yarn.lock*", "./"]

RUN yarn install --prod

COPY --from=BUILD /app/dist dist

CMD [ "yarn", "start" ]
