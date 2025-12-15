.PHONY: help up down build logs app db sql restart ps clean ci dev install prisma-reset-force

# Docker Composeファイルのパス
COMPOSE_FILE := infra/docker-compose.yml

# デフォルトターゲット
.DEFAULT_GOAL := help

help: ## このヘルプメッセージを表示
	@echo "利用可能なコマンド:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

cp-env: ## .envファイルをコピー
	cp infra/.env.example infra/.env

up: ## Dockerコンテナを起動（バックグラウンド）
	cd infra && docker compose up -d

up-production: ## 本番環境用のコンテナを起動
	cd infra && docker compose -f docker-compose.yml up -d

up-logs: ## Dockerコンテナを起動してログを表示
	cd infra && docker compose up

down: ## Dockerコンテナを停止・削除
	cd infra && docker compose down

build: ## Dockerイメージをビルド
	cd infra && docker compose build

rebuild: ## Dockerイメージを再ビルド（キャッシュなし）
	cd infra && docker compose build --no-cache

logs: ## すべてのコンテナのログを表示
	cd infra && docker compose logs -f

logs-app: ## Next.jsアプリのログを表示
	cd infra && docker compose logs -f app

logs-db: ## MySQLデータベースのログを表示
	cd infra && docker compose logs -f db

app: ## Next.jsアプリコンテナ内でシェルを実行
	cd infra && docker compose exec app sh

db: ## MySQLデータベースコンテナ内でシェルを実行
	cd infra && docker compose exec db sh

sql: ## MySQLデータベースに接続
	@PASSWORD=$$(grep MYSQL_ROOT_PASSWORD ../.env 2>/dev/null | cut -d '=' -f2 || echo "root_password"); \
	DATABASE=$$(grep MYSQL_DATABASE ../.env 2>/dev/null | cut -d '=' -f2 || echo "internship"); \
	cd infra && docker compose exec db mysql -u root -p$$PASSWORD $$DATABASE

restart: ## すべてのコンテナを再起動
	cd infra && docker compose restart

restart-app: ## Next.jsアプリコンテナを再起動
	cd infra && docker compose restart app

restart-db: ## MySQLデータベースコンテナを再起動
	cd infra && docker compose restart db

restart-production: ## 本番環境用のコンテナを再起動
	cd infra && docker compose -f docker-compose.yml restart

restart-app-production: ## Next.jsアプリコンテナを再起動
	cd infra && docker compose -f docker-compose.yml restart app

restart-db-production: ## MySQLデータベースコンテナを再起動
	cd infra && docker compose -f docker-compose.yml restart db

ps: ## コンテナの状態を表示
	cd infra && docker compose ps

stop: ## コンテナを停止（削除しない）
	cd infra && docker compose stop

start: ## 停止中のコンテナを起動
	cd infra && docker compose start

clean: ## コンテナ、ボリューム、ネットワークを完全に削除
	cd infra && docker compose down -v --remove-orphans

clean-all: clean ## 完全にクリーンアップ（イメージも削除）
	cd infra && docker compose down -v --rmi all --remove-orphans

dev: ## Next.js開発サーバーを起動（npm run dev）
	cd infra && docker compose exec app npm run dev

ci: ## 依存関係をインストール（npm ci）
	cd infra && docker compose exec app npm ci

install: ## 開発環境をセットアップ
	make cp-env && \
	make up && \
	make ci && \
	make prisma-reset-force && \
	make dev

lint: ## ESLintを実行
	cd infra && docker compose exec app npm run lint

prisma-reset-force: ## Prismaマイグレーションをリセット（強制）
	cd infra && docker compose exec app npm run prisma:reset:force

migrate-production: ## 本番環境用のマイグレーションを実行
	cd infra && docker compose --profile migration run --rm migration

install-production: ## 本番環境のセットアップ
	make migrate-production && \
	make up-production
