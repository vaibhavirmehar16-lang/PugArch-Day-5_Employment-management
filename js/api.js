
const API_URL = "https://dummyjson.com/users?limit=30";
const API_TIMEOUT_MS = 15000;
const INDIAN_EMPLOYEE_NAMES = [
    "Aarav Sharma",
    "Priya Verma",
    "Rahul Patel",
    "Sneha Joshi",
    "Kabir Mehta",
    "Ananya Singh",
    "Vikram Reddy",
    "Meera Nair",
    "Arjun Kapoor",
    "Ishita Gupta",
    "Rohan Desai",
    "Kavya Iyer",
    "Aditya Kulkarni",
    "Neha Chatterjee",
    "Karan Malhotra",
    "Pooja Menon",
    "Siddharth Rao",
    "Divya Shah",
    "Manish Yadav",
    "Ritika Bose",
    "Nikhil Bansal",
    "Aditi Mishra",
    "Varun Pillai",
    "Shreya Das",
    "Harsh Agarwal",
    "Tanvi Kulkarni",
    "Ankit Sinha",
    "Simran Kaur",
    "Devansh Jain",
    "Riya Mukherjee"
];

async function fetchEmployees() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
        const response = await fetch(API_URL, { signal: controller.signal });

        if (!response.ok) {
            throw new Error(`Unable to load employees (HTTP ${response.status}).`);
        }

        const data = await response.json();

        if (!Array.isArray(data.users)) {
            throw new Error("Employee API returned an invalid response.");
        }

        return data.users.map((user, index) => ({
            id: user.id,
            name: INDIAN_EMPLOYEE_NAMES[index] || `${user.firstName} ${user.lastName}`,
            email: user.email,
            department: user.company.department || "General",
            position: user.company.title || "Team Member",
            salary: null,
            status: "Active",
            image: user.image
        }));
    } finally {
        clearTimeout(timeoutId);
    }
}
