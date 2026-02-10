import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getTaskById } from "@/actions/scripts";
import { ScriptForm } from "@/components/scripts/ScriptForm";

export default async function EditTaskPage({
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

  return <ScriptForm task={task} />;
}
