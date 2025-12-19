# Prisma 入門ガイド

## はじめに

このガイドでは、データベースを扱うツール「Prisma」について説明する。

---

## 1. そもそもデータベースって何？

アプリケーションを作る時、**データを保存する場所**が必要だ。例えば：

- SNS アプリ → ユーザー情報、投稿、コメント
- EC サイト → 商品情報、注文履歴、在庫
- 英語学習アプリ → ユーザーの学習記録、スコア、問題データ

これらのデータを整理して保存する「箱」が**データベース**である。

---

## 2. SQL って何？

**SQL（エスキューエル）** は、データベースと会話するための言語である。

### SQL の例

```sql
-- ユーザー一覧を取得する
SELECT * FROM users;

-- 特定のユーザーを取得する
SELECT * FROM users WHERE id = 1;

-- 新しいユーザーを追加する
INSERT INTO users (name, email) VALUES ('太郎', 'taro@example.com');
```

### SQL の問題点

アプリケーションコードにて SQL を使用する際には以下のような難しさがある：

1. **文法を覚える必要がある** - SELECT、WHERE、JOIN など独特の書き方
2. **タイプミスしやすい** - `users`と書くべきところを`user`と書いてしまうなど
3. **データの型チェックがない** - 数字を入れるべきところに文字を入れてもエラーにならない
4. **コードとの統合が面倒** - SQL の結果をプログラムで使うのに変換作業が必要

---

## 3. Prisma とは？

**Prisma（プリズマ）** は、SQL をもっと簡単に、安全に使えるようにするツールである。

### Prisma の特徴

- **プログラミング言語で書ける** - JavaScript や TypeScript で自然に書ける
- **タイプミスを防げる** - エディタが間違いを教えてくれる
- **型安全** - データの型（数字か文字か等）を自動でチェック
- **読みやすい** - SQL より直感的で分かりやすい

### 料理に例えると...

- **SQL** = 料理人が厨房で直接調理する（専門知識が必要）
- **Prisma** = レストランでメニューから注文する（簡単で間違いにくい）

---

## 4. Prisma と SQL の比較

### 例 1: 全てのユーザーを取得

**SQL の場合**

```sql
SELECT * FROM users;
```

**Prisma の場合**

```typescript
const users = await prisma.user.findMany();
```

### 例 2: 特定のユーザーを取得

**SQL の場合**

```sql
SELECT * FROM users WHERE id = 1;
```

**Prisma の場合**

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
});
```

### 例 3: 名前で検索

**SQL の場合**

```sql
SELECT * FROM users WHERE name LIKE '%太郎%';
```

**Prisma の場合**

```typescript
const users = await prisma.user.findMany({
  where: {
    name: {
      contains: "太郎",
    },
  },
});
```

**見比べてみると？**

- Prisma の方が**英語の文章みたいに読める**
- `findMany`（たくさん見つける）、`findUnique`（一つだけ見つける）など、**名前から何をするか分かる**
- `where`の中に条件を書くので**構造が分かりやすい**

---

## 5. Prisma の基本的な使い方

### 5.1 準備（スキーマファイル）

Prisma を使う前に、`schema.prisma`というファイルでデータの設計図を書く。

```prisma
// schema.prisma の例

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}
```

**読み方：**

- `model User` = 「ユーザー」というデータの種類を定義
- `id Int` = id という項目があって、数字（Int）が入る
- `@id` = この項目が識別番号（主キー）
- `@default(autoincrement())` = 自動で番号を増やす

### 5.2 Prisma の初期化

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
```

これで`prisma`という道具が使えるようになる。

---

## 6. データ取得の基本パターン

### 6.1 全件取得 - `findMany()`

**すべてのデータを取得する**

```typescript
// ユーザー全員を取得
const allUsers = await prisma.user.findMany();

console.log(allUsers);
// 結果: [{ id: 1, name: '太郎', email: '...' }, { id: 2, name: '花子', email: '...' }, ...]
```

### 6.2 1 件取得 - `findUnique()`

