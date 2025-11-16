// --- Validation Functions ---
export const validateEmail = (email) => {
  if (!email) return "Email é obrigatório.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return "Por favor, insira um formato de email válido.";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Senha é obrigatória.";
  const errors = [];
  if (password.length < 6) errors.push("pelo menos 6 caracteres");
  if (!/[A-Z]/.test(password)) errors.push("pelo menos uma letra maiúscula");
  if (!/\d/.test(password)) errors.push("pelo menos um número");
  if (!/[@#\$%&*\!?/\\|_\-+=.]/.test(password))
    errors.push("um caractere especial");
  if (/[¨{}\[\]´`~^:;<>,“‘]/.test(password))
    errors.push("sem caracteres não permitidos");

  if (errors.length > 0) return `A senha deve conter ${errors.join(", ")}.`;
  return "";
};

export const validatePasswordMatch = (password, confirm) => {
  if (password !== confirm) return "As senhas não coincidem.";
  return "";
};

export const validateFullName = (name) => {
  if (!name) return "O nome completo é obrigatório.";
  const value = name.trim();
  const specialCharRegex = /[@#\$%&*\!?/\\|_\-+=.¨{}\[\]´`~^:;<>,“‘\d]/;
  if (specialCharRegex.test(value)) {
    return "O nome completo não pode conter caracteres especiais ou números.";
  }
  const names = value.split(" ").filter((n) => n);
  if (names.length < 2) return "Por favor, insira pelo menos dois nomes.";
  if (names[0].length < 2)
    return "O primeiro nome deve ter pelo menos 2 caracteres.";
  return "";
};

export const validateCpf = (cpf) => {
  if (!cpf) return "O CPF é obrigatório.";
  let cpfDigits = cpf.replace(/\D/g, "");
  if (cpfDigits.length !== 11 || /^(\d)\1+$/.test(cpfDigits)) {
    return "Formato de CPF inválido.";
  }
  let sum = 0,
    remainder;
  for (let i = 1; i <= 9; i++)
    sum += parseInt(cpfDigits.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpfDigits.substring(9, 10)))
    return "CPF inválido.";
  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum += parseInt(cpfDigits.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpfDigits.substring(10, 11)))
    return "CPF inválido.";
  return "";
};

export const validateAge = (dob) => {
  if (!dob) return "A data de nascimento é obrigatória.";
  const age = calculateAge(dob);
  if (age === null)
    return "Formato de data inválido. Por favor, use DD/MM/YYYY.";
  if (age < 18) return "Você deve ter pelo menos 18 anos.";
  return "";
};

// --- Masking Functions ---
export const maskCpf = (value) => {
  let v = value.replace(/\D/g, "").substring(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return v;
};

export const maskDate = (value) => {
  let v = value.replace(/\D/g, "").substring(0, 8);
  if (v.length > 4) v = v.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
  else if (v.length > 2) v = v.replace(/(\d{2})(\d)/, "$1/$2");
  return v;
};

// --- Helper Functions ---
function calculateAge(birthDateString) {
  const parts = birthDateString.split("/");
  if (parts.length !== 3 || parts[2].length < 4) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  const birthDate = new Date(year, month, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month ||
    birthDate.getDate() !== day
  )
    return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}
