# ベースイメージ
FROM node:24.6.0-alpine AS base

# 開発環境用のステージ
FROM base AS development

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 開発依存関係も含めてインストール
RUN npm ci

# アプリケーションのコードをコピー（ボリュームマウントで上書きされる）
COPY . .

# ポートを公開
EXPOSE 3000

# 開発サーバーを起動
CMD ["tail", "-f", "/dev/null"]

# 本番環境用のビルドステージ
FROM base AS builder

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# アプリケーションのコードをコピー
COPY . .

# Prismaスキーマを生成
RUN npm run prisma:generate

# Next.jsアプリケーションをビルド
RUN npm run build

# 本番環境用の実行ステージ
FROM base AS production

# 作業ディレクトリを設定
WORKDIR /app

# ビルドステージからのファイルをコピー
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# ポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["node", "server.js"]
