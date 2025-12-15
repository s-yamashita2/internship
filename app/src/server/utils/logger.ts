import { now, toIso } from "@/utils/date";

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

type LogContext = Record<string, unknown>;

interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
    fields?: Record<string, string>;
  };
  context?: LogContext;
}

export class Logger {
  /**
   * 構造化ログを出力する
   * @param level ログレベル
   * @param message メッセージ
   * @param context 追加のコンテキスト情報
   * @param error エラー情報（エラーログの場合）
   */
  private static log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: StructuredLog["error"]
  ): void {
    const logEntry: StructuredLog = {
      timestamp: toIso(now()),
      level,
      message,
      ...(error && { error }),
      ...(context && Object.keys(context).length > 0 && { context }),
    };

    const logString = JSON.stringify(logEntry);

    switch (level) {
      case "DEBUG":
        console.debug(logString);
        break;
      case "INFO":
        console.info(logString);
        break;
      case "WARN":
        console.warn(logString);
        break;
      case "ERROR":
        console.error(logString);
        break;
    }
  }

  /**
   * デバッグログを出力
   * @param message メッセージ
   * @param context 追加のコンテキスト情報
   */
  public static debug(message: string, context?: LogContext): void {
    // デバッグ情報なので本番環境では表示しない
    if (process.env.NODE_ENV !== "production") {
      this.log("DEBUG", message, context);
    }
  }

  /**
   * 情報ログを出力
   * @param message メッセージ
   * @param context 追加のコンテキスト情報
   */
  public static info(message: string, context?: LogContext): void {
    this.log("INFO", message, context);
  }

  /**
   * 警告ログを出力
   * @param message メッセージ
   * @param context 追加のコンテキスト情報
   */
  public static warn(message: string, context?: LogContext): void {
    this.log("WARN", message, context);
  }

  /**
   * エラーログを出力
   * @param err エラーオブジェクト
   * @param context 追加のコンテキスト情報
   */
  public static error(err: Error | unknown, context?: LogContext): void {
    const errorInfo: StructuredLog["error"] =
      err instanceof Error
        ? {
            name: err.name,
            message: err.message,
            stack: err.stack,
            // InvalidParameterErrorの場合はfieldsを含める
            ...(err instanceof Error &&
              "fields" in err &&
              typeof err.fields === "object" &&
              err.fields !== null && {
                fields: err.fields as Record<string, string>,
              }),
          }
        : {
            name: "UnknownError",
            message: String(err),
          };

    const message = err instanceof Error ? err.message : String(err);

    this.log("ERROR", message, context, errorInfo);
  }
}
