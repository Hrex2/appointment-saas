import React, { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import AppointmentCard from "../components/AppointmentCard"
import AppointmentForm, { createEmptyAppointmentForm } from "../components/AppointmentForm"
import { createAppointment, deleteAppointment, listAppointments, updateAppointment } from "../api/appointmentApi"

const filters = [
    { label: "Today", value: "today" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" },
    { label: "All", value: "all" }
]

const AppointmentSettings = () => {
    const [appointments, setAppointments] = useState([])
    const [search, setSearch] = useState("")
    const [scope, setScope] = useState("upcoming")
    const [createForm, setCreateForm] = useState(createEmptyAppointmentForm())
    const [editForm, setEditForm] = useState(createEmptyAppointmentForm())
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const loadAppointments = async () => {
        const response = await listAppointments({
            scope,
            search: search || undefined
        })
        setAppointments(response.data)
    }

    useEffect(() => {
        loadAppointments().catch(console.error)
    }, [scope])

    const summary = useMemo(() => ({
        total: appointments.length,
        pending: appointments.filter((appointment) => appointment.status === "pending").length,
        confirmed: appointments.filter((appointment) => appointment.status === "confirmed").length,
        cancelled: appointments.filter((appointment) => appointment.status === "cancelled").length
    }), [appointments])

    const handleCreate = async () => {
        setLoading(true)
        try {
            await createAppointment({
                ...createForm,
                fee: Number(createForm.fee || 0),
                durationMinutes: Number(createForm.durationMinutes || 30)
            })
            setCreateForm(createEmptyAppointmentForm())
            setMessage("Appointment created successfully.")
            await loadAppointments()
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async () => {
        if (!editForm.id) {
            setMessage("Enter an appointment code or select a card to edit.")
            return
        }

        setLoading(true)
        try {
            await updateAppointment(editForm.id, {
                ...editForm,
                fee: Number(editForm.fee || 0),
                durationMinutes: Number(editForm.durationMinutes || 30)
            })
            setMessage("Appointment updated successfully.")
            setEditForm(createEmptyAppointmentForm())
            await loadAppointments()
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (appointment) => {
        await deleteAppointment(appointment.appointmentCode || appointment.id)
        setMessage("Appointment cancelled successfully.")
        await loadAppointments()
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
                <div className="soft-card p-5">
                    <p className="text-sm text-slate-400">Visible appointments</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{summary.total}</p>
                </div>
                <div className="soft-card p-5">
                    <p className="text-sm text-slate-400">Pending</p>
                    <p className="mt-3 text-3xl font-semibold text-amber-200">{summary.pending}</p>
                </div>
                <div className="soft-card p-5">
                    <p className="text-sm text-slate-400">Confirmed</p>
                    <p className="mt-3 text-3xl font-semibold text-cyan-200">{summary.confirmed}</p>
                </div>
                <div className="soft-card p-5">
                    <p className="text-sm text-slate-400">Cancelled</p>
                    <p className="mt-3 text-3xl font-semibold text-pink-200">{summary.cancelled}</p>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <AppointmentForm
                    value={createForm}
                    onChange={setCreateForm}
                    onSubmit={handleCreate}
                    loading={loading}
                    submitLabel="Create appointment"
                />
                <AppointmentForm
                    value={editForm}
                    onChange={setEditForm}
                    onSubmit={handleUpdate}
                    loading={loading}
                    submitLabel="Update appointment"
                    mode="update"
                />
            </div>

            <section className="glass-card p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Search, filter, update, and delete</h2>
                        <p className="mt-2 text-sm text-slate-400">Everything from your appointment control panel stays in one place.</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            <Search className="h-4 w-4 text-slate-500" />
                            <input
                                className="bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, phone, or code"
                            />
                        </div>
                        <button className="button-secondary" onClick={loadAppointments}>Search</button>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    {filters.map((filter) => (
                        <button
                            key={filter.value}
                            className={scope === filter.value ? "button-primary" : "button-secondary"}
                            onClick={() => setScope(filter.value)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {message && (
                    <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                        {message}
                    </div>
                )}

                <div className="mt-6 space-y-4">
                    {appointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            onDelete={handleDelete}
                            onEdit={(item) => setEditForm({
                                id: item.appointmentCode || item.id,
                                name: item.name,
                                customerPhone: item.customerPhone || "",
                                date: item.date,
                                time: item.time,
                                durationMinutes: item.durationMinutes || 30,
                                fee: item.fee || 0,
                                service: item.service || "Consultation",
                                status: item.status,
                                notes: item.notes || ""
                            })}
                        />
                    ))}
                </div>
            </section>
        </div>
    )
}

export default AppointmentSettings
