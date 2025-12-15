# マイグレーション専用のDockerfile
# ビルドコンテキスト: プロジェクトルート（..）
FROM node:24.6.0-alpine

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー（app/から）
COPY app/package*.json ./

# すべての依存関係をインストール（Prisma CLIを含む）
RUN npm ci

# アプリケーションのコードをコピー（app/から）
COPY app/ .

CMD ["npx", "prisma", "migrate", "deploy"]

