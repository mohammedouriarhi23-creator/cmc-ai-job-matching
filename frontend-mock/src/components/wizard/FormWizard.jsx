import { useState } from "react"
import Stepper from "./Stepper"
import WizardFooter from "./WizardFooter"

function stripFiles(value) {
  if (Array.isArray(value)) return value.map(stripFiles)
  if (value && typeof value === "object") {
    if ("file" in value && "name" in value && "size" in value) {
      const { file, ...meta } = value
      return { ...meta, stale: true }
    }
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, stripFiles(val)]))
  }
  return value
}

function loadPersisted(storageKey, steps) {
  const defaults = Object.fromEntries(steps.map((step) => [step.id, step.initial]))
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return { data: defaults, stepIndex: 0, completedSteps: [] }
    const parsed = JSON.parse(raw)
    const data = { ...defaults }
    for (const step of steps) {
      data[step.id] = { ...step.initial, ...(parsed.data?.[step.id] || {}) }
    }
    const stepIndex = Math.min(Math.max(parsed.stepIndex || 0, 0), steps.length - 1)
    return { data, stepIndex, completedSteps: parsed.completedSteps || [] }
  } catch {
    return { data: defaults, stepIndex: 0, completedSteps: [] }
  }
}

export default function FormWizard({ steps, storageKey, title, onSubmit }) {
  const [{ data: initialData, stepIndex: initialStepIndex, completedSteps: initialCompleted }] = useState(() =>
    loadPersisted(storageKey, steps)
  )
  const [stepIndex, setStepIndex] = useState(initialStepIndex)
  const [data, setData] = useState(initialData)
  const [completedSteps, setCompletedSteps] = useState(new Set(initialCompleted))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  // Champs pré-remplis depuis l'extraction de CV, tant qu'ils n'ont pas été
  // modifiés manuellement. Clé = "stepId:champ".
  const [extractedFields, setExtractedFields] = useState(new Set())

  const currentStep = steps[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === steps.length - 1

  function persist(nextData, nextStepIndex, nextCompleted) {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          data: stripFiles(nextData),
          stepIndex: nextStepIndex,
          completedSteps: Array.from(nextCompleted),
        })
      )
    } catch {
      // localStorage indisponible ou quota dépassé : la persistance est un confort, pas un pré-requis
    }
  }

  function updateStepData(patch) {
    setData((prev) => {
      const next = { ...prev, [currentStep.id]: { ...prev[currentStep.id], ...patch } }
      persist(next, stepIndex, completedSteps)
      return next
    })
    // Une modification manuelle efface le badge "extrait du CV" du champ touché.
    setExtractedFields((prev) => {
      const next = new Set(prev)
      for (const field of Object.keys(patch)) next.delete(`${currentStep.id}:${field}`)
      return next
    })
  }

  // Applique un patch d'extraction de CV sur plusieurs étapes à la fois
  // (ex: identité + formation + compétences en un seul geste).
  function applyExtraction(patchByStepId) {
    setData((prev) => {
      const next = { ...prev }
      for (const [stepId, patch] of Object.entries(patchByStepId)) {
        next[stepId] = { ...next[stepId], ...patch }
      }
      persist(next, stepIndex, completedSteps)
      return next
    })
    setExtractedFields((prev) => {
      const next = new Set(prev)
      for (const [stepId, patch] of Object.entries(patchByStepId)) {
        for (const field of Object.keys(patch)) next.add(`${stepId}:${field}`)
      }
      return next
    })
  }

  function goToStep(index) {
    setStepIndex(index)
    persist(data, index, completedSteps)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const stepErrors = currentStep.validate(data[currentStep.id], data) || {}
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length > 0) return

    const nextCompleted = new Set(completedSteps).add(stepIndex)
    setCompletedSteps(nextCompleted)

    if (!isLast) {
      const nextIndex = stepIndex + 1
      setStepIndex(nextIndex)
      setErrors({})
      persist(data, nextIndex, nextCompleted)
      return
    }

    setSubmitError("")
    setSubmitting(true)
    try {
      await onSubmit(data)
      localStorage.removeItem(storageKey)
    } catch (err) {
      setSubmitError(err.message || "Une erreur est survenue. Réessayez.")
    } finally {
      setSubmitting(false)
    }
  }

  const StepComponent = currentStep.Component
  const extractedFieldNames = new Set(
    Array.from(extractedFields)
      .filter((key) => key.startsWith(`${currentStep.id}:`))
      .map((key) => key.slice(currentStep.id.length + 1))
  )

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-[#333333]">{title}</h1>
      <p className="mb-6 text-sm text-gray-500">Les champs marqués * sont obligatoires.</p>

      <Stepper steps={steps} currentIndex={stepIndex} completedSteps={completedSteps} onStepClick={goToStep} />

      <form onSubmit={handleSubmit} noValidate>
        <StepComponent
          value={data[currentStep.id]}
          onChange={updateStepData}
          errors={errors}
          allData={data}
          applyExtraction={applyExtraction}
          extractedFieldNames={extractedFieldNames}
        />

        {submitError && (
          <p className="mt-6 rounded-lg bg-[#fdecee] px-3.5 py-2.5 text-sm font-medium text-[#bc0001]">
            {submitError}
          </p>
        )}

        <WizardFooter
          isFirst={isFirst}
          isLast={isLast}
          submitting={submitting}
          onPrevious={() => goToStep(stepIndex - 1)}
        />
      </form>
    </div>
  )
}
