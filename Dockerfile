# 使用 Node.js 20 作为基础镜像
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制所有源代码
COPY . .

# PUBLIC_* 变量需要在构建时设置
# 可以通过 gcloud run deploy --build-env-vars 传入,或使用下面的默认值
ARG PUBLIC_POCKETBASE_URL=https://api.maigewan.com/
ARG PUBLIC_POCKETBASE_ADMIN=https://api.maigewan.com/_/
ARG PUBLIC_BASE_URL=https://maigewan.com/
ARG PUBLIC_GITHUB_PROFILE=https://github.com/yourusername
ARG PUBLIC_REPOSITORY_URL=https://github.com/yourusername/yourrepo
ARG PUBLIC_DOCS_URL=https://github.com/yourusername/yourrepo/blob/main/README.md
ARG PUBLIC_GITHUB_STARS_URL=https://api.github.com/repos/yourusername/yourrepo

ENV PUBLIC_POCKETBASE_URL=$PUBLIC_POCKETBASE_URL
ENV PUBLIC_POCKETBASE_ADMIN=$PUBLIC_POCKETBASE_ADMIN
ENV PUBLIC_BASE_URL=$PUBLIC_BASE_URL
ENV PUBLIC_GITHUB_PROFILE=$PUBLIC_GITHUB_PROFILE
ENV PUBLIC_REPOSITORY_URL=$PUBLIC_REPOSITORY_URL
ENV PUBLIC_DOCS_URL=$PUBLIC_DOCS_URL
ENV PUBLIC_GITHUB_STARS_URL=$PUBLIC_GITHUB_STARS_URL


# 构建应用
RUN pnpm run build

# 生产阶段
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 从构建阶段复制必要文件
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=8080

# 暴露端口 (Cloud Run 使用 8080)
EXPOSE 8080

# 启动应用
CMD ["node", "build/index.js"]
