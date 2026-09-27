const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
const User = require("./models/User");

require("dotenv").config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) =>
    new Promise((resolve) => rl.question(text, resolve));

async function resetAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected.");

        const email = await question("Enter admin email: ");
        const newPassword = await question("Enter new admin password: ");

        const admin = await User.findOne({
            email: email.toLowerCase().trim(),
            role: "admin"
        });

        if (!admin) {
            console.log("Admin account not found.");
            await mongoose.disconnect();
            rl.close();
            return;
        }

        admin.password = await bcrypt.hash(newPassword, 12);
        admin.isActive = true;

        await admin.save();

        console.log("");
        console.log("Admin password reset successfully.");
        console.log(`Admin email: ${admin.email}`);

        await mongoose.disconnect();
        rl.close();
    } catch (error) {
        console.error("Password reset failed:");
        console.error(error.message);
        rl.close();
    }
}

resetAdmin();