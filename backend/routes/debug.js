// routes/debug.js
const express = require("express");
const router = express.Router();
const Grievance = require("../models/Grievance");
const Subsidiary = require("../models/Subsidiary");

router.get("/grievances-by-subsidiary", async (req, res) => {
  try {
    const result = await Grievance.aggregate([
      {
        $group: {
          _id: "$subsidiary",
          count: { $sum: 1 }
        }
      }
    ]);

    // Populate the subsidiary names
    const enriched = await Promise.all(
      result.map(async (r) => {
        const sub = await Subsidiary.findById(r._id);
        return { name: sub?.name || "Unknown", count: r.count };
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: "Error fetching grievance count", error: err.message });
  }
});

module.exports = router;
