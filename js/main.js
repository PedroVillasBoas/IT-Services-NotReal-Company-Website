/**
 * Main application script.
 * Handles DOM manipulation and event listeners for all pages.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Checking login status on page load
  checkLoginStatus();

  // Attaching event listeners for the current page
  const page =
    document.body.id ||
    window.location.pathname.split("/").pop().replace(".html", "");
  switch (page) {
    case "index":
      initIndexPage();
      break;
    case "login":
      initLoginPage();
      break;
    case "change_password":
      initChangePasswordPage();
      break;
    case "register":
      initRegisterPage();
      break;
    case "cart":
      initCartPage();
      break;
  }
});

/**
 * Checking if the user is logged in via sessionStorage and updates if necessary
 */
function checkLoginStatus() {
  const serviceRequestsLink = document.getElementById("serviceRequestsLink");
  if (sessionStorage.getItem("isLoggedIn") === "true" && serviceRequestsLink) {
    serviceRequestsLink.style.display = "list-item";
  }
}

/**
 * Initializing functionalities for the index.html (home) page
 */
function initIndexPage() {
  const modal = document.getElementById("galleryModal");
  const modalImg = document.getElementById("img01");
  const thumbnails = document.querySelectorAll(".gallery-thumbnail");
  const span = document.getElementsByClassName("gallery-modal-close")[0];

  thumbnails.forEach((img) => {
    img.onclick = function () {
      modal.style.display = "flex";
      modalImg.src = this.dataset.full;
    };
  });

  if (span) {
    span.onclick = function () {
      modal.style.display = "none";
    };
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

/**
 * Initializing functionalities for the login page.
 */
function initLoginPage() {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const clearButton = document.getElementById("clearLogin");
  const messageLabel = document.getElementById("loginMessage");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;
    isValid &= validateEmail(emailInput, "emailError");

    // Checking if password is not empty for login
    isValid &= validateRequired(
      passwordInput,
      "passwordError",
      "Password is required."
    );

    if (isValid) {
      messageLabel.textContent = "Validation completed successfully";
      messageLabel.className = "validation-message success";

      // Simulating successful login
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userName", "Test User");
      sessionStorage.setItem("userEmail", emailInput.value);

      // Navigating to index page after a short delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      messageLabel.textContent = "Please correct the errors above.";
      messageLabel.className = "validation-message error";
    }
  });

  clearButton.addEventListener("click", () => {
    form.reset();
    clearError("emailError");
    clearError("passwordError");
    messageLabel.textContent = "";
    emailInput.focus();
  });
}

/**
 * Initializing functionalities for the Change Password page
 */
function initChangePasswordPage() {
  const form = document.getElementById("changePasswordForm");
  const emailInput = document.getElementById("changeEmail");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmNewPassword");
  const clearButton = document.getElementById("clearChangePassword");
  const messageLabel = document.getElementById("changePasswordMessage");

  // Real-time password rule validation
  newPasswordInput.addEventListener("input", () => {
    validatePasswordRealtime(newPasswordInput, {
      length: "ruleLength",
      numeric: "ruleNumeric",
      uppercase: "ruleUppercase",
      special: "ruleSpecial",
    });

    // Also checking if they match when the main password changes
    validatePasswordMatch(
      newPasswordInput,
      confirmPasswordInput,
      "confirmNewPasswordError"
    );
  });

  // Real-time password match validation
  confirmPasswordInput.addEventListener("input", () => {
    validatePasswordMatch(
      newPasswordInput,
      confirmPasswordInput,
      "confirmNewPasswordError"
    );
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;
    isValid &= validateEmail(emailInput, "changeEmailError");
    isValid &= validatePassword(newPasswordInput, "newPasswordError");
    isValid &= validatePasswordMatch(
      newPasswordInput,
      confirmPasswordInput,
      "confirmNewPasswordError"
    );

    if (isValid) {
      messageLabel.textContent = "Validation completed successfully";
      messageLabel.className = "validation-message success";
      setTimeout(() => {
        history.back();
      }, 1500);
    } else {
      messageLabel.textContent = "Please correct the errors above.";
      messageLabel.className = "validation-message error";
    }
  });

  clearButton.addEventListener("click", () => {
    form.reset();
    clearAllErrors([
      "changeEmailError",
      "newPasswordError",
      "confirmNewPasswordError",
    ]);
    messageLabel.textContent = "";

    // Reset password rule styles
    const rules = ["ruleLength", "ruleNumeric", "ruleUppercase", "ruleSpecial"];
    rules.forEach((ruleId) =>
      document.getElementById(ruleId)?.classList.remove("met")
    );
    emailInput.focus();
  });
}

