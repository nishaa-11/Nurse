require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Shift = require("./models/Shift");
const Rating = require("./models/Rating");
const Notification = require("./models/Notification");
const Payment = require("./models/Payment");
const Availability = require("./models/Availability");
const EmergencyRequest = require("./models/EmergencyRequest");

const seed = async () => {
  try {
    await connectDB();
    console.log("Starting database seeding...");

    await User.deleteMany({});
    await User.deleteMany({});
    await Shift.deleteMany({});
    await Rating.deleteMany({});
    await Notification.deleteMany({});
    await Payment.deleteMany({});
    await Availability.deleteMany({});
    await EmergencyRequest.deleteMany({});

    console.log("Creating hospitals...");
    const hospital1 = await User.create({
      name: "City General Hospital",
      email: "admin@cityhospital.com",
      password: "hospital123",
      phone: "+1-555-0101",
      role: "hospital",
      location: { type: "Point", coordinates: [-74.006, 40.7128] },
      address: {
        street: "123 Medical Center Dr",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      verified: true,
      verificationStatus: "verified",
      hospitalProfile: {
        hospitalType: "General",
        size: "Large (301-500 beds)",
        departments: ["ICU", "ER", "Surgery", "Cardiology", "Pediatrics"],
        contactPerson: {
          name: "Dr. Sarah Johnson",
          title: "Chief Nursing Officer",
          phone: "+1-555-0102",
          email: "s.johnson@cityhospital.com"
        },
        accreditation: ["Joint Commission", "Magnet Recognition"],
        emergencyContact: {
          name: "Emergency Operations",
          phone: "+1-555-0199"
        }
      }
    });

    const hospital2 = await User.create({
      name: "St. Mary's Medical Center",
      email: "contact@stmarys.org",
      password: "hospital123",
      phone: "+1-555-0201",
      role: "hospital",
      location: { type: "Point", coordinates: [-118.2437, 34.0522] },
      address: {
        street: "456 Healthcare Blvd",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      verified: true,
      verificationStatus: "verified",
      hospitalProfile: {
        hospitalType: "Specialty",
        size: "Medium (101-300 beds)",
        departments: ["ER", "Surgery", "Oncology", "Mental Health"],
        contactPerson: {
          name: "Maria Rodriguez",
          title: "HR Director",
          phone: "+1-555-0202",
          email: "m.rodriguez@stmarys.org"
        },
        accreditation: ["AAAHC"],
        emergencyContact: {
          name: "24/7 Support",
          phone: "+1-555-0299"
        }
      }
    });

    console.log("Creating nurses...");
    const nurse1 = await User.create({
      name: "Emily Chen",
      email: "emily.chen@email.com",
      password: "nurse123",
      phone: "+1-555-0301",
      role: "nurse",
      location: { type: "Point", coordinates: [-74.0060, 40.7589] },
      address: {
        street: "789 Nurse Ave",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        country: "USA"
      },
      verified: true,
      verificationStatus: "verified",
      nurseProfile: {
        licenseNumber: "RN123456789",
        experienceYears: 5,
        specializations: ["ICU", "ER", "Cardiology"],
        certifications: ["BLS", "ACLS", "CCRN"],
        hourlyRate: 45,
        availability: {
          monday: { available: true, hours: ["07:00-19:00"] },
          tuesday: { available: true, hours: ["07:00-19:00"] },
          wednesday: { available: true, hours: ["07:00-19:00"] },
          thursday: { available: false, hours: [] },
          friday: { available: true, hours: ["07:00-15:00"] },
          saturday: { available: true, hours: ["19:00-07:00"] },
          sunday: { available: false, hours: [] }
        },
        isAvailable: true,
        rating: 4.8,
        totalRatings: 24,
        completedShifts: 87
      }
    });

    const nurse2 = await User.create({
      name: "Marcus Thompson",
      email: "marcus.thompson@email.com",
      password: "nurse123",
      phone: "+1-555-0401",
      role: "nurse",
      location: { type: "Point", coordinates: [-74.0020, 40.7200] },
      address: {
        street: "321 Healthcare St",
        city: "New York",
        state: "NY",
        zipCode: "10003",
        country: "USA"
      },
      verified: true,
      verificationStatus: "verified",
      nurseProfile: {
        licenseNumber: "RN987654321",
        experienceYears: 8,
        specializations: ["Surgery", "ER", "General"],
        certifications: ["BLS", "PALS", "TNCC"],
        hourlyRate: 50,
        availability: {
          monday: { available: true, hours: ["19:00-07:00"] },
          tuesday: { available: true, hours: ["19:00-07:00"] },
          wednesday: { available: true, hours: ["19:00-07:00"] },
          thursday: { available: true, hours: ["19:00-07:00"] },
          friday: { available: false, hours: [] },
          saturday: { available: false, hours: [] },
          sunday: { available: true, hours: ["07:00-19:00"] }
        },
        isAvailable: true,
        rating: 4.6,
        totalRatings: 31,
        completedShifts: 124
      }
    });

    const nurse3 = await User.create({
      name: "Jessica Williams",
      email: "jessica.w@email.com",
      password: "nurse123",
      phone: "+1-555-0501",
      role: "nurse",
      location: { type: "Point", coordinates: [-118.2500, 34.0600] },
      address: {
        street: "654 Medical Plaza",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90211",
        country: "USA"
      },
      verified: true,
      verificationStatus: "verified",
      nurseProfile: {
        licenseNumber: "RN456789123",
        experienceYears: 3,
        specializations: ["Pediatrics", "General"],
        certifications: ["BLS", "PALS", "NRP"],
        hourlyRate: 42,
        availability: {
          monday: { available: true, hours: ["07:00-15:00"] },
          tuesday: { available: true, hours: ["07:00-15:00"] },
          wednesday: { available: true, hours: ["15:00-23:00"] },
          thursday: { available: true, hours: ["15:00-23:00"] },
          friday: { available: true, hours: ["07:00-15:00"] },
          saturday: { available: true, hours: ["07:00-19:00"] },
          sunday: { available: false, hours: [] }
        },
        isAvailable: true,
        rating: 4.9,
        totalRatings: 18,
        completedShifts: 45
      }
    });

    console.log("Creating shifts...");
    const shift1 = await Shift.create({
      hospital: hospital1._id,
      title: "ICU Day Shift - Critical Care",
      description: "Intensive care unit day shift requiring experienced nurse for post-surgical patients",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      startTime: "07:00",
      endTime: "19:00",
      duration: 12,
      department: "ICU",
      requiredSpecializations: ["ICU"],
      requiredCertifications: ["BLS", "ACLS"],
      minimumExperience: 2,
      urgencyLevel: "medium",
      paymentRate: 48,
      paymentType: "hourly",
      bonusAmount: 0,
      status: "open",
      surge: false,
      surgeMultiplier: 1.0,
      priority: 5,
      hospitalNotes: "Patient load: 4-6 patients, mix of post-op and medical ICU"
    });

    const shift2 = await Shift.create({
      hospital: hospital1._id,
      title: "Emergency Night Shift - ER",
      description: "Fast-paced emergency department night shift",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      startTime: "19:00",
      endTime: "07:00",
      duration: 12,
      department: "ER",
      requiredSpecializations: ["ER"],
      requiredCertifications: ["BLS", "ACLS", "TNCC"],
      minimumExperience: 3,
      urgencyLevel: "high",
      paymentRate: 52,
      paymentType: "hourly",
      bonusAmount: 50,
      status: "open",
      surge: true,
      surgeMultiplier: 1.3,
      priority: 8,
      hospitalNotes: "High-volume night, trauma level 1 facility"
    });

    const shift3 = await Shift.create({
      hospital: hospital2._id,
      title: "Pediatric Day Shift",
      description: "Caring for pediatric patients in medical/surgical unit",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      startTime: "07:00",
      endTime: "15:00",
      duration: 8,
      department: "Pediatrics",
      requiredSpecializations: ["Pediatrics"],
      requiredCertifications: ["BLS", "PALS"],
      minimumExperience: 1,
      urgencyLevel: "low",
      paymentRate: 44,
      paymentType: "hourly",
      bonusAmount: 0,
      status: "assigned",
      nurseAssigned: nurse3._id,
      assignedAt: new Date(),
      surge: false,
      surgeMultiplier: 1.0,
      priority: 3,
      hospitalNotes: "Ages 2-16, mostly routine care and medication administration"
    });

    shift1.nursesApplied.push({
      nurse: nurse1._id,
      appliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      message: "Experienced ICU nurse, available for this shift"
    });

    shift2.nursesApplied.push({
      nurse: nurse2._id,
      appliedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      message: "Night shift specialist, trauma experience"
    });

    await shift1.save();
    await shift2.save();

    console.log("Creating availability records...");
    await Availability.create({
      nurse: nurse1._id,
      weeklySchedule: {
        monday: { available: true, timeSlots: [{ startTime: "07:00", endTime: "19:00", maxShifts: 1 }] },
        tuesday: { available: true, timeSlots: [{ startTime: "07:00", endTime: "19:00", maxShifts: 1 }] },
        wednesday: { available: true, timeSlots: [{ startTime: "07:00", endTime: "19:00", maxShifts: 1 }] },
        thursday: { available: false, timeSlots: [] },
        friday: { available: true, timeSlots: [{ startTime: "07:00", endTime: "15:00", maxShifts: 1 }] },
        saturday: { available: true, timeSlots: [{ startTime: "19:00", endTime: "07:00", maxShifts: 1 }] },
        sunday: { available: false, timeSlots: [] }
      },
      preferences: {
        preferredShiftLength: 12,
        maxShiftsPerWeek: 4,
        maxConsecutiveDays: 3,
        minimumNoticeHours: 24,
        willingToWorkWeekends: true,
        willingToWorkNights: true,
        willingToWorkHolidays: false,
        preferredDepartments: ["ICU", "ER"],
        minimumHourlyRate: 40
      },
      currentStatus: "available",
      emergencyAvailable: true,
      emergencyContactHours: 2
    });

    console.log("Creating ratings...");
    const rating1 = await Rating.create({
      shift: shift3._id,
      nurse: nurse3._id,
      hospital: hospital2._id,
      overallScore: 5,
      ratings: {
        punctuality: 5,
        professionalism: 5,
        skillLevel: 4,
        communication: 5,
        teamwork: 5,
        patientCare: 5
      },
      positiveComment: "Excellent care with pediatric patients. Very gentle and professional.",
      improvementComment: "Could improve on documentation speed.",
      wouldRecommend: true,
      wouldHireAgain: true,
      verified: true
    });

    console.log("Creating payments...");
    await Payment.create({
      shift: shift3._id,
      hospital: hospital2._id,
      nurse: nurse3._id,
      baseAmount: 352,
      surgeAmount: 0,
      bonusAmount: 0,
      totalAmount: 352,
      platformFee: 17.6,
      status: "completed",
      paymentMethod: "stripe",
      transactionId: `txn_${Date.now()}`,
      paidAt: new Date(),
      processedAt: new Date(),
      notes: "Payment for pediatric day shift"
    });

    console.log("Creating notifications...");
    await Notification.create({
      recipient: nurse1._id,
      sender: hospital1._id,
      type: "shift_assigned",
      title: "Shift Assignment Confirmation",
      message: "You have been assigned to ICU Day Shift on " + new Date().toDateString(),
      shift: shift1._id,
      priority: "medium"
    });

    await Notification.create({
      recipient: hospital1._id,
      sender: nurse2._id,
      type: "application_received",
      title: "New Shift Application",
      message: "Marcus Thompson applied for Emergency Night Shift",
      shift: shift2._id,
      priority: "medium"
    });

    console.log("Creating emergency request...");
    await EmergencyRequest.create({
      hospital: hospital1._id,
      urgencyLevel: "critical",
      situation: "Multiple trauma patients incoming, need additional ER nurse immediately",
      estimatedDuration: 6,
      department: "ER",
      requiredSpecializations: ["ER"],
      requiredCertifications: ["BLS", "ACLS", "TNCC"],
      minimumExperience: 2,
      nursesNeeded: 1,
      neededBy: new Date(Date.now() + 30 * 60 * 1000),
      startTime: new Date().toTimeString().slice(0, 5),
      emergencyRate: 75,
      bonusAmount: 100,
      contactPerson: {
        name: "Dr. Sarah Johnson",
        phone: "+1-555-0102",
        title: "Chief Nursing Officer"
      },
      additionalNotes: "Multi-vehicle accident, expect 3-4 critical patients",
      status: "active",
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000)
    });

    console.log("Seed data created successfully!");
    console.log(`
Created:
- 2 Hospitals
- 3 Nurses  
- 3 Shifts
- 1 Availability record
- 1 Rating
- 1 Payment
- 2 Notifications
- 1 Emergency Request
    `);

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seed();
