import api from "./api.js";

const form = document.querySelector("#registerForm");
const message = document.querySelector("#message");
const rememberInput = document.querySelector('input[name="remember"]');

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;

    message.textContent = "";

    try {
        const response = await api.post("/add_user", {
            username,
            mail: email,
            password
        });

        const user = {
            username,
            email
        };

        // Только фронтенд: сохраняем данные для отображения имени на главной.
        // Это не является настоящей авторизацией.
        localStorage.removeItem("skolwayn_user");
        sessionStorage.removeItem("skolwayn_user");

        const storage = rememberInput.checked
            ? localStorage
            : sessionStorage;

        storage.setItem("skolwayn_user", JSON.stringify(user));

        message.textContent = "Аккаунт создан. Переносим на главную...";
        message.style.color = "#6ee7b7";

        console.log(response.data);

        setTimeout(() => {
            window.location.href = "./main.html";
        }, 500);
    } catch (error) {
        console.error(error.response?.data || error);

        if (error.response?.status === 400) {
            message.textContent = error.response.data.detail;
        } else {
            message.textContent = "Ошибка сервера";
        }

        message.style.color = "#ff6b81";
    }
});

// ================================
// ANIMATED BACKGROUND
// ================================

const canvas = document.querySelector("#painting");
const ctx = canvas.getContext("2d");

let particles = [];

const mouse = {
    x: null,
    y: null
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});

function createParticles() {
    particles = [];

    const amount = Math.min(
        Math.floor((window.innerWidth * window.innerHeight) / 15000),
        120
    );

    for (let i = 0; i < amount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.35,
            speedY: (Math.random() - 0.5) * 0.35,
            opacity: Math.random() * 0.5 + 0.15
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particles) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size * 6
        );

        gradient.addColorStop(
            0,
            `rgba(130, 95, 255, ${particle.opacity})`
        );
        gradient.addColorStop(1, "rgba(130, 95, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
            particle.x,
            particle.y,
            particle.size * 6,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const opacity = (1 - distance / 120) * 0.12;

                ctx.strokeStyle = `rgba(120, 90, 255, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }

    if (mouse.x !== null) {
        for (const particle of particles) {
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0 && distance < 160) {
                const force = (160 - distance) / 160;
                particle.x += (dx / distance) * force * 0.8;
                particle.y += (dy / distance) * force * 0.8;
            }
        }
    }

    requestAnimationFrame(draw);
}

resizeCanvas();
draw();

const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector("#passwordToggle");

passwordToggle.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordToggle.textContent = "🙈";
        passwordToggle.setAttribute("aria-label", "Скрыть пароль");
    } else {
        passwordInput.type = "password";
        passwordToggle.textContent = "👁";
        passwordToggle.setAttribute("aria-label", "Показать пароль");
    }
});
