"use client"

import { useState } from "react"
import Image from "next/image"
import { LayoutGridIcon, ListIcon, SearchIcon, XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { FilterChips } from "@/components/filter-chips"
import { cn } from "@/lib/utils"

import { useBookFilter } from "./use-book-filter"
import { type Book, type BookLibraryProps } from "./types"

function CategoryTag({
  category,
  tone,
}: Readonly<{ category: string; tone: { tone: string; text: string } }>) {
  return (
    <span
      className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: `${tone.tone}1a`, color: tone.text }}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full"
        style={{ background: tone.tone }}
      />
      {category}
    </span>
  )
}

function linkProps(book: Book) {
  return {
    href: book.url || "#",
    target: book.url ? "_blank" : undefined,
    rel: book.url ? "noopener noreferrer" : undefined,
  }
}

export function BookLibrary({ books }: BookLibraryProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredBooks,
    getCategoryTone,
    getCategoryCount,
  } = useBookFilter(books)

  return (
    <div className="flex flex-col gap-8">
      {/* Search, count and view switch */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code or title"
            aria-label="Search books"
            className="h-12 w-full rounded-full border border-border bg-muted py-3 pr-11 pl-12 text-[15px] text-foreground transition-colors placeholder:text-muted-foreground focus:border-foreground/40 focus:bg-background focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <p className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
            {filteredBooks.length} of {books.length} books
          </p>
          <div
            role="group"
            aria-label="Layout"
            className="flex rounded-full bg-muted p-1"
          >
            {(
              [
                ["grid", LayoutGridIcon, "Grid view"],
                ["list", ListIcon, "List view"],
              ] as const
            ).map(([mode, Icon, label]) => (
              <button
                key={mode}
                type="button"
                aria-label={label}
                aria-pressed={viewMode === mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "grid size-9 place-items-center rounded-full transition-colors",
                  viewMode === mode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <FilterChips
        label="Book categories"
        value={selectedCategory}
        onChange={setSelectedCategory}
        options={categories.map((cat) => ({
          value: cat,
          count: cat === "All" ? undefined : getCategoryCount(cat),
          tone: cat === "All" ? undefined : getCategoryTone(cat).tone,
        }))}
      />

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book, idx) => (
              <motion.a
                key={book.code}
                layout
                {...linkProps(book)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: Math.min(idx, 8) * 0.03 }}
                className="group flex flex-col rounded-2xl bg-muted p-3 transition-colors hover:bg-neutral-200/70"
              >
                <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-neutral-200">
                  <Image
                    src={book.imageUrl}
                    alt={book.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 px-1.5 pt-4 pb-1.5">
                  <p className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
                    {book.code}
                  </p>
                  <p className="line-clamp-2 text-[17px] leading-snug font-medium tracking-[-0.015em] text-foreground">
                    {book.name}
                  </p>
                  <div className="mt-auto pt-2">
                    <CategoryTag
                      category={book.category}
                      tone={getCategoryTone(book.category)}
                    />
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book, idx) => (
              <motion.a
                key={book.code}
                layout
                {...linkProps(book)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.3, delay: Math.min(idx, 8) * 0.03 }}
                className="group flex items-center gap-4 rounded-2xl bg-muted p-3 transition-colors hover:bg-neutral-200/70"
              >
                <div className="relative aspect-3/4 h-24 shrink-0 overflow-hidden rounded-lg bg-neutral-200 sm:h-28">
                  <Image
                    src={book.imageUrl}
                    alt={book.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <p className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
                    {book.code}
                  </p>
                  <p className="line-clamp-2 font-medium text-foreground">
                    {book.name}
                  </p>
                  <CategoryTag
                    category={book.category}
                    tone={getCategoryTone(book.category)}
                  />
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filteredBooks.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted px-6 py-16 text-center">
          <SearchIcon className="size-5 text-muted-foreground" />
          <div>
            <p className="font-medium">No books found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another search or category.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("All")
            }}
            className="h-10 rounded-full border border-border px-5 text-sm transition-colors hover:border-foreground/40"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
