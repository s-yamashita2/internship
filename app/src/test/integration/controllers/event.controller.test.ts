/* eslint-disable no-restricted-syntax */
import { NextRequest } from "next/server";

import { GET, POST } from "@/app/api/events/route";
import { prisma } from "@/lib/prisma";
import { Prefecture } from "@/shared/common/enums/prefecture.enum";
import { DataCleaner } from "@/test/helpers/data-cleaner";

describe("EventController", () => {
  const dataCleaner = new DataCleaner(prisma);

  describe("GET /api/events", () => {
    beforeAll(async () => {
      await prisma.events.create({
        data: {
          name: "Event 1",
          description: "First event",
          eventStartDatetime: new Date("2025-01-01T10:00:00.000Z"),
          eventEndDatetime: new Date("2025-01-01T12:00:00.000Z"),
          capacity: 100,
          prefecture: Prefecture.HOKKAIDO,
          createdAt: new Date("2025-01-01T00:00:00.000Z"),
          updatedAt: new Date("2025-01-01T00:00:00.000Z"),
        },
      });
      await prisma.events.create({
        data: {
          name: "Event 2",
          description: "Second event",
          eventStartDatetime: new Date("2025-01-02T10:00:00.000Z"),
          eventEndDatetime: new Date("2025-01-02T12:00:00.000Z"),
          capacity: 200,
          prefecture: Prefecture.AOMORI,
          createdAt: new Date("2025-01-02T00:00:00.000Z"),
          updatedAt: new Date("2025-01-02T00:00:00.000Z"),
        },
      });
      await prisma.events.create({
        data: {
          name: "Event 3",
          description: "Third event",
          eventStartDatetime: new Date("2025-01-03T10:00:00.000Z"),
          eventEndDatetime: new Date("2025-01-03T12:00:00.000Z"),
          capacity: 300,
          prefecture: Prefecture.IWATE,
          createdAt: new Date("2025-01-03T00:00:00.000Z"),
          updatedAt: new Date("2025-01-03T00:00:00.000Z"),
        },
      });
    });

    afterAll(async () => {
      await dataCleaner.clean();
    });

    it("イベントを取得できること", async () => {
      // NextRequestクラスを実体化する処理
      const request = new NextRequest("http://localhost:3000/api/events", {
        method: "GET",
      });

      // API (GET /api/events) を実行する処理
      const response = await GET(request);

      // APIの戻り値をJSON形式に変換する処理
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toHaveLength(3);
      expect(body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: "Event 1",
            description: "First event",
            eventStartDatetime: "2025-01-01T10:00:00.000Z",
            eventEndDatetime: "2025-01-01T12:00:00.000Z",
            capacity: 100,
            prefecture: Prefecture.HOKKAIDO,
            createdAt: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            ),
            updatedAt: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            ),
          }),
          expect.objectContaining({
            id: expect.any(Number),
            name: "Event 2",
            description: "Second event",
            eventStartDatetime: "2025-01-02T10:00:00.000Z",
            eventEndDatetime: "2025-01-02T12:00:00.000Z",
            capacity: 200,
            prefecture: Prefecture.AOMORI,
            createdAt: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            ),
            updatedAt: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            ),
          }),
          expect.objectContaining({
            id: expect.any(Number),
            name: "Event 3",
            description: "Third event",
            eventStartDatetime: "2025-01-03T10:00:00.000Z",
            eventEndDatetime: "2025-01-03T12:00:00.000Z",
            capacity: 300,
            prefecture: Prefecture.IWATE,
            createdAt: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            ),
            updatedAt: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            ),
          }),
        ])
      );
    });
  });

  describe("POST /api/events", () => {
    afterEach(async () => {
      await dataCleaner.clean();
    });

    it("イベントを作成できること", async () => {
      const request = new NextRequest("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Event",
          description: "This is a test event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
          prefecture: Prefecture.HOKKAIDO,
        }),
      });

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.data).toMatchObject({
        name: "Test Event",
        description: "This is a test event",
        eventStartDatetime: "2025-01-01T10:00:00.000Z",
        eventEndDatetime: "2025-01-01T12:00:00.000Z",
        capacity: 100,
        prefecture: Prefecture.HOKKAIDO,
      });
      expect(body.data.id).toBeDefined();
      expect(body.data.createdAt).toBeDefined();
      expect(body.data.updatedAt).toBeDefined();
    });

    it("説明なしでイベントを作成できること", async () => {
      const request = new NextRequest("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
          prefecture: Prefecture.HOKKAIDO,
        }),
      });

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.data).toMatchObject({
        name: "Test Event",
        description: null,
        eventStartDatetime: "2025-01-01T10:00:00.000Z",
        eventEndDatetime: "2025-01-01T12:00:00.000Z",
        capacity: 100,
        prefecture: Prefecture.HOKKAIDO,
      });
      expect(body.data.id).toBeDefined();
      expect(body.data.createdAt).toBeDefined();
      expect(body.data.updatedAt).toBeDefined();
    });

    it("バリデーションエラーでステータスコード400のレスポンスを返すこと", async () => {
      const request = new NextRequest("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: "This is a test event",
          eventStartDatetime: "2025-01-01T10:00:00.000Z",
          eventEndDatetime: "2025-01-01T12:00:00.000Z",
          capacity: 100,
          prefecture: Prefecture.HOKKAIDO,
        }),
      });

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBeDefined();
      expect(body.error.message).toBe("Invalid request body");
      expect(body.error.fields).toBeDefined();
      expect(body.error.fields.name).toBe("name is required");
    });
  });
});
