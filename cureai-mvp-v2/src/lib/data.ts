export type Doctor = {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  experience: string;
  clinic: string;
  location: string;
  availability: string[];
  fee: string;
  rating: string;
  testimonials: string[];
  focus: string[];
};

export const doctors: Doctor[] = [
  {
    id: "ananya-rao",
    name: "Dr. Ananya Rao",
    qualification: "MBBS, MD - Internal Medicine",
    specialization: "General Physician",
    experience: "11 years",
    clinic: "Cure AI Health Centre",
    location: "Indiranagar, Bengaluru",
    availability: ["Today 4:30 PM", "Tomorrow 10:00 AM", "Sat 12:30 PM"],
    fee: "Rs. 600",
    rating: "4.8",
    focus: ["fever", "cough", "fatigue", "body pain", "infection"],
    testimonials: [
      "Clear diagnosis and practical next steps.",
      "Very calm, thorough, and punctual.",
    ],
  },
  {
    id: "kabir-mehta",
    name: "Dr. Kabir Mehta",
    qualification: "MBBS, MD - Dermatology",
    specialization: "Dermatologist",
    experience: "9 years",
    clinic: "Blue Leaf Clinic",
    location: "Koramangala, Bengaluru",
    availability: ["Today 6:00 PM", "Fri 11:30 AM", "Sun 5:00 PM"],
    fee: "Rs. 800",
    rating: "4.7",
    focus: ["rash", "acne", "itching", "skin allergy", "hair fall"],
    testimonials: [
      "Explained treatment options without rushing.",
      "My allergy improved within a week.",
    ],
  },
  {
    id: "isha-menon",
    name: "Dr. Isha Menon",
    qualification: "MBBS, MS - Orthopaedics",
    specialization: "Orthopaedic Specialist",
    experience: "13 years",
    clinic: "Northstar Ortho Care",
    location: "Whitefield, Bengaluru",
    availability: ["Tomorrow 9:30 AM", "Fri 4:00 PM", "Mon 1:00 PM"],
    fee: "Rs. 900",
    rating: "4.9",
    focus: ["joint pain", "back pain", "sprain", "knee", "shoulder"],
    testimonials: [
      "Excellent review of my reports before treatment.",
      "The appointment flow was smooth and professional.",
    ],
  },
  {
    id: "neel-shah",
    name: "Dr. Neel Shah",
    qualification: "MBBS, DM - Cardiology",
    specialization: "Cardiologist",
    experience: "15 years",
    clinic: "Cure AI Heart Clinic",
    location: "HSR Layout, Bengaluru",
    availability: ["Today 7:00 PM", "Sat 10:00 AM", "Tue 3:30 PM"],
    fee: "Rs. 1200",
    rating: "4.9",
    focus: ["chest pain", "palpitations", "blood pressure", "breathless"],
    testimonials: [
      "Very reassuring and detail-oriented.",
      "Helped us understand risk without panic.",
    ],
  },
];

export const appointments = [
  { patient: "Meera Nair", doctor: "Dr. Ananya Rao", time: "Today, 4:30 PM", status: "Confirmed" },
  { patient: "Rohan Kapoor", doctor: "Dr. Neel Shah", time: "Today, 7:00 PM", status: "Awaiting arrival" },
  { patient: "Aarav Singh", doctor: "Dr. Isha Menon", time: "Tomorrow, 9:30 AM", status: "Booked" },
];

export const records = [
  { title: "Blood test report", type: "Lab report", date: "28 Jun 2026" },
  { title: "Viral fever prescription", type: "Prescription", date: "14 Jun 2026" },
  { title: "Orthopaedic consultation note", type: "Consultation note", date: "02 May 2026" },
];

export function suggestSpeciality(symptoms: string) {
  const text = symptoms.toLowerCase();
  const scored = doctors
    .map((doctor) => ({
      doctor,
      score: doctor.focus.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!symptoms.trim()) return { speciality: "General Physician", matches: doctors.slice(0, 2) };
  if (best.score === 0) return { speciality: "General Physician", matches: doctors.filter((d) => d.specialization === "General Physician") };
  return {
    speciality: best.doctor.specialization,
    matches: scored.filter((item) => item.score > 0).map((item) => item.doctor),
  };
}
