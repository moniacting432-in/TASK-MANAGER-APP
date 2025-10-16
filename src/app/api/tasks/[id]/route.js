import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Task from "@/models/Task";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    const body = await req.json(); // ✅ fixed the typo

    const updatedTask = await Task.findByIdAndUpdate(params.id, body, { new: true });

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const deletedTask = await Task.findByIdAndDelete(params.id);

    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task deleted successfully", task: deletedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
