"use client";

import { Check } from "lucide-react";
import { DropdownMenu } from "radix-ui";

import { KEYBOARD_SHORTCUTS } from "@/config/keyboard-shortcuts";
import { useMounted } from "@/hooks/use-mounted";
import { usePrimaryColor } from "@/providers/primary-color-provider";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Kbd } from "../ui/kbd";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export function PrimaryColorPicker() {
  const mounted = useMounted();
  const { colors, primaryColor, setPrimaryColor } = usePrimaryColor();
  const selectedColor = colors.find((color) => color.value === primaryColor) ?? colors[0];

  return (
    <TooltipProvider>
      <DropdownMenu.Root>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu.Trigger asChild disabled={!mounted}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Change primary color"
                disabled={!mounted}
              >
                <span
                  className="size-4 rounded-full border border-border shadow-sm ring-2 ring-background"
                >
                  <span
                    className="block size-full rounded-full"
                    style={{ backgroundColor: selectedColor.swatch }}
                  />
                </span>
              </Button>
            </DropdownMenu.Trigger>
          </TooltipTrigger>

          <TooltipContent className="pr-2 pl-3">
            <div className="flex items-center gap-3">
              Primary Color
              <Kbd>{KEYBOARD_SHORTCUTS.primaryColor.label}</Kbd>
            </div>
          </TooltipContent>
        </Tooltip>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            className="z-50 min-w-40 rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          >
            {colors.map((color) => {
              const isSelected = color.value === primaryColor;

              return (
                <DropdownMenu.Item
                  key={color.value}
                  className={cn(
                    "flex h-8 cursor-pointer items-center gap-2 rounded-md px-2 text-sm outline-none transition-colors select-none focus:bg-muted",
                    isSelected && "bg-muted"
                  )}
                  onSelect={() => setPrimaryColor(color.value)}
                >
                  <span
                    className="size-4 rounded-full border border-border"
                  >
                    <span
                      className="block size-full rounded-full"
                      style={{ backgroundColor: color.swatch }}
                    />
                  </span>
                  <span className="flex-1">{color.name}</span>
                  <Check className={cn("size-4 opacity-0", isSelected && "opacity-100")} />
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </TooltipProvider>
  );
}
