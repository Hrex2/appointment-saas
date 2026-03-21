import React, { useEffect, useMemo, useState } from "react"
import { addDays, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek } from "../utils/dateUtils"
import { listAppointments } from "../api/appointmentApi"

const CalendarView = () => {
    const [appointments, setAppointments] = useState([])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [mode, setMode] = useState("month")

    useEffect(() => {
        listAppointments().then((response) => setAppointments(response.data)).catch(console.error)
    }, [])

    const calendarDays = useMemo(() => {
        if (mode === "week") {
            const start = startOfWeek(currentDate)
            return Array.from({ length: 7 }, (_, index) => addDays(start, index))
        }

        const start = startOfWeek(startOfMonth(currentDate))
        const end = endOfWeek(endOfMonth(currentDate))
        const days = []
        let cursor = start

        while (cursor <= end) {
            days.push(cursor)
            cursor = addDays(cursor, 1)
        }

        return days
    }, [currentDate, mode])

    const appointmentsForSelectedDate = useMemo(
        () => appointments.filter((appointment) => isSameDay(parseISO(appointment.date), selectedDate)),
        [appointments, selectedDate]
    )

    const getDayAppointments = (date) =>
        appointments.filter((appointment) => isSameDay(parseISO(appointment.date), date))

    return (
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.8fr]">
            <div className="glass-card neon-border p-6">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">Calendar view</h1>
                        <p className="mt-2 text-sm text-slate-400">Switch between month and week views and inspect appointments visually.</p>
                    </div>

                    <div className="flex gap-3">
                        <button className="button-secondary" onClick={() => setCurrentDate(addDays(currentDate, mode === "week" ? -7 : -30))}>Previous</button>
                        <button className="button-secondary" onClick={() => setCurrentDate(new Date())}>Today</button>
                        <button className="button-secondary" onClick={() => setCurrentDate(addDays(currentDate, mode === "week" ? 7 : 30))}>Next</button>
                    </div>
                </div>

                <div className="mb-5 flex gap-3">
                    <button className={mode === "month" ? "button-primary" : "button-secondary"} onClick={() => setMode("month")}>Monthly</button>
                    <button className={mode === "week" ? "button-primary" : "button-secondary"} onClick={() => setMode("week")}>Weekly</button>
                </div>

                <div className="grid grid-cols-7 gap-3 text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                <div className="mt-4 grid grid-cols-7 gap-3">
                    {calendarDays.map((day) => {
                        const items = getDayAppointments(day)
                        const active = isSameDay(day, selectedDate)
                        const inMonth = isSameMonth(day, currentDate)

                        return (
                            <button
                                key={day.toISOString()}
                                className={[
                                    "min-h-[120px] rounded-3xl border p-3 text-left transition",
                                    active ? "border-cyan-400/40 bg-cyan-400/10 shadow-neon" : "border-white/10 bg-white/5 hover:bg-white/10",
                                    !inMonth && mode === "month" ? "opacity-40" : ""
                                ].join(" ")}
                                onClick={() => setSelectedDate(day)}
                            >
                                <p className="text-sm font-semibold text-white">{format(day, "dd")}</p>
                                <div className="mt-3 space-y-2">
                                    {items.slice(0, 3).map((item) => (
                                        <div key={item.id} className="rounded-2xl bg-white/10 px-2 py-1 text-xs text-slate-200">
                                            {item.time} {item.name}
                                        </div>
                                    ))}
                                    {items.length > 3 && (
                                        <div className="text-xs text-cyan-200">+{items.length - 3} more</div>
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="soft-card p-6">
                <h2 className="text-xl font-semibold text-white">Selected date</h2>
                <p className="mt-2 text-sm text-slate-400">{format(selectedDate, "full")}</p>

                <div className="mt-6 space-y-4">
                    {appointmentsForSelectedDate.map((appointment) => (
                        <div key={appointment.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                            <p className="text-sm font-semibold text-white">{appointment.name}</p>
                            <p className="mt-2 text-sm text-slate-400">{appointment.time} · {appointment.service}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-cyan-300">{appointment.status}</p>
                        </div>
                    ))}

                    {!appointmentsForSelectedDate.length && (
                        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-slate-400">
                            No appointments on the selected date.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CalendarView