/**
 * Initializing functionalities for the Register page
 */
function initRegisterPage() {
  const form = document.getElementById("registerForm");
  const clearButton = document.getElementById("clearRegister");
  const backButton = document.getElementById("backRegister");
  const messageLabel = document.getElementById("registerMessage");

  // Input fields
  const emailInput = document.getElementById("registerEmail");
  const passwordInput = document.getElementById("registerPassword");
  const confirmPasswordInput = document.getElementById(
    "confirmRegisterPassword"
  );
  const fullNameInput = document.getElementById("fullName");
  const cpfInput = document.getElementById("cpf");
  const dobInput = document.getElementById("dateOfBirth");
  const phoneInput = document.getElementById("cellphone");

  // Masks
  cpfInput.addEventListener("input", () => maskCpf(cpfInput));
  phoneInput.addEventListener("input", () => maskPhone(phoneInput));
  dobInput.addEventListener("input", () => maskDate(dobInput));

  // Real-time password rule validation
  passwordInput.addEventListener("input", () => {
    validatePasswordRealtime(passwordInput, {
      length: "ruleLengthReg",
      numeric: "ruleNumericReg",
      uppercase: "ruleUppercaseReg",
      special: "ruleSpecialReg",
    });
    validatePasswordMatch(
      passwordInput,
      confirmPasswordInput,
      "confirmRegisterPasswordError"
    );
  });

  // Real-time password match validation
  confirmPasswordInput.addEventListener("input", () => {
    validatePasswordMatch(
      passwordInput,
      confirmPasswordInput,
      "confirmRegisterPasswordError"
    );
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;
    isValid &= validateEmail(emailInput, "registerEmailError");
    isValid &= validatePassword(passwordInput, "registerPasswordError");
    isValid &= validatePasswordMatch(
      passwordInput,
      confirmPasswordInput,
      "confirmRegisterPasswordError"
    );
    isValid &= validateFullName(fullNameInput, "fullNameError");
    isValid &= validateCpf(cpfInput, "cpfError");
    isValid &= validateAge(dobInput, "dateOfBirthError");
    isValid &= validatePhone(phoneInput, "cellphoneError"); // Optional

    if (isValid) {
      messageLabel.textContent = "Validation completed successfully";
      messageLabel.className = "validation-message success";
    } else {
      messageLabel.textContent = "Please correct the errors above.";
      messageLabel.className = "validation-message error";
    }
  });

  clearButton.addEventListener("click", () => {
    form.reset();
    const errorIds = [
      "registerEmailError",
      "registerPasswordError",
      "confirmRegisterPasswordError",
      "fullNameError",
      "cpfError",
      "dateOfBirthError",
      "cellphoneError",
    ];
    clearAllErrors(errorIds);
    messageLabel.textContent = "";

    // Reset password rule styles
    const rules = [
      "ruleLengthReg",
      "ruleNumericReg",
      "ruleUppercaseReg",
      "ruleSpecialReg",
    ];
    rules.forEach((ruleId) =>
      document.getElementById(ruleId)?.classList.remove("met")
    );
    emailInput.focus();
  });

  backButton.addEventListener("click", () => {
    history.back();
  });
}

/**
 * Initializing functionalities for the cart page
 */
