import {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    useLanguage
} from "../context/LanguageContext";

import "./ReturnedLoans.css";
import "./SearchBar.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";
    
function ReturnedLoans() {
    const { t } =
        useLanguage();

    const [loans, setLoans] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [selectedLoan, setSelectedLoan] =
        useState(null);

    const [saving, setSaving] =
        useState(false);

    const [form, setForm] =
        useState({
            name: "",
            phone: "",
            email: "",
            address: "",
            location: "",

            allotmentNumber: "",

            metalType: "Gold",
            itemDescription: "",
            grossWeight: "",
            netWeight: "",
            principalAmount: "",
            interestRate: "",
            loanDate: "",
            returnDate: "",
            notes: ""
        });

    const getHeaders = () => ({
        Authorization:
            `Bearer ${localStorage.getItem("token")}`
    });

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const response =
                await axios.get(
                    `${API_URL}/api/loans`,
                    {
                        headers:
                            getHeaders()
                    }
                );

            const returned =
                (
                    response.data.loans ||
                    []
                ).filter(
                    (loan) =>
                        loan.status ===
                        "Closed"
                );

            setLoans(
                returned
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLoans =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return loans;
            }

            return loans.filter(
                (loan) => {
                    const searchableText =
                        [
                            loan.entryNumber,
                            loan.allotmentNumber,
                            loan.loanId,

                            loan.client?.clientId,
                            loan.client?.name,
                            loan.client?.phone,
                            loan.client?.email,
                            loan.client?.address,
                            loan.client?.location,

                            loan.location,
                            loan.metalType,
                            loan.itemDescription,

                            loan.principalAmount,
                            loan.interestRate,
                            loan.loanDate,
                            loan.returnDate,

                            loan.finalAmount,
                            loan.interestAmount
                        ]
                            .filter(
                                (value) =>
                                    value !== null &&
                                    value !== undefined
                            )
                            .join(" ")
                            .toLowerCase();

                    return searchableText.includes(
                        query
                    );
                }
            );
        }, [
            loans,
            search
        ]);

    const openEdit = (
        loan
    ) => {
        setSelectedLoan(
            loan
        );

        setForm({
            name:
                loan.client?.name ||
                "",

            phone:
                loan.client?.phone ||
                "",

            email:
                loan.client?.email ||
                "",

            address:
                loan.client?.address ||
                "",

            location:
                loan.location ||
                loan.client?.location ||
                "",

            allotmentNumber:
                loan.allotmentNumber ||
                "",

            metalType:
                loan.metalType ||
                "Gold",

            itemDescription:
                loan.itemDescription ||
                "",

            grossWeight:
                loan.grossWeight ??
                "",

            netWeight:
                loan.netWeight ??
                "",

            principalAmount:
                loan.principalAmount ??
                "",

            interestRate:
                loan.interestRate ??
                "",

            loanDate:
                loan.loanDate
                    ? loan.loanDate.split(
                          "T"
                      )[0]
                    : "",

            returnDate:
                loan.returnDate
                    ? loan.returnDate.split(
                          "T"
                      )[0]
                    : "",

            notes:
                loan.notes ||
                ""
        });
    };

    const closeEdit = () => {
        setSelectedLoan(
            null
        );
    };

    const handleChange = (
        e
    ) => {
        const {
            name,
            value
        } = e.target;

        setForm(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );
    };

    const saveChanges =
        async (e) => {
            e.preventDefault();

            try {
                setSaving(true);

                await axios.put(
                    `${API_URL}/api/loans/${selectedLoan._id}`,
                    form,
                    {
                        headers:
                            getHeaders()
                    }
                );

                closeEdit();

                await fetchLoans();

                alert(
                    t(
                        "returnedLoanUpdated"
                    )
                );
            } catch (error) {
                alert(
                    error.response?.data?.message ||
                        "Unable to update returned loan."
                );
            } finally {
                setSaving(false);
            }
        };

    if (loading) {
        return (
            <div className="page-loading">
                Loading...
            </div>
        );
    }

    return (
        <div className="loans-page">

            <section className="page-title">

                <div>

                    <h2>
                        {t(
                            "returnedLoansTitle"
                        )}
                    </h2>

                    <p>
                        {t(
                            "returnedLoansSubtitle"
                        )}
                    </p>

                </div>

                <div className="page-count">
                    {
                        filteredLoans.length
                    }
                </div>

            </section>


            {/* SEARCH */}

            <section className="search-section">

                <div className="search-box">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder={t(
                            "searchReturnedPlaceholder"
                        )}
                    />

                    {search && (
                        <button
                            type="button"
                            className="clear-search-button"
                            onClick={() =>
                                setSearch("")
                            }
                            title={t(
                                "clearSearch"
                            )}
                        >
                            ×
                        </button>
                    )}

                </div>

            </section>


            {/* TABLE */}

            <section className="panel loans-table-panel">

                {filteredLoans.length ===
                0 ? (

                    <div className="empty-state">

                        {search
                            ? t(
                                  "noSearchResults"
                              )
                            : t(
                                  "noReturnedLoans"
                              )}

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        {t(
                                            "entryNumber"
                                        )}
                                    </th>

                                    <th>
                                        {t(
                                            "allotmentNumber"
                                        )}
                                    </th>

                                    <th>
                                        {t(
                                            "loanId"
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
                                            "interest"
                                        )}
                                    </th>

                                    <th>
                                        {t(
                                            "finalAmount"
                                        )}
                                    </th>

                                    <th>
                                        {t(
                                            "returnDate"
                                        )}
                                    </th>

                                    <th>
                                        {t(
                                            "action"
                                        )}
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredLoans.map(
                                    (
                                        loan
                                    ) => (
                                        <tr
                                            key={
                                                loan._id
                                            }
                                        >

                                            <td>
                                                <strong>
                                                    {String(
                                                        loan.entryNumber ??
                                                            "-"
                                                    ).padStart(
                                                        4,
                                                        "0"
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    loan.allotmentNumber ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    loan.loanId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    loan.client
                                                        ?.name ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    loan.metalType
                                                }
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    loan.principalAmount ||
                                                        0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits:
                                                            2
                                                    }
                                                )}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    loan.interestAmount ||
                                                        0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits:
                                                            2
                                                    }
                                                )}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    loan.finalAmount ||
                                                        0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits:
                                                            2
                                                    }
                                                )}
                                            </td>

                                            <td>
                                                {loan.returnDate
                                                    ? new Date(
                                                          loan.returnDate
                                                      ).toLocaleDateString(
                                                          "en-IN"
                                                      )
                                                    : "-"}
                                            </td>

                                            <td>

                                                <button
                                                    className="return-button"
                                                    onClick={() =>
                                                        openEdit(
                                                            loan
                                                        )
                                                    }
                                                >
                                                    {t(
                                                        "edit"
                                                    )}
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </section>


            {/* EDIT MODAL */}

            {selectedLoan && (

                <div className="modal-overlay">

                    <div className="return-modal edit-loan-modal">

                        <div className="modal-header">

                            <div>

                                <h3>
                                    {t(
                                        "editReturnedLoan"
                                    )}
                                </h3>

                                <p>
                                    {
                                        selectedLoan.client
                                            ?.name
                                    }
                                    {" — "}
                                    {
                                        selectedLoan.loanId
                                    }
                                </p>

                            </div>

                            <button
                                className="close-button"
                                onClick={
                                    closeEdit
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* IDENTIFIERS */}

                        <div className="return-details">

                            <div>

                                <span>
                                    {t(
                                        "entryNumber"
                                    )}
                                </span>

                                <strong>
                                    {String(
                                        selectedLoan.entryNumber ??
                                            "-"
                                    ).padStart(
                                        4,
                                        "0"
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    {t(
                                        "allotmentNumber"
                                    )}
                                </span>

                                <strong>
                                    {
                                        selectedLoan.allotmentNumber ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    {t(
                                        "loanId"
                                    )}
                                </span>

                                <strong>
                                    {
                                        selectedLoan.loanId
                                    }
                                </strong>

                            </div>

                        </div>


                        <form
                            onSubmit={
                                saveChanges
                            }
                        >

                            {/* CLIENT DETAILS */}

                            <div className="form-section">

                                <h4>
                                    {t(
                                        "clientDetails"
                                    )}
                                </h4>


                                <div className="form-grid">

                                    <div className="form-field">

                                        <label>
                                            {t(
                                                "fullName"
                                            )}
                                        </label>

                                        <input
                                            name="name"
                                            value={
                                                form.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="form-field">

                                        <label>
                                            {t(
                                                "phone"
                                            )}
                                        </label>

                                        <input
                                            name="phone"
                                            value={
                                                form.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="form-field">

                                        <label>
                                            {t(
                                                "email"
                                            )}
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                form.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>


                                    <div className="form-field">

                                        <label>
                                            {t(
                                                "location"
                                            )}
                                        </label>

                                        <input
                                            name="location"
                                            value={
                                                form.location
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="form-field form-field-full">

                                        <label>
                                            {t(
                                                "address"
                                            )}
                                        </label>

                                        <input
                                            name="address"
                                            value={
                                                form.address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* LOAN DETAILS */}

                            <div className="form-section">

                                <h4>
                                    {t(
                                        "loanDetails"
                                    )}
                                </h4>


                                <div className="form-grid">

                                    <div className="form-field">

                                        <label>
                                            {t(
                                                "allotmentNumber"
                                            )}
                                        </label>

                                        <input
                                            type="text"
                                            name="allotmentNumber"
                                            value={
                                                form.allotmentNumber
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder={t(
                                                "allotmentNumberPlaceholder"
                                            )}
                                            required
                                        />

                                    </div>


                                    <div className="form-field">

                                        <label>
                                            {t(
                                                "metalType"
                                            )}
                                        </label>

                                        <select
                                            name="metalType"
                                            value={
                                                form.metalType
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="Gold">
                                                {t(
                                                    "gold"
                                                )}
                                            </option>

                                            <option value="Silver">
                                                {t(
                                                    "silver"
                                                )}
                                            </option>

                                        </select>

                                    </div>


                                    <div className="form-field">

                                        <label>
                                            {t(
                                                "itemDescription"
                                            )}
                                        </label>

                                        <input
                                            name="itemDescription"
                                            value={
                                                form.itemDescription
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="form-field">

                                        <label>
                                            {t(
                                                "grossWeight"
                                            )}
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="grossWeight"
                                            value={
                                                form.grossWeight
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="form-field">

                                        <label>
                                            {t(
                                                "netWeight"
                                            )}
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="netWeight"
                                            value={
                                                form.netWeight
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="form-field">

                                        <label>
                                            {t(
                                                "principalAmount"
                                            )}
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="principalAmount"
                                            value={
                                                form.principalAmount
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="form-field">

                                        <label>
                                            {t(
                                                "interestRate"
                                            )}
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="interestRate"
                                            value={
                                                form.interestRate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="form-field">

                                        <label>
                                            {t(
                                                "loanDate"
                                            )}
                                        </label>

                                        <input
                                            type="date"
                                            name="loanDate"
                                            value={
                                                form.loanDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="form-field">

                                        <label>
                                            {t(
                                                "returnDate"
                                            )}
                                        </label>

                                        <input
                                            type="date"
                                            name="returnDate"
                                            value={
                                                form.returnDate
                                            }
                                            min={
                                                form.loanDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="form-field form-field-full">

                                        <label>
                                            {t(
                                                "notes"
                                            )}
                                        </label>

                                        <textarea
                                            name="notes"
                                            value={
                                                form.notes
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            rows="3"
                                        />

                                    </div>

                                </div>

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={
                                        closeEdit
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    {t(
                                        "cancel"
                                    )}
                                </button>


                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={
                                        saving
                                    }
                                >
                                    {saving
                                        ? t(
                                              "saving"
                                          )
                                        : t(
                                              "saveChanges"
                                          )}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default ReturnedLoans;
