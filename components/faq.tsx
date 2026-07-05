import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "When should my child start preparing for the SHSAT?",
    answer:
      "We recommend beginning SHSAT preparation in the spring or summer before 8th grade. This gives students enough time to master the content, build test-taking stamina, and complete several full-length practice exams before the fall test date.",
  },
  {
    question: "Do you offer both in-person and online instruction?",
    answer:
      "Yes. We offer in-person classes at our Astoria location as well as live, interactive online sessions. Both formats use the same curriculum, materials, and expert instructors so you can choose whatever fits your family's schedule.",
  },
  {
    question: "How are your classes structured?",
    answer:
      "Programs combine small-group instruction, one-on-one coaching, and regular full-length practice tests. After each diagnostic, we build a personalized study plan and share detailed progress reports so families always know where their student stands.",
  },
  {
    question: "What kind of score improvements can we expect?",
    answer:
      "Results vary by student, but our SAT students average a 150+ point improvement, and our SHSAT students earn a 96% specialized high school admission rate. We set realistic, personalized targets after an initial diagnostic assessment.",
  },
  {
    question: "How much do your programs cost?",
    answer:
      "Pricing depends on the program, format, and number of sessions. We offer flexible packages and payment plans. The best next step is to book a free consultation, where we'll recommend a plan and give you transparent pricing.",
  },
  {
    question: "What if my child is preparing for more than one exam?",
    answer:
      "Many of our students prepare for multiple exams, such as Regents alongside the SAT or AP courses. We create an integrated schedule that balances every commitment without overwhelming your student.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 lg:py-32 bg-secondary/40">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">FAQ</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground text-balance">
            Questions, answered
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
            Everything you need to know about preparing with AhmedPrep. Still curious? Reach out
            and we&apos;ll help.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12 w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-2xl border border-border/60 bg-card px-6 data-[state=open]:shadow-sm"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline hover:text-accent py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
