import { describe, expect, it } from "vitest"

import { parseBookInput, parseTeamInput } from "@/lib/admin-input"

const book = {
  code: " RA-01 ",
  name: "Rust for AI",
  category: "Programming",
  imageUrl: "https://x.public.blob.vercel-storage.com/cover.png",
}

describe("parseBookInput", () => {
  it("trims values and defaults the order", () => {
    const r = parseBookInput({ ...book, url: "" })
    expect(r).toEqual({
      ok: true,
      data: { ...book, code: "RA-01", url: null, orderIndex: 0 },
    })
  })

  it("rejects missing required fields", () => {
    expect(parseBookInput({ ...book, name: "  " })).toEqual({
      ok: false,
      error: "Missing required fields",
    })
    expect(parseBookInput({ code: "x" })).toMatchObject({ ok: false })
  })

  it("only accepts https links", () => {
    for (const url of [
      "http://x.test",
      "javascript:alert(1)",
      "data:text/html,x",
      "ftp://x",
    ]) {
      expect(parseBookInput({ ...book, url })).toEqual({
        ok: false,
        error: "Invalid URL",
      })
    }
    expect(
      parseBookInput({ ...book, url: "https://amazon.com/dp/1" })
    ).toMatchObject({ ok: true })
  })

  it("accepts local image paths but not protocol-relative ones", () => {
    expect(parseBookInput({ ...book, imageUrl: "/books/a.png" })).toMatchObject(
      { ok: true }
    )
    expect(
      parseBookInput({ ...book, imageUrl: "//evil.test/a.png" })
    ).toMatchObject({ ok: false })
  })

  it("rejects a non-integer order and a non-object body", () => {
    expect(parseBookInput({ ...book, orderIndex: 1.5 })).toEqual({
      ok: false,
      error: "Invalid order",
    })
    expect(parseBookInput(null)).toEqual({
      ok: false,
      error: "Invalid request body",
    })
  })
})

describe("parseTeamInput", () => {
  it("turns empty optional fields into null", () => {
    const r = parseTeamInput({
      name: "Ana",
      role: "Engineer",
      bio: " ",
      linkedin: "",
      github: null,
    })
    expect(r).toEqual({
      ok: true,
      data: {
        name: "Ana",
        role: "Engineer",
        bio: null,
        imageUrl: null,
        linkedin: null,
        github: null,
        orderIndex: 0,
      },
    })
  })

  it("rejects non-https profile links", () => {
    expect(
      parseTeamInput({
        name: "Ana",
        role: "Engineer",
        github: "javascript:alert(1)",
      })
    ).toEqual({
      ok: false,
      error: "Invalid URL",
    })
    expect(
      parseTeamInput({
        name: "Ana",
        role: "Engineer",
        linkedin: "https://linkedin.com/in/ana",
      })
    ).toMatchObject({ ok: true })
  })
})
