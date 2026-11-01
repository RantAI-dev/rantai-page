import { z } from "zod"

// Server-side checks for the books and team CMS forms. Their values end up
// as image sources and outbound links on public pages, so links must be
// https and nothing else gets through. Errors are short, stable strings.

export const ADMIN_INPUT_ERRORS = {
  missing: "Missing required fields",
  url: "Invalid URL",
  order: "Invalid order",
  body: "Invalid request body",
} as const

const required = z
  .string({ error: ADMIN_INPUT_ERRORS.missing })
  .trim()
  .min(1, ADMIN_INPUT_ERRORS.missing)
  .max(500)

/** Empty or missing becomes null. */
const optionalText = z
  .string()
  .trim()
  .max(2000)
  .nullish()
  .transform((v) => (v ? v : null))

function isHttps(value: string) {
  try {
    return new URL(value).protocol === "https:"
  } catch {
    return false
  }
}

/** An outbound link: https only. */
const httpsUrl = z
  .string({ error: ADMIN_INPUT_ERRORS.url })
  .trim()
  .refine(isHttps, ADMIN_INPUT_ERRORS.url)

/** An image: https (Vercel Blob or elsewhere) or a path in /public. */
const imageUrl = z
  .string({ error: ADMIN_INPUT_ERRORS.missing })
  .trim()
  .min(1, ADMIN_INPUT_ERRORS.missing)
  .refine(
    (v) => isHttps(v) || (v.startsWith("/") && !v.startsWith("//")),
    ADMIN_INPUT_ERRORS.url
  )

const optional = <T extends z.ZodType>(schema: T) =>
  z
    .union([z.literal(""), schema])
    .nullish()
    .transform((v) => (v ? (v as z.output<T>) : null))

const orderIndex = z
  .number({ error: ADMIN_INPUT_ERRORS.order })
  .int(ADMIN_INPUT_ERRORS.order)
  .min(0, ADMIN_INPUT_ERRORS.order)
  .optional()
  .transform((v) => v ?? 0)

const bookSchema = z.object({
  code: required,
  name: required,
  category: required,
  imageUrl,
  url: optional(httpsUrl),
  orderIndex,
})

const teamSchema = z.object({
  name: required,
  role: required,
  bio: optionalText,
  imageUrl: optional(imageUrl),
  linkedin: optional(httpsUrl),
  github: optional(httpsUrl),
  orderIndex,
})

export type BookInput = z.output<typeof bookSchema>
export type TeamInput = z.output<typeof teamSchema>

type Result<T> = { ok: true; data: T } | { ok: false; error: string }

function parse<T>(schema: z.ZodType<T>, body: unknown): Result<T> {
  if (!body || typeof body !== "object") {
    return { ok: false, error: ADMIN_INPUT_ERRORS.body }
  }
  const result = schema.safeParse(body)
  if (result.success) return { ok: true, data: result.data }
  // The first problem, as one of the stable messages above.
  const message = result.error.issues[0]?.message
  const known = Object.values(ADMIN_INPUT_ERRORS) as string[]
  return {
    ok: false,
    error:
      message && known.includes(message) ? message : ADMIN_INPUT_ERRORS.body,
  }
}

export const parseBookInput = (body: unknown) => parse(bookSchema, body)
export const parseTeamInput = (body: unknown) => parse(teamSchema, body)

/** Reads a JSON body, or null when it isn't valid JSON. */
export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    return null
  }
}
