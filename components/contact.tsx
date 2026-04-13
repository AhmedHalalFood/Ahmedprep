"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    label: "Visit Us",
    value: "20-65 47th Street",
    subValue: "Astoria, NY 11105"
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "(347) 479-5020",
    subValue: "Mon-Sat, 9am-7pm"
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "Tariq@ahmedprep.com",
    subValue: "We respond within 24 hours"
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Monday - Saturday",
    subValue: "9:00 AM - 7:00 PM"
  },
]

export function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    program: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact info */}
          <div>
            <p className="text-sm font-medium tracking-widest text-accent uppercase">
              Get In Touch
            </p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground text-balance">
              Let&apos;s start a conversation
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Have questions about our programs? Ready to enroll? We&apos;re here 
              to help you take the next step in your educational journey.
            </p>
            
            <div className="mt-12 grid sm:grid-cols-2 gap-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <info.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {info.label}
                    </p>
                    <p className="mt-1 font-medium text-foreground">
                      {info.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {info.subValue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Contact form */}
          <div className="bg-secondary/30 rounded-3xl p-8 lg:p-10 border border-border/50">
            <h3 className="font-serif text-2xl font-medium text-foreground">
              Send us a message
            </h3>
            <p className="mt-2 text-muted-foreground">
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    First Name
                  </label>
                  <Input
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="bg-card border-border focus:border-accent rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Last Name
                  </label>
                  <Input
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="bg-card border-border focus:border-accent rounded-xl"
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-card border-border focus:border-accent rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-card border-border focus:border-accent rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Program of Interest
                </label>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-card border border-border text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="">Select a program</option>
                  <option value="shsat">SHSAT Preparation</option>
                  <option value="sat">SAT Preparation</option>
                  <option value="act">ACT Preparation</option>
                  <option value="ap">AP Courses</option>
                  <option value="essays">College Essays</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Message
                </label>
                <Textarea
                  placeholder="Tell us about your goals and how we can help..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-card border-border focus:border-accent rounded-xl min-h-[120px] resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-6 text-base font-medium"
              >
                <Send className="mr-2 w-4 h-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
