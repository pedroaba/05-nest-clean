FROM node:20 AS base

RUN npm install -g @pnpm/exe

FROM base AS dependencies

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

FROM base AS build
WORKDIR /usr/src/app

COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

RUN pnpm prisma generate

RUN pnpm build
RUN pnpm prune --prod

FROM node:20-alpine3.19 as deploy

WORKDIR /usr/src/app

RUN npm install -g @pnpm/exe
RUN npm i -g prisma

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/prisma ./prisma

EXPOSE 3333

CMD [ "npm", "run", "start:prod" ]
