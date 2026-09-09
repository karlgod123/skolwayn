import api from "./api.js";

const form = document.querySelector("#registerForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
        const response = await api.post("/add_user", {
            username: username,
            mail: email,
            password: password
        });

        console.log(response.data);
    } catch (error) {
        console.error(error.response?.data || error);
    }
});