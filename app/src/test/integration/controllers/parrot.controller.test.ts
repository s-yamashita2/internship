import { NextRequest } from "next/server";

import { GET } from "@/app/api/parrot/route";

describe("ParrotController", () => {
  describe("GET /api/parrot", () => {
    it("指定したメッセージが返ってくること", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/parrot?message=Hi!",
        {
          method: "GET",
        }
      );

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toEqual({
        message: "Hi!",
      });
    });
  });
});
