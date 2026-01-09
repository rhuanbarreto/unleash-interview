FROM oven/bun:1.3.5-slim AS base

ENV NODE_ENV=production

WORKDIR /app
COPY . .
RUN bun install

RUN bun build ./src/index.ts --compile --sourcemap --outfile ./dist/app --define:process.env.NODE_ENV='\"production\"'

FROM gcr.io/distroless/base-nossl-debian11 AS runtime
ENV NODE_ENV=production
EXPOSE 3000

COPY --from=base /app/dist/app /usr/local/bin/

CMD ["app"]