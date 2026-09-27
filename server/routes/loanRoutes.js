const express = require("express");
const Loan = require("../models/Loan");
const Client = require("../models/Client");
const { protect } = require("../middleware/auth");

const router = express.Router();

const calculateInterest = (
    loanDateInput,
    returnDateInput,
    principal,
    rate
) => {
    const loanDate = new Date(loanDateInput);
    const returnDate = new Date(returnDateInput);

    if (
        Number.isNaN(loanDate.getTime()) ||
        Number.isNaN(returnDate.getTime())
    ) {
        throw new Error("Invalid loan date or return date");
    }

    if (returnDate < loanDate) {
        throw new Error("Return date cannot be before loan date");
    }

    const principalAmount = Number(principal);
    const interestRate = Number(rate);

    if (
        Number.isNaN(principalAmount) ||
        Number.isNaN(interestRate) ||
        principalAmount < 0 ||
        interestRate < 0
    ) {
        throw new Error("Invalid principal amount or interest rate");
    }

    let fullMonths =
        (returnDate.getUTCFullYear() - loanDate.getUTCFullYear()) * 12 +
        (returnDate.getUTCMonth() - loanDate.getUTCMonth());

    if (returnDate.getUTCDate() < loanDate.getUTCDate()) {
        fullMonths -= 1;
    }

    if (fullMonths < 0) {
        fullMonths = 0;
    }

    const completedMonthsDate = new Date(loanDate);

    completedMonthsDate.setUTCMonth(
        completedMonthsDate.getUTCMonth() + fullMonths
    );

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const remainingDays = Math.max(
        0,
        Math.round(
            (returnDate.getTime() -
                completedMonthsDate.getTime()) /
                millisecondsPerDay
        )
    );

    const monthlyInterest =
        principalAmount * (interestRate / 100);

    const fullMonthsInterest =
        monthlyInterest * fullMonths;

    const daysInMonth = new Date(
        Date.UTC(
            completedMonthsDate.getUTCFullYear(),
            completedMonthsDate.getUTCMonth() + 1,
            0
        )
    ).getUTCDate();

    const dailyInterest =
        daysInMonth > 0
            ? monthlyInterest / daysInMonth
            : 0;

    const remainingDaysInterest =
        dailyInterest * remainingDays;

    const totalInterest =
        fullMonthsInterest + remainingDaysInterest;

    const finalAmount =
        principalAmount + totalInterest;

    return {
        fullMonths,
        remainingDays,
        daysInMonth,
        monthlyInterest: Number(
            monthlyInterest.toFixed(2)
        ),
        dailyInterest: Number(
            dailyInterest.toFixed(2)
        ),
        fullMonthsInterest: Number(
            fullMonthsInterest.toFixed(2)
        ),
        remainingDaysInterest: Number(
            remainingDaysInterest.toFixed(2)
        ),
        totalInterest: Number(
            totalInterest.toFixed(2)
        ),
        finalAmount: Number(
            finalAmount.toFixed(2)
        )
    };
};


/* =========================================================
   GET ALL LOANS
========================================================= */

router.get("/", protect, async (req, res) => {
    try {
        const loans = await Loan.find()
            .populate("client")
            .populate("createdBy", "name")
            .populate("updatedBy", "name")
            .sort({
                entryNumber: -1,
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            loans
        });
    } catch (error) {
        console.error("Get loans error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve loans"
        });
    }
});


/* =========================================================
   GET ACTIVE LOANS
========================================================= */

router.get("/active", protect, async (req, res) => {
    try {
        const loans = await Loan.find({
            status: {
                $in: ["Active", "Overdue"]
            }
        })
            .populate("client")
            .populate("createdBy", "name")
            .populate("updatedBy", "name")
            .sort({
                entryNumber: -1,
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            loans
        });
    } catch (error) {
        console.error("Get active loans error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve active loans"
        });
    }
});


