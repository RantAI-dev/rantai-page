"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export type TeamAuthor = {
  name: string;
  role: string | null;
  imageUrl: string | null;
};

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

type Props = {
  value: string;
  options: TeamAuthor[];
  onChange: (name: string) => void;
};

export function AuthorSelect({ value, options, onChange }: Props) {
  const selected = options.find((option) => option.name === value) ?? null;

  return (
    <Combobox<TeamAuthor>
      items={options}
      value={selected}
      onValueChange={(item) => onChange(item?.name ?? "")}
      itemToStringLabel={(item) => item.name}
      isItemEqualToValue={(a, b) => a.name === b.name}
    >
      <ComboboxInput placeholder="Cari penulis…" showClear />
      <ComboboxContent>
        <ComboboxEmpty>Penulis tidak ditemukan.</ComboboxEmpty>
        <ComboboxList>
          {(item: TeamAuthor) => (
            <ComboboxItem key={item.name} value={item}>
              <Item className="p-1">
                <ItemMedia>
                  <Avatar size="lg">
                    <AvatarImage src={item.imageUrl ?? undefined} />
                    <AvatarFallback>{initials(item.name)}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{item.name}</ItemTitle>
                  {item.role && (
                    <ItemDescription className="leading-none">
                      {item.role}
                    </ItemDescription>
                  )}
                </ItemContent>
              </Item>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
