# ディレクトリ構成の解説

## 概要

このドキュメントでは、プロジェクトのディレクトリ構成と各ディレクトリの役割について説明します。

## ルートディレクトリ構成

```
app/
├── src/                    # ソースコード
├── prisma/                 # Prisma スキーマとマイグレーション
├── public/                 # 静的ファイル
├── node_modules/          # 依存パッケージ
├── package.json           # プロジェクト設定
├── tsconfig.json          # TypeScript 設定
└── next.config.ts         # Next.js 設定
```

## src/ ディレクトリ構成

### app/ - Next.js App Router

Next.js の App Router を使用したフロントエンドと API ルートを配置します。

```
app/
├── api/                   # API ルート
│   └── users/            # ユーザー関連の API エンドポイント
│       └── route.ts      # GET /api/users, POST /api/users
├── layout.tsx            # ルートレイアウト
├── page.tsx              # トップページ
├── globals.css           # グローバルスタイル
└── favicon.ico           # ファビコン
```

**役割**:

- `app/api/`: Next.js の API ルートハンドラーを配置
- 各 API エンドポイントは `route.ts` ファイルで定義
- HTTP メソッド（GET, POST など）をエクスポートする関数として実装

### server/ - バックエンドロジック

レイヤードアーキテクチャに基づいたバックエンドロジックを配置します。

```
server/
├── controllers/           # Controller 層
│   ├── base.controller.ts
│   └── user.controller.ts
├── services/             # Service 層
│   └── user.service.ts
├── repositories/         # Repository 層
│   ├── base.repository.ts
│   └── user.repository.ts
├── utils/                # ユーティリティ関数
│   └── validation.ts     # バリデーション関数
├── error.ts              # カスタムエラークラス
├── container.ts          # DI コンテナ
└── dependencies.ts       # 依存関係の登録
```

#### controllers/ - Controller 層

**役割**: HTTP リクエスト/レスポンスの処理、バリデーションの呼び出し、Service 層への委譲

- `base.controller.ts`: 共通のエラーハンドリングとリクエスト処理を提供するベースクラス
- `*.controller.ts`: 各機能ごとのコントローラー（例: `user.controller.ts`）

**特徴**:

- `BaseController` を継承
- エラーハンドリングは `BaseController` で統一
- バリデーションは `server/utils/validation.ts` の関数を使用
- **型の変換**: Service 層から返される Prisma の型（例: `Users`）を、API レスポンス用の型（例: `shared/response/types/user.type.ts` の `User`）に変換する
- `handleRequest<T>` の型パラメータには、API レスポンス用の型を指定する

#### services/ - Service 層

**役割**: ビジネスロジックの実装、トランザクション管理、Repository 層への委譲

- `*.service.ts`: 各機能ごとのサービス（例: `user.service.ts`）

**特徴**:

- ビジネスロジックを実装
- `TransactionManager` を使用してトランザクション管理
- Repository 層を利用してデータアクセスを行う
- **型の使用**: Prisma の型（例: `Users`）を返す。API レスポンス用の型（`shared/response/types/`）は使用しない

#### repositories/ - Repository 層

**役割**: データの作成・更新・削除・検索・取得操作

- `base.repository.ts`: Prisma クライアントを保持するベースクラス
- `*.repository.ts`: 各エンティティごとのリポジトリ（例: `user.repository.ts`）

**特徴**:

- `BaseRepository` を継承
- Prisma を使用したデータベース操作
- トランザクション対応（`Prisma.TransactionClient` を受け取る）
- データの作成・更新・削除・検索・取得の操作を担当

#### error.ts - カスタムエラークラス

**役割**: カスタム例外クラスの定義

**特徴**:

- エラークラスは `Error` を継承
- 各レイヤーで使用される共通の例外クラス
- HTTP ステータスコードに対応したエラークラスを定義

#### container.ts - DI コンテナ

**役割**: 依存関係の注入（Dependency Injection）を管理

**特徴**:

- シングルトンパターンでインスタンスを管理
- ファクトリー関数を使用してインスタンスを生成
- テスト時にクリア可能

#### dependencies.ts - 依存関係の登録

**役割**: DI コンテナに依存関係を登録

**特徴**:

- アプリケーション起動時に自動実行
- 依存関係の順序を考慮して登録（下位レイヤーから上位レイヤーへ）

#### utils/ - ユーティリティ関数

**役割**: バックエンドロジックで使用するユーティリティ関数を配置

- `validation.ts`: リクエストボディとクエリパラメータのバリデーション関数
- `logger.ts`: 構造化ログを出力するロガークラス

**特徴**:

- HTTP リクエストに特化したバリデーション関数
- Zod スキーマを使用した型安全なバリデーション
- Controller 層から使用される

**logger.ts の詳細**:

- `Logger`クラス: 構造化ログ（JSON 形式）を出力する静的クラス
- ログレベル: `DEBUG`, `INFO`, `WARN`, `ERROR`
- 出力形式: JSON 形式の構造化ログ（タイムスタンプ、レベル、メッセージ、エラー情報、コンテキスト情報を含む）
- 使用場所: `BaseController`でリクエスト開始/終了ログとエラーログを自動出力
- 環境による制御: `DEBUG`ログは本番環境では出力しない

