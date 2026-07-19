import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, Briefcase, ClipboardList, Download, LogOut, Plus, RefreshCw } from "lucide-react"

import Logo from "../../components/ui/Logo"
import Button from "../../components/ui/Button"
import Badge from "../../components/ui/Badge"
import { useAuth } from "../../context/auth"
import { applicationApi, companyApi, jobOfferApi, saveDownloadedFile } from "../../lib/api"

const EMPTY_COMPANY = {
  name: "", sector: "", city: "", email: "", phone: "", contact_name: "",
  website: "", description: "", status: "ACTIVE",
}
const EMPTY_OFFER = {
  title: "", company_id: "", description: "", requirements: "", location: "",
  contract_type: "", education_level: "", offer_type: "EMPLOYMENT",
  target_audience: "BOTH", work_mode: "ONSITE", number_of_positions: 1,
  required_skills: "", preferred_skills: "", application_deadline: "", status: "DRAFT",
}
const STATUS_LABELS = {
  SUBMITTED: "Envoyée", UNDER_REVIEW: "En analyse", SHORTLISTED: "Présélectionnée",
  INTERVIEW: "Entretien", ACCEPTED: "Acceptée", REJECTED: "Refusée", WITHDRAWN: "Retirée",
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState("companies")
  const [companies, setCompanies] = useState([])
  const [offers, setOffers] = useState([])
  const [applications, setApplications] = useState([])
  const [companyForm, setCompanyForm] = useState(EMPTY_COMPANY)
  const [offerForm, setOfferForm] = useState(EMPTY_OFFER)
  const [editingCompanyId, setEditingCompanyId] = useState(null)
  const [editingOfferId, setEditingOfferId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [companyData, offerData, applicationData] = await Promise.all([
        companyApi.adminList({ page_size: 100 }),
        jobOfferApi.adminList({ page_size: 100 }),
        applicationApi.adminList({ page_size: 100 }),
      ])
      setCompanies(companyData.items)
      setOffers(offerData.items)
      setApplications(applicationData.items)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  function notify(message) {
    setSuccess(message)
    setTimeout(() => setSuccess(""), 2500)
  }

  async function submitCompany(event) {
    event.preventDefault()
    setError("")
    try {
      const payload = Object.fromEntries(
        Object.entries(companyForm).map(([key, value]) => [key, value || null])
      )
      payload.name = companyForm.name
      payload.sector = companyForm.sector
      payload.city = companyForm.city
      payload.status = companyForm.status
      if (editingCompanyId) await companyApi.update(editingCompanyId, payload)
      else await companyApi.create(payload)
      setCompanyForm(EMPTY_COMPANY)
      setEditingCompanyId(null)
      notify(editingCompanyId ? "Entreprise mise à jour." : "Entreprise créée.")
      await loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  function editCompany(company) {
    setEditingCompanyId(company.id)
    setCompanyForm({
      name: company.name, sector: company.sector, city: company.city,
      email: company.email || "", phone: company.phone || "",
      contact_name: company.contact_name || "", website: company.website || "",
      description: company.description || "", status: company.status,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function removeCompany(company) {
    if (!window.confirm(`Supprimer ${company.name} ?`)) return
    try {
      await companyApi.remove(company.id)
      notify("Entreprise supprimée.")
      loadAll()
    } catch (err) { setError(err.message) }
  }

  async function submitOffer(event) {
    event.preventDefault()
    setError("")
    try {
      const payload = {
        ...offerForm,
        company_id: Number(offerForm.company_id),
        number_of_positions: Number(offerForm.number_of_positions),
        required_skills: offerForm.required_skills.split(",").map((item) => item.trim()).filter(Boolean),
        preferred_skills: offerForm.preferred_skills.split(",").map((item) => item.trim()).filter(Boolean),
        application_deadline: offerForm.application_deadline || null,
        location: offerForm.location || null,
        contract_type: offerForm.contract_type || null,
        education_level: offerForm.education_level || null,
        requirements: offerForm.requirements || null,
      }
      if (editingOfferId) await jobOfferApi.update(editingOfferId, payload)
      else await jobOfferApi.create(payload)
      setOfferForm(EMPTY_OFFER)
      setEditingOfferId(null)
      notify(editingOfferId ? "Offre mise à jour." : "Offre créée.")
      await loadAll()
    } catch (err) { setError(err.message) }
  }

  function editOffer(offer) {
    setEditingOfferId(offer.id)
    setOfferForm({
      title: offer.title,
      company_id: offer.company_id || "",
      description: offer.description || "",
      requirements: offer.requirements || "",
      location: offer.location || "",
      contract_type: offer.contract_type || "",
      education_level: offer.education_level || "",
      offer_type: offer.offer_type,
      target_audience: offer.target_audience,
      work_mode: offer.work_mode,
      number_of_positions: offer.number_of_positions,
      required_skills: (offer.required_skills || []).join(", "),
      preferred_skills: (offer.preferred_skills || []).join(", "),
      application_deadline: offer.application_deadline || "",
      status: offer.status,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function offerAction(action, offer) {
    try {
      if (action === "publish") await jobOfferApi.publish(offer.id)
      if (action === "archive") await jobOfferApi.archive(offer.id)
      if (action === "delete") {
        if (!window.confirm(`Supprimer l'offre « ${offer.title} » ?`)) return
        await jobOfferApi.remove(offer.id)
      }
      notify("Offre mise à jour.")
      loadAll()
    } catch (err) { setError(err.message) }
  }

  async function changeApplicationStatus(application, status) {
    const note = window.prompt("Note administrative (facultative) :", application.admin_note || "")
    if (note === null) return
    try {
      await applicationApi.updateStatus(application.id, status, note)
      notify("Statut de la candidature mis à jour.")
      loadAll()
    } catch (err) { setError(err.message) }
  }

  async function downloadApplicationCv(application) {
    try {
      const blob = await applicationApi.downloadCv(application.id)
      saveDownloadedFile(blob, application.cv_file_name || `cv-candidature-${application.id}.pdf`)
    } catch (err) { setError(err.message) }
  }

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
        <Logo />
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="hidden sm:inline">{user?.email}</span>
          <button onClick={handleLogout} className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5">
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administration CMC</h1>
            <p className="text-sm text-gray-500">Entreprises, offres et candidatures réelles.</p>
          </div>
          <Button variant="outline" onClick={loadAll}><RefreshCw size={15} />Actualiser</Button>
        </div>
        {error && <p className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {success && <p className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">{success}</p>}

        <div className="mb-7 flex flex-wrap gap-2">
          <Tab active={tab === "companies"} onClick={() => setTab("companies")} icon={Building2} label={`Entreprises (${companies.length})`} />
          <Tab active={tab === "offers"} onClick={() => setTab("offers")} icon={Briefcase} label={`Offres (${offers.length})`} />
          <Tab active={tab === "applications"} onClick={() => setTab("applications")} icon={ClipboardList} label={`Candidatures (${applications.length})`} />
        </div>

        {loading ? <p className="py-20 text-center text-gray-500">Chargement...</p> : null}
        {!loading && tab === "companies" && (
          <CompaniesPanel
            companies={companies} form={companyForm} setForm={setCompanyForm}
            editingId={editingCompanyId} setEditingId={setEditingCompanyId}
            onSubmit={submitCompany} onEdit={editCompany} onRemove={removeCompany}
          />
        )}
        {!loading && tab === "offers" && (
          <OffersPanel
            companies={companies} offers={offers} form={offerForm} setForm={setOfferForm}
            editingId={editingOfferId} setEditingId={setEditingOfferId}
            onSubmit={submitOffer} onEdit={editOffer} onAction={offerAction}
          />
        )}
        {!loading && tab === "applications" && (
          <ApplicationsPanel applications={applications} onStatus={changeApplicationStatus} onDownloadCv={downloadApplicationCv} />
        )}
      </main>
    </div>
  )
}

function Tab({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${active ? "bg-[#3dabc4] text-white" : "border bg-white text-gray-600"}`}>
      <Icon size={16} />{label}
    </button>
  )
}

function CompaniesPanel({ companies, form, setForm, editingId, setEditingId, onSubmit, onEdit, onRemove }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <form onSubmit={onSubmit} className="h-fit rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold">{editingId ? "Modifier l'entreprise" : "Nouvelle entreprise"}</h2>
        <Field label="Nom *" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
        <Field label="Secteur *" value={form.sector} onChange={(value) => setForm({ ...form, sector: value })} required />
        <Field label="Ville *" value={form.city} onChange={(value) => setForm({ ...form, city: value })} required />
        <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
        <Field label="Téléphone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
        <Field label="Contact" value={form.contact_name} onChange={(value) => setForm({ ...form, contact_name: value })} />
        <label className="mb-3 block text-sm">Statut
          <select className="mt-1 w-full rounded-lg border p-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="PENDING">En attente</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
          </select>
        </label>
        <label className="mb-4 block text-sm">Description
          <textarea rows={3} className="mt-1 w-full rounded-lg border p-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </label>
        <div className="flex gap-2">
          <Button type="submit"><Plus size={15} />{editingId ? "Enregistrer" : "Ajouter"}</Button>
          {editingId && <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setForm(EMPTY_COMPANY) }}>Annuler</Button>}
        </div>
      </form>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-3">Entreprise</th><th className="p-3">Ville</th><th className="p-3">Statut</th><th className="p-3">Actions</th></tr></thead>
          <tbody className="divide-y">{companies.map((company) => <tr key={company.id}><td className="p-3"><b>{company.name}</b><br/><span className="text-xs text-gray-500">{company.sector}</span></td><td className="p-3">{company.city}</td><td className="p-3"><Badge color={company.status === "ACTIVE" ? "green" : "gray"}>{company.status}</Badge></td><td className="p-3"><button className="mr-3 text-[#3dabc4]" onClick={() => onEdit(company)}>Modifier</button><button className="text-red-600" onClick={() => onRemove(company)}>Supprimer</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}

function OffersPanel({ companies, offers, form, setForm, editingId, setEditingId, onSubmit, onEdit, onAction }) {
  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold">{editingId ? "Modifier l'offre" : "Nouvelle offre"}</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Titre *" value={form.title} onChange={(value) => setForm({ ...form, title: value })} required />
          <label className="text-sm">Entreprise *<select required className="mt-1 w-full rounded-lg border p-2" value={form.company_id} onChange={(event) => setForm({ ...form, company_id: event.target.value })}><option value="">Sélectionner</option>{companies.filter((company) => company.status !== "INACTIVE").map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></label>
          <Field label="Localisation" value={form.location} onChange={(value) => setForm({ ...form, location: value })} />
          <Field label="Contrat" value={form.contract_type} onChange={(value) => setForm({ ...form, contract_type: value })} />
          <Field label="Niveau de formation" value={form.education_level} onChange={(value) => setForm({ ...form, education_level: value })} />
          <Field label="Nombre de postes" type="number" value={form.number_of_positions} onChange={(value) => setForm({ ...form, number_of_positions: value })} />
          <SelectField label="Type" value={form.offer_type} values={["INTERNSHIP", "PFE", "EMPLOYMENT"]} onChange={(value) => setForm({ ...form, offer_type: value })} />
          <SelectField label="Public" value={form.target_audience} values={["STAGIAIRE", "LAUREAT", "BOTH"]} onChange={(value) => setForm({ ...form, target_audience: value })} />
          <SelectField label="Mode" value={form.work_mode} values={["ONSITE", "REMOTE", "HYBRID"]} onChange={(value) => setForm({ ...form, work_mode: value })} />
          <Field label="Compétences obligatoires (virgules)" value={form.required_skills} onChange={(value) => setForm({ ...form, required_skills: value })} />
          <Field label="Compétences souhaitées (virgules)" value={form.preferred_skills} onChange={(value) => setForm({ ...form, preferred_skills: value })} />
          <Field label="Date limite" type="date" value={form.application_deadline} onChange={(value) => setForm({ ...form, application_deadline: value })} />
        </div>
        <label className="mt-3 block text-sm">Description *<textarea required minLength={10} rows={4} className="mt-1 w-full rounded-lg border p-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })}/></label>
        <label className="mt-3 block text-sm">Profil recherché<textarea rows={3} className="mt-1 w-full rounded-lg border p-2" value={form.requirements} onChange={(event) => setForm({ ...form, requirements: event.target.value })}/></label>
        <div className="mt-4 flex gap-2"><Button type="submit"><Plus size={15}/>{editingId ? "Enregistrer" : "Créer"}</Button>{editingId && <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setForm(EMPTY_OFFER) }}>Annuler</Button>}</div>
      </form>
      <div className="overflow-x-auto rounded-xl border bg-white"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-3">Offre</th><th className="p-3">Entreprise</th><th className="p-3">Statut</th><th className="p-3">Candidatures</th><th className="p-3">Actions</th></tr></thead><tbody className="divide-y">{offers.map((offer) => <tr key={offer.id}><td className="p-3"><b>{offer.title}</b><br/><span className="text-xs text-gray-500">{offer.offer_type} · {offer.target_audience}</span></td><td className="p-3">{offer.company_name}</td><td className="p-3"><Badge color={offer.status === "PUBLISHED" ? "green" : "gray"}>{offer.status}</Badge></td><td className="p-3">{offer.application_count}</td><td className="p-3 whitespace-nowrap"><button className="mr-2 text-[#3dabc4]" onClick={() => onEdit(offer)}>Modifier</button>{offer.status !== "PUBLISHED" && <button className="mr-2 text-green-700" onClick={() => onAction("publish", offer)}>Publier</button>}<button className="mr-2 text-amber-700" onClick={() => onAction("archive", offer)}>Archiver</button><button className="text-red-600" onClick={() => onAction("delete", offer)}>Supprimer</button></td></tr>)}</tbody></table></div>
    </div>
  )
}

function ApplicationsPanel({ applications, onStatus, onDownloadCv }) {
  return <div className="overflow-x-auto rounded-xl border bg-white"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-3">Candidat</th><th className="p-3">Offre</th><th className="p-3">CV</th><th className="p-3">Statut</th><th className="p-3">Action suivante</th></tr></thead><tbody className="divide-y">{applications.map((application) => <tr key={application.id}><td className="p-3"><b>{application.candidate?.first_name} {application.candidate?.last_name}</b><br/><span className="text-xs text-gray-500">{application.candidate?.email} · {application.candidate?.candidate_type}</span></td><td className="p-3">{application.offer?.title}<br/><span className="text-xs text-gray-500">{application.offer?.company_name}</span></td><td className="p-3"><button className="inline-flex items-center gap-1 text-[#3dabc4]" onClick={() => onDownloadCv(application)}><Download size={14}/>Télécharger</button></td><td className="p-3"><Badge color="blue">{STATUS_LABELS[application.status] || application.status}</Badge></td><td className="p-3"><select className="rounded-lg border p-2 text-sm" defaultValue="" disabled={!application.allowed_statuses?.length} onChange={(event) => { if (event.target.value) onStatus(application, event.target.value); event.target.value = "" }}><option value="">Changer le statut</option>{application.allowed_statuses?.map((status) => <option key={status} value={status}>{STATUS_LABELS[status] || status}</option>)}</select></td></tr>)}</tbody></table></div>
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return <label className="mb-3 block text-sm">{label}<input type={type} required={required} className="mt-1 w-full rounded-lg border p-2" value={value} onChange={(event) => onChange(event.target.value)} /></label>
}

function SelectField({ label, value, values, onChange }) {
  return <label className="text-sm">{label}<select className="mt-1 w-full rounded-lg border p-2" value={value} onChange={(event) => onChange(event.target.value)}>{values.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
}
