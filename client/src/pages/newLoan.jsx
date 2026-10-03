import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

import "./newLoan.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";
    
const NewLoan = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();

    const isHindi = language === "hi";

    const text = {
        eyebrow: isHindi
            ? "ऋण प्रबंधन"
            : "LENDING MANAGEMENT",

        title: isHindi
            ? "नया ऋण"
            : "New Loan",

        subtitle: isHindi
            ? "सोने या चाँदी के लिए नया सुरक्षित ऋण रिकॉर्ड बनाएँ।"
            : "Create a new gold or silver secured lending record.",

        dashboard: isHindi
            ? "डैशबोर्ड"
            : "Dashboard",

        activeLoans: isHindi
            ? "सक्रिय ऋण"
            : "Active Loans",

        loanIdentification: isHindi
            ? "ऋण पहचान"
            : "Loan Identification",

        loanIdentificationDescription: isHindi
            ? "मैन्युअल रूप से निर्धारित आवंटन संख्या दर्ज करें।"
            : "Enter the manually assigned allotment number.",

        allotmentNo: isHindi
            ? "आवंटन संख्या"
            : "Allotment No.",

        loanDate: isHindi
            ? "ऋण दिनांक"
            : "Loan Date",

        clientInformation: isHindi
            ? "ग्राहक जानकारी"
            : "Client Information",

        clientInformationDescription: isHindi
            ? "ऋण लेने वाले व्यक्ति का विवरण।"
            : "Details of the person taking the loan.",

        clientName: isHindi
            ? "ग्राहक का नाम"
            : "Client Name",

        phoneNumber: isHindi
            ? "फोन नंबर"
            : "Phone Number",

        emailAddress: isHindi
            ? "ईमेल पता"
            : "Email Address",

        location: isHindi
            ? "स्थान"
            : "Location",

        address: isHindi
            ? "पता"
            : "Address",

        pledgedAsset: isHindi
            ? "गिरवी रखी गई संपत्ति"
            : "Pledged Asset",

        pledgedAssetDescription: isHindi
            ? "गिरवी रखी गई सोने या चाँदी की वस्तु की जानकारी।"
            : "Information about the gold or silver item.",

        metalType: isHindi
            ? "धातु का प्रकार"
            : "Metal Type",

        gold: isHindi
            ? "सोना"
            : "Gold",

        silver: isHindi
            ? "चाँदी"
            : "Silver",

        itemDescription: isHindi
            ? "वस्तु का विवरण"
            : "Item Description",

        grossWeight: isHindi
            ? "कुल वजन (ग्राम)"
            : "Gross Weight (g)",

        netWeight: isHindi
            ? "शुद्ध वजन (ग्राम)"
            : "Net Weight (g)",

        loanInterestDetails: isHindi
            ? "ऋण और ब्याज विवरण"
            : "Loan & Interest Details",

        loanInterestDescription: isHindi
            ? "इस ऋण के लिए मूलधन और लागू ब्याज दर दर्ज करें।"
            : "Enter the principal and applicable interest rate for this loan.",

        principalAmount: isHindi
            ? "मूलधन राशि"
            : "Principal Amount",

        interestRate: isHindi
            ? "ब्याज दर (%)"
            : "Interest Rate (%)",

        interestRateNote: isHindi
            ? "ब्याज दर प्रत्येक ऋण के लिए अलग से दर्ज की जाती है।"
            : "Interest rate is entered separately for each loan.",

        additionalNotes: isHindi
            ? "अतिरिक्त टिप्पणियाँ"
            : "Additional Notes",

        additionalNotesDescription: isHindi
            ? "बाद में उपयोगी होने वाली कोई अतिरिक्त जानकारी दर्ज करें।"
            : "Add any information that may be useful later.",

        notes: isHindi
            ? "टिप्पणियाँ"
            : "Notes",

        cancel: isHindi
            ? "रद्द करें"
            : "Cancel",

        createLoan: isHindi
            ? "ऋण बनाएँ"
            : "Create Loan",

        creatingLoan: isHindi
            ? "ऋण बनाया जा रहा है..."
            : "Creating Loan...",

        enterAllotment: isHindi
            ? "आवंटन संख्या दर्ज करें"
            : "Enter allotment number",

        allotmentHelp: isHindi
            ? "यह संख्या मैन्युअल रूप से निर्धारित की जाती है और ऋण के साथ संग्रहीत की जाती है।"
            : "This number is manually assigned and stored with the loan.",

        enterClientName: isHindi
            ? "ग्राहक का नाम दर्ज करें"
            : "Enter client name",

        enterPhone: isHindi
            ? "फोन नंबर दर्ज करें"
            : "Enter phone number",

        enterEmail: isHindi
            ? "ईमेल पता दर्ज करें"
            : "Enter email address",

        enterLocation: isHindi
            ? "स्थान दर्ज करें"
            : "Enter location",

        enterAddress: isHindi
            ? "पूरा पता दर्ज करें"
            : "Enter complete address",

        enterItem: isHindi
            ? "वस्तु का विवरण दर्ज करें"
            : "Enter item description",

        enterNotes: isHindi
            ? "अतिरिक्त टिप्पणियाँ दर्ज करें..."
            : "Enter additional notes...",

        required: isHindi
            ? "आवश्यक फ़ील्ड"
            : "Required field",

        notLoggedIn: isHindi
            ? "आप लॉग इन नहीं हैं।"
            : "You are not logged in.",

        loanCreated: isHindi
            ? "ऋण सफलतापूर्वक बनाया गया।"
            : "Loan created successfully.",

        unableCreate: isHindi
            ? "ऋण बनाने में असमर्थ।"
            : "Unable to create loan."
    };

    const getToday = () =>
        new Date()
            .toISOString()
            .split("T")[0];

    const getInitialForm = () => ({
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
        loanDate: getToday(),
        notes: ""
    });

    const [formData, setFormData] =
        useState(getInitialForm);

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const handleChange = (event) => {
        const { name, value } =
            event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));

        setError("");
        setMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const token =
                localStorage.getItem("token");

            if (!token) {
                setError(text.notLoggedIn);
                setLoading(false);
                return;
            }

            if (
                !formData.allotmentNumber.trim()
            ) {
                throw new Error(
                    text.allotmentNo +
                        " " +
                        text.required
                );
            }

            if (!formData.name.trim()) {
                throw new Error(
                    text.clientName +
                        " " +
                        text.required
                );
            }

            if (!formData.phone.trim()) {
                throw new Error(
                    text.phoneNumber +
                        " " +
                        text.required
                );
            }

            if (!formData.location.trim()) {
                throw new Error(
                    text.location +
                        " " +
                        text.required
                );
            }

            if (
                !formData.itemDescription.trim()
            ) {
                throw new Error(
                    text.itemDescription +
                        " " +
                        text.required
                );
            }

            if (
                formData.grossWeight === "" ||
                Number(formData.grossWeight) < 0
            ) {
                throw new Error(
                    text.grossWeight +
                        " " +
                        text.required
                );
            }

            if (
                formData.netWeight === "" ||
                Number(formData.netWeight) < 0
            ) {
                throw new Error(
                    text.netWeight +
                        " " +
                        text.required
                );
            }

            if (
                formData.principalAmount === "" ||
                Number(formData.principalAmount) < 0
            ) {
                throw new Error(
                    text.principalAmount +
                        " " +
                        text.required
                );
            }

            if (
                formData.interestRate === "" ||
                Number(formData.interestRate) < 0
            ) {
                throw new Error(
                    text.interestRate +
                        " " +
                        text.required
                );
            }

            const response =
                await axios.post(
                    `${API_URL}/api/clients`,
                    {
                        allotmentNumber:
                            formData.allotmentNumber.trim(),

                        name:
                            formData.name.trim(),

                        phone:
                            formData.phone.trim(),

                        email:
                            formData.email.trim(),

                        address:
                            formData.address.trim(),

                        location:
                            formData.location.trim(),

                        metalType:
                            formData.metalType,

                        itemDescription:
                            formData.itemDescription.trim(),

                        grossWeight:
                            Number(
                                formData.grossWeight
                            ),

                        netWeight:
                            Number(
                                formData.netWeight
                            ),

                        principalAmount:
                            Number(
                                formData.principalAmount
                            ),

                        interestRate:
                            Number(
                                formData.interestRate
                            ),

                        loanDate:
                            formData.loanDate,

                        notes:
                            formData.notes.trim()
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            if (response.data?.success) {
                const loan =
                    response.data.loan;

                setMessage(
                    `${text.loanCreated} ` +
                    `Entry No: ${
                        loan?.entryNumber || "-"
                    } | ` +
                    `${text.allotmentNo}: ${
                        loan?.allotmentNumber || "-"
                    } | ` +
                    `Loan ID: ${
                        loan?.loanId || "-"
                    }`
                );

                setFormData(
                    getInitialForm()
                );
            }
        } catch (err) {
            console.error(
                "Unable to create loan:",
                err
            );

            setError(
                err.response?.data?.message ||
                    err.message ||
                    text.unableCreate
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-loan-page">

            <div className="new-loan-header">

                <div>

                    <div className="page-eyebrow">
                        {text.eyebrow}
                    </div>

                    <h1>
                        {text.title}
                    </h1>

                    <p>
                        {text.subtitle}
                    </p>

                </div>

                <div className="new-loan-header-actions">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                    >
                        {text.dashboard}
                    </button>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                "/active-loans"
                            )
                        }
                    >
                        {text.activeLoans}
                    </button>

                </div>

            </div>

            {message && (
                <div className="loan-alert success-alert">

                    <span className="alert-icon">
                        ✓
                    </span>

                    <span>
                        {message}
                    </span>

                </div>
            )}

            {error && (
                <div className="loan-alert error-alert">

                    <span className="alert-icon">
                        !
                    </span>

                    <span>
                        {error}
                    </span>

                </div>
            )}

            <form
                className="new-loan-form"
                onSubmit={handleSubmit}
            >

                {/* =================================================
                    01 — LOAN IDENTIFICATION
                ================================================= */}

                <section className="loan-card">

                    <div className="loan-card-header">

                        <div className="section-icon gold-icon">
                            01
                        </div>

                        <div>

                            <h2>
                                {text.loanIdentification}
                            </h2>

                            <p>
                                {text.loanIdentificationDescription}
                            </p>

                        </div>

                    </div>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                {text.allotmentNo}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                type="text"
                                name="allotmentNumber"
                                value={
                                    formData.allotmentNumber
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder={
                                    text.enterAllotment
                                }
                                required
                            />

                            <small>
                                {text.allotmentHelp}
                            </small>

                        </div>

                        <div className="form-group">

                            <label>
                                {text.loanDate}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                type="date"
                                name="loanDate"
                                value={
                                    formData.loanDate
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                    </div>

                </section>

                {/* =================================================
                    02 — CLIENT INFORMATION
                ================================================= */}

                <section className="loan-card">

                    <div className="loan-card-header">

                        <div className="section-icon silver-icon">
                            02
                        </div>

                        <div>

                            <h2>
                                {text.clientInformation}
                            </h2>

                            <p>
                                {text.clientInformationDescription}
                            </p>

                        </div>

                    </div>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                {text.clientName}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder={
                                    text.enterClientName
                                }
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                {text.phoneNumber}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={
                                    formData.phone
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder={
                                    text.enterPhone
                                }
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                {text.emailAddress}
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder={
                                    text.enterEmail
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                {text.location}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={
                                    formData.location
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder={
                                    text.enterLocation
                                }
                                required
                            />

                        </div>

                        <div className="form-group full-width">

                            <label>
                                {text.address}
                            </label>

                            <textarea
                                name="address"
                                value={
                                    formData.address
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder={
                                    text.enterAddress
                                }
                                rows="3"
                            />

                        </div>

                    </div>

                </section>

                {/* =================================================
                    03 — PLEDGED ASSET
                ================================================= */}

                <section className="loan-card">

                    <div className="loan-card-header">

                        <div className="section-icon gold-icon">
                            03
                        </div>

                        <div>

                            <h2>
                                {text.pledgedAsset}
                            </h2>

                            <p>
                                {text.pledgedAssetDescription}
                            </p>

                        </div>

                    </div>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                {text.metalType}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <select
                                name="metalType"
                                value={
                                    formData.metalType
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >
                                <option value="Gold">
                                    {text.gold}
                                </option>

                                <option value="Silver">
                                    {text.silver}
                                </option>
                            </select>

                        </div>

                        <div className="form-group">

                            <label>
                                {text.itemDescription}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                type="text"
                                name="itemDescription"
                                value={
                                    formData.itemDescription
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder={
                                    text.enterItem
                                }
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                {text.grossWeight}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                type="number"
                                name="grossWeight"
                                value={
                                    formData.grossWeight
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                {text.netWeight}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                type="number"
                                name="netWeight"
                                value={
                                    formData.netWeight
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />

                        </div>

                    </div>

                </section>

                {/* =================================================
                    04 — LOAN & INTEREST
                ================================================= */}

                <section className="loan-card">

                    <div className="loan-card-header">

                        <div className="section-icon silver-icon">
                            04
                        </div>

                        <div>

                            <h2>
                                {text.loanInterestDetails}
                            </h2>

                            <p>
                                {text.loanInterestDescription}
                            </p>

                        </div>

                    </div>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                {text.principalAmount}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <div className="input-prefix">

                                <span>
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    name="principalAmount"
                                    value={
                                        formData.principalAmount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label>
                                {text.interestRate}
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <div className="input-suffix">

                                <input
                                    type="number"
                                    name="interestRate"
                                    value={
                                        formData.interestRate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />

                                <span>
                                    %
                                </span>

                            </div>

                            <small>
                                {text.interestRateNote}
                            </small>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    05 — NOTES
                ================================================= */}

                <section className="loan-card">

                    <div className="loan-card-header">

                        <div className="section-icon gold-icon">
                            05
                        </div>

                        <div>

                            <h2>
                                {text.additionalNotes}
                            </h2>

                            <p>
                                {text.additionalNotesDescription}
                            </p>

                        </div>

                    </div>

                    <div className="form-group">

                        <label>
                            {text.notes}
                        </label>

                        <textarea
                            name="notes"
                            value={
                                formData.notes
                            }
                            onChange={
                                handleChange
                            }
                            placeholder={
                                text.enterNotes
                            }
                            rows="4"
                        />

                    </div>

                </section>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                        disabled={loading}
                    >
                        {text.cancel}
                    </button>

                    <button
                        type="submit"
                        className="create-loan-button"
                        disabled={loading}
                    >
                        {loading
                            ? text.creatingLoan
                            : text.createLoan}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default NewLoan;