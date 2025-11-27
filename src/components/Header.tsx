import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { NavLink } from "@/components/NavLink";
import icon from "@/../public/icon.png";
import darkIcon from "@/../public/icon_black.png";

const navLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Limits", href: "/limits" },
    { label: "Community", href: "/community" },
    { label: "Rewards", href: "/rewards" },
    { label: "Profile", href: "/profile" },
];

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2 whitespace-nowrap">
                  <img
                      src={theme === "dark" ? icon : darkIcon}
                      className="h-8 w-8 mt-1"
                  />

                  <span className="text-4xl font-bold text-foreground leading-none">
                      RelAI
                  </span>
              </div>
              <nav className="flex flex-1 flex-wrap items-center gap-2 lg:justify-end">
                  {navLinks.map((link) => (
                      <NavLink
                          key={link.href}
                          to={link.href}
                          className="px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-full hover:text-foreground transition"
                          activeClassName="text-foreground bg-primary/10"
                      >
                          {link.label}
                      </NavLink>
                  ))}
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="relative"
                  >
                      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                  </Button>
              </nav>
          </div>
      </header>
  );
};

export default Header;
