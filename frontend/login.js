const loginForm = document.getElementById("login-form");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            message.textContent = "Login successful!";

            setTimeout(() => {
                window.location.href = "/";
            }, 500);

        } else {

            message.textContent = data.message;
        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Something went wrong. Please try again.";
    }
});