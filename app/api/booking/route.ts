import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.name || !data.email || !data.date || !data.time) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      )
    }

    console.log("[v0] New appointment booking:", data)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 },
    )
  }
}