function initCartPage() {
  const loggedInUserName = document.getElementById("loggedInUserName");
  const loggedInUserEmail = document.getElementById("loggedInUserEmail");
  const requestsTableBody = document.querySelector("#requestsTable tbody");
  const newRequestForm = document.getElementById("newRequestForm");
  const serviceSelect = document.getElementById("serviceSelect");
  const messageLabel = document.getElementById("newRequestMessage");

  // Populate user info from sessionStorage
  loggedInUserName.textContent = sessionStorage.getItem("userName") || "Guest";
  loggedInUserEmail.textContent =
    sessionStorage.getItem("userEmail") || "guest@example.com";

  // --- Data Mocks ---
  const servicesData = {
    cloud: { name: "Cloud Migration", price: 5000.0, leadTime: 14 },
    cybersecurity: { name: "Cybersecurity Audit", price: 3500.0, leadTime: 7 },
    managedit: { name: "Managed IT Services", price: 2500.0, leadTime: 30 },
    network: { name: "Network Setup", price: 4200.0, leadTime: 10 },
  };

  let requestsData = [
    {
      date: "2025-08-01",
      number: "SRV-001",
      service: "Cloud Migration",
      status: "COMPLETED",
      price: 5000.0,
      expectedDate: "2025-08-15",
    },
    {
      date: "2025-09-10",
      number: "SRV-002",
      service: "Cybersecurity Audit",
      status: "IN PROGRESS",
      price: 3500.0,
      expectedDate: "2025-09-17",
    },
    {
      date: "2025-09-25",
      number: "SRV-003",
      service: "Managed IT Services",
      status: "EM ELABORAÇÃO",
      price: 2500.0,
      expectedDate: "2025-10-25",
    },
  ];

  // --- Functions ---
  const renderTable = () => {
    requestsTableBody.innerHTML = "";
    // Sort data by request date before rendering
    requestsData.sort((a, b) => new Date(a.date) - new Date(b.date));

    requestsData.forEach((req, index) => {
      const row = requestsTableBody.insertRow();
      row.innerHTML = `
                <td>${new Date(req.date).toLocaleDateString("pt-BR")}</td>
                <td>${req.number}</td>
                <td>${req.service}</td>
                <td>${req.status}</td>
                <td>${req.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}</td>
                <td>${new Date(req.expectedDate).toLocaleDateString(
                  "pt-BR"
                )}</td>
                <td><button class="btn-delete" data-index="${index}"><i class="fas fa-trash-alt"></i></button></td>
            `;
    });
  };

  const updateNewRequestForm = () => {
    const selectedServiceKey = serviceSelect.value;
    const priceLabel = document.getElementById("servicePrice");
    const leadTimeLabel = document.getElementById("serviceLeadTime");
    const expectedDateLabel = document.getElementById("expectedServiceDate");

    if (selectedServiceKey && servicesData[selectedServiceKey]) {
      const service = servicesData[selectedServiceKey];
      priceLabel.textContent = service.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      leadTimeLabel.textContent = service.leadTime;

      const today = new Date();
      const expectedDate = new Date(
        today.setDate(today.getDate() + service.leadTime)
      );
      expectedDateLabel.textContent = expectedDate.toLocaleDateString("pt-BR");
    } else {
      priceLabel.textContent = "R$ 0,00";
      leadTimeLabel.textContent = "0";
      expectedDateLabel.textContent = "--/--/----";
    }
  };

  // --- Event Listeners ---
  serviceSelect.addEventListener("change", updateNewRequestForm);

  requestsTableBody.addEventListener("click", (e) => {
    // Use event delegation to handle delete clicks
    if (e.target.closest(".btn-delete")) {
      const button = e.target.closest(".btn-delete");
      const indexToDelete = parseInt(button.dataset.index, 10);
      requestsData.splice(indexToDelete, 1);
      renderTable(); // Re-render the table
    }
  });

  newRequestForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedServiceKey = serviceSelect.value;
    if (!selectedServiceKey) {
      messageLabel.textContent = "Please select a service to include.";
      messageLabel.className = "validation-message error";
      return;
    }

    const service = servicesData[selectedServiceKey];
    const today = new Date();
    const expectedDate = new Date(
      new Date().setDate(today.getDate() + service.leadTime)
    );

    const newRequest = {
      date: today.toISOString().split("T")[0],
      number: `SRV-${String(requestsData.length + 4).padStart(3, "0")}`,
      service: service.name,
      status: "EM ELABORAÇÃO",
      price: service.price,
      expectedDate: expectedDate.toISOString().split("T")[0],
    };

    requestsData.push(newRequest);
    renderTable();

    messageLabel.textContent = "Request included successfully!";
    messageLabel.className = "validation-message success";
    newRequestForm.reset();
    updateNewRequestForm();

    setTimeout(() => {
      messageLabel.textContent = "";
    }, 3000);
  });

  // Initial render
  renderTable();
}

// --- Helper function to clear multiple error fields ---
function clearAllErrors(errorIds) {
  errorIds.forEach((id) => clearError(id));
}
