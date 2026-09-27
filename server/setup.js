const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const readline = require("readline");
const fs = require("fs");
const User = require("./models/User");

require("dotenv").config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) => {
    return new Promise((resolve) => {
        rl.question(text, resolve);
    });
};

const createSetup = async () => {
    console.log("");
    console.log("========================================");
    console.log(" Gold & Silver Lending - Initial Setup");
    console.log("========================================");
    console.log("");

    const mongodbUri = await question(
        "Enter your MongoDB connection string: "
    );

    const adminName = await question(
        "Enter admin name: "
    );

    const adminEmail = await question(
        "Enter admin email: "
    );

    const adminPassword = await question(
        "Enter admin password: "
    );

    if (!mongodbUri || !adminName || !adminEmail || !adminPassword) {
        console.log("");
        console.log("All fields are required.");
        rl.close();
        process.exit(1);
    }

    const jwtSecret = crypto.randomBytes(48).toString("hex");

    fs.writeFileSync(
        ".env",
        [
            `MONGODB_URI=${mongodbUri}`,
            `JWT_SECRET=${jwtSecret}`,
            "PORT=5000",
            ""
        ].join("\n")
    );

    console.log("");
    console.log("Connecting to MongoDB...");

    await mongoose.connect(mongodbUri);

    const existingAdmin = await User.findOne({
        role: "admin"
    });

    if (existingAdmin) {
        console.log("");
        console.log("An administrator already exists.");
        console.log(`Admin email: ${existingAdmin.email}`);
        await mongoose.disconnect();
        rl.close();
        process.exit(0);
    }

    const existingUser = await User.findOne({
        email: adminEmail.toLowerCase().trim()
    });

    if (existingUser) {
        console.log("");
        console.log("This email is already registered.");
        await mongoose.disconnect();
        rl.close();
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(
        adminPassword,
        12
    );

    await User.create({
        name: adminName.trim(),
        email: adminEmail.toLowerCase().trim(),
        password: hashedPassword,
        role: "admin",
        isActive: true
    });

    console.log("");
    console.log("========================================");
    console.log(" Setup completed successfully");
    console.log("========================================");
    console.log(`Admin: ${adminEmail}`);
    console.log("Role: ADMIN");
    console.log("MongoDB: Connected");
    console.log("JWT: Configured");
    console.log("========================================");
    console.log("");

    await mongoose.disconnect();
    rl.close();
};

createSetup().catch((error) => {
    console.error("");
    console.error("Setup failed:");
    console.error(error.message);

    rl.close();
    process.exit(1);
});
