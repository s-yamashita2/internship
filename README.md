# インターンシップ用リポジトリ

## 概要

このプロジェクトは、インターンシップで実装する Web アプリケーションです。

Web アプリケーションの実装・テストコードの実装を通して、実務に近い開発を体験することができます。

詳細な仕様については、[ドキュメント](#ドキュメント)セクションを参照してください。

### 参加者名

山下　竣也

## 使用技術

### フロントエンド・フレームワーク

- **Next.js** 16.0.2 - React ベースのフルスタックフレームワーク
- **React** 19.2.0 - UI ライブラリ
- **TypeScript** 5.9.3 - 型安全性を提供する言語
- **Tailwind CSS** 4 - ユーティリティファーストの CSS フレームワーク

### バックエンド・データベース

- **Prisma** 6.19.0 - モダンな ORM（Object-Relational Mapping）
- **MySQL** - リレーショナルデータベース

### バリデーション・テスト

- **Zod** 4.1.12 - TypeScript ファーストのスキーマバリデーションライブラリ
- **Jest** 30.2.0 - JavaScript/TypeScript のテストフレームワーク

### 開発環境

- **Docker** & **Docker Compose** - コンテナ化された開発環境

## 開発環境の構築

### 前提条件

- Docker と Docker Compose がインストールされていること
- Make コマンドが利用可能であること

### セットアップ手順

1. **環境変数ファイルのコピーとコンテナの起動、依存関係のインストール、データベースの初期化を一度に実行**

```bash
make install
```

このコマンドは以下の処理を順番に実行します：

- `.env`ファイルのコピー（`infra/.env.example`から`infra/.env`へ）
- Docker コンテナの起動
- 依存関係のインストール（`npm ci`）
- Prisma マイグレーションのリセットと実行（`prisma:reset:force`）

2. **Next.js 開発サーバーの起動**

```bash
make dev
```

このコマンドを実行すると、Next.js 開発サーバーが起動します。開発サーバーが起動したら、ブラウザで http://localhost:3000（または`.env`で設定した`APP_PORT`）にアクセスしてアプリケーションを確認できます。

### よく使う Make コマンド

#### コンテナ管理

```bash
make up          # Dockerコンテナを起動（バックグラウンド）
make up-logs     # Dockerコンテナを起動してログを表示
make down        # Dockerコンテナを停止・削除
make restart     # すべてのコンテナを再起動
make ps          # コンテナの状態を表示
```

#### 開発

```bash
make dev         # Next.js開発サーバーを起動（npm run dev）
make logs        # すべてのコンテナのログを表示
make logs-app    # Next.jsアプリのログを表示
make logs-db     # MySQLデータベースのログを表示
```

#### データベース

```bash
make sql         # MySQLデータベースに接続
make prisma-reset-force  # Prismaマイグレーションをリセット（強制）
```

#### その他

```bash
make lint        # ESLintを実行
make help        # 利用可能なコマンド一覧を表示
```

### アプリケーションへのアクセス

セットアップが完了すると、以下の URL でアプリケーションにアクセスできます：

- **フロントエンド**: http://localhost:3000（または`.env`で設定した`APP_PORT`）
- **API**: http://localhost:3000/api（または`.env`で設定した`APP_PORT`）

### データベース接続情報

- **ホスト**: localhost
- **ポート**: 3306（または`.env`で設定した`DB_PORT`）
- **データベース名**: `internship`（デフォルト、`.env`ファイルで変更可能）
- **ユーザー名・パスワード**: `.env`ファイルで設定

### 複数人でのデプロイ時の注意事項

同じ EC2 インスタンス上で複数のユーザーが同時にデプロイする場合、以下の設定を各ユーザーが異なる値に設定する必要があります：

1. **`PROJECT_PREFIX`**: コンテナ名のプレフィックス

   - 例: `user1`, `user2`, `dev1`など
   - これにより、各ユーザーのコンテナ名が分離されます

2. **`COMPOSE_PROJECT_NAME`**: Docker Compose プロジェクト名

   - 例: `user1`, `user2`, `dev1`など（`PROJECT_PREFIX`と同じ値にすることを推奨）
   - この値は、ボリューム名とネットワーク名に自動的にプレフィックスとして付与されます
   - これにより、各ユーザーのボリュームとネットワークが分離されます

3. **`APP_PORT`**: アプリケーションのポート番号

   - 例: `3000`, `3001`, `3002`など
   - 各ユーザーが異なるポートを使用することで、ポート競合を回避します

4. **`DB_PORT`**: データベースのポート番号
   - 例: `3306`, `3307`, `3308`など
   - 各ユーザーが異なるポートを使用することで、ポート競合を回避します

これらの設定は`infra/.env`ファイルで行います。初回セットアップ時は`infra/.env.example`をコピーして使用してください。

## プロジェクト構成

詳細なディレクトリ構成については、[ディレクトリ構成の解説](./docs/directory-structure.md)を参照してください。

## ドキュメント

- [API 仕様書](./docs/specifications/main/api-specifications.md) - REST API の詳細な仕様
- [データベーススキーマ](./docs/specifications/main/database-schema.md) - データベーステーブル定義
- [要求仕様書](./docs/specifications/main/business-requirements.md) - 要求仕様書
- [業務フロー図](./docs/specifications/main/workflow.md) - 業務フロー図
- [コーディング規約](./docs/coding-standards.md) - コーディング規約・命名規則
- [ディレクトリ構成](./docs/directory-structure.md) - プロジェクトのディレクトリ構成
- [テストケースの粒度の考え方](./docs/test-granularity.md) - テストケースの粒度の考え方
