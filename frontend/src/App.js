import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Actors from "./pages/Actors";
import Filmmakers from "./pages/Filmmakers";
import Login from "./pages/Login";
import Register from "./pages/Register";

// 🧩 Layout gérant dynamiquement l’affichage du Header
function Layout({ children }) {
  const location = useLocation();

  // Liste des pages sans Header
  const hideHeaderRoutes = ["/login", "/register"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!shouldHideHeader && <Header />} {/* header caché sur login/register */}
      <main className="flex-grow">{children}</main>
      <Footer /> {/* le footer s'affiche sur toutes les pages */}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Redirection par défaut */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* Routes publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Routes protégées */}
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/actors"
              element={
                <PrivateRoute>
                  <Actors />
                </PrivateRoute>
              }
            />
            <Route
              path="/filmmakers"
              element={
                <PrivateRoute>
                  <Filmmakers />
                </PrivateRoute>
              }
            />

            {/* Redirection en cas d’erreur de route */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
