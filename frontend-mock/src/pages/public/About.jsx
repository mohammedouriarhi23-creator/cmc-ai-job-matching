import { Target, Eye, Users, GraduationCap, Building2, Briefcase } from "lucide-react"
import Card from "../../components/ui/Card"
import { filieres } from "../../data/filieres"
import { stats } from "../../data/stats"

const statIcons = { users: Users, "graduation-cap": GraduationCap, building: Building2, briefcase: Briefcase }

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#333333] via-[#1a4a54] to-[#3dabc4] py-16">
        <div className="container-page text-center">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
            À propos
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            La Cité des Métiers et des Compétences de l'Oriental
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Un établissement de nouvelle génération dédié à la formation professionnelle et à
            l'insertion durable des jeunes de la région de l'Oriental.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="p-8">
            <Target className="mb-4 text-[#bc0001]" size={30} />
            <h2 className="mb-3 text-xl font-bold text-[#333333]">Notre mission</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Former des profils qualifiés et directement opérationnels, en phase avec les besoins
              réels des entreprises de la région de l'Oriental, et faciliter leur insertion
              professionnelle grâce à un accompagnement personnalisé et à un réseau solide de
              partenaires économiques.
            </p>
          </Card>
          <Card className="p-8">
            <Eye className="mb-4 text-[#bc0001]" size={30} />
            <h2 className="mb-3 text-xl font-bold text-[#333333]">Notre vision</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Devenir un pôle de référence en formation professionnelle à l'échelle nationale,
              reconnu pour la qualité de ses lauréats et sa capacité à répondre aux mutations
              économiques et technologiques de demain.
            </p>
          </Card>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-[#333333]">La CMC en chiffres</h2>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = statIcons[stat.icon]
              return (
                <div key={stat.id} className="flex flex-col items-center gap-2 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ebfbff] text-[#3dabc4]">
                    <Icon size={24} />
                  </span>
                  <p className="text-3xl font-extrabold text-[#333333]">{stat.value}+</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-[#333333]">Nos filières & spécialités</h2>
          <p className="mt-2 text-gray-500">
            Des formations pensées pour répondre aux besoins des secteurs porteurs de la région.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filieres.map((f) => (
            <Card key={f.id} className="p-6">
              <h3 className="mb-3 font-bold text-[#333333]">{f.nom}</h3>
              <ul className="flex flex-col gap-1.5 text-sm text-gray-600">
                {f.specialites.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#bc0001]" />
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
