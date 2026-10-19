
const authForm = document.getElementById("auth-form");
const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");
const nameGroup = document.getElementById("name-group");
const fullName = document.getElementById("full-name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submitButton = document.getElementById("submit-button");
const switchMode = document.getElementById("switch-mode");
const switchLabel = document.getElementById("switch-label");
const formMessage = document.getElementById("form-message");

let isSignUp = false;

switchMode.addEventListener("click", function () {
  isSignUp = !isSignUp;

  formTitle.textContent = isSignUp ? "Create Account" : "Sign In";
  formSubtitle.textContent = isSignUp
    ? "Create your InvoiceIQ account."
    : "Enter your details to continue.";

  nameGroup.hidden = !isSignUp;
  fullName.required = isSignUp;

  password.autocomplete = isSignUp
    ? "new-password"
    : "current-password";

  submitButton.innerHTML = isSignUp
    ? 'Create Account <span>→</span>'
    : 'Sign In <span>→</span>';

  switchLabel.textContent = isSignUp
    ? "Already have an account?"
    : "Don't have an account?";

  switchMode.textContent = isSignUp ? "Sign in" : "Create account";

  formMessage.textContent = "";
  formMessage.className = "form-message";
});

authForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const enteredName = fullName.value.trim();
  const enteredEmail = email.value.trim();
  const enteredPassword = password.value;

  if (isSignUp && !enteredName) {
    showMessage("Please enter your full name.", "error");
    fullName.focus();
    return;
  }

  if (enteredPassword.length < 6) {
    showMessage("Password must contain at least 6 characters.", "error");
    password.focus();
    return;
  }

  if (isSignUp) {
    showMessage(
      "Form validated! Real account creation needs a backend and database.",
      "success"
    );
  } else {
    showMessage(
      "The form is valid, but actual login is not connected yet. Backend authentication is required.",
      "success"
    );
  }
});

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = "form-message " + type;
}
