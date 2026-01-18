"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Eye } from "lucide-react";
import { DeleteTaskButton } from "@/components/DeleteTaskButton";
import type { Task } from "@/db/schema";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "NEW":
        return "New";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  // Truncate content for preview
  const contentPreview = task.content
    ? task.content.replace(/<[^>]*>/g, "").substring(0, 150)
    : "";

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow cursor-pointer group">
      <Link href={`/tasks/${task.id}`}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <CardTitle className="text-base sm:text-lg group-hover:text-black transition-colors wrap-break-word flex-1 min-w-0">
              {task.title}
            </CardTitle>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap shrink-0 ${getStatusColor(
                task.status,
              )}`}
            >
              {getStatusLabel(task.status)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="grow">
          {contentPreview ? (
            <p className="text-sm text-gray-600 line-clamp-3">
              {contentPreview}
              {contentPreview.length >= 150 && "..."}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">No content</p>
          )}
        </CardContent>
      </Link>
      <CardFooter className="flex flex-wrap justify-end gap-2 pt-4">
        <Link href={`/tasks/${task.id}`} className="flex-1 sm:flex-initial">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Eye className="h-4 w-4 sm:mr-0" />
            <span className="hidden sm:inline ml-2">View</span>
          </Button>
        </Link>
        <Link
          href={`/tasks/${task.id}/edit`}
          className="flex-1 sm:flex-initial"
        >
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Pencil className="h-4 w-4 sm:mr-0" />
            <span className="hidden sm:inline ml-2">Edit</span>
          </Button>
        </Link>
        <div className="flex-1 sm:flex-initial">
          <DeleteTaskButton taskId={task.id} />
        </div>
      </CardFooter>
    </Card>
  );
}
