import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "classic";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark", "classic");
    
    if (theme === "light") {
      root.classList.add("light");
    } else if (theme === "classic") {
      root.classList.add("classic");
    } else {
      root.classList.add("dark");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("classic");
    } else {
      setTheme("dark");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        "w-10 h-10 rounded-full border-2 transition-all duration-300",
        theme === "dark" && "border-[#00FFFF] bg-[#0A0A0A] text-[#00FFFF]",
        theme === "light" && "border-gray-300 bg-white text-gray-800",
        theme === "classic" && "border-amber-400 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800"
      )}
    >
      {theme === "light" ? (
        <Sun className="h-4 w-4" />
      ) : theme === "classic" ? (
        <Monitor className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}