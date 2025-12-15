/* eslint-disable no-restricted-imports, no-restricted-syntax */
import { TZDate, tzOffset } from "@date-fns/tz";
import {
  addDays as addDaysInDateFns,
  addHours as addHoursInDateFns,
  addMilliseconds as addMillisecondsInDateFns,
  addMinutes as addMinutesInDateFns,
  addMonths as addMonthsInDateFns,
  addSeconds as addSecondsInDateFns,
  addYears as addYearsInDateFns,
  format as formatInDateFns,
  isSameDay as isSameDayInDateFns,
} from "date-fns";
import { enUS, ja } from "date-fns/locale";

export const TZ = {
  UTC: "UTC",
  JST: "Asia/Tokyo",
} as const;
export type TimeZone = (typeof TZ)[keyof typeof TZ];

export const LOCALES = {
  JA: ja,
  EN: enUS,
} as const;
export type Locale = (typeof LOCALES)[keyof typeof LOCALES];

export type CreateDateParams = {
  params: {
    year: number;
    monthIndex: number;
    day: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
  };
  options?: {
    timeZone?: TimeZone;
  };
};

/**
 * 現在の日時を取得
 * @returns Date
 */
export const now = () => {
  return new Date();
};

/**
 * 指定されたタイムゾーンの日時をUTCのDateオブジェクトとして作成
 *
 * 例: JST 2024-01-01 12:00 を作成する場合
 * - 引数
 *   - params: { year: 2024, monthIndex: 0, day: 1, hour: 12, minute: 0, second: 0, millisecond: 0 }
 *   - options: { timeZone: TZ.JST }
 * - 処理の流れ
 *   - Date.UTC(2024, 0, 1, 12, 0, 0) → UTC 2024-01-01 12:00:00
 *   - tzOffset("Asia/Tokyo", utcDate) → +540分（UTC+9）
 *   - utcDate.getTime() - 540 * 60 * 1000 → UTC 2024-01-01 03:00:00（正しい結果）
 *
 * @param params 日時のパラメータ
 * @param options オプション (timeZone: タイムゾーン)
 * @returns 作成した日時
 */
export const createDate = ({ params, options }: CreateDateParams): Date => {
  const { year, monthIndex, day, hour, minute, second, millisecond } = params;
  const timeZone = options?.timeZone || TZ.UTC;
  const utcDate = new Date(
    Date.UTC(
      year,
      monthIndex,
      day,
      hour ?? 0,
      minute ?? 0,
      second ?? 0,
      millisecond ?? 0
    )
  );
  const timeOffset = tzOffset(timeZone, utcDate);
  return new Date(utcDate.getTime() - timeOffset * 60 * 1000);
};

/**
 * ISO 8601形式の日時文字列をDateオブジェクトに変換
 * @param isoStr ISO 8601形式の日時文字列
 * @returns Date
 */
export const parseIso = (isoStr: string) => {
  if (!isValidIso(isoStr)) {
    throw new Error(`Invalid datetime string: ${isoStr}`);
  }
  return new Date(isoStr);
};

/**
 * DateオブジェクトをISO 8601形式の日時文字列に変換
 * @param date Dateオブジェクト
 * @returns ISO 8601形式の日時文字列
 */
export const toIso = (date: Date) => {
  return date.toISOString();
};

/**
 * 年を加算
 * @param date Dateオブジェクト
 * @param years 年数
 * @returns Date
 */
export const addYears = (date: Date, years: number) => {
  return addYearsInDateFns(date, years);
};

/**
 * 月を加算
 * @param date Dateオブジェクト
 * @param months 月数
 * @returns Date
 */
export const addMonths = (date: Date, months: number) => {
  return addMonthsInDateFns(date, months);
};

/**
 * 日を加算
 * @param date Dateオブジェクト
 * @param days 日数
 * @returns Date
 */
export const addDays = (date: Date, days: number) => {
  return addDaysInDateFns(date, days);
};

/**
 * 時間を加算
 * @param date Dateオブジェクト
 * @param hours 時間数
 * @returns Date
 */
export const addHours = (date: Date, hours: number) => {
  return addHoursInDateFns(date, hours);
};

/**
 * 分を加算
 * @param date Dateオブジェクト
 * @param minutes 分数
 * @returns Date
 */
export const addMinutes = (date: Date, minutes: number) => {
  return addMinutesInDateFns(date, minutes);
};

/**
 * 秒を加算
 * @param date Dateオブジェクト
 * @param seconds 秒数
 * @returns Date
 */
export const addSeconds = (date: Date, seconds: number) => {
  return addSecondsInDateFns(date, seconds);
};

/**
 * ミリ秒を加算
 * @param date Dateオブジェクト
 * @param milliseconds ミリ秒数
 * @returns Date
 */
export const addMilliseconds = (date: Date, milliseconds: number) => {
  return addMillisecondsInDateFns(date, milliseconds);
};

/**
 * 同じ日付かどうかを判定
 * @param date1 Dateオブジェクト
 * @param date2 Dateオブジェクト
 * @returns boolean
 */
export const isSameDay = (
  date1: Date,
  date2: Date,
  options?: { timeZone?: TimeZone }
) => {
  const tzDate1 = new TZDate(date1, options?.timeZone || TZ.UTC);
  const tzDate2 = new TZDate(date2, options?.timeZone || TZ.UTC);
  return isSameDayInDateFns(tzDate1, tzDate2);
};

/**
 * ISO 8601形式の日時文字列が有効かどうかを判定
 * @param isoStr ISO 8601形式の日時文字列
 * @returns boolean
 */
export const isValidIso = (isoStr: string): boolean => {
  if (
    !/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/.test(
      isoStr
    )
  )
    return false;
  const date = new Date(isoStr);
  return !isNaN(date.getTime()) && date.toISOString() === isoStr;
};

/**
 * 日時をフォーマット
 * @param date Dateオブジェクト
 * @param format 日時のフォーマット
 * @param options オプション (locale: ロケール, timeZone: タイムゾーン)
 * @returns フォーマットされた日時文字列
 */
export const format = (
  date: Date,
  format: string,
  options?: { locale?: Locale; timeZone?: TimeZone }
) => {
  const tzDate = new TZDate(date, options?.timeZone || TZ.UTC);
  const locale = options?.locale || LOCALES.EN;
  return formatInDateFns(tzDate, format, { locale });
};

/**
 * 日時を指定したタイムゾーンの年、月、日、時、分、秒、ミリ秒に分解して取得
 * @param date Dateオブジェクト
 * @param options オプション (timeZone: タイムゾーン)
 * @returns { year: number, monthIndex: number, day: number, hour: number, minute: number, second: number, millisecond: number }
 */
export const getParts = (date: Date, options?: { timeZone?: TimeZone }) => {
  const tzDate = new TZDate(date, options?.timeZone || TZ.UTC);

  return {
    year: tzDate.getFullYear(),
    monthIndex: tzDate.getMonth(),
    day: tzDate.getDate(),
    hour: tzDate.getHours(),
    minute: tzDate.getMinutes(),
    second: tzDate.getSeconds(),
    millisecond: tzDate.getMilliseconds(),
  };
};
