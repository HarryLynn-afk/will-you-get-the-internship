export const JOB_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Mobile Developer",
];

export function isValidJobRole(role) {
  return JOB_ROLES.includes(String(role || "").trim());
}
