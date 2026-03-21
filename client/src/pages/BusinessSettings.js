import React, { useEffect, useState } from "react"
import { Save } from "lucide-react"
import { getBusinessSettings, updateBusinessSettings } from "../api/businessApi"

const defaultState = {
    businessName: "",
    phoneNumber: "",
    whatsappNumber: "",
    workingHours: {
        start: "09:00",
        end: "18:00",
        timezone: "Asia/Kolkata",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    },
    fee: 0,
    address: ""
}

const BusinessSettings = () => {
    const [form, setForm] = useState(defaultState)
    const [message, setMessage] = useState("")

    useEffect(() => {
        getBusinessSettings()
            .then((response) => {
                setForm({
                    ...defaultState,
                    ...response.data,
                    workingHours: {
                        ...defaultState.workingHours,
                        ...(response.data.workingHours || {})
                    }
                })
            })
            .catch(console.error)
    }, [])

    const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

    const updateWorkingHours = (field, value) => {
        setForm((current) => ({
            ...current,
            workingHours: {
                ...current.workingHours,
                [field]: value
            }
        }))
    }

    const submit = async () => {
        const response = await updateBusinessSettings(form)
        setForm({
            ...defaultState,
            ...response.data.businessSettings,
            workingHours: {
                ...defaultState.workingHours,
                ...(response.data.businessSettings.workingHours || {})
            }
        })
        setMessage("Business settings saved successfully.")
    }

    return (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="glass-card neon-border p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-white">Business profile</h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Configure the details used across bookings, fees, WhatsApp reminders, and your public-facing operations.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="label-shell">Business name</label>
                        <input className="input-shell" value={form.businessName} onChange={(e) => updateField("businessName", e.target.value)} />
                    </div>
                    <div>
                        <label className="label-shell">Phone number</label>
                        <input className="input-shell" value={form.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} />
                    </div>
                    <div>
                        <label className="label-shell">WhatsApp number</label>
                        <input className="input-shell" value={form.whatsappNumber} onChange={(e) => updateField("whatsappNumber", e.target.value)} />
                    </div>
                    <div>
                        <label className="label-shell">Default fee</label>
                        <input className="input-shell" type="number" value={form.fee} onChange={(e) => updateField("fee", e.target.value)} />
                    </div>
                    <div>
                        <label className="label-shell">Start hour</label>
                        <input className="input-shell" type="time" value={form.workingHours.start} onChange={(e) => updateWorkingHours("start", e.target.value)} />
                    </div>
                    <div>
                        <label className="label-shell">End hour</label>
                        <input className="input-shell" type="time" value={form.workingHours.end} onChange={(e) => updateWorkingHours("end", e.target.value)} />
                    </div>
                    <div>
                        <label className="label-shell">Timezone</label>
                        <input className="input-shell" value={form.workingHours.timezone} onChange={(e) => updateWorkingHours("timezone", e.target.value)} />
                    </div>
                    <div>
                        <label className="label-shell">Working days</label>
                        <input className="input-shell" value={form.workingHours.days.join(", ")} onChange={(e) => updateWorkingHours("days", e.target.value.split(",").map((item) => item.trim()).filter(Boolean))} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="label-shell">Address</label>
                        <textarea className="min-h-[130px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-emerald-200">{message}</p>
                    <button className="button-primary gap-2" onClick={submit}>
                        <Save className="h-4 w-4" />
                        Save business settings
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="soft-card p-6">
                    <h2 className="text-lg font-semibold text-white">Recommended setup</h2>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
                        <li>Use your payment-linked WhatsApp number for reminder delivery consistency.</li>
                        <li>Keep business fee aligned with appointment default pricing for cleaner revenue analytics.</li>
                        <li>Set working days precisely so future slot automation can enforce availability.</li>
                    </ul>
                </div>
                <div className="soft-card p-6">
                    <h2 className="text-lg font-semibold text-white">Notification routing</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        Confirmation and reminder previews use your saved WhatsApp number and appointment details from the backend profile service.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default BusinessSettings
