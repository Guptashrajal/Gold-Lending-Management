import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

import "./Dashboard.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";
    
const Dashboard = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    const [clients, setClients] = useState([]);
    const [loans, setLoans] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const [clientsResponse, loansResponse] =
                    await Promise.all([
                        axios.get(
                            `${API_URL}/api/clients`,
                            config
                        ),
                        axios.get(
                            `${API_URL}/api/loans`,
                            config
                        )
                    ]);

                setClients(
                    clientsResponse.data?.clients || []
                );

                setLoans(
                    loansResponse.data?.loans || []
                );
            } catch (error) {
                console.error(
                    "Unable to load dashboard data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [token]);

    /* =========================================================
       LOAN DATA
    ========================================================= */

    const activeLoans = useMemo(() => {
        return loans.filter(
            (loan) =>
                loan.status === "Active" ||
                loan.status === "Overdue"
        );
    }, [loans]);

    const returnedLoans = useMemo(() => {
        return loans.filter(
            (loan) => loan.status === "Closed"
        );
    }, [loans]);

    const interestEarned = useMemo(() => {
        return returnedLoans.reduce(
            (total, loan) =>
                total +
                Number(loan.interestAmount || 0),
            0
        );
    }, [returnedLoans]);

    const principalRecovered = useMemo(() => {
        return returnedLoans.reduce(
            (total, loan) =>
                total +
                Number(loan.principalAmount || 0),
            0
        );
    }, [returnedLoans]);

    const activePrincipal = useMemo(() => {
        return activeLoans.reduce(
            (total, loan) =>
                total +
                Number(loan.principalAmount || 0),
            0
        );
    }, [activeLoans]);

    /* =========================================================
       SEARCH
    ========================================================= */

    const filteredLoans = useMemo(() => {
        const term = searchTerm
            .trim()
            .toLowerCase();

        if (!term) {
            return loans;
        }

        return loans.filter((loan) => {
            const client = loan.client || {};

            const searchableText = [
                loan.entryNumber,
                loan.allotmentNumber,
                loan.loanId,
                loan.location,
                loan.metalType,
                loan.itemDescription,
                loan.principalAmount,
                loan.interestRate,
                loan.status,
                client.name,
                client.phone,
                client.email,
                client.location
            ]
                .filter(
                    (value) =>
                        value !== undefined &&
                        value !== null
                )
                .join(" ")
                .toLowerCase();

            return searchableText.includes(term);
        });
    }, [loans, searchTerm]);

    const recentLoans = useMemo(() => {
        return filteredLoans.slice(0, 5);
    }, [filteredLoans]);

    /* =========================================================
       FORMATTERS
    ========================================================= */

    const formatCurrency = (value) => {
        return new Intl.NumberFormat(
            language === "hi" ? "en-IN" : "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        ).format(Number(value || 0));
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            language === "hi"
                ? "en-IN"
                : "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
    };

    const getStatusText = (status) => {
        if (status === "Active") {
            return t("active");
        }

        if (status === "Closed") {
            return t("closed");
        }

        if (status === "Overdue") {
            return t("overdue");
        }

        return status || "-";
    };

    const getStatusClass = (status) => {
        if (status === "Closed") {
            return "dashboard-status closed";
        }

        if (status === "Overdue") {
            return "dashboard-status overdue";
        }

        return "dashboard-status active";
    };

    const getClientName = (loan) => {
        if (
            loan?.client &&
            typeof loan.client === "object"
        ) {
            return loan.client.name || "-";
        }

        return "-";
    };

    return (
        <div className="dashboard-page-v2">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="dashboard-hero-v2">

                <div className="dashboard-hero-content">

                    <div className="dashboard-eyebrow">
                        {t("goldSilverLending") ||
                            "Gold & Silver Lending"}
                    </div>

                    <h1>
                        {t("dashboardTitle")}
                    </h1>

                    <p>
                        {t("dashboardSubtitle")}
                    </p>

                </div>

                <div className="dashboard-hero-actions">

                    <button
                        type="button"
                        className="dashboard-primary-button"
                        onClick={() =>
                            navigate("/new-loan")
                        }
                    >
                        + {t("newLoan")}
                    </button>

                </div>

            </section>

            {/* =====================================================
                SEARCH
            ===================================================== */}

            <section className="dashboard-search-section">

                <div className="dashboard-search-wrapper">

                    <span className="dashboard-search-icon">
                        ⌕
                    </span>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        placeholder={
                            t("searchDashboard") ||
                            "Search by client, entry number, allotment number, loan ID, phone, location..."
                        }
                        className="dashboard-search-input"
                    />

                    {searchTerm && (
                        <button
                            type="button"
                            className="dashboard-search-clear"
                            onClick={() =>
                                setSearchTerm("")
                            }
                        >
                            ×
                        </button>
                    )}

                </div>

                {searchTerm && (
                    <div className="dashboard-search-result-text">
                        {filteredLoans.length}{" "}
                        {filteredLoans.length === 1
                            ? t("matchingLoan")
                            : t("matchingLoans")}
                    </div>
                )}

            </section>

            {/* =====================================================
                KPI CARDS
                3 COLUMNS × 2 ROWS
            ===================================================== */}

            <section className="dashboard-stat-grid">

                {/* =================================================
                    1. TOTAL CLIENTS
                ================================================= */}

                <article className="dashboard-stat-card">

                    <div className="dashboard-stat-icon">
                        ♙
                    </div>

                    <div className="dashboard-stat-content">

                        <span className="dashboard-stat-label">
                            {t("totalClients")}
                        </span>

                        <strong className="dashboard-stat-value">
                            {loading
                                ? "—"
                                : clients.length}
                        </strong>

                        <span className="dashboard-stat-description">
                            {t("registeredClients")}
                        </span>

                    </div>

                </article>

                {/* =================================================
                    2. ACTIVE LOANS
                ================================================= */}

                <article className="dashboard-stat-card">

                    <div className="dashboard-stat-icon">
                        ◇
                    </div>

                    <div className="dashboard-stat-content">

                        <span className="dashboard-stat-label">
                            {t("activeLoanCount")}
                        </span>

                        <strong className="dashboard-stat-value">
                            {loading
                                ? "—"
                                : activeLoans.length}
                        </strong>

                        <span className="dashboard-stat-description">
                            {t("currentLendingRecords")}
                        </span>

                    </div>

                </article>

                {/* =================================================
                    3. ACTIVE PRINCIPAL
                ================================================= */}

                <article className="dashboard-stat-card">

                    <div className="dashboard-stat-icon currency">
                        ₹
                    </div>

                    <div className="dashboard-stat-content">

                        <span className="dashboard-stat-label">
                            {t("activePrincipal")}
                        </span>

                        <strong className="dashboard-stat-value currency-value">
                            {loading
                                ? "—"
                                : formatCurrency(
                                    activePrincipal
                                )}
                        </strong>

                        <span className="dashboard-stat-description">
                            {t("principalCurrentlyLent")}
                        </span>

                    </div>

                </article>

                {/* =================================================
                    4. INTEREST EARNED
                ================================================= */}

                <article className="dashboard-stat-card">

                    <div className="dashboard-stat-icon interest-icon">
                        ₹
                    </div>

                    <div className="dashboard-stat-content">

                        <span className="dashboard-stat-label">
                            {language === "hi"
                                ? "अर्जित ब्याज"
                                : "Interest Earned"}
                        </span>

                        <strong className="dashboard-stat-value currency-value">
                            {loading
                                ? "—"
                                : formatCurrency(
                                    interestEarned
                                )}
                        </strong>

                        <span className="dashboard-stat-description">
                            {language === "hi"
                                ? "लौटाए गए ऋणों से कुल ब्याज"
                                : "Total interest from returned loans"}
                        </span>

                    </div>

                </article>

                {/* =================================================
                    5. PRINCIPAL RECOVERED
                ================================================= */}

                <article className="dashboard-stat-card">

                    <div className="dashboard-stat-icon recovered-icon">
                        ✓
                    </div>

                    <div className="dashboard-stat-content">

                        <span className="dashboard-stat-label">
                            {language === "hi"
                                ? "वसूल किया गया मूलधन"
                                : "Principal Recovered"}
                        </span>

                        <strong className="dashboard-stat-value currency-value">
                            {loading
                                ? "—"
                                : formatCurrency(
                                    principalRecovered
                                )}
                        </strong>

                        <span className="dashboard-stat-description">
                            {language === "hi"
                                ? "लौटाए गए ऋणों का कुल मूलधन"
                                : "Total principal from returned loans"}
                        </span>

                    </div>

                </article>

                {/* =================================================
                    6. RETURNED LOANS
                ================================================= */}

                <article className="dashboard-stat-card">

                    <div className="dashboard-stat-icon returned-icon">
                        ↩
                    </div>

                    <div className="dashboard-stat-content">

                        <span className="dashboard-stat-label">
                            {language === "hi"
                                ? "लौटाए गए ऋण"
                                : "Returned Loans"}
                        </span>

                        <strong className="dashboard-stat-value">
                            {loading
                                ? "—"
                                : returnedLoans.length}
                        </strong>

                        <span className="dashboard-stat-description">
                            {language === "hi"
                                ? "पूरे किए गए ऋण रिकॉर्ड"
                                : "Completed lending records"}
                        </span>

                    </div>

                </article>

            </section>

            {/* =====================================================
                MAIN GRID
            ===================================================== */}

            <section className="dashboard-main-grid">

                {/* =================================================
                    RECENT ACTIVITY
                ================================================= */}

                <div className="dashboard-panel dashboard-activity-panel">

                    <div className="dashboard-panel-header">

                        <div>

                            <h2>
                                {t(
                                    "recentLendingActivity"
                                )}
                            </h2>

                            <p>
                                {t(
                                    "latestLoanEntries"
                                )}
                            </p>

                        </div>

                        <button
                            type="button"
                            className="dashboard-text-button"
                            onClick={() =>
                                navigate(
                                    "/active-loans"
                                )
                            }
                        >
                            {t("viewManageActiveLoans")}
                        </button>

                    </div>

                    <div className="dashboard-table-wrapper">

                        {loading ? (
                            <div className="dashboard-empty-state">
                                {t("loading")}
                            </div>
                        ) : recentLoans.length ===
                          0 ? (
                            <div className="dashboard-empty-state">
                                {searchTerm
                                    ? t(
                                          "noMatchingRecords"
                                      )
                                    : t("noRecords")}
                            </div>
                        ) : (
                            <table className="dashboard-table">

                                <thead>

                                    <tr>

                                        <th>
                                            {t(
                                                "entryNo"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "allotmentNo"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "client"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "metal"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "principal"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "status"
                                            )}
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {recentLoans.map(
                                        (loan) => (
                                            <tr
                                                key={
                                                    loan._id
                                                }
                                            >

                                                <td>

                                                    <span className="dashboard-entry-number">
                                                        {String(
                                                            loan.entryNumber ??
                                                                "-"
                                                        ).padStart(
                                                            4,
                                                            "0"
                                                        )}
                                                    </span>

                                                </td>

                                                <td>

                                                    <span className="dashboard-allotment-number">
                                                        {loan.allotmentNumber ||
                                                            "-"}
                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="dashboard-client-cell">

                                                        <strong>
                                                            {getClientName(
                                                                loan
                                                            )}
                                                        </strong>

                                                        {loan
                                                            .client
                                                            ?.phone && (
                                                            <span>
                                                                {
                                                                    loan
                                                                        .client
                                                                        .phone
                                                                }
                                                            </span>
                                                        )}

                                                    </div>

                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            loan.metalType ===
                                                            "Gold"
                                                                ? "dashboard-metal-badge gold"
                                                                : "dashboard-metal-badge silver"
                                                        }
                                                    >
                                                        {loan.metalType ===
                                                        "Gold"
                                                            ? t(
                                                                  "gold"
                                                              )
                                                            : t(
                                                                  "silver"
                                                              )}
                                                    </span>

                                                </td>

                                                <td>

                                                    <strong className="dashboard-money">
                                                        {formatCurrency(
                                                            loan.principalAmount
                                                        )}
                                                    </strong>

                                                </td>

                                                <td>

                                                    <span
                                                        className={getStatusClass(
                                                            loan.status
                                                        )}
                                                    >
                                                        {getStatusText(
                                                            loan.status
                                                        )}
                                                    </span>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>
                        )}

                    </div>

                </div>

                {/* =================================================
                    QUICK ACCESS
                ================================================= */}

                <div className="dashboard-panel dashboard-quick-panel">

                    <div className="dashboard-panel-header">

                        <div>

                            <h2>
                                {t("quickAccess")}
                            </h2>

                            <p>
                                {t(
                                    "frequentlyUsedSections"
                                )}
                            </p>

                        </div>

                    </div>

                    <div className="dashboard-quick-list">

                        <button
                            type="button"
                            className="dashboard-quick-item"
                            onClick={() =>
                                navigate(
                                    "/new-loan"
                                )
                            }
                        >

                            <span className="dashboard-quick-symbol">
                                +
                            </span>

                            <span className="dashboard-quick-text">

                                <strong>
                                    {t(
                                        "createNewLendingRecord"
                                    )}
                                </strong>

                                <small>
                                    {t(
                                        "newLoan"
                                    )}
                                </small>

                            </span>

                            <span className="dashboard-quick-arrow">
                                →
                            </span>

                        </button>

                        <button
                            type="button"
                            className="dashboard-quick-item"
                            onClick={() =>
                                navigate(
                                    "/active-loans"
                                )
                            }
                        >

                            <span className="dashboard-quick-symbol">
                                ◇
                            </span>

                            <span className="dashboard-quick-text">

                                <strong>
                                    {t(
                                        "activeLoans"
                                    )}
                                </strong>

                                <small>
                                    {t(
                                        "viewManageActiveLoans"
                                    )}
                                </small>

                            </span>

                            <span className="dashboard-quick-arrow">
                                →
                            </span>

                        </button>

                        <button
                            type="button"
                            className="dashboard-quick-item"
                            onClick={() =>
                                navigate(
                                    "/returned-loans"
                                )
                            }
                        >

                            <span className="dashboard-quick-symbol">
                                ✓
                            </span>

                            <span className="dashboard-quick-text">

                                <strong>
                                    {t(
                                        "returnedLoans"
                                    )}
                                </strong>

                                <small>
                                    {t(
                                        "viewCompletedLoanRecords"
                                    )}
                                </small>

                            </span>

                            <span className="dashboard-quick-arrow">
                                →
                            </span>

                        </button>

                    </div>

                    <div className="dashboard-quick-summary">

                        <div className="dashboard-summary-row">

                            <span>
                                {t("totalLoanRecords")}
                            </span>

                            <strong>
                                {loans.length}
                            </strong>

                        </div>

                        <div className="dashboard-summary-row">

                            <span>
                                {t("activeLoanCount")}
                            </span>

                            <strong>
                                {activeLoans.length}
                            </strong>

                        </div>

                        <div className="dashboard-summary-row">

                            <span>
                                {t("returnedRecords")}
                            </span>

                            <strong>
                                {returnedLoans.length}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================================
                INFORMATION PANEL
            ===================================================== */}

            <section className="dashboard-information-panel">

                <div className="dashboard-information-icon">
                    ◈
                </div>

                <div>

                    <h2>
                        {t("goldLedgerManagement")}
                    </h2>

                    <p>
                        {t("dashboardInfo")}
                    </p>

                </div>

            </section>

        </div>
    );
};

export default Dashboard;