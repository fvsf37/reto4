document.addEventListener("DOMContentLoaded", function () {
  console.log("map.js cargado correctamente");

  var map = L.map("map").setView([40.4168, -3.7038], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  function loadPoints() {
    fetch("/api/points")
      .then((response) => response.json())
      .then((data) => {
        let selectedCategory =
          localStorage.getItem("selectedCategory") || "Todos";
        document.getElementById("categoryFilter").value = selectedCategory;

        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });

        data.forEach((point) => {
          if (
            selectedCategory === "Todos" ||
            point.category === selectedCategory
          ) {
            let marker = L.marker([point.latitude, point.longitude]).addTo(map)
              .bindPopup(`
                                <b>ID: ${point.id}</b><br>
                                <b>${point.name}</b><br>${point.description}<br>
                                <b>Categoría:</b> ${point.category}<br>
                                <button class="btn btn-danger btn-sm mt-2" onclick="deletePoint(${point.id})">Eliminar</button>
                                <button class="btn btn-warning btn-sm mt-2" onclick="openEditModal(${point.id}, '${point.name}', '${point.description}', '${point.category}', ${point.latitude}, ${point.longitude})">Modificar</button>
                            `);
          }
        });
      })
      .catch((error) => console.error("Error cargando los puntos:", error));
  }

  loadPoints();

  document
    .getElementById("categoryFilter")
    .addEventListener("change", function () {
      let selectedCategory = this.value;
      localStorage.setItem("selectedCategory", selectedCategory);
      loadPoints();
    });

  document
    .getElementById("addPointForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      var newPoint = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        latitude: parseFloat(document.getElementById("latitude").value),
        longitude: parseFloat(document.getElementById("longitude").value),
      };

      fetch("/api/points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPoint),
      })
        .then(() => location.reload())
        .catch((error) => console.error("Error añadiendo el punto:", error));
    });

  function deletePoint(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este punto?")) {
      fetch(`/api/points/${id}`, { method: "DELETE" })
        .then(() => location.reload())
        .catch((error) => console.error("Error eliminando el punto:", error));
    }
  }

  function openEditModal(id, name, description, category, latitude, longitude) {
    document.getElementById("editId").value = id;
    document.getElementById("editName").value = name;
    document.getElementById("editDescription").value = description;
    document.getElementById("editCategory").value = category;
    document.getElementById("editLatitude").value = latitude;
    document.getElementById("editLongitude").value = longitude;

    var editModal = new bootstrap.Modal(document.getElementById("editModal"));
    editModal.show();
  }

  document
    .getElementById("editPointForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      var editedPoint = {
        id: parseInt(document.getElementById("editId").value),
        name: document.getElementById("editName").value,
        description: document.getElementById("editDescription").value,
        category: document.getElementById("editCategory").value,
        latitude: parseFloat(document.getElementById("editLatitude").value),
        longitude: parseFloat(document.getElementById("editLongitude").value),
      };

      fetch(`/api/points/${editedPoint.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedPoint),
      })
        .then(() => location.reload())
        .catch((error) => console.error("Error editando el punto:", error));
    });

  // ==================== FUNCIONALIDAD PUNTO MÁS CERCANO ====================

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  document.getElementById("findNearest").addEventListener("click", function () {
    console.log("Botón 'Encontrar Punto Más Cercano' clickeado.");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          console.log(`Ubicación del usuario: ${userLat}, ${userLon}`);

          fetch("/api/points")
            .then((response) => response.json())
            .then((points) => {
              console.log("Puntos obtenidos:", points);

              if (points.length === 0) {
                alert("No hay puntos de interés disponibles.");
                return;
              }

              let nearest = points.reduce(
                (closest, point) => {
                  const distance = haversine(
                    userLat,
                    userLon,
                    point.latitude,
                    point.longitude
                  );
                  return distance < closest.distance
                    ? { point, distance }
                    : closest;
                },
                { distance: Infinity }
              ).point;

              if (nearest) {
                alert(
                  `El punto más cercano es: ${nearest.name} (${nearest.description})`
                );
                map.setView([nearest.latitude, nearest.longitude], 14);
                L.marker([userLat, userLon])
                  .addTo(map)
                  .bindPopup("Tu ubicación actual")
                  .openPopup();
              } else {
                alert("No hay puntos de interés disponibles.");
              }
            })
            .catch((error) =>
              console.error("Error obteniendo los puntos:", error)
            );
        },
        (error) => {
          alert(
            "Error obteniendo tu ubicación. Asegúrate de permitir la geolocalización."
          );
          console.error("Error de geolocalización:", error);
        }
      );
    } else {
      alert("Tu navegador no soporta la geolocalización.");
    }
  });
});
