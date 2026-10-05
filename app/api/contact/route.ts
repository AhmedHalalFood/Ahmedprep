import { NextResponse } from "next/server"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PROGRAMS = new Set(["SHSAT", "Digital SAT"])

const clean = (value: unknown, max = 200) => (typeof value === "string" ? value.trim().slice(0, max) : "")

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = {
      name: clean(body.name),
      grade: clean(body.grade, 50),
      email: clean(body.email),
      phone: clean(body.phone, 30),
      program: clean(body.program, 30),
      level: clean(body.level),
      goal: clean(body.goal),
      message: clean(body.message, 2000),
    }

    if (!data.name || !data.grade || !EMAIL_PATTERN.test(data.email) || !PROGRAMS.has(data.program)) {
      return NextResponse.json({ success: false, error: "Please complete all required fields." }, { status: 400 })
    }

    console.log("New contact form submission:", data)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}
