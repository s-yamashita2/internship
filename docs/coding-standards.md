# コーディング規約・命名規則

## 概要

このドキュメントでは、プロジェクトで使用するコーディング規約と命名規則を定義します。

## コーディング規約

### TypeScript 設定

- **strict mode**: TypeScript の strict モードを有効化
- **型安全性**: 可能な限り型を明示的に定義
- **型インポート**: 型のみをインポートする場合は`import type`を使用

```typescript
import type { NextRequest } from "next/server";
import type { Users } from "@/generated/prisma";
```

### パスエイリアス

- プロジェクトルートからの相対パスは`@/`エイリアスを使用
- 例: `@/server/controllers/user.controller.ts`

### アーキテクチャパターン

プロジェクトはレイヤードアーキテクチャを採用しています：

1. **Controller 層** (`server/controllers/`)

   - HTTP リクエスト/レスポンスの処理
   - バリデーションの呼び出し
   - Service 層への委譲
   - **型の変換**: Service 層から返される Prisma の型を、API レスポンス用の型（`shared/response/types/`）に変換
   - `handleRequest<T>` の型パラメータには、API レスポンス用の型を指定

2. **Service 層** (`server/services/`)

   - ビジネスロジックの実装
   - トランザクション管理
   - Repository 層への委譲
   - **型の使用**: Prisma の型（例: `Users`）を返す。API レスポンス用の型は使用しない

3. **Repository 層** (`server/repositories/`)

   - データの作成・更新・削除・検索・取得操作
   - データベースアクセスの抽象化

### エラーハンドリング

- カスタムエラークラスを使用（`server/error.ts`）
- エラーハンドリングは`BaseController`で統一
- エラーレスポンスは適切な HTTP ステータスコードを返す

```typescript
// エラークラスの例
throw new InvalidParameterError("User already exists", {
  email: "this email is already in use",
});
```

### バリデーション

- リクエストのバリデーションには**Zod**を使用
- スキーマは`shared/requests/schemas/`に配置
- リクエスト型は`shared/requests/types/`に配置（`z.input`を使用してスキーマから推論）
- バリデーション関数は`server/utils/validation.ts`に定義

### トランザクション管理

- データベース操作は`TransactionManager`を使用してトランザクション管理
- トランザクションが必要な操作は`transactionManager.execute()`でラップ

### コメント

- **日本語コメント**: コード内のコメントは日本語で記述
- **JSDoc**: 関数・メソッドには JSDoc コメントを記述

```typescript
/**
 * ユーザーを検索
 * @param params 検索パラメータ
 * @returns 検索結果
 */
async searchUsers(params: SearchUsersParams): Promise<User[]> {
  // ...
}
```

### インデント・フォーマット

- **インデント**: 2 スペース
- **セミコロン**: 使用する
- **クォート**: シングルクォートまたはダブルクォート（プロジェクト内で統一）

### 非同期処理

- 非同期関数は`async/await`を使用
- Promise チェーンは避ける

### ベースクラス

- 共通処理はベースクラスに実装（`BaseController`, `BaseRepository`）
- 各レイヤーは対応するベースクラスを継承

### ログ

- **構造化ログ**: JSON 形式でログを出力
- **ログレベル**: `DEBUG`, `INFO`, `WARN`, `ERROR`の 4 段階
- **ログ出力**: `Logger`クラス（`server/utils/logger.ts`）を使用
- **ログ出力場所**: `BaseController`でリクエスト開始/終了ログとエラーログを自動出力

**ログの特徴**:

- タイムスタンプ（ISO 8601 形式）を含む
- リクエスト ID を付与してリクエストを追跡可能にする
- エラー情報（名前、メッセージ、スタックトレース、カスタムフィールド）を含む
- コンテキスト情報（追加のメタデータ）を含めることができる
- `DEBUG`ログは本番環境では出力しない（`NODE_ENV !== "production"`の場合のみ出力）

