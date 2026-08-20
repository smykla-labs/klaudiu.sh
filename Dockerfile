FROM node:24-alpine@sha256:d32cdf619f63fe0471182d08996dd516c6275bb5fd31ae06e55a570bd9e1ad43 AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile
COPY . .
RUN git submodule update --init --recursive
RUN pnpm build
RUN pnpm prune --prod

FROM node:24-alpine@sha256:d32cdf619f63fe0471182d08996dd516c6275bb5fd31ae06e55a570bd9e1ad43
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/klaudiush/docs/errors klaudiush/docs/errors/
COPY --from=builder /app/klaudiush/CHANGELOG.md klaudiush/CHANGELOG.md
COPY --from=builder /app/klaudiush/examples klaudiush/examples/
COPY --from=builder /app/klaudiush/install.sh klaudiush/install.sh
COPY --from=builder /app/klaudiush/schema klaudiush/schema/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "build"]
