# Cloud Run 部署指南

## 📋 环境变量说明

### 构建时环境变量 (`--build-env-vars`)
这些 `PUBLIC_*` 变量会被打包进客户端代码,**不能包含敏感信息**:

```bash
PUBLIC_POCKETBASE_URL=https://api.maigewan.com/
PUBLIC_POCKETBASE_ADMIN=https://api.maigewan.com/_/
PUBLIC_BASE_URL=https://maigewan.com/
PUBLIC_GITHUB_PROFILE=https://github.com/yourusername
PUBLIC_REPOSITORY_URL=https://github.com/yourusername/yourrepo
PUBLIC_DOCS_URL=https://github.com/yourusername/yourrepo/blob/main/README.md
PUBLIC_GITHUB_STARS_URL=https://api.github.com/repos/yourusername/yourrepo
PUBLIC_OPENAI_MODEL=gpt-3.5-turbo
PUBLIC_BTC_DONATION_ADDRESS=1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

### 运行时环境变量 (`--set-env-vars`)
这些变量只在服务端使用,可以包含敏感信息:

```bash
# API 密钥
OPENAI_API_KEY=sk-xxx...

# 第三方服务
REDIRECT_URL=https://api.maigewan.com/api/oauth2-redirect
FORTUNE_API=https://api.quotegarden.com/quotes/random
BITCOIN_PREDICTION_API=https://api.coindesk.com/v1/bpi/currentprice.json
N8N_AGENT_API=https://example.com/webhook

# 支付配置
USDT_TRC20_ADDRESS=TEyeCRWf56qTcrsNnHZJiZzsph9yDK867z
USDT_ERC20_ADDRESS=0xe96e3b1b4d344c04f13f74ef26455e6284a45e14
LICENSE_PRICE=700

# Google 表单
GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/example/formResponse
FORM_PAYLOAD_FIRST_NAME=entry.123456789
FORM_PAYLOAD_LAST_NAME=entry.123456789
FORM_PAYLOAD_TYPE=entry.123456789
FORM_PAYLOAD_PRIORITY=entry.123456789
FORM_PAYLOAD_MESSAGE=entry.123456789
FORM_PAYLOAD_EMAIL=emailAddress
```

## 🚀 快速部署

### 方法 1: 使用部署脚本

1. 修改 `deploy-cloudrun.sh` 中的配置:
   ```bash
   PROJECT_ID="your-project-id"  # 替换为你的 GCP 项目 ID
   REGION="asia-east1"           # 替换为你想要的区域
   ```

2. 运行部署脚本:
   ```bash
   ./deploy-cloudrun.sh
   ```

### 方法 2: 手动部署

```bash
gcloud run deploy admin-maigewan \
  --source . \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --build-env-vars "PUBLIC_POCKETBASE_URL=https://api.maigewan.com/" \
  --build-env-vars "PUBLIC_BASE_URL=https://maigewan.com/" \
  --set-env-vars "OPENAI_API_KEY=sk-your-key-here"
```

## 🔒 使用 Secret Manager (推荐)

对于敏感信息(如 API 密钥),建议使用 Google Secret Manager:

1. **创建 Secret**:
   ```bash
   echo -n "sk-your-openai-key" | gcloud secrets create openai-api-key --data-file=-
   ```

2. **授予 Cloud Run 访问权限**:
   ```bash
   gcloud secrets add-iam-policy-binding openai-api-key \
     --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   ```

3. **在部署时引用 Secret**:
   ```bash
   gcloud run deploy admin-maigewan \
     --source . \
     --set-secrets="OPENAI_API_KEY=openai-api-key:latest"
   ```

## 📝 注意事项

1. **`.env` 文件不会被部署到 Cloud Run** - 只在本地开发时使用
2. **构建时变量会暴露在客户端** - 不要放敏感信息
3. **运行时变量只在服务端可用** - 适合存放 API 密钥
4. **Dockerfile 使用 ARG** - 允许在构建时传入变量

## 🔄 更新环境变量

只更新环境变量而不重新构建:

```bash
gcloud run services update admin-maigewan \
  --region asia-east1 \
  --update-env-vars "LICENSE_PRICE=800"
```

## 🐛 调试

查看部署日志:
```bash
gcloud run services logs read admin-maigewan --region asia-east1
```

查看环境变量配置:
```bash
gcloud run services describe admin-maigewan --region asia-east1 --format=yaml
```

## 📚 相关文档

- [Cloud Run 环境变量](https://cloud.google.com/run/docs/configuring/environment-variables)
- [Secret Manager](https://cloud.google.com/secret-manager/docs)
- [SvelteKit 环境变量](https://kit.svelte.dev/docs/modules#$env-dynamic-private)
