FROM node:22-alpine AS builder
LABEL Developers="Florian Schmidt, Len Porath"
WORKDIR /app
COPY . .
RUN npm ci && npm run build && npm prune --omit-dev

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./package.json
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
