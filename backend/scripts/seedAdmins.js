const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Subsidiary = require('../models/Subsidiary');
const Area = require('../models/Area');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://grievanceuser:tvgC0zseQxdR3Eta@cluster0.rvpktyq.mongodb.net/grievancedb?', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function seedAdmins() {
  try {
    await mongoose.connection;

    // Clear old admins if necessary
    // await User.deleteMany({ role: { $in: ['superadmin', 'subsidiaryadmin', 'areaadmin'] } });

    const hashedPassword = await bcrypt.hash('securepass', 10);

    const superadmins = [
      {
        employeeId: 'super001',
        name: 'Super Admin 1',
        email: 'super1@coalindia.in',
        password: hashedPassword,
        role: 'superadmin',
      },
      {
        employeeId: 'super002',
        name: 'Super Admin 2',
        email: 'super2@coalindia.in',
        password: hashedPassword,
        role: 'superadmin',
      }
    ];

    const subsidiaries = await Subsidiary.find({});
    const areas = await Area.find({});

    const subsidiaryAdmins = subsidiaries.map(sub => ({
      employeeId: `subsadmin_${sub.name.split(' ')[0].toLowerCase()}`,
      name: `${sub.name} Admin`,
      email: `${sub.name.split(' ')[0].toLowerCase()}admin@coalindia.in`,
      password: hashedPassword,
      role: 'subsidiaryadmin',
      subsidiary: sub._id
    }));

    const areaAdmins = [];
    let areaCounter = 1;

    for (const sub of subsidiaries) {
      const subAreas = areas.filter(a => a.subsidiary.toString() === sub._id.toString()).slice(0, 10);

      for (const area of subAreas) {
        areaAdmins.push({
          employeeId: `area${areaCounter.toString().padStart(3, '0')}`,
          name: `Area Admin ${areaCounter}`,
          email: `area${areaCounter}@coalindia.in`,
          password: hashedPassword,
          role: 'areaadmin',
          subsidiary: sub._id,
          area: area._id
        });
        areaCounter++;
      }
    }

    const allAdmins = [...superadmins, ...subsidiaryAdmins, ...areaAdmins];
    await User.insertMany(allAdmins);

    console.log(`✅ Seeded ${allAdmins.length} admins successfully.`);
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding admins:', err);
    mongoose.disconnect();
  }
}
await User.deleteMany({ role: { $in: ['superadmin', 'subsidiaryadmin'] } }); // Optional: clear previous admins

seedAdmins();
