import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    console.log("New contact form submission:", data)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}
