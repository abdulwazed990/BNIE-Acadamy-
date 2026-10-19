import { useState, useEffect, FormEvent } from "react";
import { 
  LeadershipProfile, 
  LeadershipPosition, 
  PublicationStatus, 
  LEADERSHIP_POSITIONS 
} from "../types";
import { 
  fetchLeadershipProfiles, 
  saveLeadershipProfile, 
  deleteLeadershipProfile, 
  subscribeLeadershipProfiles 
} from "../lib/leadershipService";
import PassportPhotoCropper from "./PassportPhotoCropper";
import { 
  Plus, Edit2, Trash2, CheckCircle2, Clock, EyeOff, Search, 
  Building2, Mail, Phone, MapPin, Smartphone, FileText, 
  Check, X, AlertCircle, ArrowUpDown, Filter, ShieldCheck, UserCheck
} from "lucide-react";

export default function LeadershipAdminModule() {
  const [profiles, setProfiles] = useState<LeadershipProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Filters
  const [selectedPositionFilter, setSelectedPositionFilter] = useState<LeadershipPosition | "ALL">("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<PublicationStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  // Form Fields
  const [formPosition, setFormPosition] = useState<LeadershipPosition>("Vice-Chancellor");
  const [formFullName, setFormFullName] = useState("");
  const [formDesignation, setFormDesignation] = useState("");
  const [formDepartmentOrOffice, setFormDepartmentOrOffice] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMobile, setFormMobile] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formOfficeAddress, setFormOfficeAddress] = useState("");
  const [formPhotoUrl, setFormPhotoUrl] = useState<string | undefined>(undefined);
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);
  const [formStatus, setFormStatus] = useState<PublicationStatus>("Published");

  // Delete Confirmation Modal
  const [deleteCandidate, setDeleteCandidate] = useState<LeadershipProfile | null>(null);

  // Subscribe to real-time updates and fetch initially
  useEffect(() => {
    setIsLoading(true);
    fetchLeadershipProfiles().then((initial) => {
      setProfiles(initial);
      setIsLoading(false);
    });

    const unsubscribe = subscribeLeadershipProfiles((updated) => {
      setProfiles(updated);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Clear feedback after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const openAddModal = (presetPosition?: LeadershipPosition) => {
    setEditingProfileId(null);
    setFormPosition(presetPosition || (selectedPositionFilter !== "ALL" ? selectedPositionFilter : "Vice-Chancellor"));
    setFormFullName("");
    setFormDesignation("");
    setFormDepartmentOrOffice("");
    setFormEmail("");
    setFormPhone("");
    setFormMobile("");
    setFormBio("");
    setFormOfficeAddress("");
    setFormPhotoUrl(undefined);
    setFormDisplayOrder(profiles.length + 1);
    setFormStatus("Published");
    setIsModalOpen(true);
  };

  const openEditModal = (profile: LeadershipProfile) => {
    setEditingProfileId(profile.id);
    setFormPosition(profile.position);
    setFormFullName(profile.fullName);
    setFormDesignation(profile.designation);
    setFormDepartmentOrOffice(profile.departmentOrOffice);
    setFormEmail(profile.email);
    setFormPhone(profile.phone);
    setFormMobile(profile.mobileNumber || "");
    setFormBio(profile.biography || "");
    setFormOfficeAddress(profile.officeAddress || "");
    setFormPhotoUrl(profile.photoUrl);
    setFormDisplayOrder(profile.displayOrder || 1);
    setFormStatus(profile.status);
    setIsModalOpen(true);
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();

    if (!formFullName.trim()) {
      setFeedback({ type: "error", message: "Full Name is required." });
      return;
    }
    if (!formDesignation.trim()) {
      setFeedback({ type: "error", message: "Official Designation is required." });
      return;
    }
    if (!formDepartmentOrOffice.trim()) {
      setFeedback({ type: "error", message: "Department or Office is required." });
      return;
    }
    if (formEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formEmail.trim())) {
        setFeedback({ type: "error", message: "Please enter a valid email address format (e.g. name@bnie.edu.bd)." });
        return;
      }
    }
    if (formPhone.trim()) {
      const phoneRegex = /^[\d\s\+\-\(\)]{6,25}$/;
      if (!phoneRegex.test(formPhone.trim())) {
        setFeedback({ type: "error", message: "Please enter a valid phone number format." });
        return;
      }
    }
    if (formMobile.trim()) {
      const mobileRegex = /^[\d\s\+\-\(\)]{6,25}$/;
      if (!mobileRegex.test(formMobile.trim())) {
        setFeedback({ type: "error", message: "Please enter a valid mobile number format." });
        return;
      }
    }

    const now = new Date().toISOString();
    const profileToSave: LeadershipProfile = {
      id: editingProfileId || `lp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      position: formPosition,
      fullName: formFullName.trim(),
      designation: formDesignation.trim(),
      departmentOrOffice: formDepartmentOrOffice.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      mobileNumber: formMobile.trim() || undefined,
      biography: formBio.trim() || undefined,
      officeAddress: formOfficeAddress.trim() || undefined,
      photoUrl: formPhotoUrl,
      displayOrder: Number(formDisplayOrder) || 1,
      status: formStatus,
      createdAt: editingProfileId ? (profiles.find(p => p.id === editingProfileId)?.createdAt || now) : now,
      updatedAt: now,
    };

    try {
      await saveLeadershipProfile(profileToSave);
      setFeedback({ 
        type: "success", 
        message: editingProfileId 
          ? `Profile for ${profileToSave.fullName} updated successfully!` 
          : `Profile for ${profileToSave.fullName} added successfully!`
      });
      setIsModalOpen(false);
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to save profile. Please check network connection." });
    }
  };

  const handleTogglePublication = async (profile: LeadershipProfile) => {
    const nextStatus: PublicationStatus = profile.status === "Published" ? "Unpublished" : "Published";
    const updated: LeadershipProfile = {
      ...profile,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    };
    try {
      await saveLeadershipProfile(updated);
      setFeedback({
        type: "success",
        message: `${profile.fullName} is now ${nextStatus.toLowerCase()}.`
      });
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to update publication status." });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteLeadershipProfile(deleteCandidate.id);
      setFeedback({ type: "success", message: `Profile for ${deleteCandidate.fullName} deleted.` });
      setDeleteCandidate(null);
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to delete profile." });
    }
  };

  // Filtered & Sorted Profiles
  const filteredProfiles = profiles
    .filter((p) => {
      if (selectedPositionFilter !== "ALL" && p.position !== selectedPositionFilter) return false;
      if (selectedStatusFilter !== "ALL" && p.status !== selectedStatusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.fullName.toLowerCase().includes(q);
        const matchesDesig = p.designation.toLowerCase().includes(q);
        const matchesDept = p.departmentOrOffice.toLowerCase().includes(q);
        const matchesEmail = p.email.toLowerCase().includes(q);
        return matchesName || matchesDesig || matchesDept || matchesEmail;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by position rank first, then displayOrder
      const posA = LEADERSHIP_POSITIONS.indexOf(a.position);
      const posB = LEADERSHIP_POSITIONS.indexOf(b.position);
      if (posA !== posB) return posA - posB;
      return (a.displayOrder || 1) - (b.displayOrder || 1);
    });

  return (
    <div className="space-y-6">
      {/* Module Title & Quick Action Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#006a4e]" />
            <h3 className="text-xl font-black text-gray-950 font-sans tracking-tight">
              Leadership &amp; Administration Management
            </h3>
          </div>
          <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
            Manage official leadership profiles, statutory designations, passport-size portraits, and live publication statuses. Profiles published here are dynamically displayed on the public leadership portal.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openAddModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 border border-[#00563f]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Official Profile</span>
        </button>
      </div>

      {/* Feedback Messages */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 hover:bg-black/5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Position Filter Tabs (7 Required Positions) */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
          Selectable Leadership Positions:
        </span>
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-gray-100 rounded-xl border border-gray-200">
          <button
            type="button"
            onClick={() => setSelectedPositionFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedPositionFilter === "ALL"
                ? "bg-black text-white shadow-xs"
                : "text-gray-700 hover:bg-white/80"
            }`}
          >
            All Positions ({profiles.length})
          </button>

          {LEADERSHIP_POSITIONS.map((pos, idx) => {
            const count = profiles.filter((p) => p.position === pos).length;
            const publishedCount = profiles.filter((p) => p.position === pos && p.status === "Published").length;
            return (
              <button
                key={pos}
                type="button"
                onClick={() => setSelectedPositionFilter(pos)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedPositionFilter === pos
                    ? "bg-[#006a4e] text-white shadow-xs"
                    : "text-gray-700 hover:bg-white/80"
                }`}
              >
                <span>{idx + 1}. {pos}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedPositionFilter === pos
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {publishedCount}/{count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status & Search Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-xs font-bold text-gray-700">Status:</span>
          <div className="flex items-center gap-1">
            {(["ALL", "Published", "Draft", "Unpublished"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                  selectedStatusFilter === st
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, designation, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#006a4e] text-gray-900"
          />
        </div>
      </div>

      {/* Profiles Cards / Ledger */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
          <div className="animate-spin w-8 h-8 border-3 border-[#006a4e] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs text-gray-500 font-medium">Synchronizing leadership records...</p>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300 space-y-3">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#006a4e]">
            <UserCheck className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-gray-900">No Leadership Profiles Found</h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            {selectedPositionFilter !== "ALL"
              ? `There are no official profiles created yet for ${selectedPositionFilter}. Click below to add one.`
              : "No profiles match your current search or filter. You can add official profiles anytime."}
          </p>
          <button
            type="button"
            onClick={() => openAddModal(selectedPositionFilter !== "ALL" ? selectedPositionFilter : undefined)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Profile for {selectedPositionFilter !== "ALL" ? selectedPositionFilter : "Leadership"}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProfiles.map((p) => {
            const isPublished = p.status === "Published";
            const isDraft = p.status === "Draft";

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Top: Position & Status Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#006a4e] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md inline-block">
                        {p.position}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono ml-2">
                        Order #{p.displayOrder}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePublication(p)}
                      title="Click to toggle publication"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 border ${
                        isPublished
                          ? "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600"
                          : isDraft
                          ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
                          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {isPublished ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Published</span>
                        </>
                      ) : isDraft ? (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>Draft</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Unpublished</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Profile Identification with Passport Photo */}
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-26 rounded-lg border border-gray-300 bg-gray-50 overflow-hidden shrink-0 shadow-2xs flex items-center justify-center">
                      {p.photoUrl ? (
                        <img
                          src={p.photoUrl}
                          alt={p.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-1 text-gray-400">
                          <span className="text-[9px] font-mono block">NO PHOTO</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="text-base font-extrabold text-gray-900 leading-snug truncate">
                        {p.fullName}
                      </h4>
                      <p className="text-xs font-bold text-gray-800 leading-snug">
                        {p.designation}
                      </p>
                      <p className="text-[11px] text-gray-600 flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">{p.departmentOrOffice}</span>
                      </p>
                    </div>
                  </div>

                  {/* Contact Desk Info */}
                  <div className="bg-gray-50/70 rounded-xl p-3 border border-gray-100 space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-mono text-[11px] truncate">{p.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-mono text-[11px]">{p.phone}</span>
                    </div>
                    {p.mobileNumber && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Smartphone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="font-mono text-[11px]">{p.mobileNumber}</span>
                      </div>
                    )}
                    {p.officeAddress && (
                      <div className="flex items-center gap-2 text-gray-600 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-[11px] truncate">{p.officeAddress}</span>
                      </div>
                    )}
                  </div>

                  {/* Biography Preview */}
                  {p.biography && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed italic bg-white p-2.5 rounded-lg border border-gray-100">
                      &quot;{p.biography}&quot;
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-gray-400">
                    Updated: {new Date(p.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-gray-500" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(p)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT PROFILE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 my-8">
            {/* Modal Header */}
            <div className="bg-[#006a4e] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-sans">
                  {editingProfileId ? "Edit Leadership Profile" : "Add New Official Leadership Profile"}
                </h3>
                <p className="text-xs text-emerald-100">
                  Fill in official verified credentials. Photos will be cropped to passport 3:4 portrait standards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Position Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Select Leadership Position *
                </label>
                <select
                  value={formPosition}
                  onChange={(e) => setFormPosition(e.target.value as LeadershipPosition)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-[#006a4e] text-gray-900"
                >
                  {LEADERSHIP_POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500">
                  {formPosition === "Former Vice-Chancellors"
                    ? "Multiple profiles are supported for Former Vice-Chancellors to preserve historical records."
                    : `This profile will represent the official ${formPosition} of the institute.`}
                </p>
              </div>

              {/* Full Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder=""
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#006a4e] text-gray-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Official Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder=""
                    value={formDesignation}
                    onChange={(e) => setFormDesignation(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#006a4e] text-gray-900"
                  />
                </div>
              </div>

              {/* Department or Office */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Department or Office *
                </label>
                <input
                  type="text"
                  required
                  placeholder=""
                  value={formDepartmentOrOffice}
                  onChange={(e) => setFormDepartmentOrOffice(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#006a4e] text-gray-900"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    placeholder=""
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#006a4e] text-gray-900 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Official Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#006a4e] text-gray-900 font-mono"
                  />
                </div>
              </div>

              {/* Mobile Number & Office Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Mobile Number <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#006a4e] text-gray-900 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Office Address <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={formOfficeAddress}
                    onChange={(e) => setFormOfficeAddress(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#006a4e] text-gray-900"
                  />
                </div>
              </div>

              {/* Passport Photo Cropper Component */}
              <div className="space-y-1 border-t border-gray-100 pt-4">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Official Profile Photo (Gallery / Camera / Files)
                </label>
                <PassportPhotoCropper
                  currentPhotoUrl={formPhotoUrl}
                  onPhotoCropped={(dataUrl) => setFormPhotoUrl(dataUrl)}
                  onPhotoRemoved={() => setFormPhotoUrl(undefined)}
                />
              </div>

              {/* Biography or Profile Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Biography or Profile Description <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter official executive biography, educational background, achievements, and scholarly leadership..."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-hidden focus:border-[#006a4e] text-gray-900 leading-relaxed"
                />
              </div>

              {/* Display Order & Publication Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Display Order (Priority Sequence)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-[#006a4e] text-gray-900 font-mono"
                  />
                  <p className="text-[11px] text-gray-500">Lower numbers appear first (e.g. 1, 2, 3...)</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Publication Status *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Published", "Draft", "Unpublished"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormStatus(st)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                          formStatus === st
                            ? st === "Published"
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                              : st === "Draft"
                              ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                              : "bg-gray-800 text-white border-gray-800 shadow-xs"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Only profiles with <strong className="text-emerald-700">&quot;Published&quot;</strong> status are visible to the public.
                  </p>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#006a4e] hover:bg-[#00563f] transition-all cursor-pointer shadow-md flex items-center gap-2 border border-[#00563f]"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProfileId ? "Save Changes" : "Create Official Profile"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-gray-900">Delete Leadership Profile?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Are you sure you want to permanently remove the profile of{" "}
                <strong className="text-gray-950 font-bold">{deleteCandidate.fullName}</strong> ({deleteCandidate.position})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 border border-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer shadow-xs"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
