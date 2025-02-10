var express = require("express");
var router = express.Router();
var pointsOfInterest = require("../data/data_provider");

// Ruta para obtener los puntos de interés
router.get("/points", function (req, res, next) {
  res.json(pointsOfInterest);
});

module.exports = router;
