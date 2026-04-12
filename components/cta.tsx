import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 lg:py-32 bg-primary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-primary-foreground text-balance">
            Classes are filling up quickly!
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/80 leading-relaxed">
            Don&apos;t wait - secure your spot today. Our affordable programs are conducted 
            live and online, so you can join from anywhere without wasting time.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-card text-foreground hover:bg-card/90 rounded-full px-8 py-6 text-base font-medium shadow-lg"
              asChild
            >
              <a href="tel:347-479-5020">
                <Phone className="mr-2 w-5 h-5" />
                Call Now: 347-479-5020
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full px-8 py-6 text-base font-medium border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <a href="mailto:Tariq@ahmedprep.com">
                Email: Tariq@ahmedprep.com
              </a>
            </Button>
          </div>
          
          <p className="mt-8 text-sm text-primary-foreground/60">
            19-15 21st Ave, 2B, Astoria, NY 11105
          </p>
        </div>
      </div>
    </section>
  )
}
