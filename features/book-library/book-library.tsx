"use client"

import { useState } from "react"
import Image from "next/image"
import {
  SearchIcon,
  FilterIcon,
  LayoutGridIcon,
  ListIcon,
  BookOpenIcon,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateAction,
} from "@/components/ui/empty-state"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

import { cn } from "@/lib/utils"
import { useBookFilter } from "./use-book-filter"
import { type BookLibraryProps } from "./types"

export function BookLibrary({ books }: BookLibraryProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredBooks,
    getCategoryBadgeClass,
    getCategoryCount,
  } = useBookFilter(books)

  return (
    <div className="space-y-4">
      {/* ── Search & Filter Bar ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup className="max-w-sm flex-1">
          <InputGroupAddon>
            <InputGroupText>
              <SearchIcon className="size-4" />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search by code or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="font-mono"
          />
        </InputGroup>

        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "grid" | "list")}
        >
          <TabsList className="h-8">
            <TabsTrigger value="grid" className="px-2.5" aria-label="Grid view">
              <LayoutGridIcon className="size-4" />
            </TabsTrigger>
            <TabsTrigger value="list" className="px-2.5" aria-label="List view">
              <ListIcon className="size-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* ── Category Pills & Results Count ──────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* <FilterIcon className="mr-0.5 size-4 text-muted-foreground" /> */}
          {categories.map((cat) => (
            <Badge
              key={cat}
              asChild
              variant={selectedCategory === cat ? "default" : "outline"}
              className="h-6 cursor-pointer px-2.5 font-mono text-xs transition-all duration-200 hover:scale-105"
            >
              <button onClick={() => setSelectedCategory(cat)}>
                {cat}
                {cat !== "All" && (
                  <span className="ml-1 opacity-60">
                    {getCategoryCount(cat)}
                  </span>
                )}
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <BookOpenIcon className="size-4 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">
            {filteredBooks.length} of {books.length} books
            {selectedCategory !== "All" && (
              <>
                {" "}
                in <span className="text-foreground">{selectedCategory}</span>
              </>
            )}
            {searchQuery && (
              <>
                {" "}
                matching &quot;
                <span className="text-foreground">{searchQuery}</span>&quot;
              </>
            )}
          </span>
        </div>
      </div>

      {/* ── Grid View ───────────────────────────────────────────────── */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book, idx) => (
              <motion.div
                key={book.code}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
              >
                <a
                  href={book.url || "#"}
                  target={book.url ? "_blank" : undefined}
                  rel={book.url ? "noopener noreferrer" : undefined}
                  className="group block h-full"
                >
                  <Card className="h-full overflow-hidden pt-0 transition-all duration-300 hover:shadow-lg hover:ring-2 hover:shadow-primary/5 hover:ring-primary/30">
                    <div className="relative aspect-3/4 w-full overflow-hidden bg-muted/40">
                      <Image
                        src={book.imageUrl}
                        alt={book.code}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <CardHeader className="gap-2">
                      <p className="font-mono text-sm text-muted-foreground uppercase">
                        {book.code}
                      </p>
                      <CardTitle className="line-clamp-2 leading-snug">
                        {book.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryBadgeClass(book.category)}>
                          {book.category}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── List View ───────────────────────────────────────────────── */}
      {viewMode === "list" && (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book, idx) => (
              <motion.div
                key={book.code}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
              >
                <a
                  href={book.url || "#"}
                  target={book.url ? "_blank" : undefined}
                  rel={book.url ? "noopener noreferrer" : undefined}
                  className="group block"
                >
                  <Card className="flex flex-row items-center gap-4 overflow-hidden p-0 transition-all duration-300 hover:shadow-lg hover:ring-2 hover:shadow-primary/5 hover:ring-primary/30">
                    <div className="relative aspect-3/4 h-24 shrink-0 overflow-hidden bg-muted/40 sm:h-28">
                      <Image
                        src={book.imageUrl}
                        alt={book.code}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-1.5 py-3 pr-4">
                      <p className="font-mono text-sm text-muted-foreground uppercase">
                        {book.code}
                      </p>
                      <p className="line-clamp-2 font-medium text-foreground">
                        {book.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryBadgeClass(book.category)}>
                          {book.category}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Empty State ─────────────────────────────────────────────── */}
      {filteredBooks.length === 0 && (
        <EmptyState>
          <EmptyStateIcon>
            <SearchIcon />
          </EmptyStateIcon>
          <div>
            <EmptyStateTitle>No books found</EmptyStateTitle>
            <EmptyStateDescription>
              Try adjusting your search or filter criteria
            </EmptyStateDescription>
          </div>
          <EmptyStateAction>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
            >
              Clear filters
            </Button>
          </EmptyStateAction>
        </EmptyState>
      )}
    </div>
  )
}
