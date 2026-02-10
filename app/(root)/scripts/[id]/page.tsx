import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getTaskById } from "@/actions/scripts";
import ViewScript from "@/components/scripts/ViewScript";

export default async function ViewScriptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const script = await getTaskById(id);

  if (!script) {
    redirect("/");
  }

  return <ViewScript script={script} userName={session.user.name || "User"} />;
}