/* =========================================================
   RETURN PREVIEW
========================================================= */

router.post("/:id/return-preview", protect, async (req, res) => {
    try {
        const { id } = req.params;
        const { returnDate } = req.body;

        if (!returnDate) {
            return res.status(400).json({
                success: false,
                message: "Return date is required"
            });
        }

        const loan = await Loan.findById(id)
            .populate("client");

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: "Loan not found"
            });
        }

        if (loan.status === "Closed") {
            return res.status(400).json({
                success: false,
                message: "This loan has already been returned"
            });
        }

        const calculation = calculateInterest(
            loan.loanDate,
            returnDate,
            loan.principalAmount,
            loan.interestRate
        );

        res.status(200).json({
            success: true,
            loan: {
                id: loan._id,
                entryNumber: loan.entryNumber,
                allotmentNumber: loan.allotmentNumber,
                loanId: loan.loanId,
                client: loan.client,
                principalAmount: loan.principalAmount,
                interestRate: loan.interestRate,
                loanDate: loan.loanDate,
                metalType: loan.metalType
            },
            calculation
        });
    } catch (error) {
        console.error("Return preview error:", error);

        res.status(400).json({
            success: false,
            message:
                error.message ||
                "Unable to calculate return amount"
        });
    }
});


/* =========================================================
   RETURN LOAN
========================================================= */

router.post("/:id/return", protect, async (req, res) => {
    try {
        const { id } = req.params;
        const { returnDate } = req.body;

        if (!returnDate) {
            return res.status(400).json({
                success: false,
                message: "Return date is required"
            });
        }

        const loan = await Loan.findById(id);

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: "Loan not found"
            });
        }

        if (loan.status === "Closed") {
            return res.status(400).json({
                success: false,
                message: "This loan has already been returned"
            });
        }

        const calculation = calculateInterest(
            loan.loanDate,
            returnDate,
            loan.principalAmount,
            loan.interestRate
        );

        loan.returnDate = new Date(returnDate);

        loan.applicableDays =
            calculation.fullMonths *
                calculation.daysInMonth +
            calculation.remainingDays;

        loan.interestAmount =
            calculation.totalInterest;

        loan.finalAmount =
            calculation.finalAmount;

        loan.status = "Closed";

        loan.updatedBy = req.user.id;

        await loan.save();

        const updatedLoan = await Loan.findById(
            loan._id
        )
            .populate("client")
            .populate("createdBy", "name")
            .populate("updatedBy", "name");

        res.status(200).json({
            success: true,
            message: "Loan returned successfully",
            loan: updatedLoan,
            calculation
        });
    } catch (error) {
        console.error("Return loan error:", error);

        res.status(400).json({
            success: false,
            message:
                error.message ||
                "Unable to return loan"
        });
    }
});


/* =========================================================
   EDIT LOAN
   - Active loans can be edited
   - Returned loans can also be edited
========================================================= */

