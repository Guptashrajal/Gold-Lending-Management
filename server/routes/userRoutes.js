const express = require("express");
const { protect, adminOnly } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to retrieve users"
        });
    }
});

module.exports = router;
