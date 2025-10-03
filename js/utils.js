/**
 * Utility functions for input masking and age calculation.
 */

/**
 * Masks the CPF input to the format NNN.NNN.NNN-NN.
 * @param {HTMLInputElement} cpfInput - The input element for the CPF.
 */
function maskCpf(cpfInput) {
  let value = cpfInput.value.replace(/\D/g, ""); // Just to remove all non-digits
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  cpfInput.value = value;
}

/**
 * Masks the phone input to the format (XX) XXXXX-XXXX.
 * @param {HTMLInputElement} phoneInput - The input element for the phone number.
 */
function maskPhone(phoneInput) {
  let value = phoneInput.value.replace(/\D/g, "");
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  phoneInput.value = value;
}

/**
 * Masks the date input to the format DD/MM/YYYY.
 * @param {HTMLInputElement} dateInput - The input element for the date.
 */
function maskDate(dateInput) {
  let value = dateInput.value.replace(/\D/g, "");
  value = value.substring(0, 8); // 8 digits limit (DDMMYYYY)
  if (value.length > 4) {
    // Applying final mask when the year is started
    value = value.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
  } else if (value.length > 2) {
    // Adding the first slash after the day
    value = value.replace(/(\d{2})(\d)/, "$1/$2");
  }
  dateInput.value = value;
}

/**
 * Calculates the age from a birth date string (DD/MM/YYYY).
 * @param {string} birthDateString - The date of birth in DD/MM/YYYY format.
 * @returns {number|null} The age in years, or null if the date is invalid.
 */
function calculateAge(birthDateString) {
  // The date input now comes as DD/MM/YYYY, so we parse it
  const parts = birthDateString.split("/");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in Js Date
  const year = parseInt(parts[2], 10);

  if (
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year) ||
    year < 1900 ||
    year > new Date().getFullYear() ||
    parts[2].length < 4
  ) {
    return null;
  }
  const birthDate = new Date(year, month, day);
  // Verifying if the date is valid
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month ||
    birthDate.getDate() !== day
  ) {
    return null; // Invalid date
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}
