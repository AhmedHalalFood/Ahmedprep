import Image from "next/image"
import { Button } from "@/components/ui/button"


export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <a href="/" className="flex items-center">
            <Image
              src="/ahmedprep-logo.png"
              alt="AhmedPrep Logo"
              width={120}
              height={120}
              className="h-14 w-auto"
              priority
            />
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

          <div className="hidden md:flex items-center">
            <Button asChild className="rounded-full px-6">
              <a href="#contact">Book Consultation</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
