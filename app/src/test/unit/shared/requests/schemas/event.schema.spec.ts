import { CreateEventParamsSchema } from "@/shared/requests/schemas/event.schema";

describe("event.schema", () => {
  describe("CreateEventParamsSchema", () => {
    describe("有効なデータ", () => {
      it("すべての必須フィールドが含まれている場合は有効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(data);
        }
      });

      it("descriptionが含まれている場合は有効", () => {
        const data = {
          name: "Test Event",
          description: "This is a test event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(data);
        }
      });

      it("descriptionがundefinedの場合は有効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.description).toBeUndefined();
        }
      });

      it("nameが200文字の場合は有効", () => {
        const data = {
          name: "a".repeat(200),
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(true);
      });

      it("descriptionが500文字の場合は有効", () => {
        const data = {
          name: "Test Event",
          description: "a".repeat(500),
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(true);
      });

      it("capacityが1の場合は有効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 1,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(true);
      });
    });

    describe("nameのバリデーション", () => {
      it("nameが未指定の場合は無効", () => {
        const data = {
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe("name is required");
        }
      });

      it("nameが文字列型でない場合は無効", () => {
        const data = {
          name: 123,
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "type of name must be string"
          );
        }
      });

      it("nameが空文字列の場合は無効", () => {
        const data = {
          name: "",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "name must be at least 1 character"
          );
        }
      });

      it("nameが201文字の場合は無効", () => {
        const data = {
          name: "a".repeat(201),
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "name must be at most 200 characters"
          );
        }
      });
    });

    describe("descriptionのバリデーション", () => {
      it("descriptionが文字列型でない場合は無効", () => {
        const data = {
          name: "Test Event",
          description: 123,
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "type of description must be string"
          );
        }
      });

      it("descriptionが空文字列の場合は無効", () => {
        const data = {
          name: "Test Event",
          description: "",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "description must be at least 1 character"
          );
        }
      });

      it("descriptionが501文字の場合は無効", () => {
        const data = {
          name: "Test Event",
          description: "a".repeat(501),
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "description must be at most 500 characters"
          );
        }
      });
    });

    describe("eventStartDatetimeのバリデーション", () => {
      it("eventStartDatetimeが未指定の場合は無効", () => {
        const data = {
          name: "Test Event",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "eventStartDatetime is required"
          );
        }
      });

      it("eventStartDatetimeが文字列型でない場合は無効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: 123,
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "type of eventStartDatetime must be string"
          );
        }
      });

      it("eventStartDatetimeが無効な日付形式の場合は無効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "invalid-date",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "eventStartDatetime must be a valid ISO 8601 datetime format"
          );
        }
      });

      it("eventStartDatetimeがISO 8601形式でない場合は無効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "2025-01-01 10:00:00",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "eventStartDatetime must be a valid ISO 8601 datetime format"
          );
        }
      });
    });

    describe("eventEndDatetimeのバリデーション", () => {
      it("eventEndDatetimeが未指定の場合は無効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "eventEndDatetime is required"
          );
        }
      });

      it("eventEndDatetimeが文字列型でない場合は無効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: 123,
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "type of eventEndDatetime must be string"
          );
        }
      });

      it("eventEndDatetimeが無効な日付形式の場合は無効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "invalid-date",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "eventEndDatetime must be a valid ISO 8601 datetime format"
          );
        }
      });

      it("eventEndDatetimeがeventStartDatetimeより前の場合は無効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "2025-01-01T12:00:00.000Z",
          eventEndDatetime: "2025-01-01T10:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "eventEndDatetime must be after than eventStartDatetime"
          );
        }
      });

      it("eventEndDatetimeがeventStartDatetimeと等しい場合は無効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T10:00:00.000Z",
          capacity: 100,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "eventEndDatetime must be after than eventStartDatetime"
          );
        }
      });
    });

    describe("capacityのバリデーション", () => {
      it("capacityが未指定の場合は無効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe("capacity is required");
        }
      });

      it("capacityが数値型でない場合は無効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: "100",
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "type of capacity must be number"
          );
        }
      });

      it("capacityが0の場合は無効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 0,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "capacity must be greater than 0"
          );
        }
      });

      it("capacityが負の数の場合は無効", () => {
        const data = {
          name: "Test Event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: -1,
        };

        const result = CreateEventParamsSchema.safeParse(data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "capacity must be greater than 0"
          );
        }
      });
    });
  });
});
