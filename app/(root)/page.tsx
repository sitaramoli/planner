import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getTasks } from "@/actions/tasks";
import { Header } from "@/components/Header";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const tasks = await getTasks();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header name={session.user.name ?? "User"} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              My Tasks
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {tasks.length === 0
                ? "No tasks yet"
                : `${tasks.length} task${tasks.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <Link href="/tasks/new" className="w-full sm:w-auto">
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </Link>
        </div>

        {tasks.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4 text-lg">
                No tasks yet. Create your first task to get started!
              </p>
              <Link href="/tasks/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Task
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
