export function suggestSpecialist(symptoms: string) {
  const text = symptoms.toLowerCase();

  // MVP keyword matcher.
  // Later, replace this function with a real AI API call while keeping the
  // same return value shape so the rest of the booking flow does not change.
  if (text.includes("skin") || text.includes("rash") || text.includes("acne")) {
    return "Dermatologist";
  }

  if (text.includes("tooth") || text.includes("dental")) {
    return "Dentist";
  }

  if (text.includes("fever") || text.includes("cough") || text.includes("cold")) {
    return "General Physician";
  }

  if (text.includes("chest") || text.includes("heart")) {
    return "Cardiologist";
  }

  if (text.includes("pregnancy") || text.includes("periods")) {
    return "Gynecologist";
  }

  if (text.includes("eye") || text.includes("vision")) {
    return "Ophthalmologist";
  }

  return "General Physician";
}
