FROM node:24-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile
COPY . .
RUN git submodule update --init --recursive
RUN pnpm build
RUN pnpm prune --prod

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/klaudiush/docs/errors klaudiush/docs/errors/
COPY --from=builder /app/klaudiush/CHANGELOG.md klaudiush/CHANGELOG.md
COPY --from=builder /app/klaudiush/install.sh klaudiush/install.sh
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "build"]
