import { Logger } from "../utils/logger";
import { createEvents } from "./events";

const main = async () => {
  // イベントを作成
  await createEvents();
};

main().catch((error) => {
  Logger.error(error);
  process.exit(1);
});
