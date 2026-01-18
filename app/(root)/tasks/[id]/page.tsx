import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getTaskById } from "@/actions/tasks";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/ui/editor";
import { ArrowLeft, Pencil } from "lucide-react";
import { DeleteTaskButton } from "@/components/DeleteTaskButton";
import { format } from "date-fns";

export default async function ViewTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const task = await getTaskById(id);

  if (!task) {
    redirect("/");
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header name={session.user.name ?? "User"} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Tasks
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 wrap-break-word">
                {task.title}
              </h1>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <span>
                  Created: {format(new Date(task.createdAt), "MMM d, yyyy")}
                </span>
                {task.updatedAt && task.updatedAt !== task.createdAt && (
                  <span>
                    Updated: {format(new Date(task.updatedAt), "MMM d, yyyy")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border whitespace-nowrap ${getStatusColor(
                  task.status,
                )}`}
              >
                {getStatusLabel(task.status)}
              </span>
              <Link
                href={`/tasks/${task.id}/edit`}
                className="flex-1 sm:flex-initial"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full sm:w-auto"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </Link>
              <div className="flex-1 sm:flex-initial">
                <DeleteTaskButton taskId={task.id} />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Content
            </h2>
            {task.content ? (
              <Editor content={task.content} editable={false} />
            ) : (
              <p className="text-gray-400 italic">No content</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