**ユニークな値（ID やメールなど）で 1 つだけ取得**

```typescript
// IDが1のユーザーを取得
const user = await prisma.user.findUnique({
  where: { id: 1 },
});

console.log(user);
// 結果: { id: 1, name: '太郎', email: 'taro@example.com', ... }
```

```typescript
// メールアドレスでユーザーを取得
const user = await prisma.user.findUnique({
  where: { email: "taro@example.com" },
});
```

### 6.3 条件付き取得 - `findMany()` + `where`

**条件に合うデータをすべて取得**

```typescript
// 公開済みの投稿だけを取得
const publishedPosts = await prisma.post.findMany({
  where: {
    published: true,
  },
});
```

```typescript
// 名前に「太郎」が含まれるユーザーを取得
const users = await prisma.user.findMany({
  where: {
    name: {
      contains: "太郎",
    },
  },
});
```

### 6.4 最初の 1 件だけ取得 - `findFirst()`

**条件に合う最初の 1 件だけ取得**

```typescript
// 最新の投稿を1つ取得
const latestPost = await prisma.post.findFirst({
  orderBy: {
    createdAt: "desc", // 作成日時の降順（新しい順）
  },
});
```

---

## 7. 便利な取得オプション

### 7.1 並び替え - `orderBy`

```typescript
// 名前の昇順（あいうえお順）で取得
const users = await prisma.user.findMany({
  orderBy: {
    name: "asc", // asc = 昇順, desc = 降順
  },
});
```

### 7.2 件数制限 - `take`

```typescript
// 最初の10件だけ取得
const users = await prisma.user.findMany({
  take: 10,
});
```

### 7.3 スキップ - `skip`

```typescript
// 最初の10件をスキップして、次の10件を取得（ページング）
const users = await prisma.user.findMany({
  skip: 10,
  take: 10,
});
```

### 7.4 特定の項目だけ取得 - `select`

```typescript
// 名前とメールだけ取得（idは不要な場合）
const users = await prisma.user.findMany({
  select: {
    name: true,
    email: true,
  },
});

// 結果: [{ name: '太郎', email: 'taro@...' }, ...]
```

---

## 8. 関連データの取得 - `include`

データベースでは、データ同士が関連していることがある。
例：ユーザーは複数の投稿を持っている

### 8.1 関連データも一緒に取得

```typescript
// ユーザーと、そのユーザーの投稿も一緒に取得
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true, // postsも一緒に取得
  },
});

console.log(userWithPosts);
// 結果:
// {
//   id: 1,
//   name: '太郎',
//   email: 'taro@...',
//   posts: [
//     { id: 1, title: '最初の投稿', ... },
//     { id: 2, title: '2つ目の投稿', ... }
//   ]
// }
```

### 8.2 関連データに条件をつける

```typescript
// ユーザーと、その「公開済み」の投稿だけを取得
const userWithPublishedPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: {
        published: true,
      },
    },
  },
});
```

---

## 9. 複雑な条件の組み合わせ

### 9.1 AND 条件（すべての条件を満たす）

```typescript
// 公開済み かつ タイトルに「プログラミング」が含まれる投稿
const posts = await prisma.post.findMany({
  where: {
    AND: [{ published: true }, { title: { contains: "プログラミング" } }],
  },
});

// またはシンプルに書ける（ANDは省略可能）
const posts = await prisma.post.findMany({
  where: {
    published: true,
    title: { contains: "プログラミング" },
  },
});
```

### 9.2 OR 条件（どれか 1 つの条件を満たす）

```typescript
// タイトルに「プログラミング」または「デザイン」が含まれる投稿
const posts = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: "プログラミング" } },
      { title: { contains: "デザイン" } },
    ],
  },
});
```

### 9.3 NOT 条件（条件を満たさない）

```typescript
// 公開されていない投稿
const posts = await prisma.post.findMany({
  where: {
    NOT: {
      published: true,
    },
  },
});

// またはシンプルに
const posts = await prisma.post.findMany({
  where: {
    published: false,
  },
});
```

---

## 10. 実践的な例

