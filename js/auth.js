
const loginForm = document.querySelector("#loginForm");
const togglePassword = document.querySelector("#togglePassword");
const passwordInput = document.querySelector("#password");
const loginMessage = document.querySelector("#loginMessage");

const DEMO_AUTH_KEY = "employeeHubLoggedIn";
const DEMO_AUTH_VALUE = "demo";
const DEMO_MODE_NOTICE = "Demo mode only: this is a local project demo and not secure production authentication.";

if (window.location.pathname.endsWith("/login.html") || window.location.pathname.endsWith("login.html")) {
    if (sessionStorage.getItem(DEMO_AUTH_KEY) === DEMO_AUTH_VALUE) {
        window.location.replace("index.html");
    }
}

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";
        togglePassword.textContent = isPassword ? "Hide" : "Show";
        togglePassword.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.querySelector("#email")?.value.trim();
        const password = document.querySelector("#password")?.value.trim();

        if (!email || !password) {
            if (loginMessage) {
                loginMessage.textContent = "Please enter both email and password. Demo mode only: local project demo; not secure production authentication.";
            }
            return;
        }

        if (loginMessage) {
            loginMessage.textContent = "Demo login successful. " + DEMO_MODE_NOTICE;
        }

        sessionStorage.setItem(DEMO_AUTH_KEY, DEMO_AUTH_VALUE);
        sessionStorage.setItem("employeeHubUserEmail", email);

        window.location.replace("index.html");
    });
}
