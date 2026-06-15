"use client";

import { cn } from "@/lib/utils";
import { gradientForColor } from "@/lib/tag-colors";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";

export type TagOption = {
  name: string;
  color: string;
};

type Props = {
  value: string;
  options: TagOption[];
  onChange: (name: string) => void;
};

export function TagSelect({ value, options, onChange }: Props) {
  const selected = options.find((option) => option.name === value) ?? null;

  return (
    <Combobox<TagOption>
      items={options}
      value={selected}
      onValueChange={(item) => onChange(item?.name ?? "")}
      itemToStringLabel={(item) => item.name}
      isItemEqualToValue={(a, b) => a.name === b.name}
    >
      <ComboboxInput placeholder="Cari tag…" />
      <ComboboxContent>
        <ComboboxEmpty>Tag tidak ditemukan.</ComboboxEmpty>
        <ComboboxList>
          {(item: TagOption) => (
            <ComboboxItem key={item.name} value={item}>
              <Item className="p-1">
                <ItemMedia>
                  <span
                    className={cn(
                      "size-6 rounded-md bg-gradient-to-br",
                      gradientForColor(item.color),
                    )}
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{item.name}</ItemTitle>
                </ItemContent>
              </Item>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
