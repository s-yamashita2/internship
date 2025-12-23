# API 仕様書

## 概要

このドキュメントでは、プロジェクトで提供する REST API の仕様について説明します。

## 目次

- [基本情報](#基本情報)
- [共通レスポンス形式](#共通レスポンス形式)
  - [成功レスポンス](#成功レスポンス)
  - [エラーレスポンス](#エラーレスポンス)
  - [エラータイプ](#エラータイプ)
  - [HTTP ステータスコード](#http-ステータスコード)
- [エンドポイント一覧](#エンドポイント一覧)
- [エンドポイント詳細](#エンドポイント詳細)
  - [GET /api/events](#get-apievents)
  - [POST /api/events](#post-apievents)
- [注意事項](#注意事項)

## 基本情報

- **ベース URL**: `/api`
- **リクエスト形式**: JSON
- **レスポンス形式**: JSON
- **文字エンコーディング**: UTF-8

## 共通レスポンス形式

### 成功レスポンス

すべての API は以下の形式でレスポンスを返します。

```json
{
  "data": {
    // エンドポイントごとのデータ
  }
}
```

### エラーレスポンス

エラーが発生した場合、以下の形式でレスポンスを返します。
※ fields はエラータイプが`INVALID_PARAMETER`の場合のみ

```json
{
  "error": {
    "message": "エラーメッセージ",
    "type": "エラータイプ",
    "fields": {
      "fieldName": "フィールドごとのエラーメッセージ"
    }
  }
}
```

#### エラータイプ

| エラータイプ            | 説明                       |
| ----------------------- | -------------------------- |
| `INVALID_PARAMETER`     | リクエストパラメータが不正 |
| `UNAUTHORIZED`          | 認証が必要                 |
| `FORBIDDEN`             | アクセス権限がない         |
| `NOT_FOUND`             | リソースが見つからない     |
| `INTERNAL_SERVER_ERROR` | サーバー内部エラー         |

#### HTTP ステータスコード

| ステータスコード | 説明                   |
| ---------------- | ---------------------- |
| 200              | 成功                   |
| 201              | 作成成功               |
| 400              | リクエストが不正       |
| 401              | 認証が必要             |
| 403              | アクセス権限がない     |
| 404              | リソースが見つからない |
| 500              | サーバー内部エラー     |

## エンドポイント一覧

| メソッド | エンドポイント                   | 説明         |
| -------- | -------------------------------- | ------------ |
| GET      | [`/api/events`](#get-apievents)  | イベント検索 |
| POST     | [`/api/events`](#post-apievents) | イベント作成 |

## エンドポイント詳細

### GET /api/events

イベントを検索します。

#### リクエスト

**クエリパラメータ**

| パラメータ名   | 型      | 必須 | 説明       |
| -------------- | ------- | ---- | ---------- |
| `keyword`      | string  | -    | ジャンル   |
| `from`         | date    | -    | 開催日時   |
| `to`           | date    | -    | 終了日時   |
| `prefecture`   | int     | -    | 開催場所   |
| `new`          | boolean | -    | 登録時間   |
| `createdHours` | int     | -    | 開催日時   |
| `order`        | asc     | -    | 昇順、降順 |

**バリデーション**

| フィールド名 | エラー条件                                         | エラーメッセージ                           |
| ------------ | -------------------------------------------------- | ------------------------------------------ |
| `keyword`    | 40 文字を超える場合                                | `"please enter within 40 characters"`      |
| `from`       | 日付文字列以外の文字列の場合                       | `"please enter a valid ISO 8601 datetime"` |
| `to`         | 日付文字列以外の文字列の場合                       | `"please enter a valid ISO 8601 datetime"` |
| `to`         | from より未来日付ではない場合                      | `"please enter a date after  from"`        |
| `prefecture` | 1~47 以外の数値を入れた場合 数値以外の文字列の場合 | `"please enter a number between 1 and 47"` |
| `new`        | true または false 以外の文字列の場合               | `"please enter true or false"`             |
| `order`      | asc または desc 以外の文字列の場合                 | `"please enter asc or desc"`               |

**リクエスト例**

```bash
curl -X GET "http://localhost:3000/api/events" \
  -H "Content-Type: application/json"
```

#### レスポンス

**成功時（200 OK）**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Next.js勉強会",
      "description": "Next.jsの基礎を学ぶ勉強会です",
      "eventStartDatetime": "2024-06-01T10:00:00.000Z",
      "eventEndDatetime": "2024-06-01T12:00:00.000Z",
      "capacity": 50,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**エラー時（400 Bad Request）**

```json
{
  "error": {
    "message": "Invalid query parameters",
    "type": "INVALID_PARAMETER",
    "fields": {
      "from": "invalid date format"
    }
  }
}
```

#### レスポンスデータ型

| フィールド名         | 型     | 説明                              |
| -------------------- | ------ | --------------------------------- |
| `id`                 | number | イベント ID                       |
| `name`               | string | イベント名                        |
| `description`        | string | イベント説明（null 可）           |
| `eventStartDatetime` | string | イベント開始日時（ISO 8601 形式） |
| `eventEndDatetime`   | string | イベント終了日時（ISO 8601 形式） |
| `capacity`           | number | 定員数                            |
| `createdAt`          | string | 作成日時（ISO 8601 形式）         |
| `updatedAt`          | string | 更新日時（ISO 8601 形式）         |

---

### POST /api/events

新しいイベントを作成します。

#### リクエスト

**リクエストボディ**

| パラメータ名         | 型     | 必須 | 説明             |
| -------------------- | ------ | ---- | ---------------- |
| `name`               | string | ⚪︎  | イベント名       |
| `description`        | string | -    | イベント説明     |
| `eventStartDatetime` | string | ⚪︎  | イベント開始日時 |
| `eventEndDatetime`   | string | ⚪︎  | イベント終了日時 |
| `capacity`           | number | ⚪︎  | 定員数           |

**バリデーション**

| フィールド名         | エラー条件                                  | エラーメッセージ                                                |
| -------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| `name`               | 未指定の場合                                | `"name is required"`                                            |
| `name`               | 文字列型でない場合                          | `"type of name must be string"`                                 |
| `name`               | 空文字列の場合                              | `"name must be at least 1 character"`                           |
| `name`               | 200 文字を超える場合                        | `"name must be at most 200 characters"`                         |
| `description`        | 文字列型でない場合                          | `"type of description must be string"`                          |
| `description`        | 空文字列の場合                              | `"description must be at least 1 character"`                    |
| `description`        | 500 文字を超える場合                        | `"description must be at most 500 characters"`                  |
| `eventStartDatetime` | 未指定の場合                                | `"eventStartDatetime is required"`                              |
| `eventStartDatetime` | 文字列型でない場合                          | `"type of eventStartDatetime must be string"`                   |
| `eventStartDatetime` | ISO 8601 形式でない場合                     | `"eventStartDatetime must be a valid ISO 8601 datetime format"` |
| `eventEndDatetime`   | 未指定の場合                                | `"eventEndDatetime is required"`                                |
| `eventEndDatetime`   | 文字列型でない場合                          | `"type of eventEndDatetime must be string"`                     |
| `eventEndDatetime`   | ISO 8601 形式でない場合                     | `"eventEndDatetime must be a valid ISO 8601 datetime format"`   |
| `eventEndDatetime`   | `eventStartDatetime` より前または等しい場合 | `"eventEndDatetime must be after than eventStartDatetime"`      |
| `capacity`           | 未指定の場合                                | `"capacity is required"`                                        |
| `capacity`           | 数値型でない場合                            | `"type of capacity must be number"`                             |
| `capacity`           | 1 未満の場合                                | `"capacity must be greater than 0"`                             |

**リクエスト例**

```bash
curl -X POST "http://localhost:3000/api/events" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Next.js勉強会",
    "description": "Next.jsの基礎を学ぶ勉強会です",
    "eventStartDatetime": "2024-06-01T10:00:00.000Z",
    "eventEndDatetime": "2024-06-01T12:00:00.000Z",
    "capacity": 50
  }'
```

#### レスポンス

**成功時（201 Created）**

```json
{
  "data": {
    "id": 1,
    "name": "Next.js勉強会",
    "description": "Next.jsの基礎を学ぶ勉強会です",
    "eventStartDatetime": "2024-06-01T10:00:00.000Z",
    "eventEndDatetime": "2024-06-01T12:00:00.000Z",
    "capacity": 50,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**エラー時（400 Bad Request）**

```json
{
  "error": {
    "message": "Invalid request body",
    "type": "INVALID_PARAMETER",
    "fields": {
      "eventEndDatetime": "eventEndDatetime must be after eventStartDatetime",
      "capacity": "capacity must be greater than 0"
    }
  }
}
```

#### レスポンスデータ型

| フィールド名         | 型     | 説明                              |
| -------------------- | ------ | --------------------------------- |
| `id`                 | number | イベント ID                       |
| `name`               | string | イベント名                        |
| `description`        | string | イベント説明（null 可）           |
| `eventStartDatetime` | string | イベント開始日時（ISO 8601 形式） |
| `eventEndDatetime`   | string | イベント終了日時（ISO 8601 形式） |
| `capacity`           | number | 定員数                            |
| `createdAt`          | string | 作成日時（ISO 8601 形式）         |
| `updatedAt`          | string | 更新日時（ISO 8601 形式）         |

---

## 注意事項

1. **日時形式**: すべての日時は ISO 8601 形式（UTC）で返されます
2. **エラーハンドリング**: エラーが発生した場合、適切な HTTP ステータスコードとエラー情報が返されます
3. **バリデーション**: リクエストパラメータはすべてバリデーションされます。不正な値が含まれている場合、エラーレスポンスが返されます
