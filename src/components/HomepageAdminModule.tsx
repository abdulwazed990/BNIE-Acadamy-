import { useState, useEffect, FormEvent } from "react";
import { 
  HomepageContentSettings 
} from "../types";
import { 
  fetchHomepageSettings, 
  saveHomepageSettings, 
  DEFAULT_HOMEPAGE_SETTINGS 
} from "../lib/homepageContentService";
import { 
  Save, RefreshCw, CheckCircle2, AlertCircle, LayoutTemplate, 
  Megaphone, Eye, EyeOff, Loader2, Sparkles, SlidersHorizontal 
} from "lucide-react";

export default function HomepageAdminModule() {
  const [settings, setSettings] = useState<HomepageContentSettings>(DEFAULT_HOMEPAGE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      setIsLoading(true);
      try {
        const loaded = await fetchHomepageSettings();
        if (isMounted) {
          setSettings(loaded);
        }
      } catch (err) {
        console.error("Failed to load homepage settings:", err);
        if (isMounted) {
          setErrorMessage("Failed to load latest homepage settings from database.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadSettings();
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
      await saveHomepageSettings(settings);
      setSuccessMessage("Homepage settings and contents saved permanently to database!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: unknown) {
      console.error("Failed to save homepage settings:", err);
      const msg = err instanceof Error ? err.message : "Unknown database error occurred.";
      setErrorMessage(`Save Failed: Could not write to persistent database. ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to restore default BNIE homepage texts and visibility settings?")) {
      setSettings({
        ...DEFAULT_HOMEPAGE_SETTINGS,
        updatedAt: new Date().toISOString()
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#006a4e] animate-spin mx-auto" />
        <p className="text-sm font-semibold text-gray-700">Loading Homepage Settings from Persistent Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#006a4e] text-xs font-bold mb-2">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Persistent Homepage CMS</span>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 font-sans">
            Homepage Content &amp; Section Visibility Controller
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Edit main titles, banner announcements, and manage which sections appear on the public homepage. All changes save directly to the Firestore database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center gap-3 text-xs font-bold animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main CMS Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: Announcement Banner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Urgent Notice &amp; Announcement Banner</h4>
                <p className="text-[11px] text-gray-500">Displayed at the top of the homepage for important institutional updates.</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isAnnouncementBannerActive}
                onChange={(e) => setSettings({ ...settings, isAnnouncementBannerActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a4e]"></div>
              <span className="ml-2 text-xs font-semibold text-gray-700">
                {settings.isAnnouncementBannerActive ? "Active" : "Hidden"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Announcement Message Text (নোটিশ বার্তা)
              </label>
              <input
                type="text"
                value={settings.announcementBannerText}
                onChange={(e) => setSettings({ ...settings, announcementBannerText: e.target.value })}
                placeholder="Enter alert notice..."
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Destination Link (Optional)
              </label>
              <input
                type="text"
                value={settings.announcementLink || ""}
                onChange={(e) => setSettings({ ...settings, announcementLink: e.target.value })}
                placeholder="/?page=notices"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono focus:border-[#006a4e] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Hero Titles & Welcome Paragraph */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006a4e] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Main Hero Headline &amp; Welcome Text</h4>
              <p className="text-[11px] text-gray-500">Bilingual titles, institutional branding and introductory welcome statement.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Primary Title in Bengali (বাংলা শিরোনাম) *
              </label>
              <input
                type="text"
                required
                value={settings.heroTitleBn}
                onChange={(e) => setSettings({ ...settings, heroTitleBn: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                English Sub-Heading *
              </label>
              <input
                type="text"
                required
                value={settings.heroTitleEn}
                onChange={(e) => setSettings({ ...settings, heroTitleEn: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Portal Tagline / Highlight Badge (সবুজ হাইলাইট শিরোনাম)
              </label>
              <input
                type="text"
                value={settings.heroSubtitleBn}
                onChange={(e) => setSettings({ ...settings, heroSubtitleBn: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Welcome Description Paragraph (বর্ণনামূলক বিবরণ) *
              </label>
              <textarea
                rows={4}
                required
                value={settings.heroSubtitleEn}
                onChange={(e) => setSettings({ ...settings, heroSubtitleEn: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-900 leading-relaxed font-normal focus:border-[#006a4e] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Homepage Main Sections Visibility */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Homepage Component Sections Visibility</h4>
              <p className="text-[11px] text-gray-500">Toggle entire sections on or off without removing their data.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: "isAccreditationVisible" as const, label: "Government Accreditation Section" },
              { key: "isDegreeProgramsVisible" as const, label: "Degree & Honours Programs Section" },
              { key: "isVocationalVisible" as const, label: "Vocational Specialization Section" },
              { key: "isDiplomaStreamsVisible" as const, label: "Diploma in Engineering Streams" },
              { key: "isMissionServicesVisible" as const, label: "Mission & Services Showcase" },
            ].map(({ key, label }) => {
              const isChecked = settings[key] !== false;
              return (
                <div
                  key={key}
                  onClick={() => setSettings({ ...settings, [key]: !isChecked })}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? "bg-emerald-50/50 border-emerald-300 text-emerald-900"
                      : "bg-gray-50 border-gray-200 text-gray-500 opacity-70"
                  }`}
                >
                  <span className="text-xs font-semibold">{label}</span>
                  {isChecked ? (
                    <Eye className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: Quick Access Action Cards Visibility */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Quick Access Navigation Cards Visibility</h4>
              <p className="text-[11px] text-gray-500">Control individual portal quick access buttons on the homepage.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: "isVcMessageCardVisible" as const, label: "উপাচার্যের শুভেচ্ছাপত্র (VC Welcome)" },
              { key: "isResultsCardVisible" as const, label: "পরীক্ষার ফলাফল ও মার্কশিট (Results Verification)" },
              { key: "isComplaintsCardVisible" as const, label: "অভিযোগ ও পরামর্শ (Complaints & Service)" },
              { key: "isFindProgramCardVisible" as const, label: "কোর্স তালিকা (Find Program)" },
              { key: "isHandbooksCardVisible" as const, label: "স্টুডেন্ট হ্যান্ডবুক (Handbooks)" },
              { key: "isAdmissionCardVisible" as const, label: "অনলাইন ভর্তি (Online Admission)" },
              { key: "isOsapsCardVisible" as const, label: "ওস্যাপস লগইন (OSAPS Login)" },
              { key: "isEbookCardVisible" as const, label: "ই-বুক ডিজিটাল লাইব্রেরি (E-Books)" },
              { key: "isWebmailCardVisible" as const, label: "ওয়েবমেইল (Webmail)" },
            ].map(({ key, label }) => {
              const isChecked = settings[key] !== false;
              return (
                <div
                  key={key}
                  onClick={() => setSettings({ ...settings, [key]: !isChecked })}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? "bg-purple-50/50 border-purple-300 text-purple-900"
                      : "bg-gray-50 border-gray-200 text-gray-500 opacity-70"
                  }`}
                >
                  <span className="text-xs font-semibold">{label}</span>
                  {isChecked ? (
                    <Eye className="w-4 h-4 text-purple-600 shrink-0" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button Bar */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Last Updated: <span className="font-mono font-semibold text-gray-700">{new Date(settings.updatedAt).toLocaleString()}</span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#006a4e] hover:bg-[#00563f] disabled:opacity-50 transition-all cursor-pointer shadow-md flex items-center gap-2 border border-[#00563f]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Persistent Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Homepage Content Permanently</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
