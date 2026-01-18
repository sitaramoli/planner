"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTask } from "@/actions/tasks";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Editor } from "@/components/ui/editor";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function NewTaskPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "NEW",
    },
  });

  const status = watch("status");

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", content);
      formData.append("status", data.status);

      const result = await createTask(formData);
      if (result.success) {
        toast.success("Task created successfully");
        router.push("/");
      } else {
        toast.error(result.error || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task: ", error);
      toast.error("An error occurred while creating the task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header name={session?.user?.name ?? "User"} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Tasks
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create New Task
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Fill in the details below to create a new task
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter task title"
              className={errors.title ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setValue("status", value as TaskFormData["status"])
              }
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Editor
              content={content}
              onChange={setContent}
              placeholder="Write your content here..."
              editable={!isSubmitting}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
