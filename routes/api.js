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

module.exports = router;
