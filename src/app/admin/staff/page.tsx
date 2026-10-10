"use client";

import * as React from "react";
import {
  UserCheck,
  Plus,
  ShieldCheck,
  Trash2,
  User,
  Eye,
  EyeOff,
  AlertTriangle,
  KeyRound,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import {
  AdminRecord,
  DEFAULT_OWNER_ADMIN,
  getClientStaffList,
  saveClientStaffList,
  normalizePhone,
} from "@/lib/adminAuth";

function createLocalStaffRecord(
  name: string,
  phone: string,
  ownerId: string,
  role: string
): AdminRecord {
  return {
    id: `admin_staff_${phone}`,
    name: name.toLowerCase(),
    displayName: name,
    phone,
    ownerId,
    role,
    status: "Active",
    isOwner: false,
    createdAt: "2026-10-10T00:00:00.000Z",
  };
}

export default function AdminStaffPage() {
  const [admins, setAdmins] = React.useState<AdminRecord[]>([DEFAULT_OWNER_ADMIN]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal State for adding new staff
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("");
  const [newOwnerId, setNewOwnerId] = React.useState("");
  const [newRole, setNewRole] = React.useState("Store Manager");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Passcode reveal map (id -> boolean)
  const [revealedIds, setRevealedIds] = React.useState<Record<string, boolean>>({});
  const [isOwnerPasscodeRevealed, setIsOwnerPasscodeRevealed] = React.useState(false);
  const [showNewPasscode, setShowNewPasscode] = React.useState(false);

  // Fetch admin staff list on mount
  const fetchAdmins = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch from API
      const res = await fetch("/api/admin/staff");
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.admins)) {
        setAdmins(data.admins);
        saveClientStaffList(data.admins);
        setIsLoading(false);
        return;
      }
    } catch {
      // API fallback
    }

    // 2. Local fallback
    const local = getClientStaffList();
    setAdmins(local);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = newName.trim();
    const cleanPhone = newPhone.replace(/\D/g, "");
    const cleanOwnerId = newOwnerId.trim();

    if (!cleanName) {
      setFormError("Please enter staff member's name");
      return;
    }
    if (cleanPhone.length !== 10) {
      setFormError("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    if (cleanOwnerId.length < 4) {
      setFormError("Access passcode must be at least 4 digits");
      return;
    }

    if (admins.some((a) => normalizePhone(a.phone) === cleanPhone)) {
      setFormError("An administrator with this phone number already exists");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          phone: cleanPhone,
          ownerId: cleanOwnerId,
          role: newRole,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.admin) {
        const updated = [...admins, data.admin];
        setAdmins(updated);
        saveClientStaffList(updated);
        showToast.success(`Granted admin access to ${data.admin.displayName}!`);
        setIsAddModalOpen(false);
        resetForm();
        return;
      }

      setFormError(data.error || "Failed to grant staff access");
    } catch {
      // Local client fallback
      const newAdminRecord = createLocalStaffRecord(cleanName, cleanPhone, cleanOwnerId, newRole);

      const updated = [...admins, newAdminRecord];
      setAdmins(updated);
      saveClientStaffList(updated);
      showToast.success(`Granted staff access to ${cleanName}!`);
      setIsAddModalOpen(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async (admin: AdminRecord) => {
    if (admin.isOwner || normalizePhone(admin.phone) === DEFAULT_OWNER_ADMIN.phone) {
      showToast.error("Primary Owner account cannot be revoked.");
      return;
    }

    if (!confirm(`Are you sure you want to revoke admin access for ${admin.displayName}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/staff?id=${admin.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const updated = admins.filter((a) => a.id !== admin.id);
        setAdmins(updated);
        saveClientStaffList(updated);
        showToast.success(`Revoked access for ${admin.displayName}`);
        return;
      }
    } catch {
      // Fallback
    }

    const updated = admins.filter((a) => a.id !== admin.id);
    setAdmins(updated);
    saveClientStaffList(updated);
    showToast.success(`Revoked access for ${admin.displayName}`);
  };

  const resetForm = () => {
    setNewName("");
    setNewPhone("");
    setNewOwnerId("");
    setNewRole("Store Manager");
    setFormError(null);
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B79B63] font-bold block mb-1">
            Access Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#1C1B19]">
            Staff &amp; Access Control
          </h1>
          <p className="text-xs text-[#5A5650] mt-1">
            Manage authorized boutique administrators, branch managers, and order fulfillment staff.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="bg-[#1C1B19] hover:bg-[#B79B63] text-white text-xs uppercase tracking-wider cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5 text-[#B79B63]" />
          Grant New Admin Access
        </Button>
      </div>

      {/* Primary Owner Highlight Card */}
      <div className="bg-gradient-to-r from-[#1C1B19] to-[#2E2C28] text-white p-6 rounded-xs border border-[#3E3A34] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#B79B63]/20 border border-[#B79B63]/40 text-[#B79B63] text-[10px] uppercase tracking-widest font-bold rounded-2xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Root Authority &amp; Owner</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#FAF7F2]">
            Sreesha (Founder &amp; Owner)
          </h2>
          <p className="text-xs text-stone-300 max-w-lg leading-relaxed">
            Registered with full master privileges over catalog inventory, financial receipts,
            customer records, and secondary staff delegations.
          </p>
        </div>

        <div className="bg-[#171614] border border-[#3E3A34] p-4 rounded-xs text-xs space-y-2 shrink-0 min-w-[240px]">
          <div className="flex justify-between items-center text-stone-400">
            <span>Primary Phone:</span>
            <span className="font-semibold text-white font-mono">+91 62813 44628</span>
          </div>
          <div className="flex justify-between items-center text-stone-400">
            <span>Owner Passcode:</span>
            <div className="inline-flex items-center gap-1.5 bg-[#24221E] px-2 py-0.5 border border-[#B79B63]/30">
              <span className="font-bold text-[#B79B63] font-mono tracking-widest">
                {isOwnerPasscodeRevealed ? DEFAULT_OWNER_ADMIN.ownerId : "••••"}
              </span>
              <button
                type="button"
                onClick={() => setIsOwnerPasscodeRevealed(!isOwnerPasscodeRevealed)}
                className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
                title={isOwnerPasscodeRevealed ? "Hide Passcode" : "Reveal Passcode"}
              >
                {isOwnerPasscodeRevealed ? (
                  <EyeOff className="w-3 h-3" />
                ) : (
                  <Eye className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center text-stone-400">
            <span>Access Status:</span>
            <span className="text-emerald-400 font-semibold uppercase text-[10px]">
              Active &amp; Permanent
            </span>
          </div>
        </div>
      </div>

      {/* Search and Table Section */}
      <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-xs overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-[#E8E2D8] flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C867D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff by name, phone or role..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none"
            />
          </div>
          <span className="text-xs text-[#8C867D]">{filteredAdmins.length} active admin(s)</span>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8E2D8] uppercase text-[10px] tracking-wider text-[#8C867D]">
              <tr>
                <th className="p-4">Administrator</th>
                <th className="p-4">Registered Mobile</th>
                <th className="p-4">Role &amp; Scope</th>
                <th className="p-4">Passcode / PIN</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#8C867D]">
                    Loading registered administrators...
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#8C867D]">
                    No staff members found matching &quot;{searchQuery}&quot;
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => {
                  const isRevealed = revealedIds[admin.id];
                  return (
                    <tr key={admin.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      {/* Name */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#D8C7A5] flex items-center justify-center text-[#B79B63] font-bold">
                            {admin.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-[#1C1B19] block">
                              {admin.displayName}
                            </span>
                            {admin.isOwner && (
                              <span className="text-[9px] text-[#B79B63] font-bold uppercase tracking-wider block">
                                Primary Owner
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="p-4 font-mono text-[#5A5650]">+91 {admin.phone}</td>

                      {/* Role */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-2xs border ${
                            admin.isOwner
                              ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                              : "bg-[#F7F3EB] text-[#B79B63] border-[#D8C7A5]"
                          }`}
                        >
                          {admin.role}
                        </span>
                      </td>

                      {/* PIN / Passcode */}
                      <td className="p-4">
                        <div className="inline-flex items-center gap-2">
                          <span className="font-mono font-bold tracking-widest text-[#1C1B19]">
                            {isRevealed ? admin.ownerId : "••••"}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleReveal(admin.id)}
                            className="text-[#8C867D] hover:text-[#1C1B19] p-1 cursor-pointer"
                            title={isRevealed ? "Hide Passcode" : "Reveal Passcode"}
                          >
                            {isRevealed ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        {admin.isOwner ? (
                          <span className="text-[10px] text-[#8C867D] italic">Protected Owner</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteStaff(admin)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Revoke Staff Access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant New Admin Access Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#1C1B19] text-[#FAF7F2] w-full max-w-md p-6 sm:p-8 border border-[#3E3A34] shadow-2xl rounded-xs space-y-6 animate-in fade-in zoom-in-95">
            <div className="space-y-1 text-center">
              <div className="w-12 h-12 bg-[#B79B63]/15 text-[#B79B63] mx-auto rounded-full flex items-center justify-center border border-[#B79B63]/30">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#FAF7F2] pt-2">Grant New Admin Access</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Authorized staff members can sign in with their Name, Mobile Number, and Passcode.
              </p>
            </div>

            {formError && (
              <div className="p-3 bg-[#3A1818] border border-[#8C2C2C] text-xs text-[#FFAAAA] rounded-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  Staff Member Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Staff member full name"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#141312] border border-[#3E3A34] text-white focus:border-[#B79B63] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  10-Digit Mobile Number *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-stone-400 border-r border-[#3E3A34] pr-2 pointer-events-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number"
                    className="w-full pl-14 pr-3 py-2.5 bg-[#141312] border border-[#3E3A34] text-white focus:border-[#B79B63] outline-none font-mono tracking-wider"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  Assigned Passcode / Access ID *
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type={showNewPasscode ? "text" : "password"}
                    required
                    maxLength={10}
                    value={newOwnerId}
                    onChange={(e) => setNewOwnerId(e.target.value)}
                    placeholder="Enter confidential passcode"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#141312] border border-[#3E3A34] text-white focus:border-[#B79B63] outline-none font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPasscode(!showNewPasscode)}
                    className="absolute right-3 text-stone-400 hover:text-white p-1"
                    title={showNewPasscode ? "Hide Passcode" : "Reveal Passcode"}
                  >
                    {showNewPasscode ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  At least 4 alphanumeric characters (confidential)
                </p>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  Administrative Role *
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2.5 bg-[#141312] border border-[#3E3A34] text-white focus:border-[#B79B63] outline-none"
                >
                  <option value="Store Manager">Store Manager (Orders &amp; Inventory)</option>
                  <option value="Inventory Curator">Inventory Curator (Products Only)</option>
                  <option value="Order Dispatcher">Order Dispatcher &amp; Logistics</option>
                  <option value="Co-Admin">Co-Admin (Full Privileges)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsAddModalOpen(false)}
                  className="border-[#3E3A34] text-stone-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="bg-[#B79B63] hover:bg-[#a3874f] text-[#1C1B19] font-bold"
                >
                  {isSubmitting ? "Granting..." : "Confirm & Grant Access"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
