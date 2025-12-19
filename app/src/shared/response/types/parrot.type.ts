import { ResponseData } from "./response.type";

export type Parrot = {
  message: string;
};

export type SearchParrotsResponse = ResponseData<Parrot>;
