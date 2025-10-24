import { useState } from "react";
import Modal from "./Modal";
import { LegalModalContext } from "../context/LegalModalContext";

export default function LegalModal({ children }) {
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleOpen = (type) => {
    const contents = {
      terms: {
        title: "Terms of Use",
        message: (
            <div className="space-y-3 text-gray-300 text-sm text-left">
                <p>
                Welcome to <strong>Cineverse</strong>! By using this platform, you agree to our terms of use.
                </p>
                <p>
                Cineverse provides movie information sourced from The Movie Database (TMDB).
                It is a non-commercial project and not affiliated with TMDB.
                </p>
                <ul className="list-disc list-inside">
                <li>Do not misuse the service.</li>
                <li>Provide accurate account information.</li>
                <li>Respect our community and content guidelines.</li>
                </ul>
                <p>For more details, contact: support@cineverse.app</p>
            </div>
            ),
      },
      privacy: {
        title: "Privacy Policy",
        message: (
            <div className="space-y-3 text-gray-300 text-sm text-left">
            <p>
                <strong>Cineverse</strong> values your privacy and handles your personal data in accordance
                with the <strong>General Data Protection Regulation (EU) 2016/679 (GDPR)</strong>.
            </p>

            <h4 className="font-semibold text-white mt-4">1. Data Controller</h4>
            <p>
                Cineverse (operated by <strong>Crunchers Studio</strong>) acts as the data controller for
                user accounts and site interactions.
            </p>

            <h4 className="font-semibold text-white mt-4">2. Data We Collect</h4>
            <ul className="list-disc list-inside space-y-1">
                <li>
                <strong>Account information:</strong> username, email, and password (encrypted).
                </li>
                <li>
                <strong>Technical data:</strong> browser type, device, and anonymous analytics used to
                improve the app.
                </li>
                <li>We do not collect sensitive personal data.</li>
            </ul>

            <h4 className="font-semibold text-white mt-4">3. Purpose of Processing</h4>
            <p>
                Your personal data is used exclusively to authenticate your account, maintain secure session
                access, and personalize your user experience.
            </p>

            <h4 className="font-semibold text-white mt-4">4. Legal Basis</h4>
            <p>
                Processing is based on your consent (<em>Article 6(1)(a) GDPR</em>) and the necessity to
                provide the requested service (<em>Article 6(1)(b) GDPR</em>).
            </p>

            <h4 className="font-semibold text-white mt-4">5. Data Storage & Security</h4>
            <p>
                Your personal data is securely stored within the European Union (or regions with equivalent
                protection standards). Passwords are encrypted using industry-standard security
                technologies.
            </p>

            <h4 className="font-semibold text-white mt-4">6. Data Sharing</h4>
            <p>
                We do not sell or rent your personal data. Data from{" "}
                <strong>The Movie Database (TMDB)</strong> is used for content display only — no personal
                data is ever shared with TMDB.
            </p>

            <h4 className="font-semibold text-white mt-4">7. Your Rights</h4>
            <p>
                In accordance with the GDPR, you have the right to access, rectify, delete, or port your
                personal data, and to withdraw consent at any time.
            </p>
            <p>
                Requests can be sent to:{" "}
                <a href="mailto:privacy@cineverse.app" className="text-[#e50000] hover:underline">
                privacy@cineverse.app
                </a>
            </p>

            <h4 className="font-semibold text-white mt-4">8. Retention Period</h4>
            <p>
                We retain your account data for as long as your account remains active or until deletion is
                requested.
            </p>

            <h4 className="font-semibold text-white mt-4">9. Contact</h4>
            <p>
                For privacy-related inquiries, please contact our Data Protection Officer (DPO) at:{" "}
                <a href="mailto:dpo@cineverse.app" className="text-[#e50000] hover:underline">
                dpo@cineverse.app
                </a>
            </p>
            </div>
        ),
        },

            legal: {
                title: "Legal Notice",
                message: (
            <div className="space-y-3 text-gray-300 text-sm text-left">
            <h4 className="font-semibold text-white">Website Operator</h4>
            <p>
                <strong>Cineverse</strong> — operated by <strong>Crunchers Studio</strong><br />
                14 rue de Beaune, 93100 Montreuil, France<br />
                Email:{" "}
                <a href="mailto:legal@cineverse.app" className="text-[#e50000] hover:underline">
                legal@cineverse.app
                </a>
            </p>
            <h4 className="font-semibold text-white mt-4">Hosting Provider</h4>
            <p>
                Coming soon
            </p>

            <h4 className="font-semibold text-white mt-4">Intellectual Property</h4>
            <p>
                All interface designs, logos, and source code are the property of <strong>Cineverse</strong>.
            </p>
            <p>
                All movie data, images, and metadata are provided by{" "}
                <strong>The Movie Database (TMDB)</strong> and belong to their respective owners. Cineverse
                complies with TMDB’s API Terms of Use, available at{" "}
                <a
                href="https://www.themoviedb.org/documentation/api/terms-of-use"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e50000] hover:underline"
                >
                themoviedb.org
                </a>.
            </p>

            <h4 className="font-semibold text-white mt-4">Disclaimer</h4>
            <p>
                Cineverse is a fan-made, educational, and informational project. It is not affiliated with or endorsed by TMDB, film studios, or distributors.
            </p>
            </div>
        ),
      },
      cookies: {
        title: "Cookie Settings",
        message: (
            <div className="space-y-3 text-gray-300 text-sm text-left">
            <p>
                <strong>Cineverse</strong> uses cookies and similar technologies to ensure proper functionality and improve your browsing experience.
            </p>

            <h4 className="font-semibold text-white mt-4">1. Types of Cookies</h4>
            <ul className="list-disc list-inside space-y-1">
                <li>
                <strong>Essential cookies:</strong> Required for authentication and secure access to your account.
                </li>
                <li>
                <strong>Functional cookies:</strong> Remember your preferences such as theme and language.
                </li>
                <li>
                <strong>Analytics cookies (optional):</strong> Collect anonymous usage data to help improve our features.
                </li>
            </ul>

            <h4 className="font-semibold text-white mt-4">2. Managing Cookies</h4>
            <p>
                You can choose to disable or adjust cookies in your browser settings. However, some features may not function properly without essential cookies.
            </p>

            <h4 className="font-semibold text-white mt-4">3. Consent</h4>
            <p>
                By continuing to use Cineverse, you consent to the use of essential cookies as described above.
            </p>

            <p>
                For more details, please review our{" "}
                <button
                onClick={() => handleOpen("privacy")}
                className="text-[#e50000] hover:underline"
                >
                Privacy Policy
                </button>{" "}
                or contact us at{" "}
                <a href="mailto:privacy@cineverse.app" className="text-[#e50000] hover:underline">
                privacy@cineverse.app
                </a>.
            </p>
            </div>
            ),
        },
    };

    setModalData({ isOpen: true, ...contents[type] });
  };

  const handleClose = () => setModalData({ isOpen: false, title: "", message: "" });

  return (
    <LegalModalContext.Provider value={{ handleOpen }}>
      {children}
      <Modal
        isOpen={modalData.isOpen}
        onClose={handleClose}
        title={modalData.title}
        message={modalData.message}
        buttonText="Close"
        className="w-[40rem] max-h-[80vh] overflow-y-auto text-left" // ✅ largeur élargie + scroll
      />
    </LegalModalContext.Provider>
  );
}
