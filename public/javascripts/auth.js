document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const addPointSection = document.getElementById("addPointSection");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    fetch("/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert("Login exitoso");
          localStorage.setItem("loggedIn", "true");
          loginForm.style.display = "none";
          logoutBtn.style.display = "block";
          if (addPointSection) addPointSection.style.display = "block";
        } else {
          alert("Error en login");
        }
      })
      .catch((error) => {
        console.error("Error en la autenticación:", error);
      });
  });

  logoutBtn.addEventListener("click", function () {
    fetch("/users/logout", { method: "POST" })
      .then(() => {
        alert("Sesión cerrada");
        localStorage.removeItem("loggedIn");
        loginForm.style.display = "block";
        logoutBtn.style.display = "none";
        if (addPointSection) addPointSection.style.display = "none";
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  });

  // Mantener estado del login al recargar la página
  if (localStorage.getItem("loggedIn") === "true") {
    loginForm.style.display = "none";
    logoutBtn.style.display = "block";
    if (addPointSection) addPointSection.style.display = "block";
  }
});
