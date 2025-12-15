import "@/lib/zod";

import { NextRequest } from "next/server";
import { z, ZodError } from "zod";

import { InvalidParameterError } from "@/server/error";

/**
 * リクエストボディを検証する\
 * リクエストボディがJSON形式であることを確認し、その構成がZodSchemaに準拠していることを検証する\
 * 検証に成功した場合、ZodSchemaによってパースされたオブジェクト（T型）を返す
 * @param request NextRequest リクエストオブジェクト
 * @param schema ZodSchema<T> 検証したいスキーマ
 * @returns T 検証に成功した場合、ZodSchemaによってパースされたオブジェクト（T型）を返す
 * @throws InvalidParameterError 検証に失敗した場合、フィールドとエラーメッセージを含むエラーをスローする
 */
export const validateRequestBody = async <T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<T> => {
  try {
    // リクエストボディをJSON形式で取得
    const body = await request.json();
    // リクエストボディを検証
    return schema.parse(body);
  } catch (error) {
    // Zodエラーの場合はエラーメッセージとフィールドを返す
    if (error instanceof ZodError) {
      const errorMessage = "Invalid request body";
      const fields = error.issues.reduce(
        (acc, issue) => {
          acc[issue.path.join(".")] = issue.message;
          return acc;
        },
        {} as Record<string, string>
      );
      throw new InvalidParameterError(errorMessage, fields);
    }
    // その他のエラーの場合はエラーメッセージを返す
    throw new InvalidParameterError(
      error instanceof Error ? error.message : "Invalid request body"
    );
  }
};

/**
 * クエリパラメータを検証する\
 * URLを解析してパラメータを取得し、その構成がZodSchemaに準拠していることを検証する\
 * 検証に成功した場合、ZodSchemaによってパースされたオブジェクト（T型）を返す
 * @param request NextRequest リクエストオブジェクト
 * @param schema ZodSchema<T> 検証したいスキーマ
 * @returns T 検証に成功した場合、ZodSchemaによってパースされたオブジェクト（T型）を返す
 * @throws InvalidParameterError 検証に失敗した場合、フィールドとエラーメッセージを含むエラーをスローする
 */
export const validateRequestQueryParams = async <T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<T> => {
  try {
    // URLを解析してパラメータを取得
    const url = new URL(request.url);
    const params: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    // パラメータを検証
    return schema.parse(params);
  } catch (error) {
    // Zodエラーの場合はエラーメッセージとフィールドを返す
    if (error instanceof ZodError) {
      const errorMessage = "Invalid query parameters";
      const fields = error.issues.reduce(
        (acc, issue) => {
          acc[issue.path.join(".")] = issue.message;
          return acc;
        },
        {} as Record<string, string>
      );
      throw new InvalidParameterError(errorMessage, fields);
    }
    // その他のエラーの場合はエラーメッセージを返す
    throw new InvalidParameterError(
      error instanceof Error ? error.message : "Invalid query parameters"
    );
  }
};
