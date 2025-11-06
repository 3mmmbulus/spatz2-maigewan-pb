#!/bin/bash

# Cloud Run 部署脚本
# 使用方法: ./deploy-cloudrun.sh

# 设置项目和区域
PROJECT_ID="your-project-id"  # 替换为你的 GCP 项目 ID
REGION="asia-east1"           # 或其他区域
SERVICE_NAME="admin-maigewan"

echo "🚀 开始部署到 Cloud Run..."

gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  \
  `# 构建时环境变量 (PUBLIC_* 会被打包进客户端代码)` \
  --build-env-vars "PUBLIC_POCKETBASE_URL=https://api.maigewan.com/" \
  --build-env-vars "PUBLIC_POCKETBASE_ADMIN=https://api.maigewan.com/_/" \
  --build-env-vars "PUBLIC_BASE_URL=https://maigewan.com/" \
  --build-env-vars "PUBLIC_GITHUB_PROFILE=https://github.com/yourusername" \
  --build-env-vars "PUBLIC_REPOSITORY_URL=https://github.com/yourusername/yourrepo" \
  --build-env-vars "PUBLIC_DOCS_URL=https://github.com/yourusername/yourrepo/blob/main/README.md" \
  --build-env-vars "PUBLIC_GITHUB_STARS_URL=https://api.github.com/repos/yourusername/yourrepo" \
  --build-env-vars "PUBLIC_OPENAI_MODEL=gpt-3.5-turbo" \
  --build-env-vars "PUBLIC_BTC_DONATION_ADDRESS=1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" \
  \
  `# 运行时环境变量 (服务端 API 密钥等敏感信息)` \
  --set-env-vars "REDIRECT_URL=https://api.maigewan.com/api/oauth2-redirect" \
  --set-env-vars "FORTUNE_API=https://api.quotegarden.com/quotes/random" \
  --set-env-vars "BITCOIN_PREDICTION_API=https://api.coindesk.com/v1/bpi/currentprice.json" \
  --set-env-vars "N8N_AGENT_API=https://example.com/webhook" \
  --set-env-vars "GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/example/formResponse" \
  --set-env-vars "FORM_PAYLOAD_FIRST_NAME=entry.123456789" \
  --set-env-vars "FORM_PAYLOAD_LAST_NAME=entry.123456789" \
  --set-env-vars "FORM_PAYLOAD_TYPE=entry.123456789" \
  --set-env-vars "FORM_PAYLOAD_PRIORITY=entry.123456789" \
  --set-env-vars "FORM_PAYLOAD_MESSAGE=entry.123456789" \
  --set-env-vars "FORM_PAYLOAD_EMAIL=emailAddress" \
  --set-env-vars "USDT_TRC20_ADDRESS=TEyeCRWf56qTcrsNnHZJiZzsph9yDK867z" \
  --set-env-vars "USDT_ERC20_ADDRESS=0xe96e3b1b4d344c04f13f74ef26455e6284a45e14" \
  --set-env-vars "LICENSE_PRICE=700" \
  --set-env-vars "OPENAI_API_KEY=sk-your-openai-api-key-here"

echo "✅ 部署完成!"
echo "📝 记得在 GCP Console 中配置 Secret Manager 来管理敏感信息"
