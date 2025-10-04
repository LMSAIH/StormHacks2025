import { Button } from "./button"

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
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
            Login
          </button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 hover:shadow-lg"
          >
            Go to App
          </Button>
        </div>
      </div>
    </nav>
  )
}

export { Navbar }