### lib/ - ライブラリ設定

プロジェクト全体で使用するライブラリの設定とラッパーを配置します。

```
lib/
├── prisma.ts              # Prisma クライアントの初期化とトランザクション管理
└── zod.ts                 # Zod のグローバルエラーマップ設定
```

**役割**:

- `prisma.ts`: Prisma クライアントのシングルトンインスタンスを提供し、`TransactionManager` クラスをエクスポートしてデータベーストランザクションを管理
- `zod.ts`: Zod のグローバルエラーマップを設定し、アプリケーション全体で使用されるデフォルトのエラーメッセージを定義

### shared/ - 共有リソース

プロジェクト全体で共有されるリソースを配置します。

```
shared/
├── requests/              # リクエスト関連
│   ├── schemas/          # バリデーションスキーマ
│   │   └── user.schema.ts
│   └── types/            # リクエスト型定義
│       └── user.type.ts
└── response/             # レスポンス関連
    ├── enums/            # レスポンス関連の列挙型
    │   └── error-type.enum.ts
    └── types/            # レスポンス型定義
        ├── user.type.ts
        └── response.type.ts
```

**役割**:

- `requests/schemas/`: Zod を使用したリクエストのバリデーションスキーマ定義
- `requests/types/`: スキーマから推論されたリクエスト型定義（`z.input`を使用）
- `response/enums/`: API レスポンスで使用する列挙型（例: `ErrorType`）
- `response/types/`: API レスポンスの型定義（例: `User`, `Result`, `ResponseData`）
  - `response.type.ts`: `Result`と`ResponseData`の型定義
- プロジェクト全体で使用される共通のリソース

**特徴**:

- スキーマと型を分離することで、型安全性を確保
- リクエスト型はスキーマから自動推論されるため、型の不整合を防止
- レスポンス型は API の出力形式を定義
- 列挙型と型定義を分離することで、構造が明確になる

### utils/ - ユーティリティ関数

再利用可能なユーティリティ関数を配置します。

```
utils/
├── date.ts                # 日時関連のユーティリティ
```

**役割**:

- プロジェクト全体で使用する汎用的な関数
- ビジネスロジックに依存しない純粋な関数

### test/ - テストファイル

テストコードを配置します。

```
test/
├── unit/                  # 単体テスト
│   └── utils/
│       ├── date.spec.ts
├── integration/          # 結合テスト
│   ├── controllers/
│   │   └── user.controller.test.ts
│   ├── repositories/
│   │   └── user.repository.test.ts
│   └── services/
│       └── user.service.test.ts
├── helpers/              # テストヘルパー
│   └── data-cleaner.ts
└── setup.ts              # テスト設定
```

**役割**:

- `unit/`: 単体テスト（`.spec.ts` 拡張子）
- `integration/`: 結合テスト（`.test.ts` 拡張子）
- `helpers/`: テストで使用するヘルパー関数
- `setup.ts`: Jest などのテストフレームワークの設定

**命名規則**:

- 単体テスト: `test/unit/**/*.spec.ts`
- 結合テスト: `test/integration/**/*.test.ts`

### generated/ - 自動生成ファイル

Prisma などのツールによって自動生成されるファイルを配置します。

```
generated/
└── prisma/                # Prisma クライアント（自動生成）
```

**役割**:

- Prisma スキーマから自動生成されるクライアントコード
- 手動で編集しない

## prisma/ ディレクトリ構成

```
prisma/
├── schema.prisma          # Prisma スキーマ定義
└── migrations/            # データベースマイグレーション
    └── 20251115041700_create_users_table/
        └── migration.sql
```

**役割**:

- `schema.prisma`: データベーススキーマの定義
- `migrations/`: データベースマイグレーションファイル

## ディレクトリの依存関係

```
app/api/ (Next.js API Routes)
    ↓
server/controllers/ (Controller 層) ──→ server/utils/validation.ts
    ↓
server/services/ (Service 層)
    ↓
server/repositories/ (Repository 層) ──┐
                                       └──→ lib/prisma.ts ──→ generated/prisma/
```

**依存の方向**:

- 上位レイヤーは下位レイヤーに依存
- 下位レイヤーは上位レイヤーに依存しない
- 各レイヤーは独立してテスト可能

## ファイル命名規則

各ディレクトリでのファイル命名規則は以下の通りです：

- **Controller**: `{機能名}.controller.ts` (例: `user.controller.ts`)
- **Service**: `{機能名}.service.ts` (例: `user.service.ts`)
- **Repository**: `{機能名}.repository.ts` (例: `user.repository.ts`)
- **Schema**: `{機能名}.schema.ts` (例: `user.schema.ts`)
- **Type**: `{機能名}.type.ts` (例: `user.type.ts`)
- **テスト**:
  - 単体テスト: `{機能名}.spec.ts` (例: `date.spec.ts`)
  - 結合テスト: `{機能名}.test.ts` (例: `user.controller.test.ts`)

詳細は [コーディング規約・命名規則](./coding-standards.md) を参照してください。
