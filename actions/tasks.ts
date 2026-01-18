"use server";

import { z } from "zod";
import { db } from "@/db/drizzle";
import { tasks, TaskStatus } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function getTasks() {
  const userId = await requireAuth();

  return await db.query.tasks.findMany({
    where: eq(tasks.userId, userId),
    orderBy: [desc(tasks.createdAt)],
  });
}

export async function getTaskById(taskId: string) {
  const userId = await requireAuth();

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.id, taskId), eq(tasks.userId, userId)),
  });

  if (!task) {
    return null;
  }

  return task;
}

export async function createTask(formData: FormData) {
  try {
    const userId = await requireAuth();

    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      status: formData.get("status") as TaskStatus,
    };

    const result = taskSchema.safeParse(data);

    if (!result.success) {
      return { error: result.error.issues[0].message };
    }

    await db.insert(tasks).values({
      userId,
      title: result.data.title,
      content: result.data.content || "",
      status: result.data.status,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Failed to create task: ", error);
    return { error: "Failed to create task" };
  }
}

export async function updateTask(taskId: string, formData: FormData) {
  try {
    const userId = await requireAuth();

    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      status: formData.get("status") as TaskStatus,
    };

    const result = taskSchema.safeParse(data);

    if (!result.success) {
      return { error: result.error.issues[0].message };
    }

    const updateResult = await db
      .update(tasks)
      .set({
        title: result.data.title,
        content: result.data.content || "",
        status: result.data.status,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();

    if (updateResult.length === 0) {
      return {
        error: "Task not found or you don't have permission to update it",
      };
    }

    revalidatePath("/");
    revalidatePath(`/tasks/${taskId}`);
    return { success: true };
  } catch (error) {
    console.log("Failed to update task: ", error);
    return { error: "Failed to update task" };
  }
}

export async function deleteTask(taskId: string) {
  try {
    const userId = await requireAuth();

    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();

    if (result.length === 0) {
      return {
        error: "Task not found or you don't have permission to delete it",
      };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Failed to delete task: ", error);
    return { error: "Failed to delete task" };
  }
}
