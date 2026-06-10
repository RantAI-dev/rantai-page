"use client"

import { useEffect, useState } from "react"
import { MapPin, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import GlassSurface from "@/components/GlassSurface"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email"),
  organization: z.string().optional(),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactSchema>

const formatTime = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0")
  const month = date.toLocaleString("en-US", { month: "short" })
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${day} ${month} ${hours}.${minutes}`
}

// Diisolasi sebagai komponen sendiri agar tick tiap detik tidak
// me-render ulang seluruh form + GlassSurface.
function LiveClock() {
  const [time, setTime] = useState<Date>(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="font-mono tabular-nums" suppressHydrationWarning>
      {formatTime(time)}
    </span>
  )
}

export function ContactCard() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      message: "",
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Form submitted:", data)
    reset()
  }

  return (
    // <GlassSurface
    // 	width="100%"
    // 	height="auto"
    // 	borderRadius={16}
    // 	backgroundOpacity={0.5}
    // 	displace={1.5}
    // >
    <div className="w-full flex-col border p-4 backdrop-blur-2xl sm:p-8">
      {/* Mac App Top Bar */}
      <div className="mb-6 flex flex-col justify-between gap-6 pb-6 lg:mb-10 lg:flex-row lg:items-center">
        {/* Left side */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold tracking-widest text-foreground">
              CONTACT US
            </span>

            {/* Social Links */}
            <div className="flex items-center gap-4 text-xs font-medium text-foreground/70 sm:gap-6 sm:text-sm">
              <a
                href="mailto:admin@rantai.dev"
                className="transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
              >
                Email
              </a>
              <a
                href="https://www.linkedin.com/company/rantai-dev/"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
              >
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/rantaidev?igsh=MTByZWh4YXVwM2R4Ng=="
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
              >
                Instagram
              </a>
              <a
                href="https://x.com/rantaidev?s=11&t=y2CocxXo1lB0m2FdAm9Mzg"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
              >
                X
              </a>
            </div>
          </div>
        </div>

        {/* Right side Location & Time */}
        <div className="flex items-center justify-between gap-6 text-xs text-muted-foreground sm:justify-end sm:text-sm">
          <a
            href="https://maps.google.com/?q=Depok,+West+Java,+Indonesia"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Depok, West Java, Indonesia
          </a>
          <LiveClock />
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
        {/* Left: Text */}
        <div className="flex flex-col justify-start">
          <h2 className="mb-6 text-4xl leading-tight font-medium text-foreground md:text-5xl lg:text-6xl">
            Let&apos;s Build AI That Actually Works
          </h2>
          <p className="font-mono text-sm leading-relaxed text-muted-foreground lg:max-w-md">
            We&apos;d love to hear from you — send us a message and we&apos;ll
            be in touch soon.
          </p>
        </div>

        {/* Right: Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field data-invalid={!!errors.name}>
              <FieldLabel className="font-mono text-muted-foreground uppercase">
                Name
              </FieldLabel>
              <Input
                placeholder="Your name"
                className="bg-background/80!"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel className="font-mono text-muted-foreground uppercase">
                Email
              </FieldLabel>
              <Input
                type="email"
                placeholder="your@email.com"
                className="bg-background/80!"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>
          </div>

          <Field>
            <FieldLabel className="font-mono text-muted-foreground uppercase">
              Organization
            </FieldLabel>
            <Input
              placeholder="Your company or institution"
              className="bg-background/80!"
              {...register("organization")}
            />
          </Field>

          <Field data-invalid={!!errors.message}>
            <FieldLabel className="font-mono text-muted-foreground uppercase">
              Message
            </FieldLabel>
            <Textarea
              rows={4}
              placeholder="Tell us about your project or requirements..."
              className="resize-none bg-background/80!"
              aria-invalid={!!errors.message}
              {...register("message")}
            />
            <FieldError errors={[errors.message]} />
          </Field>

          <div className="mt-2 flex justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Message
            </Button>
          </div>
        </form>
      </div>
    </div>
    // </GlassSurface>
  )
}
