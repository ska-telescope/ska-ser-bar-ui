# TODO: Use published images
ARG BUILD_IMAGE="registry.gitlab.com/ska-telescope/ska-base-images/ska-build-node:0.1.0-dev.cfccfd72b"
ARG BASE_IMAGE="registry.gitlab.com/ska-telescope/ska-base-images/ska-node:0.1.0-dev.cfccfd72b"
FROM $BUILD_IMAGE AS build

WORKDIR /build

COPY package*.json ./

RUN npm ci

COPY /src ./src
COPY /public ./public
COPY ./*.js ./*.json ./*.ts ./next.config.mjs ./

RUN npm run build-production

FROM $BASE_IMAGE

WORKDIR /app

RUN groupadd -g 1001 nodejs && \
    useradd  -u 1001 nextjs && \
    usermod -aG nextjs nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build /build/.next/standalone ./
COPY --from=build /build/.next/static ./.next/static
COPY ./public ./public

RUN chown -R nextjs:nodejs ./

USER nextjs

EXPOSE 8080

ENV PORT 8080
ENV HOSTNAME 0.0.0.0

CMD ["node", "server.js"]