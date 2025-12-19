import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ErrorType } from "@/shared/response/enums/error-type.enum";
import { ResponseData } from "@/shared/response/types/response.type";

import { Parrot } from "../../shared/response/types/parrot.type";
import { BaseController } from "./base.controller";

export class ParrotController extends BaseController {
  async getParrots(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const message = searchParams.get("message");

    if (message == null) {
      return NextResponse.json<ResponseData<Parrot>>(
        {
          error: {
            message: "Invalid query parameters",
            type: ErrorType.INVALID_PARAMETER,
            fields: {
              message: "message is required",
            },
          },
        },
        { status: 400 }
      );
    }
    if (message == "") {
      return NextResponse.json<ResponseData<Parrot>>(
        {
          error: {
            message: "Invalid query parameters",
            type: ErrorType.INVALID_PARAMETER,
            fields: {
              message: "message must be at least 1 character",
            },
          },
        },
        { status: 400 }
      );
    }
    if (message.length > 20) {
      return NextResponse.json<ResponseData<Parrot>>(
        {
          error: {
            message: "Invalid query parameters",
            type: ErrorType.INVALID_PARAMETER,
            fields: {
              message: "message must be at most 20 characters",
            },
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ResponseData<Parrot>>(
      {
        data: {
          message: message ?? "",
        },
      },
      { status: 200 }
    );
  }
}
