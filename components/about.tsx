import { Users, Target, Award, Heart } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Personalized Attention",
    description: "Every student receives individualized instruction tailored to their unique learning style and goals."
  },
  {
    icon: Target,
    title: "Proven Methodology",
    description: "Our research-backed teaching methods have consistently delivered exceptional results for over a decade."
  },
  {
    icon: Award,
    title: "Expert Instructors",
    description: "Learn from educators who are passionate about teaching and deeply knowledgeable in their subjects."
  },
  {
    icon: Users,
    title: "Family Partnership",
    description: "We work closely with parents to ensure alignment between home and classroom for optimal success."
  },
]

export function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-medium tracking-widest text-accent uppercase">
              About AhmedPrep
            </p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-tight text-balance">
              Where academic excellence meets personal growth
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Founded with a simple belief: every student has the potential to achieve 
              greatness. For over 12 years, AhmedPrep has been guiding students through 
              their most important academic milestones.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              We don&apos;t just teach test-taking strategies. We build confidence, 
              develop critical thinking skills, and nurture a lifelong love of learning 
              that extends far beyond any single exam.
            </p>
            
            {/* Signature style element */}
            <div className="mt-10 flex items-center gap-4">
              <div className="w-16 h-px bg-accent" />
              <p className="text-sm font-medium text-foreground italic">
                &ldquo;Excellence is not a destination, but a journey.&rdquo;
              </p>
            </div>
          </div>
          
          {/* Values grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="p-6 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors duration-200"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-medium text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
