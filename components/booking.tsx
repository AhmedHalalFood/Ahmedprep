"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDays, Clock, Check, Loader2 } from "lucide-react"

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
]

const programs = [
  { value: "shsat", label: "SHSAT Preparation" },
  { value: "sat", label: "SAT Preparation" },
  { value: "act", label: "ACT Preparation" },
  { value: "ap", label: "AP Courses" },
  { value: "essays", label: "College Essays" },
]

export function Booking() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [program, setProgram] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const formattedDate = date
    ? date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null

  const canSubmit = date && time && name && email && status !== "loading"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setStatus("loading")
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          program,
          date: date?.toISOString(),
          time,
        }),
      })

      if (response.ok) {
        setStatus("success")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  const resetForm = () => {
    setDate(undefined)
    setTime("")
    setName("")
    setEmail("")
    setPhone("")
    setProgram("")
    setStatus("idle")
  }

  return (
    <section id="booking" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">Book an Appointment</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground text-balance">
            Schedule your free consultation
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Pick a date and time that works for you. We&apos;ll confirm your appointment within 24 hours.
          </p>
        </div>

        {status === "success" ? (
          <div className="mt-16 max-w-xl mx-auto text-center bg-card rounded-3xl p-10 lg:p-12 border border-border/50 shadow-sm">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-accent" />
            </div>
            <h3 className="mt-6 font-serif text-2xl font-medium text-foreground">Appointment requested</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Thanks, {name.split(" ")[0]}! We&apos;ve received your request for{" "}
              <span className="font-medium text-foreground">{formattedDate}</span> at{" "}
              <span className="font-medium text-foreground">{time}</span>. A member of our team will reach out to
              confirm shortly.
            </p>
            <Button onClick={resetForm} className="mt-8 rounded-full px-8">
              Book another appointment
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-5xl mx-auto"
          >
            {/* Calendar + time slots */}
            <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/50 shadow-sm">
              <div className="flex items-center gap-2 text-foreground">
                <CalendarDays className="w-5 h-5 text-accent" />
                <h3 className="font-serif text-xl font-medium">Select a date</h3>
              </div>
              <div className="mt-4 flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(day) => {
                    const d = new Date(day)
                    d.setHours(0, 0, 0, 0)
                    return d < today || d.getDay() === 1
                  }}
                  className="rounded-xl"
                />
              </div>

              <div className="mt-6 flex items-center gap-2 text-foreground">
                <Clock className="w-5 h-5 text-accent" />
                <h3 className="font-serif text-xl font-medium">Select a time</h3>
              </div>
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors ${
                      time === slot
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-background text-foreground hover:border-accent"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-secondary/30 rounded-3xl p-6 lg:p-8 border border-border/50">
              <h3 className="font-serif text-xl font-medium text-foreground">Your details</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell us who you are so we can prepare for your visit.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                  <Input
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-card border-border focus:border-accent rounded-xl"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-card border-border focus:border-accent rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                    <Input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-card border-border focus:border-accent rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Program of Interest</label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-card border border-border text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="">Select a program</option>
                    {programs.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 rounded-2xl bg-card border border-border/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Appointment summary</p>
                <p className="mt-2 text-foreground">
                  {formattedDate ? (
                    <span className="font-medium">{formattedDate}</span>
                  ) : (
                    <span className="text-muted-foreground">No date selected</span>
                  )}
                  {time && <span className="text-muted-foreground"> · {time}</span>}
                </p>
              </div>

              {status === "error" && (
                <p className="mt-4 text-sm text-destructive">
                  Something went wrong. Please try again or call us directly.
                </p>
              )}

              <Button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-6 text-base font-medium disabled:opacity-50"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CalendarDays className="mr-2 w-4 h-4" />
                    Confirm Appointment
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
