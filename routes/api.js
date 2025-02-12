var express = require("express");
var router = express.Router();
var pointsOfInterest = require("../data/data_provider");

// Middleware para verificar autenticación
function authMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.status(403).json({ error: "No autorizado" });
  }
  next();
}

// Obtener los puntos de interés
router.get("/points", function (req, res, next) {
  res.json(pointsOfInterest);
});

// Añadir un nuevo punto
router.post("/points", authMiddleware, function (req, res, next) {
  const newPoint = {
    id: Date.now(),
    name: req.body.name,
    description: req.body.description,
    latitude: parseFloat(req.body.latitude),
    longitude: parseFloat(req.body.longitude),
    category: req.body.category,
  };

  pointsOfInterest.push(newPoint);
  res.json(newPoint);
});

// Editar un punto
router.put("/points/:id", authMiddleware, function (req, res, next) {
  const pointId = parseInt(req.params.id);
  const updatedPoint = {
    id: pointId,
    name: req.body.name,
    description: req.body.description,
    latitude: parseFloat(req.body.latitude),
    longitude: parseFloat(req.body.longitude),
    category: req.body.category,
  };

  let index = pointsOfInterest.findIndex((point) => point.id === pointId);
  if (index !== -1) {
    pointsOfInterest[index] = updatedPoint;
    res.json(updatedPoint);
  } else {
    res.status(404).json({ error: "Punto no encontrado" });
  }
});

// Eliminar un punto
router.delete("/points/:id", authMiddleware, function (req, res, next) {
  const pointId = parseInt(req.params.id);
  let index = pointsOfInterest.findIndex((point) => point.id === pointId);

  if (index !== -1) {
    pointsOfInterest.splice(index, 1);
    res.json({ message: "Punto eliminado correctamente", id: pointId });
  } else {
    res.status(404).json({ error: "Punto no encontrado" });
  }
});

module.exports = router;
