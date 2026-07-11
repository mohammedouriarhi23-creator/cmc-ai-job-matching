import Sidebar from "./Sidebar";

export default function DashboardShell({ role, title, subtitle, children }: { role: "candidate" | "admin"; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={role} />
      <main className="lg:ml-72">
        <header className="border-b border-gray-100 bg-white px-6 py-5 lg:px-8">
          <h1 className="text-2xl font-extrabold text-cmc-navy">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </header>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
