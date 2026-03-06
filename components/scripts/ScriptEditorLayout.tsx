import { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ScriptEditorLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  header: ReactNode;
}

export function ScriptEditorLayout({
  children,
  sidebar,
  header,
}: ScriptEditorLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header Area */}
      <header className="border-b bg-white px-4 sm:px-6 lg:px-8 py-3 shrink-0">
        {header}
      </header>

      {/* Main Content Area - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor (Left/Center) */}
        <main className="flex-1 flex flex-col min-w-0 bg-gray-50/50">
          <ScrollArea className="flex-1 h-full">
            <div className="max-w-3xl mx-auto px-6 py-8">{children}</div>
          </ScrollArea>
        </main>

        <Separator orientation="vertical" className="w-px" />

        {/* Sidebar (Right) - Metadata */}
        <aside className="w-87.5 bg-gray-50 flex flex-col border-l shrink-0">
          <div className="p-4 border-b bg-gray-50/50 font-medium text-sm text-gray-500 uppercase tracking-wider">
            Video Details
          </div>
          <ScrollArea className="flex-1 overflow-auto">
            <div className="p-4 space-y-6">{sidebar}</div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}
