import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Send, Camera } from "lucide-react";
import { tags } from "../data/photos";

export default function FloatingAddButton({ onAddPhoto }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", wish: "", tag: "Best Friend", image: "" });
  const [preview, setPreview] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.wish.trim()) return;

    const newPhoto = {
      id: Date.now(),
      name: form.name.trim(),
      wish: form.wish.trim(),
      tag: form.tag,
      image: form.image.trim() || `https://picsum.photos/seed/${Date.now()}/600/700`,
      color: "#e879f9",
    };

    onAddPhoto(newPhoto);
    setForm({ name: "", wish: "", tag: "Best Friend", image: "" });
    setPreview(null);
    setIsOpen(false);
  };

  const handleImageChange = (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, image: val }));
    if (val.startsWith("http")) setPreview(val);
    else setPreview(null);
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
                {/* Name */}
                <div>
                  <label className="block text-xs font-body font-semibold text-purple-300 mb-1.5">
                    Person's Name *
                  </label>
                  <input
                    id="add-name-input"
                    type="text"
                    placeholder="e.g. Sophia"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    className="w-full bg-white/5 border border-purple-500/30 rounded-xl px-3 py-2.5 text-sm font-body text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400/60 transition-colors"
                  />
                </div>

                {/* Wish */}
                <div>
                  <label className="block text-xs font-body font-semibold text-purple-300 mb-1.5">
                    Birthday Wish *
                  </label>
                  <textarea
                    id="add-wish-input"
                    placeholder="Write a heartfelt message..."
                    value={form.wish}
                    onChange={(e) => setForm((f) => ({ ...f, wish: e.target.value }))}
                    required
                    rows={3}
                    className="w-full bg-white/5 border border-purple-500/30 rounded-xl px-3 py-2.5 text-sm font-body text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400/60 transition-colors resize-none"
                  />
                </div>

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

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-body font-semibold text-purple-300 mb-1.5">
                    Image URL (optional)
                  </label>
                  <input
                    id="add-image-input"
                    type="url"
                    placeholder="https://... (or auto-generated)"
                    value={form.image}
                    onChange={handleImageChange}
                    className="w-full bg-white/5 border border-purple-500/30 rounded-xl px-3 py-2.5 text-sm font-body text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400/60 transition-colors"
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 w-full h-20 object-cover rounded-lg border border-purple-500/30"
                    />
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
                  Add Wish 🎉
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
