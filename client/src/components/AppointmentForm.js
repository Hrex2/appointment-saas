import React from "react"

const defaultForm = {
    id: "",
    name: "",
    customerPhone: "",
    date: "",
    time: "",
    durationMinutes: 30,
    fee: 0,
    service: "Consultation",
    status: "confirmed",
    notes: ""
}

export const createEmptyAppointmentForm = () => ({ ...defaultForm })

const AppointmentForm = ({ value, onChange, onSubmit, loading, submitLabel, mode = "create" }) => {
    const setField = (field, fieldValue) => {
        onChange({
            ...value,
            [field]: fieldValue
        })
    }

    return (
        <form
            className="glass-card neon-border p-6"
            onSubmit={(event) => {
                event.preventDefault()
                onSubmit()
            }}
        >
            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className="label-shell">Customer name</label>
                    <input className="input-shell" value={value.name} onChange={(e) => setField("name", e.target.value)} placeholder="Aarav Sharma" />
                </div>
                <div>
                    <label className="label-shell">Phone number</label>
                    <input className="input-shell" value={value.customerPhone} onChange={(e) => setField("customerPhone", e.target.value)} placeholder="+91 98765 43210" />
                </div>
                <div>
                    <label className="label-shell">Date</label>
                    <input className="input-shell" type="date" value={value.date} onChange={(e) => setField("date", e.target.value)} />
                </div>
                <div>
                    <label className="label-shell">Time</label>
                    <input className="input-shell" type="time" value={value.time} onChange={(e) => setField("time", e.target.value)} />
                </div>
                <div>
                    <label className="label-shell">Service</label>
                    <input className="input-shell" value={value.service} onChange={(e) => setField("service", e.target.value)} placeholder="Dental cleaning" />
                </div>
                <div>
                    <label className="label-shell">Fee</label>
                    <input className="input-shell" type="number" min="0" value={value.fee} onChange={(e) => setField("fee", e.target.value)} placeholder="1500" />
                </div>
                <div>
                    <label className="label-shell">Duration (minutes)</label>
                    <input className="input-shell" type="number" min="15" step="15" value={value.durationMinutes} onChange={(e) => setField("durationMinutes", e.target.value)} />
                </div>
                <div>
                    <label className="label-shell">Status</label>
                    <select className="select-shell" value={value.status} onChange={(e) => setField("status", e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no-show">No-show</option>
                    </select>
                </div>
                {mode === "update" && (
                    <div className="md:col-span-2">
                        <label className="label-shell">Appointment code or id</label>
                        <input className="input-shell" value={value.id} onChange={(e) => setField("id", e.target.value)} placeholder="626554" />
                    </div>
                )}
                <div className="md:col-span-2">
                    <label className="label-shell">Notes</label>
                    <textarea className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20" value={value.notes} onChange={(e) => setField("notes", e.target.value)} placeholder="Add visit details, reminders, or special requests" />
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-sm text-slate-400">
                    {mode === "create"
                        ? "Double-booking protection runs automatically on save."
                        : "Updates preserve slot protection and customer history."}
                </p>
                <button className="button-primary" disabled={loading} type="submit">
                    {loading ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    )
}

export default AppointmentForm