### 例 1: ブログの記事一覧ページ

```typescript
async function getBlogPosts(page: number) {
  const postsPerPage = 10;

  const posts = await prisma.post.findMany({
    where: {
      published: true, // 公開済みのみ
    },
    include: {
      author: {
        select: {
          name: true, // 著者名だけ取得
        },
      },
    },
    orderBy: {
      createdAt: "desc", // 新しい順
    },
    skip: (page - 1) * postsPerPage, // ページング
    take: postsPerPage,
  });

  return posts;
}

// 使い方
const firstPage = await getBlogPosts(1); // 1ページ目
```

### 例 2: ユーザー検索機能

```typescript
async function searchUsers(searchTerm: string) {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm } },
        { email: { contains: searchTerm } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      // パスワードなど機密情報は取得しない
    },
  });

  return users;
}

// 使い方
const results = await searchUsers("太郎");
```

### 例 3: ダッシュボードの統計情報

```typescript
async function getDashboardStats(userId: number) {
  // 投稿数を取得
  const totalPosts = await prisma.post.count({
    where: { authorId: userId },
  });

  // 公開済み投稿数
  const publishedPosts = await prisma.post.count({
    where: {
      authorId: userId,
      published: true,
    },
  });

  // 最新の投稿3件
  const recentPosts = await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });

  return {
    totalPosts,
    publishedPosts,
    recentPosts,
  };
}
```

---

## 11. よく使う条件指定

| やりたいこと       | Prisma の書き方                     |
| ------------------ | ----------------------------------- |
| 等しい             | `{ field: value }`                  |
| 含む（部分一致）   | `{ field: { contains: 'text' } }`   |
| 始まる             | `{ field: { startsWith: 'text' } }` |
| 終わる             | `{ field: { endsWith: 'text' } }`   |
| より大きい         | `{ field: { gt: 10 } }`             |
| 以上               | `{ field: { gte: 10 } }`            |
| より小さい         | `{ field: { lt: 10 } }`             |
| 以下               | `{ field: { lte: 10 } }`            |
| リストに含まれる   | `{ field: { in: [1, 2, 3] } }`      |
| リストに含まれない | `{ field: { notIn: [1, 2, 3] } }`   |
| NULL である        | `{ field: null }`                   |
| NULL でない        | `{ field: { not: null } }`          |

---

## 12. エラーハンドリング

データが見つからない場合の対応：

```typescript
// findUniqueは見つからない場合nullを返す
const user = await prisma.user.findUnique({
  where: { id: 999 },
});

if (!user) {
  console.log("ユーザーが見つかりませんでした");
  return;
}

// 見つかった場合の処理
console.log(user.name);
```

```typescript
// findUniqueOrThrowは見つからない場合エラーを投げる
try {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: 999 },
  });
  console.log(user.name);
} catch (error) {
  console.log("ユーザーが見つかりませんでした");
}
```

---

## 13. まとめ

### Prisma の良いところ

✅ **書きやすい** - SQL より直感的で読みやすい  
✅ **安全** - タイプミスや型の間違いをエディタが教えてくれる  
✅ **効率的** - 必要なデータだけ取得できる  
✅ **学びやすい** - ドキュメントが充実している

### 基本の型を覚えよう

- `findMany()` - 複数取得
- `findUnique()` - 1 件取得（ID 等）
- `findFirst()` - 条件に合う最初の 1 件
- `count()` - 件数を数える

### 覚えておくオプション

- `where` - 条件指定
- `select` - 取得する項目を選ぶ
- `include` - 関連データも取得
- `orderBy` - 並び替え
- `take` - 件数制限
- `skip` - スキップ（ページング）

---

## 14. 次のステップ

1. **データの作成** - `create()`
2. **データの更新** - `update()`
3. **データの削除** - `delete()`
4. **トランザクション** - 複数の操作をまとめる

---

## 参考リンク

- [Prisma 公式ドキュメント（日本語あり）](https://www.prisma.io/docs)
- [Prisma Playground](https://playground.prisma.io/) - ブラウザで試せる
