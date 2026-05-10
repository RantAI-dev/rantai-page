import { describe, it, expect, vi } from "vitest";

// Mock next/headers so auth.ts can be imported in a non-Next.js environment
vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({ get: vi.fn().mockReturnValue(undefined) }),
}));

import {
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
  COOKIE_NAME,
} from "@/lib/auth";

describe("hashPassword / verifyPassword", () => {
  it("produces a hash that verifies correctly", async () => {
    const hash = await hashPassword("secret123");
    expect(await verifyPassword("secret123", hash)).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const hash = await hashPassword("secret123");
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("each hash is unique (bcrypt salting)", async () => {
    const h1 = await hashPassword("same");
    const h2 = await hashPassword("same");
    expect(h1).not.toBe(h2);
  });
});

describe("createToken / verifyToken", () => {
  it("creates a token and verifies the email payload", async () => {
    const token = await createToken({ email: "admin@rantai.dev" });
    const result = await verifyToken(token);
    expect(result).toEqual({ email: "admin@rantai.dev" });
  });

  it("returns null for a tampered token", async () => {
    const result = await verifyToken("not.a.valid.token");
    expect(result).toBeNull();
  });

  it("returns null for an empty string", async () => {
    const result = await verifyToken("");
    expect(result).toBeNull();
  });
});

describe("COOKIE_NAME", () => {
  it("is admin_token", () => {
    expect(COOKIE_NAME).toBe("admin_token");
  });
});
