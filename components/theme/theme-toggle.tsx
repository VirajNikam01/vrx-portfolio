"use client";

import { useTheme } from "next-themes";
import { useCallback, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { KEYBOARD_SHORTCUTS } from "@/config/keyboard-shortcuts";
import { META_THEME_COLORS } from "@/config/site";
import { useMounted } from "@/hooks/use-mounted";
import { useMetaColor } from "@/hooks/theme/use-meta-color";
import { useSound } from "@/hooks/theme/use-sound";
import { useThemeTransition } from "@/hooks/theme/use-theme-transaction";

import { MoonIcon } from "../animations/icons/moon";
import { SunMediumIcon } from "../animations/icons/sun-medium";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Kbd } from "../ui/kbd";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useMounted();
    const { setMetaColor } = useMetaColor();
    const playClick = useSound("/audio/ui-sounds/click.wav");
    const buttonRef = useRef<HTMLButtonElement>(null);
    const triggerTransition = useThemeTransition(buttonRef);

    const switchTheme = useCallback(() => {
        if (!mounted || !resolvedTheme) {
            return;
        }

        playClick(0.5);
        triggerTransition(() => {
            setTheme(resolvedTheme === "dark" ? "light" : "dark");
            setMetaColor(
                resolvedTheme === "dark"
                    ? META_THEME_COLORS.light
                    : META_THEME_COLORS.dark
            );
        });
    }, [mounted, resolvedTheme, setTheme, setMetaColor, playClick, triggerTransition]);

    useHotkeys(KEYBOARD_SHORTCUTS.theme.hotkey, switchTheme);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        ref={buttonRef}
                        variant="ghost"
                        size="icon"
                        onClick={switchTheme}
                        disabled={!mounted}
                    >
                        <MoonIcon className="relative hidden after:absolute after:-inset-2 [html.dark_&]:block" />
                        <SunMediumIcon className="relative hidden after:absolute after:-inset-2 [html.light_&]:block" />
                        <span className="sr-only">Theme Toggle</span>
                    </Button>
                </TooltipTrigger>

                <TooltipContent className="pr-2 pl-3">
                    <div className="flex items-center gap-3">
                        Toggle Mode
                        <Kbd>{KEYBOARD_SHORTCUTS.theme.label}</Kbd>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
