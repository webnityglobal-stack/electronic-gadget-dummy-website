// GET USERS

function getUsers() {
    return JSON.parse(localStorage.getItem("technovaUsers")) || [];
}

// PASSWORD VISIBILITY

document.querySelectorAll(".toggle-password").forEach(button => {

    button.addEventListener("click", () => {

        const input = document.getElementById(button.dataset.target);

        if (!input) return;

        if (input.type === "password") {
            input.type = "text";
            button.textContent = "Hide";
        } else {
            input.type = "password";
            button.textContent = "Show";
        }

    });

});

// REGISTER

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const phone = document.getElementById("registerPhone").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const message = document.getElementById("registerMessage");

        message.classList.remove("success");

        if (password.length < 8) {
            message.textContent = "Password must be at least 8 characters.";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match!";
            return;
        }

        const users = getUsers();

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            message.textContent = "This email is already registered.";
            return;
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            phone,
            password
        };

        users.push(newUser);

        localStorage.setItem(
            "technovaUsers",
            JSON.stringify(users)
        );

        message.textContent = "Account created successfully! Redirecting to login...";
        message.classList.add("success");

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);

    });

}

// LOGIN

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        message.classList.remove("success");

        const users = getUsers();

        const user = users.find(
            item => item.email === email && item.password === password
        );

        if (!user) {
            message.textContent = "Invalid email or password.";
            return;
        }

        const currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone
        };

        localStorage.setItem(
            "technovaCurrentUser",
            JSON.stringify(currentUser)
        );

        message.textContent = "Login successful! Redirecting...";
        message.classList.add("success");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    });

}