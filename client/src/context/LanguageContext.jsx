import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const LanguageContext = createContext(null);

const translations = {
    en: {
        // App
        lendingManagement: "Lending Management",
        dashboard: "Dashboard",
        newLoan: "New Loan",
        activeLoans: "Active Loans",
        returnedLoans: "Returned Loans",
        clients: "Clients",
        locations: "Locations",
        payments: "Payments",
        reports: "Reports",
        users: "Users",
        settings: "Settings",
        logout: "Logout",
        english: "English",
        hindi: "हिंदी",
        admin: "Admin",
        user: "User",

        // General
        backDashboard: "← Dashboard",
        search: "Search",
        viewAll: "View All",
        cancel: "Cancel",
        save: "Save",
        edit: "Edit",
        return: "Return",
        close: "Close",
        calculate: "Calculate",
        confirmReturn: "Confirm Return",
        retry: "Retry",
        loading: "Loading...",
        noRecords: "No records available.",
        noMatchingRecords: "No matching records found.",

        // Dashboard
        goldSilverLending: "GOLD & SILVER LENDING",
        dashboardTitle: "Dashboard",
        dashboardSubtitle:
            "Manage clients, loans and lending activity from one place.",
        newLoanAction: "+ New Loan",
        activeLoansAction: "Active Loans",
        searchDashboard:
            "Search clients, entry numbers, allotment numbers, loan IDs, phone, location, metal...",

        totalClients: "Total Clients",
        registeredClients: "Registered clients",
        activeLoanCount: "Active Loans",
        currentLendingRecords: "Current lending records",
        activePrincipal: "Active Principal",
        principalCurrentlyLent: "Principal currently lent",
        goldLoans: "Gold Loans",
        activeGoldRecords: "Active gold records",
        silverLoans: "Silver Loans",
        activeSilverRecords: "Active silver records",

        recentLendingActivity: "Recent Lending Activity",
        latestLoanEntries: "Latest loan entries in the system",
        quickAccess: "Quick Access",
        frequentlyUsedSections: "Frequently used sections",

        createNewLendingRecord:
            "Create a new lending record.",
        viewManageActiveLoans:
            "View and manage active loans",
        viewCompletedLoanRecords:
            "View completed loan records",

        totalLoanRecords: "Total Loan Records",
        returnedRecords: "Returned Records",

        goldLedgerManagement: "GoldLedger Lending Management",
        dashboardInfo:
            "Use the dashboard to search lending records, review current principal amounts, and quickly access active or returned loans.",

        entryNo: "Entry No.",
        allotmentNo: "Allotment No.",
        loanId: "Loan ID",
        client: "Client",
        metal: "Metal",
        principal: "Principal",
        interestRate: "Interest Rate",
        loanDate: "Loan Date",
        status: "Status",
        location: "Location",

        // Search
        searchResults: "Search Results",
        matchingLoan: "matching loan",
        matchingLoans: "matching loans",
        searching: "Searching...",

        // Status
        active: "Active",
        closed: "Closed",
        overdue: "Overdue",

        // New Loan
        lendingManagementTitle: "LENDING MANAGEMENT",
        newLoanTitle: "New Loan",
        newLoanSubtitle:
            "Create a new gold or silver secured lending record.",

        loanIdentification: "Loan Identification",
        loanIdentificationDescription:
            "Enter the manually assigned allotment number.",

        clientInformation: "Client Information",
        clientInformationDescription:
            "Details of the person taking the loan.",

        pledgedAsset: "Pledged Asset",
        pledgedAssetDescription:
            "Information about the gold or silver item.",

        loanInterestDetails: "Loan & Interest Details",
        loanInterestDescription:
            "Enter the principal and applicable interest rate for this loan.",

        additionalNotes: "Additional Notes",
        additionalNotesDescription:
            "Add any information that may be useful later.",

        clientName: "Client Name",
        phoneNumber: "Phone Number",
        emailAddress: "Email Address",
        address: "Address",

        metalType: "Metal Type",
        itemDescription: "Item Description",
        grossWeight: "Gross Weight (g)",
        netWeight: "Net Weight (g)",

        principalAmount: "Principal Amount",
        interestRatePercent: "Interest Rate (%)",
        notes: "Notes",

        enterAllotmentNumber:
            "Enter allotment number",
        allotmentStored:
            "This number is manually assigned and stored with the loan.",
        enterClientName: "Enter client name",
        enterPhoneNumber: "Enter phone number",
        enterEmailAddress: "Enter email address",
        enterLocation: "Enter location",
        enterCompleteAddress:
            "Enter complete address",
        enterItemDescription:
            "e.g. Gold chain, silver anklet",
        enterAdditionalNotes:
            "Enter additional notes...",

        gold: "Gold",
        silver: "Silver",

        interestRatePerLoan:
            "Interest rate is entered separately for each loan.",

        createLoan: "Create Loan",
        creatingLoan: "Creating Loan...",

        loanCreatedSuccessfully:
            "Loan created successfully.",
        unableToCreateLoan:
            "Unable to create loan.",
        notLoggedIn: "You are not logged in.",

        // Active Loans
        activeLoansTitle: "Active Loans",
        activeLoansSubtitle:
            "Manage currently active lending records.",
        activeLoanSearch:
            "Search by Entry No., Allotment No., Loan ID, client, location...",
        loan: "loan",
        loans: "loans",

        // Edit Active Loan
        editActiveLoan: "Edit Active Loan",
        saveChanges: "Save Changes",
        loanRecord: "Loan Record",
        securityDetails: "Security Details",

        activeLoanNotice:
            "This loan will remain Active after saving. No return or interest settlement will be recorded.",

        // Return
        returnLoan: "Return Loan",
        returnLoanSubtitle:
            "Calculate interest and settle this loan.",
        returnDate: "Return Date",
        interestCalculation: "Interest Calculation",
        fullMonths: "Full Months",
        remainingDays: "Remaining Days",
        monthlyInterest: "Monthly Interest",
        dailyInterest: "Daily Interest (per day)",
        fullMonthsInterest: "Full Months Interest",
        remainingDaysInterest:
            "Remaining Days Interest",
        totalInterest: "Total Interest",
        finalAmount: "Final Amount",

        // Returned
        returnedLoansTitle: "Returned Loans",
        returnedLoansSubtitle:
            "View previously returned loan records and edit them.",
        returnedSearch:
            "Search by Entry No., Allotment No., Loan ID, client, phone, location...",
        action: "Action",
        editReturnedLoan: "Edit Returned Loan",

        // Errors
        unableToLoad: "Unable to load records.",
        somethingWentWrong: "Something went wrong."
    },

    hi: {
        // App
        lendingManagement: "ऋण प्रबंधन",
        dashboard: "डैशबोर्ड",
        newLoan: "नया ऋण",
        activeLoans: "सक्रिय ऋण",
        returnedLoans: "लौटाए गए ऋण",
        clients: "ग्राहक",
        locations: "स्थान",
        payments: "भुगतान",
        reports: "रिपोर्ट",
        users: "उपयोगकर्ता",
        settings: "सेटिंग्स",
        logout: "लॉगआउट",
        english: "English",
        hindi: "हिंदी",
        admin: "व्यवस्थापक",
        user: "उपयोगकर्ता",

        // General
        backDashboard: "← डैशबोर्ड",
        search: "खोजें",
        viewAll: "सभी देखें",
        cancel: "रद्द करें",
        save: "सहेजें",
        edit: "संपादित करें",
        return: "वापस करें",
        close: "बंद करें",
        calculate: "गणना करें",
        confirmReturn: "वापसी की पुष्टि करें",
        retry: "पुनः प्रयास करें",
        loading: "लोड हो रहा है...",
        noRecords: "कोई रिकॉर्ड उपलब्ध नहीं है।",
        noMatchingRecords:
            "कोई मिलान वाला रिकॉर्ड नहीं मिला।",

        // Dashboard
        goldSilverLending: "सोना एवं चाँदी ऋण",
        dashboardTitle: "डैशबोर्ड",
        dashboardSubtitle:
            "ग्राहकों, ऋणों और ऋण गतिविधियों को एक ही स्थान से प्रबंधित करें।",
        newLoanAction: "+ नया ऋण",
        activeLoansAction: "सक्रिय ऋण",
        searchDashboard:
            "ग्राहक, प्रविष्टि संख्या, आवंटन संख्या, ऋण आईडी, फोन, स्थान, धातु खोजें...",

        totalClients: "कुल ग्राहक",
        registeredClients: "पंजीकृत ग्राहक",
        activeLoanCount: "सक्रिय ऋण",
        currentLendingRecords: "वर्तमान ऋण रिकॉर्ड",
        activePrincipal: "सक्रिय मूलधन",
        principalCurrentlyLent: "वर्तमान में दिया गया मूलधन",
        goldLoans: "सोने के ऋण",
        activeGoldRecords: "सक्रिय सोने के रिकॉर्ड",
        silverLoans: "चाँदी के ऋण",
        activeSilverRecords: "सक्रिय चाँदी के रिकॉर्ड",

        recentLendingActivity: "हाल की ऋण गतिविधि",
        latestLoanEntries: "सिस्टम में नवीनतम ऋण प्रविष्टियाँ",
        quickAccess: "त्वरित पहुँच",
        frequentlyUsedSections: "अक्सर उपयोग किए जाने वाले अनुभाग",

        createNewLendingRecord:
            "नया ऋण रिकॉर्ड बनाएँ।",
        viewManageActiveLoans:
            "सक्रिय ऋण देखें और प्रबंधित करें",
        viewCompletedLoanRecords:
            "पूर्ण किए गए ऋण रिकॉर्ड देखें",

        totalLoanRecords: "कुल ऋण रिकॉर्ड",
        returnedRecords: "वापसी किए गए रिकॉर्ड",

        goldLedgerManagement:
            "GoldLedger ऋण प्रबंधन",
        dashboardInfo:
            "डैशबोर्ड से ऋण रिकॉर्ड खोजें, वर्तमान मूलधन देखें और सक्रिय या लौटाए गए ऋणों तक शीघ्र पहुँच प्राप्त करें।",

        entryNo: "प्रविष्टि संख्या",
        allotmentNo: "आवंटन संख्या",
        loanId: "ऋण आईडी",
        client: "ग्राहक",
        metal: "धातु",
        principal: "मूलधन",
        interestRate: "ब्याज दर",
        loanDate: "ऋण तिथि",
        status: "स्थिति",
        location: "स्थान",

        // Search
        searchResults: "खोज परिणाम",
        matchingLoan: "मिलान वाला ऋण",
        matchingLoans: "मिलान वाले ऋण",
        searching: "खोज जारी है...",

        // Status
        active: "सक्रिय",
        closed: "बंद",
        overdue: "अतिदेय",

        // New Loan
        lendingManagementTitle: "ऋण प्रबंधन",
        newLoanTitle: "नया ऋण",
        newLoanSubtitle:
            "नया सोना या चाँदी सुरक्षित ऋण रिकॉर्ड बनाएँ।",

        loanIdentification: "ऋण पहचान",
        loanIdentificationDescription:
            "मैन्युअल रूप से दिए गए आवंटन नंबर को दर्ज करें।",

        clientInformation: "ग्राहक जानकारी",
        clientInformationDescription:
            "ऋण लेने वाले व्यक्ति का विवरण।",

        pledgedAsset: "गिरवी रखी गई संपत्ति",
        pledgedAssetDescription:
            "सोने या चाँदी की वस्तु की जानकारी।",

        loanInterestDetails:
            "ऋण एवं ब्याज विवरण",
        loanInterestDescription:
            "इस ऋण का मूलधन और लागू ब्याज दर दर्ज करें।",

        additionalNotes: "अतिरिक्त टिप्पणियाँ",
        additionalNotesDescription:
            "बाद में उपयोगी होने वाली कोई भी जानकारी दर्ज करें।",

        clientName: "ग्राहक का नाम",
        phoneNumber: "फोन नंबर",
        emailAddress: "ईमेल पता",
        address: "पता",

        metalType: "धातु का प्रकार",
        itemDescription: "वस्तु का विवरण",
        grossWeight: "कुल वजन (ग्राम)",
        netWeight: "शुद्ध वजन (ग्राम)",

        principalAmount: "मूलधन राशि",
        interestRatePercent: "ब्याज दर (%)",
        notes: "टिप्पणियाँ",

        enterAllotmentNumber:
            "आवंटन नंबर दर्ज करें",
        allotmentStored:
            "यह नंबर मैन्युअल रूप से दिया जाता है और ऋण के साथ संग्रहीत होता है।",
        enterClientName:
            "ग्राहक का नाम दर्ज करें",
        enterPhoneNumber:
            "फोन नंबर दर्ज करें",
        enterEmailAddress:
            "ईमेल पता दर्ज करें",
        enterLocation:
            "स्थान दर्ज करें",
        enterCompleteAddress:
            "पूरा पता दर्ज करें",
        enterItemDescription:
            "जैसे: सोने की चेन, चाँदी की पायल",
        enterAdditionalNotes:
            "अतिरिक्त टिप्पणियाँ दर्ज करें...",

        gold: "सोना",
        silver: "चाँदी",

        interestRatePerLoan:
            "प्रत्येक ऋण के लिए ब्याज दर अलग से दर्ज की जाती है।",

        createLoan: "ऋण बनाएँ",
        creatingLoan: "ऋण बनाया जा रहा है...",

        loanCreatedSuccessfully:
            "ऋण सफलतापूर्वक बनाया गया।",
        unableToCreateLoan:
            "ऋण बनाने में असमर्थ।",
        notLoggedIn:
            "आप लॉग इन नहीं हैं।",

        // Active Loans
        activeLoansTitle: "सक्रिय ऋण",
        activeLoansSubtitle:
            "वर्तमान सक्रिय ऋण रिकॉर्ड प्रबंधित करें।",
        activeLoanSearch:
            "प्रविष्टि संख्या, आवंटन संख्या, ऋण आईडी, ग्राहक, स्थान से खोजें...",
        loan: "ऋण",
        loans: "ऋण",

        // Edit Active Loan
        editActiveLoan:
            "सक्रिय ऋण संपादित करें",
        saveChanges: "परिवर्तन सहेजें",
        loanRecord: "ऋण रिकॉर्ड",
        securityDetails: "सुरक्षा विवरण",

        activeLoanNotice:
            "सहेजने के बाद यह ऋण सक्रिय रहेगा। कोई वापसी या ब्याज निपटान दर्ज नहीं किया जाएगा।",

        // Return
        returnLoan: "ऋण वापसी",
        returnLoanSubtitle:
            "ब्याज की गणना करें और इस ऋण का निपटान करें।",
        returnDate: "वापसी की तारीख",
        interestCalculation: "ब्याज गणना",
        fullMonths: "पूरे महीने",
        remainingDays: "शेष दिन",
        monthlyInterest: "मासिक ब्याज",
        dailyInterest: "दैनिक ब्याज",
        fullMonthsInterest:
            "पूरे महीनों का ब्याज",
        remainingDaysInterest:
            "शेष दिनों का ब्याज",
        totalInterest: "कुल ब्याज",
        finalAmount: "अंतिम राशि",

        // Returned
        returnedLoansTitle:
            "लौटाए गए ऋण",
        returnedLoansSubtitle:
            "पहले लौटाए गए ऋण रिकॉर्ड देखें और संपादित करें।",
        returnedSearch:
            "प्रविष्टि संख्या, आवंटन संख्या, ऋण आईडी, ग्राहक, फोन, स्थान से खोजें...",
        action: "कार्रवाई",
        editReturnedLoan:
            "लौटाया गया ऋण संपादित करें",

        // Errors
        unableToLoad:
            "रिकॉर्ड लोड करने में असमर्थ।",
        somethingWentWrong:
            "कुछ गलत हो गया।"
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("language") || "en";
    });

    useEffect(() => {
        localStorage.setItem("language", language);

        document.documentElement.lang =
            language === "hi" ? "hi" : "en";

        document.documentElement.dir = "ltr";
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((current) =>
            current === "en" ? "hi" : "en"
        );
    };

    const t = (key) => {
        return (
            translations[language]?.[key] ??
            translations.en[key] ??
            key
        );
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                toggleLanguage,
                t
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
};