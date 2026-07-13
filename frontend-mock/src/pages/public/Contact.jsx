import { useState } from "react"
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react"
import Card from "../../components/ui/Card"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

export default function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" })
  const [envoye, setEnvoye] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setEnvoye(true)
    setForm({ nom: "", email: "", sujet: "", message: "" })
  }

  return (
    <div className="container-page py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-[#333333]">Contactez-nous</h1>
        <p className="mt-2 text-gray-500">
          Une question sur la plateforme ou sur nos formations ? Écrivez-nous.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Card className="flex items-start gap-3 p-5">
            <MapPin className="mt-0.5 shrink-0 text-[#bc0001]" size={20} />
            <div>
              <p className="font-semibold text-[#333333]">Adresse</p>
              <p className="text-sm text-gray-500">Route de l'Avenir, Maroc</p>
            </div>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <Phone className="mt-0.5 shrink-0 text-[#bc0001]" size={20} />
            <div>
              <p className="font-semibold text-[#333333]">Téléphone</p>
              <p className="text-sm text-gray-500">+212 500 000 000</p>
            </div>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <Mail className="mt-0.5 shrink-0 text-[#bc0001]" size={20} />
            <div>
              <p className="font-semibold text-[#333333]">Email</p>
              <p className="text-sm text-gray-500">contact@cmc.ma</p>
            </div>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <Clock className="mt-0.5 shrink-0 text-[#bc0001]" size={20} />
            <div>
              <p className="font-semibold text-gray-900">Horaires</p>
              <p className="text-sm text-gray-500">Lun. - Ven. : 8h30 - 17h30</p>
            </div>
          </Card>

          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-100 text-sm text-gray-400">
            Carte (placeholder)
          </div>
        </div>

        <Card className="p-7 lg:col-span-2">
          {envoye && (
            <div className="mb-6 flex items-center gap-2.5 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              <CheckCircle2 size={18} />
              Votre message a bien été envoyé. Nous vous répondrons rapidement.
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Nom complet"
              id="nom"
              name="nom"
              required
              value={form.nom}
              onChange={handleChange}
              placeholder="Votre nom"
            />
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="vous@exemple.com"
            />
            <div className="sm:col-span-2">
              <Input
                label="Sujet"
                id="sujet"
                name="sujet"
                required
                value={form.sujet}
                onChange={handleChange}
                placeholder="Objet de votre message"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Votre message..."
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-[#333333] placeholder:text-gray-400 focus:border-[#3dabc4] focus:outline-none focus:ring-2 focus:ring-[#3dabc4]/20"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="accent">
                Envoyer le message
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
