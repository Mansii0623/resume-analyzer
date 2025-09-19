// ---------- Utility: Show messages ----------
function showMessage(elementId, text, type) {
    const messageEl = document.getElementById(elementId);
    if (messageEl) {
        messageEl.textContent = text;
        messageEl.className = `message ${type}`; // success / error
    }
}

// ---------- Signup ----------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullname = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            showMessage("signupMessage", "Passwords do not match!", "error");
            return;
        }

        // Save user in localStorage
        localStorage.setItem("userName", fullname);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPassword", password);

        showMessage("signupMessage", "Signup successful! Redirecting to login...", "success");

        setTimeout(() => {
            window.location.href = "login.html"; // go to login page
        }, 1500);
    });
}

// ---------- Login ----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const storedEmail = localStorage.getItem("userEmail");
        const storedPassword = localStorage.getItem("userPassword");

        if (!storedEmail || !storedPassword) {
            showMessage("loginMessage", "❌ User does not exist. Please sign up first!", "error");
            return;
        }

        if (email === storedEmail && password === storedPassword) {
            localStorage.setItem("isLoggedIn", "true");
            showMessage("loginMessage", "✅ Login successful! Redirecting...", "success");

            setTimeout(() => {
                window.location.href = "dashboard.html"; // go to dashboard
            }, 1500);
        } else {
            showMessage("loginMessage", "❌ Your email or password is incorrect!", "error");
        }
    });
}

// ---------- Dashboard ----------
const welcomeUser = document.getElementById("welcomeUser");
const resumeForm = document.getElementById("resumeForm");
const jobDescription = document.getElementById("jobDescription");
const charCount = document.getElementById("charCount");
const historyList = document.getElementById("historyList");

if (welcomeUser) {
    const userName = localStorage.getItem("userName") || "User";
    welcomeUser.textContent = `Welcome, ${userName} 🎉`;
}

// Character counter for job description
if (jobDescription && charCount) {
    jobDescription.addEventListener("input", () => {
        charCount.textContent = `${jobDescription.value.length} / 1000`;
    });
}

// Handle Resume Submission
if (resumeForm) {
    resumeForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const resume = document.getElementById("resume").files[0];
        const jobDesc = jobDescription.value.trim();
        const company = document.getElementById("companyName").value.trim();
        const jobLink = document.getElementById("jobLink").value.trim();

        if (!resume) {
            alert("Please upload your resume!");
            return;
        }

        // Allow only PDF or DOCX
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword"
        ];
        if (!allowedTypes.includes(resume.type)) {
            alert("Only PDF or DOCX files are allowed!");
            return;
        }

        // Save submission to history
        let history = JSON.parse(localStorage.getItem("resumeHistory")) || [];
        history.push({
            company,
            jobDesc: jobDesc.substring(0, 50) + "...",
            jobLink,
            date: new Date().toLocaleString()
        });
        localStorage.setItem("resumeHistory", JSON.stringify(history));

        // Save dummy analysis result (replace with backend later)
        const analysisResult = {
            company: company,
            jobLink: jobLink,
            score: Math.floor(Math.random() * (95 - 60 + 1)) + 60, // random score 60–95
            missingSkills: ["Python", "Leadership"], // dummy
            suggestions: "Add more project details, highlight leadership roles.",
            conclusion: "Your resume is a good match but needs some improvements."
        };
        localStorage.setItem("analysisResult", JSON.stringify(analysisResult));

        // Redirect to results page
        window.location.href = "result.html";
    });
}

// Display Resume History
function displayHistory() {
    if (!historyList) return;
    let history = JSON.parse(localStorage.getItem("resumeHistory")) || [];

    if (history.length === 0) {
        historyList.innerHTML = "<li>No previous submissions.</li>";
        return;
    }

    historyList.innerHTML = "";
    history.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.company}</strong> - ${item.jobDesc} 
                        <br><small>${item.date}</small>
                        ${item.jobLink ? `<br><a href="${item.jobLink}" target="_blank">Job Link</a>` : ""}`;
        historyList.appendChild(li);
    });
}

// Load analysis result in result.html
const result = JSON.parse(localStorage.getItem("analysisResult"));
if (result) {
    if (document.getElementById("companyName")) {
        document.getElementById("companyName").textContent = result.company;
        document.getElementById("jobLink").textContent = result.jobLink;
        document.getElementById("jobLink").href = result.jobLink;
        document.getElementById("score").textContent = result.score;
        document.getElementById("missingSkills").textContent = result.missingSkills.join(", ");
        document.getElementById("suggestions").textContent = result.suggestions;
        document.getElementById("conclusion").textContent = result.conclusion;
    }
}

// Initialize history in dashboard
if (historyList) {
    displayHistory();
}

