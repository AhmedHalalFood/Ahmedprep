import { Button } from "@/components/ui/button"
import { Phone, Mail, Sparkles } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Limited Spots Available
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground text-balance">
            Classes are filling up quickly!
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Don&apos;t wait - secure your spot today. Our affordable programs are conducted 
            live and online, so you can join from anywhere without wasting time.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-primary/20"
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
              className="rounded-full px-8 py-6 text-base font-medium border-border hover:bg-secondary"
              asChild
            >
              <a href="mailto:Tariq@ahmedprep.com">
                <Mail className="mr-2 w-5 h-5" />
                Email Us
              </a>
            </Button>
          </div>
          
          <p className="mt-8 text-sm text-muted-foreground">
            19-15 21st Ave, 2B, Astoria, NY 11105
          </p>
        </div>
      </div>
    </section>
  )
}
