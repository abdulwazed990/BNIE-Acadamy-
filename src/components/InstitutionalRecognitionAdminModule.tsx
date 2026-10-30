import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { 
  InstitutionalRecognitionSettings, 
  InstitutionalStatus, 
  OfficialRecognitionDocument 
} from "../types";
import { 
  fetchInstitutionalRecognition, 
  saveInstitutionalRecognition, 
  DEFAULT_INSTITUTIONAL_RECOGNITION 
} from "../lib/institutionalRecognitionService";
import { 
  Save, 
  ShieldCheck, 
  FileText, 
  Landmark, 
  Building2, 
  Calendar, 
  UserCheck, 
  Upload, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus, 
  FileCheck,
  Eye,
  FileQuestion
} from "lucide-react";

export default function InstitutionalRecognitionAdminModule() {
  const [data, setData] = useState<InstitutionalRecognitionSettings>(DEFAULT_INSTITUTIONAL_RECOGNITION);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // New Document modal/inline form state
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocType, setNewDocType] = useState("Registration Certificate");
  const [newDocMemo, setNewDocMemo] = useState("");
  const [newDocDate, setNewDocDate] = useState("");
  const [newDocFileData, setNewDocFileData] = useState("");
  const [newDocFileName, setNewDocFileName] = useState("");
  const [newDocFileSize, setNewDocFileSize] = useState("");
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const loaded = await fetchInstitutionalRecognition();
        if (isMounted) {
          setData(loaded);
        }
      } catch (err) {
        console.error("Failed to load institutional recognition:", err);
        if (isMounted) {
          setErrorMessage("Failed to load recognition records from database.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await saveInstitutionalRecognition(data);
      setSuccessMessage("Institutional Recognition & Government Approval settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: unknown) {
      console.error("Failed to save institutional recognition:", err);
      const msg = err instanceof Error ? err.message : "Unknown database error.";
      setErrorMessage(`Failed to save: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDocumentFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit. Please upload a compressed document (PDF or JPEG under 2MB).");
        return;
      }
      setNewDocFileName(file.name);
      setNewDocFileSize(`${(file.size / 1024).toFixed(1)} KB`);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setNewDocFileData(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDocument = () => {
    if (!newDocTitle.trim()) {
      alert("Please enter a document title.");
      return;
    }
    const newDoc: OfficialRecognitionDocument = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.trim(),
      documentType: newDocType,
      memoReference: newDocMemo.trim(),
      issueDate: newDocDate.trim(),
      fileName: newDocFileName || "institutional_document.pdf",
      fileSize: newDocFileSize || "Archived",
      fileData: newDocFileData
    };

    setData((prev) => ({
      ...prev,
      documents: [...(prev.documents || []), newDoc]
    }));

    // Reset new doc inputs
    setNewDocTitle("");
    setNewDocMemo("");
    setNewDocDate("");
    setNewDocFileData("");
    setNewDocFileName("");
    setNewDocFileSize("");
    setIsAddingDoc(false);
  };

  const handleRemoveDocument = (id: string) => {
    if (window.confirm("Are you sure you want to remove this document from the official registry?")) {
      setData((prev) => ({
        ...prev,
        documents: (prev.documents || []).filter((d) => d.id !== id)
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#006a4e] animate-spin mx-auto" />
        <p className="text-sm font-semibold text-gray-700">Loading Institutional Recognition &amp; Government Approval data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-12">
      {/* Module Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-[#006a4e] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Landmark className="w-3.5 h-3.5" />
              <span>Institutional Recognition &amp; Government Approval Controller</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-950 font-sans tracking-tight">
              Government Approval &amp; Institutional Recognition Management
            </h2>
            <p className="text-xs text-gray-600 max-w-3xl leading-relaxed">
              Manage the institutional establishment records, official approval documents, and administrative credentials for Bangladesh National Institute of Education. Fields left blank are automatically hidden from public visitors.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Recognition Data</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Status Selection & Verification Level */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#006a4e]" />
              <span>Publication &amp; Verification Status</span>
            </h3>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              data.status === "Official Documents Verified" 
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                : data.status === "Published"
                ? "bg-blue-100 text-blue-900 border border-blue-300"
                : "bg-amber-100 text-amber-900 border border-amber-300"
            }`}>
              Current: {data.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              data.status === "Draft" 
                ? "border-amber-500 bg-amber-50/50" 
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="recognition_status"
                  value="Draft"
                  checked={data.status === "Draft"}
                  onChange={() => setData((prev) => ({ ...prev, status: "Draft" }))}
                  className="mt-1"
                />
                <div>
                  <span className="text-xs font-bold text-gray-950 block">Draft</span>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-normal">
                    Institutional recognition section is kept in draft mode for internal review.
                  </p>
                </div>
              </div>
            </label>

            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              data.status === "Published" 
                ? "border-blue-600 bg-blue-50/40" 
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="recognition_status"
                  value="Published"
                  checked={data.status === "Published"}
                  onChange={() => setData((prev) => ({ ...prev, status: "Published" }))}
                  className="mt-1"
                />
                <div>
                  <span className="text-xs font-bold text-gray-950 block">Published</span>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-normal">
                    Published for public reference displaying verified establishment and historical context.
                  </p>
                </div>
              </div>
            </label>

            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              data.status === "Official Documents Verified" 
                ? "border-[#006a4e] bg-emerald-50/60" 
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="recognition_status"
                  value="Official Documents Verified"
                  checked={data.status === "Official Documents Verified"}
                  onChange={() => setData((prev) => ({ ...prev, status: "Official Documents Verified" }))}
                  className="mt-1"
                />
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Official Documents Verified</span>
                  <p className="text-[11px] text-emerald-900 mt-0.5 leading-normal">
                    Enabled ONLY after physically checking and verifying actual official supporting documents.
                  </p>
                </div>
              </div>
            </label>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px]">
              <strong>Administrative Rule:</strong> The &quot;Official Documents Verified&quot; status must only be enabled after verifying actual authentic supporting documents. Do not invent government approval numbers or forged official names. Empty fields will be seamlessly hidden on the public website.
            </div>
          </div>
        </div>

        {/* 2. Institutional Credentials & Identifiers */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#006a4e]" />
              <span>Official Institutional Registration &amp; Approval Fields</span>
            </h3>
            <span className="text-[11px] text-gray-500">
              Leave blank if pending actual documentation; empty fields are not shown to public visitors.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Institution Name (Bengali) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Institution Name (বাংলা)
              </label>
              <input
                type="text"
                value={data.institutionNameBn || ""}
                onChange={(e) => setData((prev) => ({ ...prev, institutionNameBn: e.target.value }))}
                className="w-full text-xs font-medium border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none"
                placeholder="বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট"
              />
            </div>

            {/* Institution Name (English) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Institution Name (English)
              </label>
              <input
                type="text"
                value={data.institutionNameEn || ""}
                onChange={(e) => setData((prev) => ({ ...prev, institutionNameEn: e.target.value }))}
                className="w-full text-xs font-medium border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none"
                placeholder="Bangladesh National Institute of Education (BNIE)"
              />
            </div>

            {/* Established Year */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Established Year (প্রতিষ্ঠিত সন)
              </label>
              <input
                type="text"
                value={data.establishedYear || "1996"}
                onChange={(e) => setData((prev) => ({ ...prev, establishedYear: e.target.value }))}
                className="w-full text-xs font-mono font-bold border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none"
                placeholder="1996"
              />
            </div>

            {/* Official Registration Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Official Registration Number
              </label>
              <input
                type="text"
                value={data.officialRegistrationNumber || ""}
                onChange={(e) => setData((prev) => ({ ...prev, officialRegistrationNumber: e.target.value }))}
                className="w-full text-xs font-mono border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none"
                placeholder="e.g. Verified official registration number from document"
              />
              <span className="text-[10px] text-gray-500 block">Enter only authenticated registration number. Leave empty if unconfirmed.</span>
            </div>

            {/* Government Approval Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Government Approval Number
              </label>
              <input
                type="text"
                value={data.governmentApprovalNumber || ""}
                onChange={(e) => setData((prev) => ({ ...prev, governmentApprovalNumber: e.target.value }))}
                className="w-full text-xs font-mono border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none"
                placeholder="e.g. Official government approval order / circular number"
              />
              <span className="text-[10px] text-gray-500 block">Do not invent fictional numbers. Leave blank if pending.</span>
            </div>

            {/* Issuing Government Authority */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Issuing Government Authority
              </label>
              <input
                type="text"
                value={data.issuingGovernmentAuthority || ""}
                onChange={(e) => setData((prev) => ({ ...prev, issuingGovernmentAuthority: e.target.value }))}
                className="w-full text-xs font-medium border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none"
                placeholder="e.g. Ministry of Education / Registrar Authority"
              />
            </div>

            {/* Approval Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Approval Date
              </label>
              <input
                type="text"
                value={data.approvalDate || ""}
                onChange={(e) => setData((prev) => ({ ...prev, approvalDate: e.target.value }))}
                className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none"
                placeholder="e.g. 1996 or specific DD/MM/YYYY"
              />
            </div>

            {/* Registration Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Registration Date
              </label>
              <input
                type="text"
                value={data.registrationDate || ""}
                onChange={(e) => setData((prev) => ({ ...prev, registrationDate: e.target.value }))}
                className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none"
                placeholder="e.g. 1996 or specific DD/MM/YYYY"
              />
            </div>

            {/* Government Order / Memo Reference */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Government Order / Memo Reference
              </label>
              <input
                type="text"
                value={data.governmentOrderReference || ""}
                onChange={(e) => setData((prev) => ({ ...prev, governmentOrderReference: e.target.value }))}
                className="w-full text-xs font-mono border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none"
                placeholder="e.g. GO No. / Memo Reference from original order"
              />
            </div>

            {/* Authorized Officer's Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Authorized Officer&apos;s Name
              </label>
              <input
                type="text"
                value={data.authorizedOfficerName || ""}
                onChange={(e) => setData((prev) => ({ ...prev, authorizedOfficerName: e.target.value }))}
                className="w-full text-xs font-medium border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none"
                placeholder="Name of approving officer on the official document"
              />
            </div>

            {/* Authorized Officer's Official Designation */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Authorized Officer&apos;s Official Designation
              </label>
              <input
                type="text"
                value={data.authorizedOfficerDesignation || ""}
                onChange={(e) => setData((prev) => ({ ...prev, authorizedOfficerDesignation: e.target.value }))}
                className="w-full text-xs font-medium border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none"
                placeholder="e.g. Deputy Secretary / Registrar / Director"
              />
            </div>

            {/* Official Approval Document Title / Label */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Primary Approval Document Title
              </label>
              <input
                type="text"
                value={data.officialApprovalDocumentTitle || ""}
                onChange={(e) => setData((prev) => ({ ...prev, officialApprovalDocumentTitle: e.target.value }))}
                className="w-full text-xs font-medium border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none"
                placeholder="e.g. Institutional Establishment &amp; Registration Order"
              />
            </div>
          </div>

          {/* Recognition Details Narrative */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Recognition Details &amp; Institutional Scope (প্রাতিষ্ঠানিক বিবৃতি)
            </label>
            <textarea
              rows={3}
              value={data.recognitionDetails || ""}
              onChange={(e) => setData((prev) => ({ ...prev, recognitionDetails: e.target.value }))}
              className="w-full text-xs font-normal border border-gray-300 rounded-xl p-3 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none leading-relaxed"
              placeholder="Enter comprehensive recognition statement or institutional scope description."
            />
          </div>
        </div>

        {/* 3. Official Documents & Supporting Gazette Files Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#006a4e]" />
                <span>Uploaded Official Supporting Documents ({(data.documents || []).length})</span>
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Upload verified official certificates, gazette references, or letters for public viewing and download.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingDoc(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006a4e] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Attach New Document</span>
            </button>
          </div>

          {/* New Document Dialog / Inline Form */}
          {isAddingDoc && (
            <div className="p-4 bg-emerald-50/40 border border-emerald-300 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Attach Official Document to Registry
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingDoc(false)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Document Title</label>
                  <input
                    type="text"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="e.g. Official Registration Certificate"
                    className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Document Category</label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white"
                  >
                    <option value="Registration Certificate">Registration Certificate</option>
                    <option value="Government Approval Letter">Government Approval Letter</option>
                    <option value="Official Gazette Reference">Official Gazette Reference</option>
                    <option value="Government Order / Memo">Government Order / Memo</option>
                    <option value="Institutional Charter">Institutional Charter</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Memo / Reference No.</label>
                  <input
                    type="text"
                    value={newDocMemo}
                    onChange={(e) => setNewDocMemo(e.target.value)}
                    placeholder="e.g. Memo Ref No."
                    className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Issue Date</label>
                  <input
                    type="text"
                    value={newDocDate}
                    onChange={(e) => setNewDocDate(e.target.value)}
                    placeholder="e.g. 1996"
                    className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white"
                  />
                </div>
              </div>

              {/* File Attachment */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#006a4e]" />
                  <span>Choose PDF / Image File</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleDocumentFileUpload}
                    className="hidden"
                  />
                </label>
                {newDocFileName && (
                  <span className="text-xs font-medium text-emerald-800">
                    Selected: <strong>{newDocFileName}</strong> ({newDocFileSize})
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleAddDocument}
                  className="ml-auto bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs cursor-pointer"
                >
                  Confirm &amp; Add Document
                </button>
              </div>
            </div>
          )}

          {/* Documents Table / List */}
          {(!data.documents || data.documents.length === 0) ? (
            <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center space-y-1.5">
              <FileQuestion className="w-6 h-6 text-gray-400 mx-auto" />
              <p className="text-xs font-bold text-gray-700">No official documents attached yet.</p>
              <p className="text-[11px] text-gray-500 max-w-md mx-auto">
                Documents attached here will be presented with a clean &quot;View Document&quot; and &quot;Download Document&quot; option on the public website.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
              {data.documents.map((doc, idx) => (
                <div key={doc.id || idx} className="p-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006a4e] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{doc.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                        <span className="bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-700">{doc.documentType}</span>
                        {doc.memoReference && <span>Ref: <strong className="font-mono">{doc.memoReference}</strong></span>}
                        {doc.issueDate && <span>Date: {doc.issueDate}</span>}
                        {doc.fileSize && <span>Size: {doc.fileSize}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {doc.fileData && (
                      <a
                        href={doc.fileData}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006a4e] hover:underline px-2.5 py-1 bg-emerald-50 rounded-md"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Recognition Data</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
