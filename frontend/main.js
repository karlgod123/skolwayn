const userName = document.querySelector("#userName");
const userAvatar = document.querySelector("#userAvatar");
const userPill = document.querySelector("#userPill");
const loginLink = document.querySelector("#loginLink");
const registerLink = document.querySelector("#registerLink");
const mobileMenu = document.querySelector("#mobileMenu");
const navLinks = document.querySelector("#navLinks");
const year = document.querySelector("#year");

function getSavedUser() {
    const raw =
        localStorage.getItem("skolwayn_user") ||
        sessionStorage.getItem("skolwayn_user");

    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

const user = getSavedUser();

if (user?.username) {
    userName.textContent = user.username;
    userAvatar.textContent = user.username.trim().charAt(0).toUpperCase();
    userPill.style.display = "inline-flex";
    loginLink.style.display = "none";
    registerLink.textContent = "Мой профиль";
    registerLink.href = "#teacher";
}

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

if (year) {
    year.textContent = new Date().getFullYear();
}
