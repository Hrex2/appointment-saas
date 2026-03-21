export const parseISO = (value) => new Date(`${value}T00:00:00`)

export const addDays = (date, amount) => {
    const result = new Date(date)
    result.setDate(result.getDate() + amount)
    return result
}

export const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1)
export const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)

export const startOfWeek = (date) => {
    const result = new Date(date)
    result.setDate(result.getDate() - result.getDay())
    result.setHours(0, 0, 0, 0)
    return result
}

export const endOfWeek = (date) => addDays(startOfWeek(date), 6)

export const isSameDay = (left, right) =>
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()

export const isSameMonth = (left, right) =>
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth()

export const format = (date, mode) => {
    if (mode === "dd") {
        return String(date.getDate()).padStart(2, "0")
    }

    if (mode === "full") {
        return date.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        })
    }

    return date.toLocaleDateString()
}
