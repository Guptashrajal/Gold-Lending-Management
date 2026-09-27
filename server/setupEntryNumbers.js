require("dotenv").config();

const connectDB = require("./config/db");
const Loan = require("./models/Loan");
const Counter = require("./models/Counter");

const setupEntryNumbers = async () => {
    try {
        await connectDB();

        const loans = await Loan.find({
            $or: [
                {
                    entryNumber: {
                        $exists: false
                    }
                },
                {
                    entryNumber: null
                }
            ]
        }).sort({
            createdAt: 1
        });

        console.log(
            `Loans without entry numbers: ${loans.length}`
        );

        let maxEntryNumber = 0;

        const existingLoan =
            await Loan.findOne({
                entryNumber: {
                    $exists: true,
                    $ne: null
                }
            }).sort({
                entryNumber: -1
            });

        if (existingLoan) {
            maxEntryNumber =
                existingLoan.entryNumber;
        }

        for (const loan of loans) {
            maxEntryNumber++;

            loan.entryNumber =
                maxEntryNumber;

            await loan.save();

            console.log(
                `${loan.loanId} -> Entry No. ${String(
                    maxEntryNumber
                ).padStart(4, "0")}`
            );
        }

        await Counter.findOneAndUpdate(
            {
                name: "loanEntry"
            },
            {
                $set: {
                    sequenceValue:
                        maxEntryNumber
                }
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        console.log(
            `Entry numbering completed. Current number: ${maxEntryNumber}`
        );

        process.exit(0);
    } catch (error) {
        console.error(
            "Entry number setup failed:"
        );

        console.error(error);

        process.exit(1);
    }
};

setupEntryNumbers();
