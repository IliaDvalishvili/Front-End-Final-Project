const input = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const toggle = document.getElementById("unitToggle");
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const header = document.getElementById("mainHeader");

function handleSearch() {
  if (input.value.trim() !== "") {
    localStorage.setItem("city", input.value);
    location.reload(); 
  }
}

if (input) {
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") handleSearch();
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", handleSearch);
}

if (toggle) {
  toggle.checked = localStorage.getItem("unit") === "imperial";
  toggle.addEventListener("change", () => {
    const u = toggle.checked ? "imperial" : "metric";
    localStorage.setItem("unit", u);
    location.reload();
  });
}

if (burger && nav) {
  burger.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

setInterval(() => {
  const t = document.getElementById("time");
  if (t) {
    t.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
}, 1000);

window.addEventListener("scroll", () => {
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
});

const cookieBanner = document.getElementById("cookieBanner");
const acceptBtn = document.getElementById("acceptCookies");

if (cookieBanner && !localStorage.getItem("cookiesAccepted")) {
  setTimeout(() => {
    cookieBanner.style.display = "block";
  }, 1000);
}

if (acceptBtn) {
  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "true");
    cookieBanner.style.display = "none";
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const emailInput = document.getElementById("email");
  const passInput = document.getElementById("password");
  const togglePass = document.getElementById("togglePass");

  togglePass.addEventListener("click", () => {
    const type = passInput.getAttribute("type") === "password" ? "text" : "password";
    passInput.setAttribute("type", type);
    togglePass.textContent = type === "password" ? "👁️" : "🙈";
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailInput.nextElementSibling.textContent = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
      emailInput.nextElementSibling.textContent = "Invalid email format";
      isValid = false;
    }

    if (!passInput.value.trim()) {
      passInput.parentElement.nextElementSibling.textContent = "Password is required";
      isValid = false;
    }

    if (isValid) {
      alert("Login Successful! (Redirecting...)");
      window.location.href = "index.html";
    }
  });
}

if (document.getElementById("temp")) {
  loadToday();
}