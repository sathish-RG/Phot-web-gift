import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Send, Camera } from "lucide-react";
import { tags } from "../data/photos";

export default function FloatingAddButton({ onAddPhoto }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ type: "wish", name: "", wish: "", tag: "Best Friend", image: "" });
  const [previews, setPreviews] = useState([]);
  const [fileObjs, setFileObjs] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.type === "wish" && !form.name.trim()) return;
    if (form.type === "wish" && !form.wish.trim()) return;

    const uploadItem = async (fileObj = null) => {
      let imageBase64 = null;
      if (fileObj) {
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(fileObj);
        });
      }

      const payload = {
        type: form.type,
        name: form.name.trim(),
        wish: form.type === "wish" ? form.wish.trim() : "",
        tag: form.tag,
        imageBase64
      };

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.photo) {
          onAddPhoto(data.photo);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };

    if (fileObjs.length > 0) {
      for (const fileObj of fileObjs) {
        await uploadItem(fileObj);
      }
    } else {
      await uploadItem(null);
    }

    setForm({ type: "wish", name: "", wish: "", tag: "Best Friend", image: "" });
    setPreviews([]);
    setFileObjs([]);
    setIsOpen(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFileObjs(files);
      setPreviews(files.map(f => URL.createObjectURL(f)));
      setForm((f) => ({ ...f, image: "" }));
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.85, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 60 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-24 right-4 sm:right-8 z-50 w-[calc(100vw-2rem)] max-w-sm flex flex-col max-h-[calc(100dvh-7rem)]"
          >
            <div className="glass-card flex flex-col h-full rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-900/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 px-5 py-4 flex items-center justify-between border-b border-white/10">
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <Camera size={16} className="text-pink-400" />
                  Add Birthday Wish
                </h3>
                <button
                  id="close-add-modal"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 overscroll-contain scrollbar-hide">
                {/* Type Selection */}
                <div className="flex bg-black/40 p-1 rounded-xl w-full border border-purple-500/20">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: "wish" }))}
                    className={`flex-1 py-1.5 text-xs font-body font-semibold rounded-lg transition-colors ${
                      form.type === "wish" ? "bg-purple-600 text-white shadow" : "text-purple-300 hover:text-white"
                    }`}
                  >
                    Gamified Wish
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: "normal" }))}
                    className={`flex-1 py-1.5 text-xs font-body font-semibold rounded-lg transition-colors ${
                      form.type === "normal" ? "bg-pink-600 text-white shadow" : "text-purple-300 hover:text-white"
                    }`}
                  >
                    Static Image
                  </button>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-body font-semibold text-purple-300 mb-1.5">
                    Person's Name {form.type === "wish" ? "*" : "(optional)"}
                  </label>
                  <input
                    id="add-name-input"
                    type="text"
                    placeholder="e.g. Sophia"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required={form.type === "wish"}
                    className="w-full bg-white/5 border border-purple-500/30 rounded-xl px-3 py-2.5 text-sm font-body text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400/60 transition-colors"
                  />
                </div>

                {/* Wish (Only shown if type is 'wish') */}
                {form.type === "wish" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <label className="block text-xs font-body font-semibold text-purple-300 mb-1.5">
                      Birthday Wish *
                    </label>
                    <textarea
                      id="add-wish-input"
                      placeholder="Write a heartfelt message..."
                      value={form.wish}
                      onChange={(e) => setForm((f) => ({ ...f, wish: e.target.value }))}
                      required={form.type === "wish"}
                      rows={3}
                      className="w-full bg-white/5 border border-purple-500/30 rounded-xl px-3 py-2.5 text-sm font-body text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400/60 transition-colors resize-none"
                    />
                  </motion.div>
                )}

                {/* Tag */}
                <div>
                  <label className="block text-xs font-body font-semibold text-purple-300 mb-1.5">
                    Relationship Tag
                  </label>
                  <select
                    id="add-tag-select"
                    value={form.tag}
                    onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                    className="w-full bg-white/5 border border-purple-500/30 rounded-xl px-3 py-2.5 text-sm font-body text-white focus:outline-none focus:border-purple-400/60 transition-colors cursor-pointer"
                  >
                    {tags.filter((t) => t !== "All").map((t) => (
                      <option key={t} value={t} className="bg-purple-950 text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-body font-semibold text-purple-300 mb-1.5">
                    Upload Image
                  </label>
                  <label className="flex items-center justify-center w-full bg-white/5 border border-dashed border-purple-500/50 rounded-xl px-3 py-4 text-sm font-body text-purple-300 hover:bg-white/10 transition-colors cursor-pointer group">
                    <input
                      id="add-image-input"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Camera size={20} />
                      <span className="text-xs">Tap to choose images (multiple allowed)</span>
                    </div>
                  </label>
                  {previews.length > 0 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide py-1">
                      {previews.map((p, i) => (
                        <img
                          key={i}
                          src={p}
                          alt="Preview"
                          className="w-20 h-20 shrink-0 object-cover rounded-lg border border-purple-500/30"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <motion.button
                  id="add-submit-btn"
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-body font-bold text-sm py-3 rounded-xl shadow-lg shadow-purple-900/50 transition-all cursor-pointer"
                >
                  <Send size={15} />
                  {form.type === "wish" ? "Add Wish 🎉" : "Add Image 📸"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        id="floating-add-btn"
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
        className="fixed bottom-6 right-4 sm:right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-purple-900/60 cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #a855f7, #ec4899)",
        }}
        aria-label="Add wish"
      >
        <Plus size={24} className="text-white" strokeWidth={2.5} />

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "rgba(168,85,247,0.4)" }}
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.button>
    </>
  );
}
