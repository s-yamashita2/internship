import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ErrorType } from "@/shared/response/enums/error-type.enum";
import type {
  ResponseData,
  Result,
} from "@/shared/response/types/response.type";
import { now } from "@/utils/date";

import {
  ForbiddenError,
  InternalServerError,
  InvalidParameterError,
  NotFoundError,
  UnauthorizedError,
} from "../error";
import { Logger } from "../utils/logger";

export abstract class BaseController {
  /**
   * メソッドを実行し、エラーハンドリングを行う
   * @param request NextRequest
   * @param handler 実行するメソッド
   * @returns NextResponse
   */
  protected async handleRequest<T>(
    request: NextRequest,
    handler: () => Promise<Result<T>>
  ): Promise<NextResponse<ResponseData<T>>> {
    const startTime = now().getTime();
    const requestId = this.generateRequestId();
    const url = request.url;

    try {
      // リクエスト開始ログ
      Logger.info("Request started", {
        requestId,
        method: request.method,
        pathname: new URL(url).pathname,
        url: url,
      });

      const result = await handler();
      const statusCode = result.status ?? 200;
      const duration = now().getTime() - startTime;

      // リクエスト終了ログ（成功）
      Logger.info("Request completed", {
        requestId,
        durationMs: duration,
      });

      return NextResponse.json<ResponseData<T>>(
        {
          data: result.data,
        },
        { status: statusCode }
      );
    } catch (error) {
      return this.handleError(error, requestId, startTime);
    }
  }

  /**
   * エラーを処理して適切なレスポンスを返す
   * @param error エラーオブジェクト
   * @param requestId リクエストID
   * @returns NextResponse
   */
  private handleError(
    error: unknown,
    requestId: string,
    startTime: number
  ): NextResponse<ResponseData<never>> {
    // エラーの種類を判定してコンテキスト情報を追加
    const errorContext: Record<string, unknown> = {
      requestId,
      durationMs: now().getTime() - startTime,
    };

    if (error instanceof InvalidParameterError) {
      errorContext.errorType = "InvalidParameterError";
      Logger.error(error, errorContext);

      return NextResponse.json<ResponseData<never>>(
        {
          error: {
            message: error.message,
            fields: error.fields,
            type: ErrorType.INVALID_PARAMETER,
          },
        },
        { status: this.getErrorStatusCode(error) }
      );
    }

    if (error instanceof UnauthorizedError) {
      errorContext.errorType = "UnauthorizedError";
      Logger.error(error, errorContext);

      return NextResponse.json<ResponseData<never>>(
        {
          error: {
            message: error.message,
            type: ErrorType.UNAUTHORIZED,
          },
        },
        { status: this.getErrorStatusCode(error) }
      );
    }

    if (error instanceof ForbiddenError) {
      errorContext.errorType = "ForbiddenError";
      Logger.error(error, errorContext);

      return NextResponse.json<ResponseData<never>>(
        {
          error: {
            message: error.message,
            type: ErrorType.FORBIDDEN,
          },
        },
        { status: this.getErrorStatusCode(error) }
      );
    }

    if (error instanceof NotFoundError) {
      errorContext.errorType = "NotFoundError";
      Logger.error(error, errorContext);

      return NextResponse.json<ResponseData<never>>(
        {
          error: {
            message: error.message,
            type: ErrorType.NOT_FOUND,
          },
        },
        { status: this.getErrorStatusCode(error) }
      );
    }

    if (error instanceof InternalServerError) {
      errorContext.errorType = "InternalServerError";
      Logger.error(error, errorContext);

      return NextResponse.json<ResponseData<never>>(
        {
          error: {
            message: error.message,
            type: ErrorType.INTERNAL_SERVER_ERROR,
          },
        },
        { status: this.getErrorStatusCode(error) }
      );
    }

    // その他のエラーの場合は、500エラーとして返す
    errorContext.errorType = "UnknownError";
    Logger.error(error, errorContext);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json<ResponseData<never>>(
      {
        error: {
          message: errorMessage,
          type: ErrorType.INTERNAL_SERVER_ERROR,
        },
      },
      { status: this.getErrorStatusCode(error) }
    );
  }

  /**
   * リクエストIDを生成
   * @returns リクエストID
   */
  private generateRequestId(): string {
    return crypto.randomUUID();
  }

  /**
   * エラーのステータスコードを取得
   * @param error エラーオブジェクト
   * @returns ステータスコード
   */
  private getErrorStatusCode(error: unknown): number {
    if (error instanceof InvalidParameterError) {
      return 400;
    }
    if (error instanceof UnauthorizedError) {
      return 401;
    }
    if (error instanceof ForbiddenError) {
      return 403;
    }
    if (error instanceof NotFoundError) {
      return 404;
    }
    if (error instanceof InternalServerError) {
      return 500;
    }
    return 500;
  }
}
