import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { useLanguage } from "../context/LanguageContext";

import "./ActiveLoans.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";
    
function ActiveLoans() {
    const { t } = useLanguage();

    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [editingLoan, setEditingLoan] =
        useState(null);

    const [editForm, setEditForm] = useState({
        allotmentNumber: "",
        name: "",
        phone: "",
        email: "",
        address: "",
        location: "",
        metalType: "Gold",
        itemDescription: "",
        grossWeight: "",
        netWeight: "",
        principalAmount: "",
        interestRate: "",
        loanDate: "",
        notes: ""
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [returnLoan, setReturnLoan] =
        useState(null);

    const [returnDate, setReturnDate] =
        useState("");

    const [returnCalculation, setReturnCalculation] =
        useState(null);

    const [returnLoading, setReturnLoading] =
        useState(false);

    const [returnError, setReturnError] =
        useState("");

    const getLoans = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response = await axios.get(
                `${API_URL}/api/loans/active`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setLoans(
                response.data.loans || []
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to retrieve active loans."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLoans();
    }, []);


    /* =====================================================
       SEARCH
    ===================================================== */

    const filteredLoans = useMemo(() => {
        const value =
            search.trim().toLowerCase();

        if (!value) {
            return loans;
        }

        return loans.filter((loan) => {
            const client =
                loan.client || {};

            const searchableText = [
                loan.entryNumber,
                loan.allotmentNumber,
                loan.loanId,
                loan.location,
                loan.metalType,
                loan.itemDescription,
                loan.principalAmount,
                loan.interestRate,
                loan.loanDate,
                client.name,
                client.phone,
                client.email,
                client.location
            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(value);
        });
    }, [loans, search]);


    /* =====================================================
       EDIT
    ===================================================== */

    const openEdit = (loan) => {
        const client =
            loan.client || {};

        setEditingLoan(loan);

        setEditForm({
            allotmentNumber:
                loan.allotmentNumber || "",

            name:
                client.name || "",

            phone:
                client.phone || "",

            email:
                client.email || "",

            address:
                client.address || "",

            location:
                loan.location ||
                client.location ||
                "",

            metalType:
                loan.metalType || "Gold",

            itemDescription:
                loan.itemDescription || "",

            grossWeight:
                loan.grossWeight ?? "",

            netWeight:
                loan.netWeight ?? "",

            principalAmount:
                loan.principalAmount ?? "",

            interestRate:
                loan.interestRate ?? "",

            loanDate:
                loan.loanDate
                    ? new Date(
                          loan.loanDate
                      )
                          .toISOString()
                          .split("T")[0]
                    : "",

            notes:
                loan.notes || ""
        });

        setError("");
        setSuccess("");
    };


    const closeEdit = () => {
        if (saving) {
            return;
        }

        setEditingLoan(null);
        setError("");
    };


    const handleEditChange = (e) => {
        const {
            name,
            value
        } = e.target;

        setEditForm(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );
    };


    const saveEdit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem("token");

            await axios.put(
                `${API_URL}/api/loans/${editingLoan._id}`,
                {
                    ...editForm,

                    grossWeight:
                        Number(
                            editForm.grossWeight
                        ),

                    netWeight:
                        Number(
                            editForm.netWeight
                        ),

                    principalAmount:
                        Number(
                            editForm.principalAmount
                        ),

                    interestRate:
                        Number(
                            editForm.interestRate
                        )
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setSuccess(
                "Active loan updated successfully."
            );

            setEditingLoan(null);

            await getLoans();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to update active loan."
            );
        } finally {
            setSaving(false);
        }
    };


    /* =====================================================
       RETURN LOAN
    ===================================================== */

    const openReturn = (loan) => {
        setReturnLoan(loan);

        setReturnDate("");

        setReturnCalculation(null);

        setReturnError("");

        setError("");
    };


    const closeReturn = () => {
        if (returnLoading) {
            return;
        }

        setReturnLoan(null);

        setReturnDate("");

        setReturnCalculation(null);

        setReturnError("");
    };


    const calculateReturn = async () => {
        if (!returnDate) {
            setReturnError(
                "Please select a return date."
            );

            return;
        }

        try {
            setReturnLoading(true);

            setReturnError("");

            const token =
                localStorage.getItem("token");

            const response =
                await axios.post(
                    `${API_URL}/api/loans/${returnLoan._id}/return-preview`,
                    {
                        returnDate
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setReturnCalculation(
                response.data.calculation
            );

        } catch (err) {
            console.error(err);

            setReturnError(
                err.response?.data?.message ||
                "Unable to calculate return amount."
            );
        } finally {
            setReturnLoading(false);
        }
    };


    const confirmReturn = async () => {
        if (!returnDate) {
            setReturnError(
                "Please select a return date."
            );

            return;
        }

        try {
            setReturnLoading(true);

            setReturnError("");

            const token =
                localStorage.getItem("token");

            await axios.post(
                `${API_URL}/api/loans/${returnLoan._id}/return`,
                {
                    returnDate
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setSuccess(
                "Loan returned successfully."
            );

            closeReturn();

            await getLoans();

        } catch (err) {
            console.error(err);

            setReturnError(
                err.response?.data?.message ||
                "Unable to return loan."
            );
        } finally {
            setReturnLoading(false);
        }
    };


    const formatCurrency = (value) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        ).format(Number(value || 0));
    };


    const formatDate = (value) => {
        if (!value) {
            return "-";
        }

        return new Date(
            value
        ).toLocaleDateString("en-IN");
    };


    return (
        <div className="active-loans-page">

            <div className="active-loans-header">
                <div>
                    <h2>
                        {t("activeLoans") ||
                            "Active Loans"}
                    </h2>

                    <p>
                        Manage currently active
                        lending records.
                    </p>
                </div>
            </div>


            {success && (
                <div className="active-success">
                    {success}
                </div>
            )}


            {error && (
                <div className="active-error">
                    {error}
                </div>
            )}


            <div className="active-loans-toolbar">

                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    placeholder="Search by Entry No., Allotment No., Loan ID, client, location..."
                    className="active-search-input"
                />

                <div className="active-loan-count">
                    {filteredLoans.length} loan
                    {filteredLoans.length !== 1
                        ? "s"
                        : ""}
                </div>

            </div>


            {loading ? (
                <div className="active-empty">
                    Loading active loans...
                </div>
            ) : filteredLoans.length === 0 ? (
                <div className="active-empty">
                    No active loans found.
                </div>
            ) : (
                <div className="active-loans-table-wrapper">

                    <table className="active-loans-table">

                        <thead>
                            <tr>
                                <th>Entry No.</th>
                                <th>Allotment No.</th>
                                <th>Loan ID</th>
                                <th>Client</th>
                                <th>Metal</th>
                                <th>Principal</th>
                                <th>Rate</th>
                                <th>Loan Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredLoans.map(
                                (loan) => {

                                    const client =
                                        loan.client ||
                                        {};

                                    return (
                                        <tr
                                            key={
                                                loan._id
                                            }
                                        >

                                            <td>
                                                #
                                                {String(
                                                    loan.entryNumber
                                                ).padStart(
                                                    4,
                                                    "0"
                                                )}
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        loan.allotmentNumber
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    loan.loanId
                                                }
                                            </td>

                                            <td>
                                                <div className="client-cell">

                                                    <strong>
                                                        {
                                                            client.name ||
                                                            "-"
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            client.phone ||
                                                            ""
                                                        }
                                                    </span>

                                                </div>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        loan.metalType ===
                                                        "Gold"
                                                            ? "metal-badge gold"
                                                            : "metal-badge silver"
                                                    }
                                                >
                                                    {
                                                        loan.metalType
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                {
                                                    formatCurrency(
                                                        loan.principalAmount
                                                    )
                                                }
                                            </td>

                                            <td>
                                                {
                                                    loan.interestRate
                                                }%
                                            </td>

                                            <td>
                                                {
                                                    formatDate(
                                                        loan.loanDate
                                                    )
                                                }
                                            </td>

                                            <td>
                                                <div className="loan-actions">

                                                    <button
                                                        type="button"
                                                        className="edit-loan-button"
                                                        onClick={() =>
                                                            openEdit(
                                                                loan
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="return-loan-button"
                                                        onClick={() =>
                                                            openReturn(
                                                                loan
                                                            )
                                                        }
                                                    >
                                                        Return
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>
            )}


            {/* =================================================
                EDIT MODAL
            ================================================= */}

            {editingLoan && (
                <div className="loan-modal-overlay">

                    <div className="loan-modal edit-modal">

                        <div className="loan-modal-header">

                            <div>
                                <h3>
                                    Edit Active Loan
                                </h3>

                                <p>
                                    Entry #
                                    {String(
                                        editingLoan.entryNumber
                                    ).padStart(
                                        4,
                                        "0"
                                    )}
                                    {" • "}
                                    {
                                        editingLoan.loanId
                                    }
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={
                                    closeEdit
                                }
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={
                                saveEdit
                            }
                        >

                            <div className="edit-section">

                                <h4>
                                    Loan Record
                                </h4>

                                <div className="edit-grid">

                                    <div className="edit-field">

                                        <label>
                                            Entry No.
                                        </label>

                                        <input
                                            value={
                                                `#${String(
                                                    editingLoan.entryNumber
                                                ).padStart(
                                                    4,
                                                    "0"
                                                )}`
                                            }
                                            disabled
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Loan ID
                                        </label>

                                        <input
                                            value={
                                                editingLoan.loanId ||
                                                ""
                                            }
                                            disabled
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Allotment No.
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            name="allotmentNumber"
                                            value={
                                                editForm.allotmentNumber
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Loan Date
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="date"
                                            name="loanDate"
                                            value={
                                                editForm.loanDate
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />

                                    </div>

                                </div>

                            </div>


                            <div className="edit-section">

                                <h4>
                                    Client Information
                                </h4>

                                <div className="edit-grid">

                                    <div className="edit-field">

                                        <label>
                                            Client Name
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            name="name"
                                            value={
                                                editForm.name
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Phone
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            name="phone"
                                            value={
                                                editForm.phone
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                editForm.email
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Location
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            name="location"
                                            value={
                                                editForm.location
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="edit-field full">

                                        <label>
                                            Address
                                        </label>

                                        <textarea
                                            name="address"
                                            value={
                                                editForm.address
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            rows="3"
                                        />

                                    </div>

                                </div>

                            </div>


                            <div className="edit-section">

                                <h4>
                                    Security Details
                                </h4>

                                <div className="edit-grid">

                                    <div className="edit-field">

                                        <label>
                                            Metal Type
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <select
                                            name="metalType"
                                            value={
                                                editForm.metalType
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                        >
                                            <option value="Gold">
                                                Gold
                                            </option>

                                            <option value="Silver">
                                                Silver
                                            </option>
                                        </select>

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Gross Weight (g)
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            name="grossWeight"
                                            value={
                                                editForm.grossWeight
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            min="0"
                                            step="0.01"
                                            required
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Net Weight (g)
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            name="netWeight"
                                            value={
                                                editForm.netWeight
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            min="0"
                                            step="0.01"
                                            required
                                        />

                                    </div>


                                    <div className="edit-field full">

                                        <label>
                                            Item Description
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            name="itemDescription"
                                            value={
                                                editForm.itemDescription
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            required
                                        />

                                    </div>

                                </div>

                            </div>


                            <div className="edit-section">

                                <h4>
                                    Loan Details
                                </h4>

                                <div className="edit-grid">

                                    <div className="edit-field">

                                        <label>
                                            Principal Amount (₹)
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            name="principalAmount"
                                            value={
                                                editForm.principalAmount
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            min="0"
                                            step="0.01"
                                            required
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Interest Rate (% / month)
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            name="interestRate"
                                            value={
                                                editForm.interestRate
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            min="0"
                                            step="0.01"
                                            required
                                        />

                                    </div>


                                    <div className="edit-field full">

                                        <label>
                                            Notes
                                        </label>

                                        <textarea
                                            name="notes"
                                            value={
                                                editForm.notes
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            rows="4"
                                        />

                                    </div>

                                </div>

                            </div>


                            <div className="edit-active-notice">
                                This loan will remain <strong>Active</strong> after saving. No return or interest settlement will be recorded.
                            </div>


                            <div className="loan-modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel-button"
                                    onClick={
                                        closeEdit
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="modal-save-button"
                                    disabled={
                                        saving
                                    }
                                >
                                    {
                                        saving
                                            ? "Saving..."
                                            : "Save Changes"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =================================================
                RETURN MODAL
            ================================================= */}

            {returnLoan && (
                <div className="loan-modal-overlay">

                    <div className="loan-modal return-modal">

                        <div className="loan-modal-header">

                            <div>
                                <h3>
                                    Return Loan
                                </h3>

                                <p>
                                    {
                                        returnLoan.loanId
                                    }
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={
                                    closeReturn
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="return-loan-info">

                            <div>
                                <span>
                                    Client
                                </span>

                                <strong>
                                    {
                                        returnLoan
                                            .client
                                            ?.name ||
                                        "-"
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Allotment No.
                                </span>

                                <strong>
                                    {
                                        returnLoan.allotmentNumber ||
                                        "-"
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Principal
                                </span>

                                <strong>
                                    {
                                        formatCurrency(
                                            returnLoan.principalAmount
                                        )
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Interest Rate
                                </span>

                                <strong>
                                    {
                                        returnLoan.interestRate
                                    }%
                                </strong>
                            </div>

                        </div>


                        <div className="return-date-field">

                            <label>
                                Return Date
                            </label>

                            <input
                                type="date"
                                value={
                                    returnDate
                                }
                                onChange={(e) =>
                                    setReturnDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {returnError && (
                            <div className="return-error">
                                {
                                    returnError
                                }
                            </div>
                        )}


                        {returnCalculation && (
                            <div className="return-calculation">

                                <h4>
                                    Interest Calculation
                                </h4>

                                <div className="calculation-row">
                                    <span>
                                        Full Months
                                    </span>

                                    <strong>
                                        {
                                            returnCalculation.fullMonths
                                        }
                                    </strong>
                                </div>

                                <div className="calculation-row">
                                    <span>
                                        Remaining Days
                                    </span>

                                    <strong>
                                        {
                                            returnCalculation.remainingDays
                                        }
                                    </strong>
                                </div>

                                <div className="calculation-row">
                                    <span>
                                        Monthly Interest
                                    </span>

                                    <strong>
                                        {
                                            formatCurrency(
                                                returnCalculation.monthlyInterest
                                            )
                                        }
                                    </strong>
                                </div>

                                <div className="calculation-row">
                                    <span>
                                        Total Interest
                                    </span>

                                    <strong>
                                        {
                                            formatCurrency(
                                                returnCalculation.totalInterest
                                            )
                                        }
                                    </strong>
                                </div>

                                <div className="calculation-total">
                                    <span>
                                        Final Amount
                                    </span>

                                    <strong>
                                        {
                                            formatCurrency(
                                                returnCalculation.finalAmount
                                            )
                                        }
                                    </strong>
                                </div>

                            </div>
                        )}


                        <div className="loan-modal-actions">

                            <button
                                type="button"
                                className="modal-cancel-button"
                                onClick={
                                    closeReturn
                                }
                                disabled={
                                    returnLoading
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="calculate-button"
                                onClick={
                                    calculateReturn
                                }
                                disabled={
                                    returnLoading
                                }
                            >
                                Calculate
                            </button>

                            <button
                                type="button"
                                className="modal-save-button"
                                onClick={
                                    confirmReturn
                                }
                                disabled={
                                    returnLoading ||
                                    !returnCalculation
                                }
                            >
                                {
                                    returnLoading
                                        ? "Processing..."
                                        : "Confirm Return"
                                }
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default ActiveLoans;
