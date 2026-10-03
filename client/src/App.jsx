import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    NavLink,
    useLocation,
    useNavigate
} from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "axios";

import Dashboard from "./pages/Dashboard";
import NewLoan from "./pages/newLoan";
import ActiveLoans from "./pages/ActiveLoans";
import ReturnedLoans from "./pages/ReturnedLoans";

import {
    LanguageProvider,
    useLanguage
} from "./context/LanguageContext";

import {
    ThemeProvider,
    useTheme
} from "./context/ThemeContext";

import "./App.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/login`,
                {
                    email: email.trim(),
                    password
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            window.location.href = "/dashboard";
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo">
                        GL
                    </div>

                    <h1>
                        Gold & Silver Lending
                    </h1>

                    <p>
                        Management Platform
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>
                </form>

                <div className="login-footer">
                    Secure lending management system
                </div>
            </div>
        </div>
    );
}

function ProtectedRoute({ children }) {
    const token =
        localStorage.getItem("token");

    if (!token) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
}

function AppShell({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        language,
        toggleLanguage,
        t
    } = useLanguage();

    const {
        theme,
        toggleTheme
    } = useTheme();

    const [user, setUser] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    useEffect(() => {
        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            return;
        }

        try {
            setUser(JSON.parse(storedUser));
        } catch (error) {
            console.error(
                "Unable to read stored user:",
                error
            );
        }
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    const isDashboard =
        location.pathname === "/dashboard";

    const getPageName = () => {
        if (
            location.pathname ===
            "/new-loan"
        ) {
            return t("newLoan");
        }

        if (
            location.pathname ===
            "/active-loans"
        ) {
            return t("activeLoans");
        }

        if (
            location.pathname ===
            "/returned-loans"
        ) {
            return t("returnedLoans");
        }

        return t("dashboard");
    };

    const navClass = ({ isActive }) =>
        isActive
            ? "app-nav-link active"
            : "app-nav-link";

    const mobileNavClass = ({ isActive }) =>
        isActive
            ? "mobile-nav-link active"
            : "mobile-nav-link";

    return (
        <div className="app-shell">

            <header className="app-header">

                <div className="app-brand">

                    <div className="app-brand-logo">
                        GL
                    </div>

                    <div className="app-brand-text">
                        <strong>
                            GoldLedger
                        </strong>

                        <span>
                            {t("lendingManagement")}
                        </span>
                    </div>

                </div>

                <nav className="desktop-navigation">

                    <NavLink
                        to="/dashboard"
                        end
                        className={navClass}
                    >
                        {t("dashboard")}
                    </NavLink>

                    <NavLink
                        to="/new-loan"
                        className={navClass}
                    >
                        + {t("newLoan")}
                    </NavLink>

                    <NavLink
                        to="/active-loans"
                        className={navClass}
                    >
                        {t("activeLoans")}
                    </NavLink>

                    <NavLink
                        to="/returned-loans"
                        className={navClass}
                    >
                        {t("returnedLoans")}
                    </NavLink>

                </nav>

                <div className="app-header-actions">

                    <button
                        type="button"
                        className="header-icon-button"
                        onClick={toggleTheme}
                        title={
                            theme === "light"
                                ? "Switch to dark theme"
                                : "Switch to light theme"
                        }
                    >
                        {theme === "light"
                            ? "☾"
                            : "☀"}
                    </button>

                    <button
                        type="button"
                        className="language-toggle"
                        onClick={toggleLanguage}
                    >
                        {language === "en"
                            ? t("hindi")
                            : t("english")}
                    </button>

                    <div className="user-summary">

                        <div className="user-avatar">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"}
                        </div>

                        <div className="user-summary-text">

                            <strong>
                                {user?.name ||
                                    "User"}
                            </strong>

                            <span>
                                {user?.role ===
                                "admin"
                                    ? t("admin")
                                    : t("user")}
                            </span>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={logout}
                    >
                        {t("logout")}
                    </button>

                </div>

                <button
                    type="button"
                    className="mobile-menu-button"
                    onClick={() =>
                        setMobileMenuOpen(
                            (current) =>
                                !current
                        )
                    }
                    aria-label="Open navigation menu"
                >
                    {mobileMenuOpen
                        ? "×"
                        : "☰"}
                </button>

            </header>

            {mobileMenuOpen && (
                <div className="mobile-navigation">

                    <NavLink
                        to="/dashboard"
                        end
                        className={mobileNavClass}
                    >
                        {t("dashboard")}
                    </NavLink>

                    <NavLink
                        to="/new-loan"
                        className={mobileNavClass}
                    >
                        + {t("newLoan")}
                    </NavLink>

                    <NavLink
                        to="/active-loans"
                        className={mobileNavClass}
                    >
                        {t("activeLoans")}
                    </NavLink>

                    <NavLink
                        to="/returned-loans"
                        className={mobileNavClass}
                    >
                        {t("returnedLoans")}
                    </NavLink>

                    <div className="mobile-menu-divider" />

                    <button
                        type="button"
                        className="mobile-action-button"
                        onClick={toggleTheme}
                    >
                        {theme === "light"
                            ? "☾ Dark Theme"
                            : "☀ Light Theme"}
                    </button>

                    <button
                        type="button"
                        className="mobile-action-button"
                        onClick={toggleLanguage}
                    >
                        {language === "en"
                            ? t("hindi")
                            : t("english")}
                    </button>

                    <button
                        type="button"
                        className="mobile-action-button logout-mobile"
                        onClick={logout}
                    >
                        {t("logout")}
                    </button>

                </div>
            )}

            {!isDashboard && (
                <div className="page-navigation-bar">

                    <button
                        type="button"
                        className="back-dashboard-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        {t("backDashboard")}
                    </button>

                    <span>
                        {getPageName()}
                    </span>

                </div>
            )}

            <main className="app-content">
                {children}
            </main>

        </div>
    );
}

function App() {
    return (
        <ThemeProvider>

            <LanguageProvider>

                <BrowserRouter>

                    <Routes>

                        <Route
                            path="/"
                            element={<Login />}
                        />

                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <AppShell>
                                        <Dashboard />
                                    </AppShell>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/new-loan"
                            element={
                                <ProtectedRoute>
                                    <AppShell>
                                        <NewLoan />
                                    </AppShell>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/active-loans"
                            element={
                                <ProtectedRoute>
                                    <AppShell>
                                        <ActiveLoans />
                                    </AppShell>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/returned-loans"
                            element={
                                <ProtectedRoute>
                                    <AppShell>
                                        <ReturnedLoans />
                                    </AppShell>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="*"
                            element={
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            }
                        />

                    </Routes>

                </BrowserRouter>

            </LanguageProvider>

        </ThemeProvider>
    );
}

export default App;