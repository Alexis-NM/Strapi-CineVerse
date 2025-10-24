import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ isOpen, onClose, title, message, buttonText = "OK", className = "", }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Fenêtre modale */}
          <motion.div
            className={`bg-gray-900 text-white rounded-2xl p-6 w-85 text-center shadow-lg ${className}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h3 className="text-2xl font-bold mb-3 text-[#e50000]">{title}</h3>
            <p className="text-gray-300 mb-6">{message}</p>
            <button
              onClick={onClose}
              className="bg-[#e50000] hover:bg-[#ff1a1a] text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              {buttonText}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
