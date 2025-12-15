import { PrismaClient } from "@/generated/prisma";
import { addDays, addHours, createDate, getParts, now, TZ } from "@/utils/date";

const prisma = new PrismaClient();

type EventTemplate = {
  name: string;
  description: string | null;
  startHour: number;
  duration: number;
  capacity: number;
};

type Event = {
  name: string;
  description: string | null;
  eventStartDatetime: Date;
  eventEndDatetime: Date;
  capacity: number;
};

const eventTemplates = [
  {
    name: "React入門ワークショップ",
    description:
      "Reactの基礎から学ぶ実践的なワークショップ。コンポーネント設計や状態管理について理解を深めます。",
    startHour: 10,
    duration: 2,
    capacity: 30,
  },
  {
    name: "TypeScript実践セミナー",
    description: "TypeScriptの型システムを活用した実践的な開発手法を学びます。",
    startHour: 14,
    duration: 2,
    capacity: 25,
  },
  {
    name: "Next.jsアプリケーション開発",
    description:
      "Next.jsを使ったモダンなWebアプリケーション開発の基礎から応用までを学びます。",
    startHour: 10,
    duration: 3,
    capacity: 40,
  },
  {
    name: "Docker/Kubernetes基礎講座",
    description:
      "コンテナ技術の基礎からKubernetesによるオーケストレーションまでを実践的に学びます。",
    startHour: 13,
    duration: 2,
    capacity: 35,
  },
  {
    name: "AWSクラウド入門",
    description:
      "AWSの主要サービスを使ったクラウドインフラ構築の基礎を学びます。",
    startHour: 10,
    duration: 2,
    capacity: 50,
  },
  {
    name: "Python機械学習ハンズオン",
    description:
      "Pythonと機械学習ライブラリを使った実践的なデータ分析とモデル構築を体験します。",
    startHour: 14,
    duration: 3,
    capacity: 20,
  },
  {
    name: "GraphQL API設計",
    description: "GraphQLを使った効率的なAPI設計と実装方法を学びます。",
    startHour: 11,
    duration: 2,
    capacity: 30,
  },
  {
    name: "マイクロサービスアーキテクチャ",
    description:
      "マイクロサービスアーキテクチャの設計原則と実装パターンを学びます。",
    startHour: 15,
    duration: 2,
    capacity: 25,
  },
  {
    name: "CI/CDパイプライン構築",
    description:
      "GitHub ActionsやJenkinsを使ったCI/CDパイプラインの構築方法を実践的に学びます。",
    startHour: 10,
    duration: 2,
    capacity: 30,
  },
  {
    name: "セキュリティベストプラクティス",
    description:
      "Webアプリケーションのセキュリティ対策とベストプラクティスを学びます。",
    startHour: 13,
    duration: 2,
    capacity: 40,
  },
  {
    name: "データベース設計基礎",
    description:
      "リレーショナルデータベースの設計原則と正規化について学びます。",
    startHour: 10,
    duration: 1,
    capacity: 35,
  },
  {
    name: "フロントエンドパフォーマンス最適化",
    description:
      "Webアプリケーションのパフォーマンスを向上させる実践的な手法を学びます。",
    startHour: 14,
    duration: 2,
    capacity: 30,
  },
  {
    name: "バックエンドAPI開発",
    description:
      "RESTful APIの設計と実装、エラーハンドリングについて学びます。",
    startHour: 11,
    duration: 2,
    capacity: 25,
  },
  {
    name: "モバイルアプリ開発（React Native）",
    description:
      "React Nativeを使ったクロスプラットフォームモバイルアプリ開発を学びます。",
    startHour: 10,
    duration: 3,
    capacity: 20,
  },
  {
    name: "テスト駆動開発（TDD）",
    description:
      "テスト駆動開発の実践方法とユニットテスト、統合テストの書き方を学びます。",
    startHour: 15,
    duration: 2,
    capacity: 30,
  },
  {
    name: "Git/GitHub実践",
    description:
      "Gitの高度な使い方とGitHubを使ったチーム開発のベストプラクティスを学びます。",
    startHour: 10,
    duration: 1,
    capacity: 40,
  },
  {
    name: "デザインパターン入門",
    description:
      "オブジェクト指向設計における代表的なデザインパターンを学びます。",
    startHour: 13,
    duration: 2,
    capacity: 25,
  },
  {
    name: "リアルタイムアプリケーション開発",
    description:
      "WebSocketを使ったリアルタイム通信アプリケーションの開発方法を学びます。",
    startHour: 14,
    duration: 2,
    capacity: 30,
  },
  {
    name: "サーバーレスアーキテクチャ",
    description:
      "AWS LambdaやVercel Functionsを使ったサーバーレスアプリケーションの構築を学びます。",
    startHour: 11,
    duration: 2,
    capacity: 35,
  },
  {
    name: "コンテナオーケストレーション",
    description:
      "Kubernetesを使ったコンテナオーケストレーションの実践的な運用方法を学びます。",
    startHour: 10,
    duration: 3,
    capacity: 20,
  },
  {
    name: "モノレポ開発手法",
    description:
      "TurborepoやNxを使ったモノレポ構成での効率的な開発手法を学びます。",
    startHour: 15,
    duration: 2,
    capacity: 30,
  },
  {
    name: "アクセシビリティ対応",
    description: "Webアクセシビリティ（a11y）の基礎と実装方法を学びます。",
    startHour: 10,
    duration: 1,
    capacity: 40,
  },
  {
    name: "パフォーマンスモニタリング",
    description:
      "APMツールを使ったアプリケーションのパフォーマンス監視と分析手法を学びます。",
    startHour: 13,
    duration: 2,
    capacity: 25,
  },
  {
    name: "データ可視化技術",
    description:
      "D3.jsやChart.jsを使ったデータ可視化の実践的な手法を学びます。",
    startHour: 14,
    duration: 2,
    capacity: 30,
  },
  {
    name: "ブロックチェーン入門",
    description:
      "ブロックチェーンの基礎概念とスマートコントラクト開発の入門を学びます。",
    startHour: 10,
    duration: 2,
    capacity: 35,
  },
  {
    name: "DevOps実践",
    description:
      "インフラストラクチャのコード化（IaC）とDevOpsの実践的な手法を学びます。",
    startHour: 16,
    duration: 2,
    capacity: 30,
  },
  {
    name: "API設計のベストプラクティス",
    description:
      "RESTful APIとGraphQLの設計原則とベストプラクティスを学びます。",
    startHour: 11,
    duration: 1,
    capacity: 40,
  },
  {
    name: "フルスタック開発入門",
    description:
      "フロントエンドからバックエンドまで、フルスタック開発の基礎を学びます。",
    startHour: 10,
    duration: 3,
    capacity: 25,
  },
  {
    name: "クラウドネイティブ開発",
    description:
      "クラウドネイティブなアプリケーション開発の設計原則と実践方法を学びます。",
    startHour: 14,
    duration: 2,
    capacity: 30,
  },
  {
    name: "AI/MLアプリケーション統合",
    description:
      "機械学習モデルをWebアプリケーションに統合する実践的な手法を学びます。",
    startHour: 15,
    duration: 2,
    capacity: 20,
  },
] as const satisfies EventTemplate[];

const today = now();
const events: Event[] = eventTemplates.map((template, index) => {
  // -5日からeventTemplates.length日間
  const daysOffset = index - 5;
  const eventDate = addDays(today, daysOffset);

  // 日付のUTC年、月、日を取得してUTC 0時のISO文字列を作成
  const { year, monthIndex, day } = getParts(eventDate, { timeZone: TZ.JST });
  const startDate = createDate({
    params: {
      year,
      monthIndex,
      day,
      hour: template.startHour,
    },
    options: {
      timeZone: TZ.JST,
    },
  });
  const endDate = addHours(startDate, template.duration);

  return {
    name: template.name,
    description: template.description,
    eventStartDatetime: startDate,
    eventEndDatetime: endDate,
    capacity: template.capacity,
  };
});

export const createEvents = async () => {
  await prisma.events.createMany({
    data: events.map((event) => ({
      name: event.name,
      description: event.description,
      eventStartDatetime: event.eventStartDatetime,
      eventEndDatetime: event.eventEndDatetime,
      capacity: event.capacity,
    })),
  });
};
