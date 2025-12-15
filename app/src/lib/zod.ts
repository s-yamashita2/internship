import z from "zod";

/**
 * Zodのグローバルエラーマップを設定
 * アプリケーション全体で使用されるデフォルトのエラーメッセージを定義
 */
z.config({
  /**
   * カスタムエラーハンドラー
   * Zodのバリデーションエラーが発生した際に、ユーザーフレンドリーなエラーメッセージを生成する
   * @param issue - Zodのバリデーションエラー情報
   * @returns エラーメッセージを含むオブジェクト
   */
  customError: (issue) => {
    // エラーが発生したフィールドのパスを取得（例: "user.email"）
    // パスが存在する場合はドット区切りで結合し、存在しない場合は空文字列
    const path = issue.path?.length ? issue.path.join(".") : "";
    let message: string;

    // エラーコードに応じて適切なエラーメッセージを生成
    switch (issue.code) {
      // 型が不正な場合のエラー
      case "invalid_type":
        // 値が未定義（必須フィールドが欠落）の場合
        if (issue.input === undefined) {
          message = path ? `${path} is required` : "Required";
        } else {
          // 型が一致しない場合（例: 文字列を期待していたが数値が来た）
          message = path
            ? `type of ${path} must be ${issue.expected}`
            : `Expected ${issue.expected}, received ${issue.received}`;
        }
        break;

      // フォーマットが不正な場合のエラー
      case "invalid_format":
        // ISO 8601日時フォーマットのエラー
        if (issue.format === "iso_datetime") {
          message = path
            ? `${path} must be a valid ISO 8601 datetime format`
            : "Invalid ISO 8601 datetime format";
        }
        // その他のフォーマットエラー
        else {
          message = issue.message || "Invalid format";
        }
        break;

      // 値が最小値未満の場合のエラー
      case "too_small":
        // 文字列の長さが不足している場合
        if (issue.origin === "string") {
          message = path
            ? `${path} must be at least ${issue.minimum} character${issue.minimum === 1 ? "" : "s"}`
            : `String must be at least ${issue.minimum} character${issue.minimum === 1 ? "" : "s"}`;
        }
        // 数値が最小値未満の場合
        // Zodのminimumは「以上」を意味するため、ユーザー向けメッセージでは「より大きい」として表示
        else if (
          issue.origin === "number" ||
          issue.origin === "int" ||
          issue.origin === "bigint"
        ) {
          // minimum - 1 を表示することで、「minimum以上」という制約を「minimumより大きい」として表現
          const minValue = Number(issue.minimum) - 1;
          message = path
            ? `${path} must be greater than ${minValue}`
            : `Number must be greater than ${minValue}`;
        }
        // 配列の要素数が不足している場合
        else if (issue.origin === "array") {
          message = path
            ? `${path} must have at least ${issue.minimum} element${issue.minimum === 1 ? "" : "s"}`
            : `Array must have at least ${issue.minimum} element${issue.minimum === 1 ? "" : "s"}`;
        }
        // その他の型で値が小さすぎる場合
        else {
          message = issue.message || "Value is too small";
        }
        break;

      // 値が最大値を超えている場合のエラー
      case "too_big":
        // 文字列の長さが超過している場合
        if (issue.origin === "string") {
          message = path
            ? `${path} must be at most ${issue.maximum} characters`
            : `String must be at most ${issue.maximum} characters`;
        }
        // 数値が最大値を超えている場合
        // Zodのmaximumは「以下」を意味するため、ユーザー向けメッセージでは「未満」として表示
        else if (
          issue.origin === "number" ||
          issue.origin === "int" ||
          issue.origin === "bigint"
        ) {
          // maximum + 1 を表示することで、「maximum以下」という制約を「maximum未満」として表現
          const maxValue = Number(issue.maximum) + 1;
          message = path
            ? `${path} must be less than ${maxValue}`
            : `Number must be less than ${maxValue}`;
        }
        // 配列の要素数が超過している場合
        else if (issue.origin === "array") {
          message = path
            ? `${path} must have at most ${issue.maximum} element${issue.maximum === 1 ? "" : "s"}`
            : `Array must have at most ${issue.maximum} element${issue.maximum === 1 ? "" : "s"}`;
        }
        // その他の型で値が大きすぎる場合
        else {
          message = issue.message || "Value is too big";
        }
        break;

      // カスタムバリデーションエラー
      case "custom":
        message = issue.message || "Invalid value";
        break;

      // その他のエラーコード
      default:
        message = issue.message || "Invalid value";
    }

    return { message };
  },
});
