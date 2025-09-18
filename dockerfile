
FROM node:20-alpine AS base
WORKDIR /app

RUN corepack enable

FROM base AS deps

COPY .yarnrc.yml ./

COPY package.json yarn.lock ./

RUN corepack enable && corepack prepare yarn@4.9.3 --activate

RUN yarn install

FROM deps AS build

COPY certs ./
COPY tsconfig.json ./
COPY src ./src

RUN yarn build

FROM base AS runner
ENV NODE_ENV=local

EXPOSE 8080

# 런타임에 필요한 파일만 복사
# node_modules (deps 단계에서 설치한 것), dist, package.json 만 있으면 충분
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# 헬스체크(선택): /health 엔드포인트 있는 경우
# HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