router.put("/:id", protect, async (req, res) => {
    try {
        const { id } = req.params;

        const {
            allotmentNumber,
            name,
            phone,
            email,
            address,
            location,
            metalType,
            itemDescription,
            grossWeight,
            netWeight,
            principalAmount,
            interestRate,
            loanDate,
            returnDate,
            notes
        } = req.body;

        const loan = await Loan.findById(id);

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: "Loan not found"
            });
        }

        /* ---------------------------------------------
           BASIC VALIDATION
        --------------------------------------------- */

        if (
            !allotmentNumber ||
            !allotmentNumber.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Allotment number is required"
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Client name is required"
            });
        }

        if (!phone || !phone.trim()) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }

        if (!location || !location.trim()) {
            return res.status(400).json({
                success: false,
                message: "Location is required"
            });
        }

        if (!metalType) {
            return res.status(400).json({
                success: false,
                message: "Metal type is required"
            });
        }

        if (
            !itemDescription ||
            !itemDescription.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Item description is required"
            });
        }

        if (
            grossWeight === undefined ||
            netWeight === undefined ||
            principalAmount === undefined ||
            interestRate === undefined ||
            !loanDate
        ) {
            return res.status(400).json({
                success: false,
                message: "All loan details are required"
            });
        }

        const gross = Number(grossWeight);
        const net = Number(netWeight);
        const principal = Number(principalAmount);
        const rate = Number(interestRate);

        if (
            Number.isNaN(gross) ||
            Number.isNaN(net) ||
            gross < 0 ||
            net < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid weight values"
            });
        }

        if (
            Number.isNaN(principal) ||
            principal < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid principal amount"
            });
        }

        if (
            Number.isNaN(rate) ||
            rate < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid interest rate"
            });
        }


        /* ---------------------------------------------
           UPDATE CLIENT
        --------------------------------------------- */

        if (loan.client) {
            await Client.findByIdAndUpdate(
                loan.client,
                {
                    name: name.trim(),
                    phone: phone.trim(),
                    email: email
                        ? email.trim().toLowerCase()
                        : "",
                    address: address
                        ? address.trim()
                        : "",
                    location: location.trim(),
                    notes: notes
                        ? notes.trim()
                        : ""
                },
                {
                    new: true,
                    runValidators: true
                }
            );
        }


        /* ---------------------------------------------
           UPDATE COMMON LOAN DETAILS
        --------------------------------------------- */

        loan.allotmentNumber =
            allotmentNumber.trim();

        loan.location =
            location.trim();

        loan.metalType =
            metalType;

        loan.itemDescription =
            itemDescription.trim();

        loan.grossWeight =
            gross;

        loan.netWeight =
            net;

        loan.principalAmount =
            principal;

        loan.interestRate =
            rate;

        loan.loanDate =
            new Date(loanDate);

        loan.notes =
            notes ? notes.trim() : "";

        loan.updatedBy =
            req.user.id;


        /* ---------------------------------------------
           ACTIVE LOAN
        --------------------------------------------- */

        if (
            loan.status === "Active" ||
            loan.status === "Overdue"
        ) {
            loan.returnDate = null;
            loan.applicableDays = null;
            loan.interestAmount = 0;
            loan.finalAmount = 0;

            /*
             * Keep active loans active after editing.
             */
            loan.status = "Active";

            await loan.save();

            const updatedLoan = await Loan.findById(
                loan._id
            )
                .populate("client")
                .populate("createdBy", "name")
                .populate("updatedBy", "name");

            return res.status(200).json({
                success: true,
                message: "Active loan updated successfully",
                loan: updatedLoan
            });
        }


        /* ---------------------------------------------
           RETURNED / CLOSED LOAN
        --------------------------------------------- */

        if (loan.status === "Closed") {
            if (!returnDate) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Return date is required for a returned loan"
                });
            }

            const calculation =
                calculateInterest(
                    loanDate,
                    returnDate,
                    principal,
                    rate
                );

            loan.returnDate =
                new Date(returnDate);

            loan.applicableDays =
                calculation.fullMonths *
                    calculation.daysInMonth +
                calculation.remainingDays;

            loan.interestAmount =
                calculation.totalInterest;

            loan.finalAmount =
                calculation.finalAmount;

            loan.status = "Closed";

            await loan.save();

            const updatedLoan =
                await Loan.findById(loan._id)
                    .populate("client")
                    .populate("createdBy", "name")
                    .populate("updatedBy", "name");

            return res.status(200).json({
                success: true,
                message:
                    "Returned loan updated successfully",
                loan: updatedLoan,
                calculation
            });
        }


        return res.status(400).json({
            success: false,
            message: "Unsupported loan status"
        });

    } catch (error) {
        console.error(
            "Update loan error:",
            error
        );

        res.status(400).json({
            success: false,
            message:
                error.message ||
                "Unable to update loan"
        });
    }
});


module.exports = router;
