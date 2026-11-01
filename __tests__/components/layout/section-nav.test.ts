import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

let cleanup: (() => void) | void
vi.mock("react", () => ({
  useEffect: (effect: () => (() => void) | void) => {
    cleanup = effect()
  },
}))

import { SectionNav } from "@/components/layout/section-nav"

const sections = [{ id: "problem", label: "The problem" }]
let browser: EventTarget & {
  innerHeight: number
  scrollY: number
  location: { pathname: string; search: string; hash: string }
  history: { state: object; replaceState: ReturnType<typeof vi.fn> }
  scrollTo: ReturnType<typeof vi.fn>
}
let measure: ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.useFakeTimers()
  browser = Object.assign(new EventTarget(), {
    innerHeight: 800,
    scrollY: 1000,
    location: { pathname: "/", search: "", hash: "" },
    history: { state: { existing: true }, replaceState: vi.fn() },
    scrollTo: vi.fn(),
  })
  measure = vi.fn(() => ({ top: 100, bottom: 1600 }))
  vi.stubGlobal("window", browser)
  vi.stubGlobal("document", {
    getElementById: () => ({ getBoundingClientRect: measure }),
  })
})

afterEach(() => {
  cleanup?.()
  cleanup = undefined
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe("section links during mobile scrolling", () => {
  it("waits until inertia settles before measuring layout or updating history", () => {
    SectionNav({ sections })
    for (let i = 0; i < 10; i++) {
      browser.dispatchEvent(new Event("scroll"))
      vi.advanceTimersByTime(100)
    }
    expect(measure).not.toHaveBeenCalled()
    expect(browser.history.replaceState).not.toHaveBeenCalled()
    vi.advanceTimersByTime(150)
    expect(browser.history.replaceState).toHaveBeenCalledWith(
      browser.history.state,
      "",
      "/#problem"
    )
    expect(browser.scrollTo).not.toHaveBeenCalled()
  })

  it("does not move back to the initial anchor after a visitor starts swiping", () => {
    browser.location.hash = "#problem"
    SectionNav({ sections })
    vi.advanceTimersByTime(200)
    browser.dispatchEvent(new Event("touchstart"))
    browser.dispatchEvent(new Event("scroll"))
    browser.dispatchEvent(new Event("scrollend"))
    vi.advanceTimersByTime(500)
    expect(browser.scrollTo).not.toHaveBeenCalled()
    expect(browser.history.replaceState).not.toHaveBeenCalled()
    browser.dispatchEvent(new Event("touchend"))
    vi.advanceTimersByTime(250)
    expect(measure).toHaveBeenCalledTimes(1)
  })

  it("still positions direct links when the visitor has not taken over", () => {
    browser.location.hash = "#problem"
    SectionNav({ sections })
    vi.advanceTimersByTime(400)
    expect(browser.scrollTo).toHaveBeenCalledWith({
      top: 1028,
      behavior: "instant",
    })
  })

  it("cancels delayed scroll corrections for wheel and keyboard input too", () => {
    for (const type of ["wheel", "keydown"]) {
      browser.location.hash = "#problem"
      SectionNav({ sections })
      const event = new Event(type)
      if (type === "keydown") Object.assign(event, { key: "PageDown" })
      browser.dispatchEvent(event)
      vi.advanceTimersByTime(500)
      expect(browser.scrollTo).not.toHaveBeenCalled()
      cleanup?.()
    }
  })

  it("cleans up pending corrections and URL updates on navigation", () => {
    browser.location.hash = "#problem"
    SectionNav({ sections })
    browser.dispatchEvent(new Event("scroll"))
    cleanup?.()
    vi.advanceTimersByTime(1000)
    expect(browser.scrollTo).not.toHaveBeenCalled()
    expect(browser.history.replaceState).not.toHaveBeenCalled()
  })
})
