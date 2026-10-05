import { Button } from "@/components/ui/button"


export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <a href="/" className="flex items-center">
            <span className="font-serif text-2xl font-semibold tracking-tight text-primary">Ahmed<span className="text-accent">Prep</span></span>
          </a>

          <nav className="hidden md:flex items-center gap-10">
            <a href="#programs" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Programs
            </a>
            <a href="#about" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              About
            </a>
            <a href="#results" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Success Stories
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden sm:inline-flex text-sm font-medium text-foreground hover:text-accent transition-colors">Contact</a>
            <Button asChild className="rounded-full px-4 sm:px-6">
              <a href="#contact">Book Consultation</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
