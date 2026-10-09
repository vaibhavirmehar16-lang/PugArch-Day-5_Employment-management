
const DEMO_AUTH_KEY = "employeeHubLoggedIn";
const DEMO_AUTH_VALUE = "demo";

if (sessionStorage.getItem(DEMO_AUTH_KEY) !== DEMO_AUTH_VALUE) {
    window.location.replace("login.html");
}

const dateElement = document.querySelector("#todayDate");

if (dateElement) {
    dateElement.textContent = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

const logoutBtn = document.querySelector("#logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem(DEMO_AUTH_KEY);
        sessionStorage.removeItem("employeeHubUserEmail");
        window.location.href = "login.html";
    });
}
