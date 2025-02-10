var express = require("express");
var router = express.Router();
var pointsOfInterest = require("../data/data_provider");

// Ruta para obtener los puntos de interés
router.get("/points", function (req, res, next) {
  res.json(pointsOfInterest);
});

// Ruta para añadir un nuevo punto de interés
router.post("/points", function (req, res, next) {
  const newPoint = {
    id: pointsOfInterest.length + 1,
    name: req.body.name,
    description: req.body.description,
    latitude: parseFloat(req.body.latitude),
    longitude: parseFloat(req.body.longitude),
  };

  pointsOfInterest.push(newPoint);
  res.json(newPoint);
});

// Ruta para editar un punto de interés
router.put("/points/:id", function (req, res, next) {
  const pointId = parseInt(req.params.id);
  const updatedPoint = {
    id: pointId,
    name: req.body.name,
    description: req.body.description,
    latitude: parseFloat(req.body.latitude),
    longitude: parseFloat(req.body.longitude),
  };

  let index = pointsOfInterest.findIndex((point) => point.id === pointId);

  if (index !== -1) {
    pointsOfInterest[index] = updatedPoint;
    res.json(updatedPoint);
  } else {
    res.status(404).json({ error: "Punto no encontrado" });
  }
});

// Ruta para eliminar un punto de interés
router.delete("/points/:id", function (req, res, next) {
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
