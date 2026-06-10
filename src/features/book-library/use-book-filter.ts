import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { categoryColors } from "./constants"
import type { Book } from "./types"

export function useBookFilter(books: readonly Book[]) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = useMemo(() => {
    const cats = Array.from(new Set(books.map((b) => b.category)))
    return ["All", ...cats]
  }, [books])

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        searchQuery === "" ||
        book.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === "All" || book.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [books, searchQuery, selectedCategory])

  const getCategoryBadgeClass = (category: string) =>
    categoryColors[category] || "bg-muted text-muted-foreground border-border"

  const getCategoryCount = (category: string) =>
    books.filter((b) => b.category === category).length

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredBooks,
    getCategoryBadgeClass,
    getCategoryCount,
  }
}
