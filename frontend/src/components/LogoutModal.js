import React from "react";
import { motion } from "framer-motion";

/**
 * Reusable modal.
 * - Props:
 *   - isOpen: boolean
 *   - onClose: () => void
 *   - title?: string
 *   - message?: string | React.ReactNode
 *   - actions?: Array<{ label: string, onClick: () => void, variant?: 'danger' | 'default' }>
 *
 * If actions is omitted, a single "OK" button is shown that calls onClose.
 */
export default function LogoutModal({
  isOpen,
  onClose,
  title,
  message,
  actions = [],
}) {
  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(e) => {
        // Close when clicking backdrop, but not when clicking inside the modal card
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full"
        initial={{ opacity: 0, scale: 0.95, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {title && <h2 className="text-xl font-bold mb-3">{title}</h2>}
        {message && <div className="text-gray-700 mb-6">{message}</div>}

        <div className="flex justify-end gap-3">
          {actions.length > 0 ? (
            actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className={`px-4 py-2 rounded-md transition
                  ${
                    action.variant === "danger"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
              >
                {action.label}
              </button>
            ))
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              OK
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
