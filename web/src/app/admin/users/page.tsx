"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";

interface UserRecord {
  id: string;
  email: string;
  full_name: string;
  user_role: string;
  kyc_status: string;
  created_at: string;
  wallet_address?: string | null;
}

const ROLES = ["investor", "builder", "dealmaker", "manager", "admin"] as const;
const ROLE_COLORS: Record<string, string> = { investor: "#2B4C7E", builder: "#E8632B", dealmaker: "#D4A843", manager: "#2ECC71", admin: "#E8632B" };

export default function UsersPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newMember, setNewMember] = useState({ email: "", full_name: "", user_role: "manager" });
  const [createError, setCreateError] = useState<string | null>(null);

  const isAdmin = profile?.user_role === "admin";

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setUsers(data);
      }
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, user_role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, user_role: newRole } : u));
        setEditingUser(null);
      }
    } catch { /* silent */ }
    setSaving(false);
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) => [data, ...prev]);
        setShowCreate(false);
        setNewMember({ email: "", full_name: "", user_role: "manager" });
      } else {
        const err = await res.json();
        setCreateError(err.error || "Failed to create team member");
      }
    } catch {
      setCreateError("Network error");
    }
    setSaving(false);
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.user_role === roleFilter;
    return matchSearch && matchRole;
  });

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#E8632B]" /></div>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users & Team</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--brix-fg-muted)" }}>{users.length} total users</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#E8632B", color: "#FFFFFF" }}
          >
            + Add Team Member
          </button>
        )}
      </div>

      {/* Create Team Member Form */}
      {showCreate && (
        <div className="mb-6 rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
          <h3 className="mb-4 text-sm font-semibold text-white">Create Team Member</h3>
          {createError && <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{createError}</div>}
          <form onSubmit={handleCreateMember} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newMember.full_name}
              onChange={(e) => setNewMember((p) => ({ ...p, full_name: e.target.value }))}
              required
              className="rounded-lg border border-[var(--brix-border)] px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
              style={{ backgroundColor: "var(--brix-bg)" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={newMember.email}
              onChange={(e) => setNewMember((p) => ({ ...p, email: e.target.value }))}
              required
              className="rounded-lg border border-[var(--brix-border)] px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
              style={{ backgroundColor: "var(--brix-bg)" }}
            />
            <select
              value={newMember.user_role}
              onChange={(e) => setNewMember((p) => ({ ...p, user_role: e.target.value }))}
              className="rounded-lg border border-[var(--brix-border)] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
              style={{ backgroundColor: "var(--brix-bg)" }}
            >
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="dealmaker">Dealmaker</option>
              <option value="builder">Builder</option>
            </select>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="flex-1 rounded-lg py-2 text-sm font-semibold disabled:opacity-50" style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}>
                {saving ? "Creating..." : "Create"}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white border border-[var(--brix-border)]">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-[var(--brix-border)] px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
          style={{ backgroundColor: "var(--brix-surface)" }}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-[var(--brix-border)] px-3 py-2 text-sm text-white focus:outline-none"
          style={{ backgroundColor: "var(--brix-surface)" }}
        >
          <option value="all">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden md:block rounded-xl border border-[var(--brix-border)] overflow-hidden" style={{ backgroundColor: "var(--brix-surface)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--brix-border)]">
                {["Name", "Email", "Role", "KYC", "Joined", "Actions"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((user) => {
                const roleColor = ROLE_COLORS[user.user_role] || "#4A4A5A";
                return (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{user.full_name || "—"}</td>
                    <td className="px-4 py-3 text-white/60">{user.email}</td>
                    <td className="px-4 py-3">
                      {editingUser === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="rounded border border-white/20 px-2 py-1 text-xs text-white"
                            style={{ backgroundColor: "var(--brix-bg)" }}
                          >
                            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <button onClick={() => handleRoleChange(user.id, editRole)} disabled={saving} className="rounded px-2 py-1 text-xs font-medium" style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}>Save</button>
                          <button onClick={() => setEditingUser(null)} className="rounded px-2 py-1 text-xs text-white/40 hover:text-white">Cancel</button>
                        </div>
                      ) : (
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: roleColor + "20", color: roleColor }}>
                          {user.user_role}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{
                        backgroundColor: user.kyc_status === "verified" ? "#2ECC7120" : user.kyc_status === "rejected" ? "#E8632B20" : "#D4A84320",
                        color: user.kyc_status === "verified" ? "#2ECC71" : user.kyc_status === "rejected" ? "#E8632B" : "#D4A843",
                      }}>
                        {user.kyc_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {isAdmin && editingUser !== user.id && (
                        <button
                          onClick={() => { setEditingUser(user.id); setEditRole(user.user_role); }}
                          className="text-xs font-medium hover:opacity-80"
                          style={{ color: "#D4A843" }}
                        >
                          Edit Role
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: "var(--brix-fg-muted)" }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {filtered.map((user) => {
          const roleColor = ROLE_COLORS[user.user_role] || "#4A4A5A";
          return (
            <div key={user.id} className="rounded-xl border border-[var(--brix-border)] p-4" style={{ backgroundColor: "var(--brix-surface)" }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-white">{user.full_name || "—"}</p>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: roleColor + "20", color: roleColor }}>
                  {user.user_role}
                </span>
              </div>
              <p className="text-xs text-white/60 mb-2 truncate">{user.email}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{
                    backgroundColor: user.kyc_status === "verified" ? "#2ECC7120" : user.kyc_status === "rejected" ? "#E8632B20" : "#D4A84320",
                    color: user.kyc_status === "verified" ? "#2ECC71" : user.kyc_status === "rejected" ? "#E8632B" : "#D4A843",
                  }}>
                    {user.kyc_status}
                  </span>
                  <span className="text-xs text-white/40">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                {isAdmin && editingUser !== user.id && (
                  <button
                    onClick={() => { setEditingUser(user.id); setEditRole(user.user_role); }}
                    className="text-xs font-medium hover:opacity-80"
                    style={{ color: "#D4A843" }}
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingUser === user.id && (
                <div className="mt-3 flex items-center gap-2 border-t border-white/5 pt-3">
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="flex-1 rounded border border-white/20 px-2 py-1.5 text-xs text-white"
                    style={{ backgroundColor: "var(--brix-bg)" }}
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <button onClick={() => handleRoleChange(user.id, editRole)} disabled={saving} className="rounded px-3 py-1.5 text-xs font-medium" style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}>Save</button>
                  <button onClick={() => setEditingUser(null)} className="rounded px-2 py-1.5 text-xs text-white/40">Cancel</button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-[var(--brix-border)] p-8 text-center" style={{ backgroundColor: "var(--brix-surface)" }}>
            <p className="text-sm" style={{ color: "var(--brix-fg-muted)" }}>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
