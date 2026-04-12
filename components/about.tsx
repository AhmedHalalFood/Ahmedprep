import { Users, Target, Award, Heart, Lightbulb, BookOpen } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Holistic Approach",
    description: "Combining foundational skills, critical thinking, executive skills development, and mentorship."
  },
  {
    icon: Target,
    title: "Unlock Potential",
    description: "We tap into students' intelligence and creativity, striving to unlock their highest potential."
  },
  {
    icon: Award,
    title: "Empowered Learners",
    description: "Success on a test is just a stepping stone toward becoming empowered learners and confident individuals."
  },
  {
    icon: Lightbulb,
    title: "Critical Thinking",
    description: "We help students develop skills needed to think critically and solve problems effectively."
  },
]

export function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Content */}
          <div>
            <p className="text-sm font-medium tracking-widest text-accent uppercase">
              Who We Are
            </p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-tight text-balance">
              Dedicated to world-class test prep
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              At Ahmed Prep, we are dedicated to providing a world-class test prep experience 
              that is accessible, effective, and enjoyable for all students, without an enormous price tag.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              We inspire our students to take charge of their future. They cultivate a resilient 
              mindset, learn to excel in daily challenges, and acquire essential study skills. 
              In essence, they learn how to fulfill the commitments they make to themselves.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              We simplify challenging math and science concepts to make them easy to understand. 
              Our programs are affordable, and our classes are conducted live and online, 
              allowing you to join from anywhere without wasting time.
            </p>
            
            {/* Instructor Info */}
            <div className="mt-10 p-6 rounded-2xl bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-foreground">Tariq Ahmed</h3>
                  <p className="text-sm text-muted-foreground">Lead Instructor</p>
                </div>
              </div>
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
