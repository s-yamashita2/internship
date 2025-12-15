# DB テーブル定義書

## 概要

このドキュメントでは、プロジェクトで使用するデータベースのテーブル定義について説明します。

## データベース情報

- **データベース種類**: MySQL
- **文字セット**: utf8mb4
- **照合順序**: utf8mb4_unicode_ci

## テーブル一覧

| テーブル名           | 説明                                   | 補足 |
| -------------------- | -------------------------------------- | ---- |
| `Events`             | イベント情報を格納するテーブル         |      |
| `EventRegistrations` | イベント参加申込情報を格納するテーブル |      |

## テーブル詳細

### Events テーブル

イベント情報を管理するテーブルです。

#### テーブル情報

- **テーブル名**: `Events`
- **説明**: イベントの情報（ID、名前、説明、開催開始日時、開催終了日時、定員）を格納

#### カラム定義

| カラム名             | データ型         | NULL 許可 | デフォルト値      | 制約        | 説明                         |
| -------------------- | ---------------- | --------- | ----------------- | ----------- | ---------------------------- |
| `id`                 | UNSIGNED INTEGER | NOT NULL  | AUTO_INCREMENT    | PRIMARY KEY | イベント ID（主キー）        |
| `name`               | VARCHAR(200)     | NOT NULL  | -                 | -           | イベント名                   |
| `description`        | TEXT             | NULL      | NULL              | -           | イベント説明                 |
| `eventStartDatetime` | DATETIME         | NOT NULL  | -                 | -           | イベント開始日時             |
| `eventEndDatetime`   | DATETIME         | NOT NULL  | -                 | -           | イベント終了日時             |
| `capacity`           | INTEGER          | NOT NULL  | -                 | -           | 定員数                       |
| `createdAt`          | DATETIME         | NOT NULL  | CURRENT_TIMESTAMP | -           | レコード作成日時             |
| `updatedAt`          | DATETIME         | NOT NULL  | CURRENT_TIMESTAMP | -           | レコード更新日時（自動更新） |

#### インデックス

| インデックス名                  | カラム               | 種類        | 説明                                         |
| ------------------------------- | -------------------- | ----------- | -------------------------------------------- |
| `PRIMARY`                       | `id`                 | PRIMARY KEY | 主キーインデックス                           |
| `Events_eventStartDatetime_idx` | `eventStartDatetime` | INDEX       | イベント開始日時の検索・ソート用インデックス |
| `Events_eventEndDatetime_idx`   | `eventEndDatetime`   | INDEX       | イベント終了日時の検索用インデックス         |
| `Events_createdAt_idx`          | `createdAt`          | INDEX       | 作成日時のソート用インデックス               |

### EventRegistrations テーブル

イベント参加申込情報を管理するテーブルです。

#### テーブル情報

- **テーブル名**: `EventRegistrations`
- **説明**: イベントの参加申込情報（ID、参加イベント、参加者名、メールアドレス、電話番号、生年月日、性別、ステータス、備考欄）を格納

#### カラム定義

| カラム名      | データ型         | NULL 許可 | デフォルト値      | 制約                        | 説明                                                |
| ------------- | ---------------- | --------- | ----------------- | --------------------------- | --------------------------------------------------- |
| `id`          | UNSIGNED INTEGER | NOT NULL  | AUTO_INCREMENT    | PRIMARY KEY                 | 参加申込 ID（主キー）                               |
| `eventId`     | UNSIGNED INTEGER | NOT NULL  | -                 | FOREIGN KEY (`Events`.`id`) | イベント ID（外部キー）                             |
| `name`        | VARCHAR(100)     | NOT NULL  | -                 | -                           | 参加者名                                            |
| `email`       | VARCHAR(255)     | NOT NULL  | -                 | -                           | 参加者のメールアドレス                              |
| `phoneNumber` | VARCHAR(20)      | NOT NULL  | -                 | -                           | 参加者の電話番号                                    |
| `birthDate`   | DATE             | NULL      | NULL              | -                           | 参加者の生年月日                                    |
| `gender`      | TINYINT          | NOT NULL  | -                 | -                           | 参加者の性別（1: 男性, 2: 女性, 3: 未回答）         |
| `status`      | TINYINT          | NOT NULL  | 1                 | -                           | ステータス（1: 申込中, 2: 確認済, 3: キャンセル済） |
| `notes`       | TEXT             | NULL      | NULL              | -                           | 備考欄                                              |
| `createdAt`   | DATETIME         | NOT NULL  | CURRENT_TIMESTAMP | -                           | レコード作成日時                                    |
| `updatedAt`   | DATETIME         | NOT NULL  | CURRENT_TIMESTAMP | -                           | レコード更新日時（自動更新）                        |

#### インデックス

| インデックス名                   | カラム    | 種類        | 説明                                     |
| -------------------------------- | --------- | ----------- | ---------------------------------------- |
| `PRIMARY`                        | `id`      | PRIMARY KEY | 主キーインデックス                       |
| `EventRegistrations_email_idx`   | `email`   | INDEX       | 参加者のメールアドレス検索用インデックス |
| `EventRegistrations_eventId_idx` | `eventId` | INDEX       | イベント ID 検索用インデックス           |
| `EventRegistrations_status_idx`  | `status`  | INDEX       | ステータス検索用インデックス             |
