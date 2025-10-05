import { Button } from "./button"
import { useEffect, useState } from "react"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all ${
      isScrolled 
        ? "bg-background/20 backdrop-blur-md shadow-md border border-b" 
        : "bg-transparent"
    }`}>
      <div className="mx-auto flex  items-center justify-between">
        {/* Left - Logo/Brand (optional space) */}
        <div className="flex-1" />

        {/* Center - Navigation Links */}
        <div className="flex items-center gap-8">
          <a
            href="#platform"
            className="relative text-sm font-medium text-foreground/80 transition-all hover:text-foreground font-['Roboto_Mono',monospace] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Platform
          </a>
          <a
            href="#solutions"
            className="relative text-sm font-medium text-foreground/80 transition-all hover:text-foreground font-['Roboto_Mono',monospace] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Solutions
          </a>
          <a
            href="#impact"
            className="relative text-sm font-medium text-foreground/80 transition-all hover:text-foreground font-['Roboto_Mono',monospace] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Impact
          </a>
        </div>

        {/* Right - Login & CTA */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <button className="relative text-sm font-medium text-foreground/80 transition-all hover:text-foreground font-['Roboto_Mono',monospace] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all hover:after:w-full">
            <a href="placeholder.jpeg">Login</a>
          </button>
            <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 hover:shadow-lg"
            asChild
            >
            <a href="/Visualization">Go to App</a>
            </Button>
        </div>
      </div>
    </nav>
  )
}

export { Navbar }
