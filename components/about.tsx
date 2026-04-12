import { Target, Lightbulb, Heart } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Personalized Approach",
    description: "Every student learns differently. We create customized study plans that match your learning style and goals."
  },
  {
    icon: Lightbulb,
    title: "Expert Instruction",
    description: "Our tutors are top scorers and certified educators with years of experience in test preparation."
  },
  {
    icon: Heart,
    title: "Student Success",
    description: "Your success is our mission. We're committed to helping you achieve your highest potential."
  }
]

export function About() {
  return (
    <section id="about" className="py-24 bg-card">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">About AhmedPrep</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-foreground leading-tight text-balance">
              Empowering Students to Achieve Academic Excellence
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Founded with a passion for education, AhmedPrep has been helping students excel in their 
              academic journeys for over a decade. We believe that every student has the potential to 
              succeed with the right guidance and support.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our proven methodology combines rigorous curriculum, personalized attention, and 
              cutting-edge learning resources to deliver exceptional results. Whether you&apos;re 
              preparing for the SAT, ACT, or other standardized tests, we&apos;re here to help you reach 
              your goals.
            </p>
          </div>

          <div className="grid gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="flex gap-4 p-6 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
