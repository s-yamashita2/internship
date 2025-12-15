/* eslint-disable no-restricted-syntax */
import {
  addDays,
  addHours,
  addMilliseconds,
  addMinutes,
  addMonths,
  addSeconds,
  addYears,
  createDate,
  format,
  getParts,
  isSameDay,
  isValidIso,
  LOCALES,
  now,
  parseIso,
  toIso,
  TZ,
} from "../../../utils/date";

describe("date", () => {
  describe("now", () => {
    it("現在の日時を取得できる", () => {
      const before = new Date();
      const result = now();
      const after = new Date();

      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe("isValidIso", () => {
    describe("有効なISO 8601形式", () => {
      it("正しい形式のISO 8601文字列を検証できる", () => {
        expect(isValidIso("2024-01-15T12:30:45.123Z")).toBe(true);
        expect(isValidIso("2023-12-31T23:59:59.999Z")).toBe(true);
        expect(isValidIso("2000-01-01T00:00:00.000Z")).toBe(true);
      });
    });

    describe("無効なISO 8601形式", () => {
      it("形式が異なる場合は無効", () => {
        expect(isValidIso("2024-01-15T12:30:45.123")).toBe(false);
        expect(isValidIso("2024-01-15 12:30:45.123Z")).toBe(false);
        expect(isValidIso("2024/01/15T12:30:45.123Z")).toBe(false);
      });

      it("日付部分が不正な場合は無効", () => {
        expect(isValidIso("2024-1-15T12:30:45.123Z")).toBe(false);
        expect(isValidIso("24-01-15T12:30:45.123Z")).toBe(false);
        expect(isValidIso("2024-13-15T12:30:45.123Z")).toBe(false);
      });

      it("時刻部分が不正な場合は無効", () => {
        expect(isValidIso("2024-01-15T1:30:45.123Z")).toBe(false);
        expect(isValidIso("2024-01-15T12:3:45.123Z")).toBe(false);
        expect(isValidIso("2024-01-15T12:30:4.123Z")).toBe(false);
        expect(isValidIso("2024-01-15T12:30:45.1234Z")).toBe(false);
      });

      it("空文字列は無効", () => {
        expect(isValidIso("")).toBe(false);
      });

      it("Zがない場合は無効", () => {
        expect(isValidIso("2024-01-15T12:30:45.123")).toBe(false);
      });
    });
  });

  describe("createDate", () => {
    describe("タイムゾーン未指定", () => {
      it("全てのパラメータを指定して日時を作成できる", () => {
        const result = createDate({
          params: {
            year: 2024,
            monthIndex: 0,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 789,
          },
        });

        expect(result).toBeInstanceOf(Date);
        expect(result.toISOString()).toBe("2024-01-01T12:34:56.789Z");
      });

      it("任意のパラメータを未指定で日時を作成できる", () => {
        const result = createDate({
          params: {
            year: 2024,
            monthIndex: 0,
            day: 1,
            hour: 12,
          },
        });

        expect(result).toBeInstanceOf(Date);
        expect(result.toISOString()).toBe("2024-01-01T12:00:00.000Z");
      });
    });

    describe("タイムゾーン指定", () => {
      it("全てのパラメータを指定して日時を作成できる", () => {
        const result = createDate({
          params: {
            year: 2024,
            monthIndex: 0,
            day: 1,
            hour: 12,
            minute: 34,
            second: 56,
            millisecond: 789,
          },
          options: {
            timeZone: TZ.JST,
          },
        });

        expect(result).toBeInstanceOf(Date);
        expect(result.toISOString()).toBe("2024-01-01T03:34:56.789Z");
      });

      it("任意のパラメータを未指定で日時を作成できる", () => {
        const result = createDate({
          params: {
            year: 2024,
            monthIndex: 0,
            day: 1,
          },
          options: {
            timeZone: TZ.JST,
          },
        });

        expect(result).toBeInstanceOf(Date);
        expect(result.toISOString()).toBe("2023-12-31T15:00:00.000Z");
      });
    });
  });

  describe("parseIso", () => {
    it("有効なISO 8601文字列をDateオブジェクトに変換できる", () => {
      const isoStr = "2024-01-15T12:30:45.123Z";
      const result = parseIso(isoStr);

      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe(isoStr);
    });

    it("無効なISO 8601文字列の場合はエラーを投げる", () => {
      expect(() => parseIso("invalid")).toThrow(
        "Invalid datetime string: invalid"
      );
      expect(() => parseIso("2024-01-15T12:30:45.123")).toThrow(
        "Invalid datetime string: 2024-01-15T12:30:45.123"
      );
      expect(() => parseIso("")).toThrow("Invalid datetime string: ");
    });
  });

  describe("toIso", () => {
    it("DateオブジェクトをISO 8601形式の文字列に変換できる", () => {
      const date = new Date("2024-01-15T12:30:45.000Z");
      const result = toIso(date);

      expect(result).toBe("2024-01-15T12:30:45.000Z");
    });

    it("異なる日時でも正しく変換できる", () => {
      const date = new Date("2023-12-31T23:59:59.999Z");
      const result = toIso(date);

      expect(result).toBe("2023-12-31T23:59:59.999Z");
    });
  });

  describe("addYears", () => {
    it("年を加算できる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = addYears(date, 1);

      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(15);
    });

    it("負の値を指定すると減算できる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = addYears(date, -1);

      expect(result.getFullYear()).toBe(2023);
    });

    it("複数年の加算ができる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = addYears(date, 5);

      expect(result.getFullYear()).toBe(2029);
    });
  });

  describe("addMonths", () => {
    it("月を加算できる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = addMonths(date, 1);

      expect(result.getMonth()).toBe(1);
      expect(result.getFullYear()).toBe(2024);
    });

    it("年をまたぐ月の加算ができる", () => {
      const date = new Date("2024-12-15T12:30:45Z");
      const result = addMonths(date, 1);

      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2025);
    });

    it("負の値を指定すると減算できる", () => {
      const date = new Date("2024-03-15T12:30:45Z");
      const result = addMonths(date, -1);

      expect(result.getMonth()).toBe(1);
    });
  });

  describe("addDays", () => {
    it("日を加算できる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = addDays(date, 1);

      expect(result.getDate()).toBe(16);
    });

    it("月をまたぐ日の加算ができる", () => {
      const date = new Date("2024-01-31T12:30:45Z");
      const result = addDays(date, 1);

      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(1);
    });

    it("負の値を指定すると減算できる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = addDays(date, -1);

      expect(result.getDate()).toBe(14);
    });
  });

  describe("addHours", () => {
    it("時間を加算できる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = addHours(date, 1);

      expect(result.getHours()).toBe(13);
    });

    it("日をまたぐ時間の加算ができる", () => {
      const date = new Date("2024-01-15T23:30:45Z");
      const result = addHours(date, 1);

      expect(result.getDate()).toBe(16);
      expect(result.getHours()).toBe(0);
    });

    it("負の値を指定すると減算できる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = addHours(date, -1);

      expect(result.getHours()).toBe(11);
    });
  });

  describe("addMinutes", () => {
    it("分を加算できる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = addMinutes(date, 1);

      expect(result.getMinutes()).toBe(31);
    });

    it("時間をまたぐ分の加算ができる", () => {
      const date = new Date("2024-01-15T12:59:45Z");
      const result = addMinutes(date, 1);

      expect(result.getHours()).toBe(13);
      expect(result.getMinutes()).toBe(0);
    });

    it("負の値を指定すると減算できる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = addMinutes(date, -1);

      expect(result.getMinutes()).toBe(29);
    });
  });

  describe("addSeconds", () => {
    it("秒を加算できる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = addSeconds(date, 1);

      expect(result.getSeconds()).toBe(46);
    });

    it("分をまたぐ秒の加算ができる", () => {
      const date = new Date("2024-01-15T12:30:59Z");
      const result = addSeconds(date, 1);

      expect(result.getMinutes()).toBe(31);
      expect(result.getSeconds()).toBe(0);
    });

    it("負の値を指定すると減算できる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = addSeconds(date, -1);

      expect(result.getSeconds()).toBe(44);
    });
  });

  describe("addMilliseconds", () => {
    it("ミリ秒を加算できる", () => {
      const date = new Date("2024-01-15T12:30:45.000Z");
      const result = addMilliseconds(date, 100);

      expect(result.getMilliseconds()).toBe(100);
    });

    it("秒をまたぐミリ秒の加算ができる", () => {
      const date = new Date("2024-01-15T12:30:45.999Z");
      const result = addMilliseconds(date, 1);

      expect(result.getSeconds()).toBe(46);
      expect(result.getMilliseconds()).toBe(0);
    });

    it("負の値を指定すると減算できる", () => {
      const date = new Date("2024-01-15T12:30:45.100Z");
      const result = addMilliseconds(date, -50);

      expect(result.getMilliseconds()).toBe(50);
    });
  });

  describe("isSameDay", () => {
    it("同じ日付を判定できる", () => {
      const date1 = new Date("2024-01-15T12:30:45Z");
      const date2 = new Date("2024-01-15T23:59:59Z");

      expect(isSameDay(date1, date2)).toBe(true);
    });

    it("異なる日付を判定できる", () => {
      const date1 = new Date("2024-01-15T12:30:45Z");
      const date2 = new Date("2024-01-16T12:30:45Z");

      expect(isSameDay(date1, date2)).toBe(false);
    });

    it("タイムゾーンを指定して判定できる", () => {
      const date1 = new Date("2024-01-15T15:00:00Z"); // UTC 15:00 = JST 翌日00:00
      const date2 = new Date("2024-01-15T00:00:00Z"); // UTC 00:00 = JST 当日09:00

      // UTCで判定すると同日
      expect(isSameDay(date1, date2, { timeZone: TZ.UTC })).toBe(true);

      // JSTで判定すると別日
      expect(isSameDay(date1, date2, { timeZone: TZ.JST })).toBe(false);
    });
  });

  describe("format", () => {
    it("日時をフォーマットできる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = format(date, "yyyy-MM-dd");

      expect(result).toBe("2024-01-15");
    });

    it("時刻を含むフォーマットができる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = format(date, "yyyy-MM-dd HH:mm:ss");

      expect(result).toBe("2024-01-15 12:30:45");
    });

    it("日本語ロケールでフォーマットできる", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = format(date, "yyyy年MM月dd日(E)", { locale: LOCALES.JA });

      expect(result).toBe("2024年01月15日(月)");
    });

    it("タイムゾーンを指定してフォーマットできる", () => {
      const date = new Date("2024-01-15T00:00:00Z");
      const result = format(date, "yyyy-MM-dd HH:mm:ss", {
        timeZone: TZ.JST,
      });

      // UTC 00:00 = JST 09:00
      expect(result).toBe("2024-01-15 09:00:00");
    });

    it("ロケールとタイムゾーンの両方を指定できる", () => {
      const date = new Date("2024-01-15T00:00:00Z");
      const result = format(date, "yyyy年MM月dd日 HH:mm", {
        locale: LOCALES.JA,
        timeZone: TZ.JST,
      });

      expect(result).toBe("2024年01月15日 09:00");
    });

    it("オプションを指定しない場合はデフォルト値が使用される", () => {
      const date = new Date("2024-01-15T12:30:45Z");
      const result = format(date, "yyyy-MM-dd");

      expect(result).toBe("2024-01-15");
    });
  });

  describe("getParts", () => {
    it("日時を年、月、日、時、分、秒、ミリ秒に分解できる", () => {
      const date = new Date("2024-01-15T12:34:56.789Z");
      const result = getParts(date);

      expect(result.year).toBe(2024);
      expect(result.monthIndex).toBe(0);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(34);
      expect(result.second).toBe(56);
      expect(result.millisecond).toBe(789);
    });

    it("タイムゾーンを指定して分解できる", () => {
      const date = new Date("2024-01-15T12:34:56.789Z");
      const result = getParts(date, { timeZone: TZ.JST });

      expect(result.year).toBe(2024);
      expect(result.monthIndex).toBe(0);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(21);
      expect(result.minute).toBe(34);
      expect(result.second).toBe(56);
      expect(result.millisecond).toBe(789);
    });
  });
});
