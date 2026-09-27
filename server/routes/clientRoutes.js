const express = require("express");
const Client = require("../models/Client");
const Loan = require("../models/Loan");
const Counter = require("../models/Counter");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, async (req, res) => {
    try {
        const clients = await Client.find()
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            clients
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve clients"
        });
    }
});

router.post("/", protect, async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            address,
            location,

            allotmentNumber,

            metalType,
            itemDescription,
            grossWeight,
            netWeight,
            principalAmount,
            interestRate,
            loanDate,
            notes
        } = req.body;

        if (
            !name ||
            !phone ||
            !location
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, phone and location are required"
            });
        }

        if (!allotmentNumber) {
            return res.status(400).json({
                success: false,
                message:
                    "Allotment number is required"
            });
        }

        if (
            !metalType ||
            !itemDescription ||
            grossWeight === undefined ||
            netWeight === undefined ||
            principalAmount === undefined ||
            interestRate === undefined ||
            !loanDate
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Loan details are required"
            });
        }

        const counter =
            await Counter.findOneAndUpdate(
                {
                    name: "loanEntry"
                },
                {
                    $inc: {
                        sequenceValue: 1
                    }
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                }
            );

        const entryNumber =
            counter.sequenceValue;

        const clientId =
            `CL-${Date.now()}`;

        const client =
            await Client.create({
                clientId,
                name,
                phone,
                email,
                address,
                location,
                notes,
                createdBy: req.user.id
            });

        const loanId =
            `LN-${Date.now()}`;

        const loan =
            await Loan.create({
                entryNumber,

                allotmentNumber:
                    allotmentNumber.trim(),

                loanId,

                client: client._id,

                location,

                metalType,

                itemDescription,

                grossWeight,

                netWeight,

                principalAmount,

                interestRate,

                loanDate,

                notes,

                createdBy: req.user.id
            });

        res.status(201).json({
            success: true,

            message:
                "Client and loan created successfully",

            client,

            loan
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Unable to create client and loan"
        });
    }
});

module.exports = router;
