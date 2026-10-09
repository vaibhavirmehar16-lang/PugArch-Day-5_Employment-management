
let employees = [];
let filteredEmployees = [];

function getInitials(name) {
    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function formatSalary(salary) {
    if (salary == null || salary === "") return "Not available";

    return "₹" + Number(salary).toLocaleString("en-IN");
}

function getStatusClass(status) {
    if (status === "Active") return "status-active";
    if (status === "Inactive") return "status-inactive";
    return "status-on-leave";
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function renderEmployees(list) {
    const grid = document.querySelector("#employeeGrid");
    const emptyState = document.querySelector("#emptyState");
    const loadingState = document.querySelector("#loadingState");

    loadingState.classList.add("hidden");
    grid.innerHTML = "";

    document.querySelector("#resultCount").textContent =
        `${list.length} member${list.length !== 1 ? "s" : ""}`;

    emptyState.classList.toggle("hidden", list.length !== 0);

    list.forEach(employee => {
        const card = document.createElement("article");
        card.className = "employee-card";

        const avatar = employee.image
            ? `<img src="${escapeHTML(employee.image)}" alt="" loading="lazy">`
            : escapeHTML(getInitials(employee.name));

        card.innerHTML = `
            <div class="employee-card-top">
                <div class="avatar">${avatar}</div>
                <span class="status ${getStatusClass(employee.status)}">
                    ${escapeHTML(employee.status)}
                </span>
            </div>

            <h3 class="employee-name">${escapeHTML(employee.name)}</h3>
            <p class="employee-position">${escapeHTML(employee.position)}</p>

            <div class="employee-meta">
                <div>
                    <span>Department</span>
                    <strong>${escapeHTML(employee.department)}</strong>
                </div>
                <div>
                    <span>Email</span>
                    <strong>${escapeHTML(employee.email)}</strong>
                </div>
                <div>
                    <span>Monthly salary</span>
                    <strong>${formatSalary(employee.salary)}</strong>
                </div>
            </div>

            <div class="employee-card-actions">
                <button class="action-btn" data-action="view"
                    data-id="${employee.id}">View</button>
                <button class="action-btn" data-action="edit"
                    data-id="${employee.id}">Edit</button>
                <button class="action-btn delete-btn" data-action="delete"
                    data-id="${employee.id}">Delete</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

function updateDashboard() {
    document.querySelector("#totalEmployees").textContent =
        employees.length;

    document.querySelector("#activeEmployees").textContent =
        employees.filter(e => e.status === "Active").length;

    const departments = [...new Set(
        employees.map(e => e.department).filter(Boolean)
    )];

    document.querySelector("#totalDepartments").textContent =
        departments.length;

    const salaries = employees
        .map(e => e.salary)
        .filter(s => s != null && s !== "" && Number.isFinite(Number(s)))
        .map(Number);

    const average = salaries.length
        ? salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length
        : null;

    document.querySelector("#averageSalary").textContent =
        average == null
            ? "—"
            : "₹" + Math.round(average).toLocaleString("en-IN");

    const departmentFilter = document.querySelector("#departmentFilter");
    const currentValue = departmentFilter.value;

    departmentFilter.innerHTML =
        '<option value="">All departments</option>';

    departments.sort().forEach(department => {
        const option = document.createElement("option");
        option.value = department;
        option.textContent = department;
        departmentFilter.appendChild(option);
    });

    departmentFilter.value = departments.includes(currentValue)
        ? currentValue
        : "";

    const overview = document.querySelector("#departmentOverview");
    overview.innerHTML = "";

    departments.forEach(department => {
        const count = employees.filter(
            e => e.department === department
        ).length;

        const card = document.createElement("article");
        card.className = "department-card";
        card.innerHTML = `
            <h3>${escapeHTML(department)}</h3>
            <strong>${count}</strong>
            <p>Team member${count !== 1 ? "s" : ""}</p>
        `;

        overview.appendChild(card);
    });
}

function applyFilters() {
    const search = document.querySelector("#searchInput")
        .value.trim().toLowerCase();

    const department = document.querySelector("#departmentFilter").value;
    const status = document.querySelector("#statusFilter").value;
    const sort = document.querySelector("#sortSelect").value;

    filteredEmployees = employees.filter(employee => {
        const matchesSearch = [
            employee.name,
            employee.email,
            employee.position,
            employee.department
        ].some(value => String(value ?? "").toLowerCase().includes(search));

        return matchesSearch
            && (!department || employee.department === department)
            && (!status || employee.status === status);
    });

    if (sort === "name") {
        filteredEmployees.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    } else if (sort === "salaryHigh") {
        filteredEmployees.sort((a, b) =>
            (b.salary ?? -1) - (a.salary ?? -1)
        );
    } else if (sort === "salaryLow") {
        filteredEmployees.sort((a, b) =>
            (a.salary ?? Infinity) - (b.salary ?? Infinity)
        );
    }

    renderEmployees(filteredEmployees);
}

function loadDepartmentOptions() {
    updateDashboard();
    applyFilters();
}

async function loadEmployees() {
    const loading = document.querySelector("#loadingState");
    const error = document.querySelector("#errorState");

    loading.classList.remove("hidden");
    error.classList.add("hidden");

    try {
        employees = await fetchEmployees();
        updateDashboard();
        applyFilters();
    } catch (err) {
        loading.classList.add("hidden");
        document.querySelector("#employeeGrid").innerHTML = "";
        document.querySelector("#emptyState").classList.add("hidden");
        document.querySelector("#resultCount").textContent = "Unavailable";
        error.textContent =
            "Could not load employees. Check your internet connection and try again.";
        error.classList.remove("hidden");
        console.error(err);
    }
}

// Add or edit modal
function openEmployeeModal(employee = null) {
    const modal = document.querySelector("#employeeModal");
    const form = document.querySelector("#employeeForm");

    form.reset();
    document.querySelector("#formMessage").textContent = "";
    document.querySelector("#modalTitle").textContent =
        employee ? "Edit employee" : "Add employee";
    document.querySelector("#employeeId").value =
        employee ? employee.id : "";

    if (employee) {
        document.querySelector("#nameInput").value = employee.name;
        document.querySelector("#emailInput").value = employee.email;
        document.querySelector("#departmentInput").value = employee.department;
        document.querySelector("#positionInput").value = employee.position;
        document.querySelector("#salaryInput").value = employee.salary ?? "";
        document.querySelector("#statusInput").value = employee.status;
    }

    modal.classList.remove("hidden");
}

function closeEmployeeModal() {
    document.querySelector("#employeeModal").classList.add("hidden");
}

function showToast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2500);
}

function showEmployeeDetails(employee) {
    const container = document.querySelector("#employeeDetails");

    container.innerHTML = `
        <div class="detail-row">
            <small>Full name</small>
            <strong>${escapeHTML(employee.name)}</strong>
        </div>
        <div class="detail-row">
            <small>Email</small>
            <strong>${escapeHTML(employee.email)}</strong>
        </div>
        <div class="detail-row">
            <small>Department</small>
            <strong>${escapeHTML(employee.department)}</strong>
        </div>
        <div class="detail-row">
            <small>Position</small>
            <strong>${escapeHTML(employee.position)}</strong>
        </div>
        <div class="detail-row">
            <small>Monthly salary</small>
            <strong>${formatSalary(employee.salary)}</strong>
        </div>
        <div class="detail-row">
            <small>Status</small>
            <strong>${escapeHTML(employee.status)}</strong>
        </div>
    `;

    document.querySelector("#detailsModal").classList.remove("hidden");
}

document.querySelector("#searchInput")
    .addEventListener("input", applyFilters);

document.querySelector("#departmentFilter")
    .addEventListener("change", applyFilters);

document.querySelector("#statusFilter")
    .addEventListener("change", applyFilters);

document.querySelector("#sortSelect")
    .addEventListener("change", applyFilters);

document.querySelector("#addEmployeeBtn")
    .addEventListener("click", () => openEmployeeModal());

document.querySelector("#closeModalBtn")
    .addEventListener("click", closeEmployeeModal);

document.querySelector("#cancelBtn")
    .addEventListener("click", closeEmployeeModal);

document.querySelector("#closeDetailsBtn")
    .addEventListener("click", () => {
        document.querySelector("#detailsModal").classList.add("hidden");
    });

document.querySelector("#employeeGrid")
    .addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const id = Number(button.dataset.id);
        const employee = employees.find(e => Number(e.id) === id);
        if (!employee) return;

        if (button.dataset.action === "view") {
            showEmployeeDetails(employee);
        }

        if (button.dataset.action === "edit") {
            openEmployeeModal(employee);
        }

        if (button.dataset.action === "delete") {
            const confirmed = confirm(
                `Delete ${employee.name} from the current list?`
            );

            if (!confirmed) return;

            employees = employees.filter(e => Number(e.id) !== id);
            updateDashboard();
            applyFilters();
            showToast("Employee removed from the current list.");
        }
    });

document.querySelector("#employeeForm")
    .addEventListener("submit", event => {
        event.preventDefault();

        const id = document.querySelector("#employeeId").value;
        const name = document.querySelector("#nameInput").value.trim();
        const email = document.querySelector("#emailInput").value.trim();
        const department = document.querySelector("#departmentInput").value.trim();
        const position = document.querySelector("#positionInput").value.trim();
        const salaryValue = document.querySelector("#salaryInput").value.trim();
        const salary = salaryValue === "" ? null : Number(salaryValue);
        const status = document.querySelector("#statusInput").value;

        const message = document.querySelector("#formMessage");
        message.textContent = "";

        if (!name || !email || !department || !position ||
            (salary !== null && (!Number.isFinite(salary) || salary < 0))) {
            message.textContent = "Please enter valid employee details.";
            return;
        }

        const duplicateEmail = employees.some(employee =>
            employee.email.toLowerCase() === email.toLowerCase()
            && String(employee.id) !== id
        );

        if (duplicateEmail) {
            message.textContent = "This email already exists.";
            return;
        }

        if (id) {
            const index = employees.findIndex(
                employee => String(employee.id) === id
            );

            if (index !== -1) {
                employees[index] = {
                    ...employees[index],
                    name, email, department, position, salary, status
                };
            }

            showToast("Employee updated in the current list.");
        } else {
            const newId = employees.reduce(
                (max, employee) => Math.max(max, Number(employee.id) || 0), 0
            ) + 1;

            employees.push({
                id: newId,
                name, email, department, position, salary, status,
                image: null
            });

            showToast("Employee added to the current list.");
        }

        closeEmployeeModal();
        updateDashboard();
        applyFilters();
    });

document.querySelector("#employeeModal")
    .addEventListener("click", event => {
        if (event.target.id === "employeeModal") {
            closeEmployeeModal();
        }
    });

document.querySelector("#detailsModal")
    .addEventListener("click", event => {
        if (event.target.id === "detailsModal") {
            event.currentTarget.classList.add("hidden");
        }
    });

// Start loading API data
loadEmployees();
