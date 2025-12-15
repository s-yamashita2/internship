/* eslint-disable no-restricted-syntax */
import { prisma } from "@/lib/prisma";
import { container } from "@/server/container";
import { EventRepository } from "@/server/repositories/event.repository";
import { DataCleaner } from "@/test/helpers/data-cleaner";

describe("EventRepository", () => {
  const eventRepository = container.resolve(EventRepository);
  const dataCleaner = new DataCleaner(prisma);

  describe("create", () => {
    afterEach(async () => {
      await dataCleaner.clean();
    });

    it("イベントを作成できること", async () => {
      const event = await eventRepository.create({
        name: "Test Event",
        description: "This is a test event",
        eventStartDatetime: new Date("2025-01-01T10:00:00.000Z"),
        eventEndDatetime: new Date("2025-01-01T12:00:00.000Z"),
        capacity: 100,
      });

      expect(event).toBeDefined();
      expect(event.name).toBe("Test Event");
      expect(event.description).toBe("This is a test event");
      expect(event.eventStartDatetime).toEqual(
        new Date("2025-01-01T10:00:00.000Z")
      );
      expect(event.eventEndDatetime).toEqual(
        new Date("2025-01-01T12:00:00.000Z")
      );
      expect(event.capacity).toBe(100);
    });

    it("説明がnullのイベントを作成できること", async () => {
      const event = await eventRepository.create({
        name: "Test Event",
        description: null,
        eventStartDatetime: new Date("2025-01-01T10:00:00.000Z"),
        eventEndDatetime: new Date("2025-01-01T12:00:00.000Z"),
        capacity: 50,
      });

      expect(event).toBeDefined();
      expect(event.name).toBe("Test Event");
      expect(event.description).toBeNull();
      expect(event.capacity).toBe(50);
    });
  });

  describe("findMany", () => {
    beforeAll(async () => {
      await prisma.events.create({
        data: {
          name: "Event 1",
          description: "First event",
          eventStartDatetime: new Date("2025-01-01T10:00:00.000Z"),
          eventEndDatetime: new Date("2025-01-01T12:00:00.000Z"),
          capacity: 100,
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
          createdAt: new Date("2025-01-03T00:00:00.000Z"),
          updatedAt: new Date("2025-01-03T00:00:00.000Z"),
        },
      });
    });

    afterAll(async () => {
      await dataCleaner.clean();
    });

    it("全てのイベントを取得できること", async () => {
      const events = await eventRepository.findMany();
      expect(events).toBeDefined();
      expect(events.length).toBe(3);
      expect(events[0].name).toBe("Event 1");
      expect(events[1].name).toBe("Event 2");
      expect(events[2].name).toBe("Event 3");
    });
  });
});
