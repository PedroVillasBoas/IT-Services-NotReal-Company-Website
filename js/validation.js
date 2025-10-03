/**
 * Validation functions for form inputs.
 */

/**
 * Displays an error message for a given input field.
 * @param {string} elementId - The ID of the error message paragraph element.
 * @param {string} message - The error message to display.
 */
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

/**
 * Clears the error message for a given input field.
 * @param {string} elementId - The ID of the error message paragraph element.
 */
function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = "";
  }
}

/**
 * Validates if an input field is filled.
 * @param {HTMLInputElement} input - The input element.
 * @param {string} errorId - The ID of the error message element.
 * @param {string} message - The error message to display if validation fails.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateRequired(input, errorId, message) {
  if (input.value.trim() === "") {
    showError(errorId, message);
    return false;
  }
  clearError(errorId);
  return true;
}

/**
 * Validates an email input field for format.
 * @param {HTMLInputElement} input - The email input element.
 * @param {string} errorId - The ID of the error message element.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateEmail(input, errorId) {
  if (!validateRequired(input, errorId, "Email é obrigatório.")) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.value)) {
    showError(errorId, "Por favor, insira um formato de email válido.");
    return false;
  }
  clearError(errorId);
  return true;
}

/**
 * Validates a password input field based on composition rules.
 * @param {HTMLInputElement} input - The password input element.
 * @param {string} errorId - The ID of the error message element.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validatePassword(input, errorId) {
  if (!validateRequired(input, errorId, "Senha é obrigatória.")) {
    return false;
  }
  const value = input.value;
  const errors = [];
  if (value.length < 6) errors.push("pelo menos 6 caracteres");
  if (!/[A-Z]/.test(value)) errors.push("pelo menos uma letra maiúscula");
  if (!/\d/.test(value)) errors.push("pelo menos um número");
  if (!/[@#\$%&*\!?/\\|_\-+=.]/.test(value))
    errors.push("pelo menos um caractere especial");
  if (/[¨{}\[\]´`~^:;<>,“‘]/.test(value))
    errors.push("sem caracteres não permitidos");

  if (errors.length > 0) {
    showError(errorId, `A senha deve conter ${errors.join(", ")}.`);
    return false;
  }
  clearError(errorId);
  return true;
}

/**
 * Provides real-time feedback on password composition rules.
 * @param {HTMLInputElement} passwordInput - The password input element.
 * @param {object} ruleElementIds - An object mapping rule names to their element IDs.
 */
function validatePasswordRealtime(passwordInput, ruleElementIds) {
  const value = passwordInput.value;
  const rules = {
    length: value.length >= 6,
    numeric: /\d/.test(value),
    uppercase: /[A-Z]/.test(value),
    special:
      /[@#\$%&*\!?/\\|_\-+=.]/.test(value) &&
      !/[¨{}\[\]´`~^:;<>,“‘]/.test(value),
  };

  for (const rule in rules) {
    const el = document.getElementById(ruleElementIds[rule]);
    if (el) {
      el.classList.toggle("met", rules[rule]);
    }
  }
}

/**
 * Validates if the password and confirmation password fields match.
 * @param {HTMLInputElement} passwordInput - The main password input.
 * @param {HTMLInputElement} confirmInput - The confirmation password input.
 * @param {string} errorId - The ID of the error message element.
 * @returns {boolean} - True if they match, false otherwise.
 */
function validatePasswordMatch(passwordInput, confirmInput, errorId) {
  clearError(errorId); // Clearing any previous messages
  if (confirmInput.value === "" && passwordInput.value === "") {
    return true; // Don't show error if both are empty
  }
  if (confirmInput.value !== "" && passwordInput.value === "") {
    showError(errorId, "Por favor, insira a senha principal primeiro.");
    return false;
  }
  if (passwordInput.value !== confirmInput.value) {
    // Showing error message if confirm has text but doesn't match
    if (confirmInput.value !== "") {
      showError(errorId, "As senhas não coincidem.");
    }
    return false;
  }
  // Showing a success message when they match and confirm is not empty
  if (confirmInput.value !== "") {
    const successElement = document.getElementById(errorId);
    if (successElement) {
      successElement.textContent = "As senhas coincidem!";
      successElement.style.color = "#2ecc71";
    }
  }
  return true;
}

/**
 * Validates a full name input (at least two words, first word > 1 char, no special chars).
 * @param {HTMLInputElement} input - The full name input element.
 * @param {string} errorId - The ID of the error message element.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateFullName(input, errorId) {
  if (!validateRequired(input, errorId, "O nome completo é obrigatório.")) {
    return false;
  }
  const value = input.value.trim();
  const specialCharRegex = /[@#\$%&*\!?/\\|_\-+=.¨{}\[\]´`~^:;<>,“‘\d]/;
  if (specialCharRegex.test(value)) {
    showError(
      errorId,
      "O nome completo não pode conter caracteres especiais ou números."
    );
    return false;
  }
  const names = value.split(" ").filter((n) => n);
  if (names.length < 2) {
    showError(errorId, "Por favor, insira pelo menos dois nomes.");
    return false;
  }
  if (names[0].length < 2) {
    showError(errorId, "O primeiro nome deve ter pelo menos 2 caracteres.");
    return false;
  }
  clearError(errorId);
  return true;
}

/**
 * Validates a CPF using the standard algorithm.
 * @param {HTMLInputElement} input - The CPF input element.
 * @param {string} errorId - The ID of the error message element.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateCpf(input, errorId) {
  if (!validateRequired(input, errorId, "O CPF é obrigatório.")) {
    return false;
  }
  let cpf = input.value.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    showError(errorId, "Formato de CPF inválido.");
    return false;
  }
  let sum = 0,
    remainder;
  for (let i = 1; i <= 9; i++)
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) {
    showError(errorId, "CPF inválido.");
    return false;
  }
  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) {
    showError(errorId, "CPF inválido.");
    return false;
  }
  clearError(errorId);
  return true;
}

/**
 * Validates that the user is at least 18 years old.
 * @param {HTMLInputElement} input - The date of birth input element.
 * @param {string} errorId - The ID of the error message element.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateAge(input, errorId) {
  if (!validateRequired(input, errorId, "A data de nascimento é obrigatória.")) {
    return false;
  }
  const age = calculateAge(input.value);
  if (age === null) {
    showError(errorId, "Formato de data inválido. Por favor, use DD/MM/YYYY.");
    return false;
  }
  if (age < 18) {
    showError(errorId, "Você deve ter pelo menos 18 anos.");
    return false;
  }
  clearError(errorId);
  return true;
}

/**
 * Validates a phone number if it has been filled out.
 * @param {HTMLInputElement} input - The phone input element.
 * @param {string} errorId - The ID of the error message element.
 * @returns {boolean} - True if valid or empty, false otherwise.
 */
function validatePhone(input, errorId) {
  const value = input.value.trim();
  if (value === "") {
    clearError(errorId);
    return true; // Optional field, so it's valid if empty
  }
  // Simple regex for number like (XX) XXXXX-XXXX format (HueHueBR number format)
  const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
  if (!phoneRegex.test(value)) {
    showError(
      errorId,
      "Por favor, insira um número de telefone válido (ex: (81) 12345-6789)."
    );
    return false;
  }
  clearError(errorId);
  return true;
}
