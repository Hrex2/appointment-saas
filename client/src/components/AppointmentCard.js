import React from "react"
import { Clock3, IndianRupee, Phone, Tag } from "lucide-react"

const statusTone = {
    pending: "bg-amber-400/10 text-amber-200 border-amber-400/20",
    confirmed: "bg-cyan-400/10 text-cyan-200 border-cyan-400/20",
    completed: "bg-emerald-400/10 text-emerald-200 border-emerald-400/20",
    cancelled: "bg-pink-400/10 text-pink-200 border-pink-400/20",
    "no-show": "bg-violet-400/10 text-violet-200 border-violet-400/20",
    booked: "bg-cyan-400/10 text-cyan-200 border-cyan-400/20",
    changed: "bg-purple-400/10 text-purple-200 border-purple-400/20"
}

const AppointmentCard = ({ appointment, onEdit, onDelete }) => {
    return (
        <div className="soft-card p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{appointment.name}</h3>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${statusTone[appointment.status] || statusTone.pending}`}>
                            {appointment.status}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">Code: {appointment.appointmentCode || appointment.id}</p>
                </div>

                <div className="flex gap-2">
                    <button className="button-secondary px-4 py-2 text-xs" onClick={() => onEdit?.(appointment)}>Update</button>
                    <button className="button-danger px-4 py-2 text-xs" onClick={() => onDelete?.(appointment)}>Delete</button>
                </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-slate-300 md:grid-cols-2 xl:grid-cols-4">
                <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-cyan-300" />
                    <span>{appointment.date} at {appointment.time}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-cyan-300" />
                    <span>{appointment.customerPhone || "No phone saved"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-cyan-300" />
                    <span>{appointment.service || "Consultation"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-cyan-300" />
                    <span>{appointment.fee || 0}</span>
                </div>
            </div>

            {appointment.notes && (
                <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-300">
                    {appointment.notes}
                </p>
            )}
        </div>
    )
}

export default AppointmentCard
