"use client";

import * as React from "react";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import { IconSun } from "@tabler/icons-react";
import { IconMoon } from "@tabler/icons-react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-xl h-11 w-11"
    >
      {theme === "light" ? (
        <IconMoon className="h-5 w-5" />
      ) : (
        <IconSun className="h-5 w-5" />
      )}
      <span className="sr-only">تغییر تم</span>
    </Button>
  );
}
