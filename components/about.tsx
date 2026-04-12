"use client"

import { Heart, Users, Award, BookOpen } from "lucide-react"

export function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            Who We Are
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground text-balance">
            Meet Your Instructor
          </h2>
        </div>

        {/* Instructor Bio */}
        <div className="mt-16 grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Photo/Icon Area */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-secondary/50 border border-border/50 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-accent" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium">
                Lead Instructor
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: "NYU Graduate" },
                { icon: Heart, label: "Family First" },
                { icon: Award, label: "Since 2021" },
                { icon: BookOpen, label: "Expert Tutor" },
              ].map((stat, index) => (
                <div key={index} className="p-4 rounded-xl bg-secondary/50 text-center">
                  <stat.icon className="w-6 h-6 text-accent mx-auto" />
                  <p className="mt-2 text-sm font-medium text-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bio Content */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-3xl md:text-4xl font-medium text-foreground">
              Tariq Ahmed
            </h3>
            <p className="mt-2 text-lg text-accent font-medium">
              Founder & Lead Instructor
            </p>

            <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Hi, my name is Tariq Ahmed. After graduating from NYU, I went to medical school 
                (I could not finish because of family obligations) and worked in a Biomedical R&D 
                research lab. I also worked many other jobs, including driving a Taxi in New York City.
              </p>
              <p>
                Neither of these worlds fully fit me; they never felt like my &ldquo;destiny&rdquo; or how I 
                was supposed to leave my mark in this world. So, I became a teacher to stay close 
                to family and my children and fulfill my desire to help as many people as possible. 
                I am passionate about teaching high-quality test prep courses.
              </p>
              <p>
                I am a student of knowledge myself. I take clues from here and there and put them 
                together into meaningful and thoughtful ways to solve problems. My experience with 
                teaching middle and high school students and my profound inquiry in high-stakes test 
                preparations like SHSAT, SAT/ACT, AP, and PSAT/NMSQT help me gain the skills I need 
                to bring academic success to all my students.
              </p>
              <p>
                In light of the aftermath of the COVID-19 pandemic and with the great help of my 
                beloved wife and my two children, Ahmed Prep came into existence in mid-2021 to 
                cater to the test prep needs of our loving students. With our parents&apos; and community 
                leaders&apos; gracious help and generous support, Ahmed Prep is becoming a well-known 
                premier Tutorial and Educational Service center.
              </p>
            </div>

            {/* Quote */}
            <blockquote className="mt-10 p-6 rounded-2xl bg-accent/5 border-l-4 border-accent">
              <p className="font-serif text-xl italic text-foreground">
                &ldquo;I am committed to bringing the best out of our beloved students with the love 
                and empathy they need and the care they deserve. We strive to make a difference.&rdquo;
              </p>
              <cite className="mt-4 block text-sm text-muted-foreground not-italic">
                - Tariq Ahmed
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
