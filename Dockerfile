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

# 设置构建时的环境变量
ENV PUBLIC_POCKETBASE_URL=https://api.maigewan.com/api/
ENV PUBLIC_BASE_URL=https://admin.maigewan.com

# 构建应用 (不再需要 OPENAI_API_KEY 占位符,因为使用了延迟初始化)
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
