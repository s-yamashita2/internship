import { ErrorType } from "../enums/error-type.enum";

export type Result<T> = {
  data?: T;
  status?: number;
};

export type ResponseData<T> = {
  data?: T;
  error?: {
    message: string;
    fields?: Record<string, string>;
    type: ErrorType;
  };
};