**使用例**:

```typescript
// 情報ログ
Logger.info("Request started", {
  requestId: "xxx",
  method: "GET",
  pathname: "/api/users",
});

// エラーログ
Logger.error(error, {
  requestId: "xxx",
  errorType: "InvalidParameterError",
});
```

### テスト

- **単体テスト**: `test/unit/`ディレクトリ配下に配置し、ファイル名は`.spec.ts`を使用
- **結合テスト**: `test/integration/`ディレクトリ配下に配置し、ファイル名は`.test.ts`を使用

例:

- 単体テスト: `test/unit/utils/date.spec.ts`
- 結合テスト: `test/integration/controllers/user.controller.test.ts`

## 命名規則

| 項目                     | 命名規則                                          | 説明                                                                                         | 例                                                                                                                                                   |
| ------------------------ | ------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| ファイル名               | kebab-case                                        | ファイル名は機能とレイヤーを表す                                                             | `user.controller.ts`<br>`user.service.ts`<br>`user.repository.ts`<br>`user.schema.ts`<br>`user.type.ts`                                              |
| クラス名                 | PascalCase                                        | クラス名は機能とレイヤーを表す                                                               | `UserController`<br>`UserService`<br>`UserRepository`<br>`BaseController`<br>`InvalidParameterError`                                                 |
| 関数・メソッド名         | camelCase                                         | 動詞で始める（検索: `search`, 作成: `create`, 取得: `find`, 更新: `update`, 削除: `delete`） | `searchUsers()`<br>`createUser()`<br>`findUserByEmail()`<br>`validateRequestBody()`                                                                  |
| 変数名                   | camelCase                                         | 意味のある名前を付ける                                                                       | `userService`<br>`searchUsersParams`<br>`createUserParams`<br>`existingUser`                                                                         |
| 型名・インターフェース名 | PascalCase                                        | 型名は`Params`, `Response`, `Error`などのサフィックスを使用                                  | `User`<br>`SearchUsersParams`<br>`CreateUserParams`<br>`FindUserByEmailParams`<br>`Result<T>`<br>`ResponseData<T>`                                   |
| 定数名                   | camelCase / UPPER_SNAKE_CASE                      | 一般的な定数は camelCase、設定値や列挙型の値は UPPER_SNAKE_CASE                              | `isValidIso`<br>`TZ.UTC`<br>`TZ.JST`                                                                                                                 |
| エラークラス名           | PascalCase + `Error`サフィックス                  | カスタムエラークラス                                                                         | `InvalidParameterError`<br>`UnauthorizedError`<br>`ForbiddenError`<br>`NotFoundError`<br>`InternalServerError`                                       |
| スキーマ名               | PascalCase + `Schema`サフィックス                 | Zod スキーマ                                                                                 | `CreateUserParamsSchema`<br>`SearchUsersParamsSchema`                                                                                                |
| テストファイル名         | テスト対象ファイル名 + `.test.ts`または`.spec.ts` | 単体テスト（`test/unit/`）は`.spec.ts`、結合テスト（`test/integration/`）は`.test.ts`を使用  | `test/unit/utils/date.spec.ts`<br>`test/integration/controllers/user.controller.test.ts`<br>`test/integration/services/user.service.test.ts`         |
| ディレクトリ名           | kebab-case                                        | -                                                                                            | `server/controllers/`<br>`server/services/`<br>`server/repositories/`<br>`server/schemas/`<br>`server/types/`<br>`test/integration/`<br>`test/unit/` |
| テーブル名               | camelCase                                         | データベースのテーブル名                                                                     | `users`<br>`userProfiles`<br>`orderItems`                                                                                                            |
| カラム名                 | camelCase                                         | データベースのカラム名                                                                       | `id`<br>`name`<br>`email`<br>`createdAt`<br>`updatedAt`<br>`userId`                                                                                  |
