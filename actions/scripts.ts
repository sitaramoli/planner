"use server";

import { z } from "zod";
import { db } from "@/db/drizzle";
import { scripts, ScriptStatus, ScriptType } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// Helper function to calculate word count from HTML content
function calculateWordCount(html: string): number {
  if (!html) return 0;
  // Remove HTML tags and get text content
  const text = html.replace(/<[^>]*>/g, " ");
  // Split by whitespace and filter out empty strings
  const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
  return words.length;
}

// Helper function to estimate video duration (average 150 words per minute)
function estimateDuration(wordCount: number): number {
  return Math.ceil(wordCount / 150);
}

const scriptSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  status: z.enum([
    "DRAFT",
    "WRITING",
    "REVIEW",
    "READY_TO_FILM",
    "FILMING",
    "EDITING",
    "READY_TO_PUBLISH",
    "PUBLISHED",
    "ARCHIVED",
  ]),
  scriptType: z
    .enum(["TUTORIAL", "REVIEW", "VLOG", "EDUCATIONAL", "ENTERTAINMENT", "OTHER"])
    .optional(),
  videoTitle: z.string().optional(),
  description: z.string().optional(),
  tags: z.string().optional(),
  estimatedDuration: z.coerce.number().optional(),
  targetPublishDate: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  thumbnailNotes: z.string().optional(),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function getScripts() {
  const userId = await requireAuth();

  return await db
    .select()
    .from(scripts)
    .where(eq(scripts.userId, userId))
    .orderBy(desc(scripts.createdAt));
}

// Keep getTasks as alias for backward compatibility
export const getTasks = getScripts;

export async function getScriptById(scriptId: string) {
  const userId = await requireAuth();

  const result = await db
    .select()
    .from(scripts)
    .where(and(eq(scripts.id, scriptId), eq(scripts.userId, userId)))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0];
}

// Keep getTaskById as alias for backward compatibility
export const getTaskById = getScriptById;

export async function createScript(formData: FormData) {
  try {
    const userId = await requireAuth();

    const content = (formData.get("content") as string) || "";
    const wordCount = calculateWordCount(content);
    const estimatedDuration = estimateDuration(wordCount);

    const data = {
      title: formData.get("title") as string,
      content: content,
      status: formData.get("status") as ScriptStatus,
      scriptType: (formData.get("scriptType") as ScriptType) || undefined,
      videoTitle: (formData.get("title") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      tags: (formData.get("tags") as string) || undefined,
      targetPublishDate: (formData.get("targetPublishDate") as string) || undefined,
      videoUrl: (formData.get("videoUrl") as string) || undefined,
      thumbnailNotes: (formData.get("thumbnailNotes") as string) || undefined,
    };

    const result = scriptSchema.safeParse(data);

    if (!result.success) {
      return { error: result.error.issues[0].message };
    }

    await db.insert(scripts).values({
      userId,
      title: result.data.title,
      content: result.data.content || "",
      status: result.data.status,
      scriptType: result.data.scriptType || null,
      videoTitle: result.data.videoTitle || null,
      description: result.data.description || null,
      tags: result.data.tags || null,
      estimatedDuration: estimatedDuration || null,
      targetPublishDate: result.data.targetPublishDate
        ? new Date(result.data.targetPublishDate)
        : null,
      videoUrl: result.data.videoUrl || null,
      thumbnailNotes: result.data.thumbnailNotes || null,
      wordCount: wordCount,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Failed to create script: ", error);
    return { error: "Failed to create script" };
  }
}

// Keep createTask as alias for backward compatibility
export const createTask = createScript;

export async function updateScript(scriptId: string, formData: FormData) {
  try {
    const userId = await requireAuth();

    const content = (formData.get("content") as string) || "";
    const wordCount = calculateWordCount(content);
    const estimatedDuration = estimateDuration(wordCount);

    const data = {
      title: formData.get("title") as string,
      content: content,
      status: formData.get("status") as ScriptStatus,
      scriptType: (formData.get("scriptType") as ScriptType) || undefined,
      videoTitle: (formData.get("title") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      tags: (formData.get("tags") as string) || undefined,
      targetPublishDate: (formData.get("targetPublishDate") as string) || undefined,
      videoUrl: (formData.get("videoUrl") as string) || undefined,
      thumbnailNotes: (formData.get("thumbnailNotes") as string) || undefined,
    };

    const result = scriptSchema.safeParse(data);

    if (!result.success) {
      return { error: result.error.issues[0].message };
    }

    const updateResult = await db
      .update(scripts)
      .set({
        title: result.data.title,
        content: result.data.content || "",
        status: result.data.status,
        scriptType: result.data.scriptType || null,
        videoTitle: result.data.videoTitle || null,
        description: result.data.description || null,
        tags: result.data.tags || null,
        estimatedDuration: estimatedDuration || null,
        targetPublishDate: result.data.targetPublishDate
          ? new Date(result.data.targetPublishDate)
          : null,
        videoUrl: result.data.videoUrl || null,
        thumbnailNotes: result.data.thumbnailNotes || null,
        wordCount: wordCount,
        updatedAt: new Date(),
      })
      .where(and(eq(scripts.id, scriptId), eq(scripts.userId, userId)))
      .returning();

    if (updateResult.length === 0) {
      return {
        error: "Script not found or you don't have permission to update it",
      };
    }

    revalidatePath("/");
    revalidatePath(`/scripts/${scriptId}`);
    return { success: true };
  } catch (error) {
    console.log("Failed to update script: ", error);
    return { error: "Failed to update script" };
  }
}

// Keep updateTask as alias for backward compatibility
export const updateTask = updateScript;

export async function deleteScript(scriptId: string) {
  try {
    const userId = await requireAuth();

    const result = await db
      .delete(scripts)
      .where(and(eq(scripts.id, scriptId), eq(scripts.userId, userId)))
      .returning();

    if (result.length === 0) {
      return {
        error: "Script not found or you don't have permission to delete it",
      };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Failed to delete script: ", error);
    return { error: "Failed to delete script" };
  }
}

// Keep deleteTask as alias for backward compatibility
export const deleteTask = deleteScript;

export async function updateScriptStatus(scriptId: string, status: ScriptStatus) {
  try {
    const userId = await requireAuth();

    const result = await db
      .update(scripts)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(and(eq(scripts.id, scriptId), eq(scripts.userId, userId)))
      .returning();

    if (result.length === 0) {
      return { error: "Script not found" };
    }

    revalidatePath("/");
    revalidatePath(`/scripts/${scriptId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update script status:", error);
    return { error: "Failed to update status" };
  }
}
