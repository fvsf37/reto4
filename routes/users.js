var express = require("express");
var router = express.Router();
var session = require("express-session");

router.use(
  session({
    secret: "clave_secreta",
    resave: false,
    saveUninitialized: true,
  })
);

// Lista de usuarios registrados
const users = [
  { username: "admin", password: "1234" },
  { username: "usuario", password: "5678" },
];

// Ruta de inicio de sesión
router.post("/login", function (req, res) {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    req.session.user = username;
    res.json({ message: "Login exitoso", user: username });
  } else {
    res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }
});

// Ruta para cerrar sesión
router.post("/logout", function (req, res) {
  req.session.destroy();
  res.json({ message: "Sesión cerrada" });
});

// Ruta para verificar si el usuario está autenticado
router.get("/session", function (req, res) {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
