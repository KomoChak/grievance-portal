const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Grievance = require("../models/Grievance");
const User = require("../models/User");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const sampleGrievances = [
  {
    title: "PF not settled after 3 months",
    description: "It has been over 3 months since retirement, and I have not received my Provident Fund settlement.",
    category: "Payment of Provident Fund",
    subcategory: "Delay in Payment",
    dateOfRetirement: "2023-01-15",
  },
  {
    title: "Gratuity not credited",
    description: "Despite completing all formalities, I haven’t received my gratuity.",
    category: "Gratuity",
    subcategory: "Gratuity Not Received",
    dateOfRetirement: "2022-12-10",
  }
];

const seedGrievances = async () => {
  try {
    const employees = await User.find({ role: "employee" });

    if (!employees || employees.length === 0) {
      throw new Error("❌ No employees found. Please seed employees first.");
    }

    const grievances = [];

    for (const emp of employees) {
      // Add 2 grievances per employee
      for (let i = 0; i < 2; i++) {
        grievances.push({
          user: emp._id,
          subsidiary: emp.subsidiary,
          area: emp.area,
          unit: emp.unit,
          title: sampleGrievances[i].title,
          description: sampleGrievances[i].description,
          category: sampleGrievances[i].category,
          subcategory: sampleGrievances[i].subcategory,
          dateOfRetirement: sampleGrievances[i].dateOfRetirement,
          status: "submitted"
        });
      }
    }

    await Grievance.insertMany(grievances);
    console.log(`✅ Seeded ${grievances.length} grievances successfully.`);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding grievances:", err);
    process.exit(1);
  }
};

seedGrievances();
