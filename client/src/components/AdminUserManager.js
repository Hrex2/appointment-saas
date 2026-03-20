import React, { useEffect, useState } from "react"
import { getUsers, saveUser } from "../api/userApi"

const emptyForm = {
    name: "",
    email: "",
    phone: "",
    role: "user"
}

const AdminUserManager = () => {
    const [users, setUsers] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const loadUsers = async () => {
        try {
            setLoading(true)
            setError("")
            const res = await getUsers()
            setUsers(res.data)
        } catch (err) {
            console.error(err)
            setError("We couldn't load users right now.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const handleChange = (e) => {
        setForm((current) => ({
            ...current,
            [e.target.name]: e.target.value
        }))
    }

    const handleSave = async () => {
        if (!form.email && !form.phone) {
            setError("Enter at least an email or a WhatsApp phone number.")
            return
        }

        try {
            setSaving(true)
            setError("")
            setMessage("")
            await saveUser(form)
            setMessage("User saved successfully.")
            setForm(emptyForm)
            await loadUsers()
        } catch (err) {
            console.error(err)
            setError("The user could not be saved. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="stack-lg">
            <div className="field-row">
                <div className="stack">
                    <label className="field-label" htmlFor="admin-name">Name</label>
                    <input id="admin-name" className="field" name="name" value={form.name} onChange={handleChange} />
                </div>
                <div className="stack">
                    <label className="field-label" htmlFor="admin-role">Role</label>
                    <select id="admin-role" className="field" name="role" value={form.role} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <div className="field-row">
                <div className="stack">
                    <label className="field-label" htmlFor="admin-email">Email</label>
                    <input
                        id="admin-email"
                        className="field"
                        name="email"
                        placeholder="user@example.com"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="stack">
                    <label className="field-label" htmlFor="admin-phone">WhatsApp phone</label>
                    <input
                        id="admin-phone"
                        className="field"
                        name="phone"
                        placeholder="whatsapp:+91XXXXXXXXXX"
                        value={form.phone}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {message && <p className="message message-success">{message}</p>}
            {error && <p className="message message-error">{error}</p>}

            <div className="button-row">
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save user"}
                </button>
                <button className="btn btn-secondary" onClick={loadUsers} disabled={loading}>
                    {loading ? "Refreshing..." : "Refresh users"}
                </button>
            </div>

            {loading ? (
                <p className="message message-muted">Loading users...</p>
            ) : (
                <div className="appointments-grid">
                    {users.map((user) => (
                        <article className="appointment-item" key={user._id}>
                            <div className="appointment-main">
                                <span className="appointment-name">{user.name || user.email || user.phone}</span>
                                <span className="appointment-meta">Email: {user.email || "Not set"}</span>
                                <span className="appointment-meta">Phone: {user.phone || "Not set"}</span>
                            </div>
                            <span className="pill pill-confirmed">{user.role}</span>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AdminUserManager
