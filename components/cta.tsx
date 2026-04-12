import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Mail } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-12 md:p-16">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground text-balance">
              Ready to Achieve Your Best Score?
            </h2>
            <p className="mt-4 text-primary-foreground/80 text-lg">
              Schedule a free consultation today and discover how AhmedPrep can help you reach your academic goals.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="gap-2 text-base px-8 bg-background text-foreground hover:bg-background/90"
              >
                Schedule Free Consultation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-primary-foreground/80">
              <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Phone className="h-4 w-4" />
                <span>(123) 456-7890</span>
              </a>
              <a href="mailto:info@ahmedprep.com" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Mail className="h-4 w-4" />
                <span>info@ahmedprep.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
