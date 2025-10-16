import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Task from "@/models/Task";

export async function GET(req) { // ✅ Add 'req' here
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const tasks = userId ? await Task.find({ userId }) : await Task.find();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const newTask = await Task.create(body);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
