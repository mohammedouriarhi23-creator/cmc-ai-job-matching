import { Bell, BellDot } from "lucide-react"
import Card from "../../../components/ui/Card"
import { notificationsLaureat } from "../../../data/notifications"

export default function Notifications() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900">Notifications</h1>
      <p className="mb-6 text-sm text-gray-500">Restez informé de l'évolution de vos candidatures.</p>

      <div className="flex flex-col gap-3">
        {notificationsLaureat.map((n) => (
          <Card
            key={n.id}
            className={`flex items-start gap-4 p-5 ${!n.lue ? "border-l-4 border-l-accent-500" : ""}`}
          >
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                n.lue ? "bg-gray-100 text-gray-400" : "bg-accent-50 text-accent-500"
              }`}
            >
              {n.lue ? <Bell size={16} /> : <BellDot size={16} />}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-gray-900">{n.titre}</p>
                <span className="shrink-0 text-xs text-gray-400">
                  {new Date(n.date).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{n.message}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
