let navPerfil = document.getElementById("perfil");
let navLogin = document.getElementById("login");
let navNegocios = document.getElementById("negocios");
let navLogout = document.getElementById("logout");
let idUser;
let favoritos = JSON.parse(localStorage.getItem("favoritos"));
let datos = null;

navLogout.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("user", -1);
  localStorage.setItem("rol", "?");
  window.location.href = "./index.html";
});

document.addEventListener("DOMContentLoaded", function (e) {
  //datos = localStorage.getItem("tiendas");
  let rol = localStorage.getItem("rol");
  if (rol == "Comprador") {
    navNegocios.style.display = "none";
  } else if (rol == "Vendedor") {
    navLogin.style.display = "none";
  } else if (rol == "?" || rol == null) {
    navNegocios.style.display = "none";
    navPerfil.style.display = "none";
    navLogout.style.display = "none";
  }

  cargarTiendas();
});

function generarTienda({ idTienda, nombre, ubicacion, telefono, descripcion }) {
  var botonInfo = document.createElement("button");

  // Agregar atributos al botón
  botonInfo.setAttribute("type", "button");
  botonInfo.setAttribute("class", "btn btn-primary");
  botonInfo.setAttribute("data-bs-toggle", "modal");
  botonInfo.setAttribute("data-bs-target", "#exampleModal");
  botonInfo.setAttribute("id", "btnInfo");
  botonInfo.textContent = "Ver más";

  botonInfo.addEventListener("click", () => {
    document.getElementById("modalContent").textContent = descripcion;
    document.getElementById("modalContent").textContent = descripcion;

    // Código para generar el mapa dentro del modal
    var mapContainer = document.getElementById("mapContainer");

    // Verificar si mapContainer existe antes de continuar
    if (!mapContainer) {
      console.error("El elemento mapContainer no se encontró en el modal.");
      return; // Salir de la función si no se encuentra el elemento
    }

    mapContainer.style.display = "block"; // Mostrar el mapa

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: ubicacion }, function (results, status) {
      if (status === "OK") {
        // Verificar si google está definido (API de Google Maps cargada)
        console.log("Geocodificación exitosa:", results[0].geometry.location);
        if (typeof google !== "undefined") {
          var map = new google.maps.Map(mapContainer, {
            center: results[0].geometry.location,
            zoom: 15,
          });
          new google.maps.Marker({
            map,
            position: results[0].geometry.location,
          });
        } else {
          console.error("La API de Google Maps no está cargada.");
        }
      } else {
        alert("Geocode was not successful for the following reason: " + status);
        console.error("Error en la geocodificación:", status);
      }
    });
  });

  let rol = localStorage.getItem("rol");
  // Creación de la tarjeta
  const card = document.createElement("div");
  card.classList.add("card", "mt-2");
  card.style.width = "25rem";
  card.style.marginLeft = "3px";

  // Creación de la fila (row)
  const row = document.createElement("div");
  row.classList.add("row", "no-gutters");

  // Creación de la columna de la imagen
  const imgColumn = document.createElement("div");
  imgColumn.classList.add("col-md-4");

  // Creación de la imagen
  const img = document.createElement("img");
  img.src = "shopping-store.png";
  img.classList.add("card-img");
  img.alt = "";

  // Agregar la imagen a la columna de la imagen
  imgColumn.appendChild(img);

  // Creación de la columna del cuerpo de la tarjeta
  const bodyColumn = document.createElement("div");
  bodyColumn.classList.add("col-md-8");

  // Creación del cuerpo de la tarjeta
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  // Creación del título
  const title = document.createElement("h5");
  title.classList.add("card-title");
  title.textContent = nombre;

  // Creación del primer párrafo
  const paragraph1 = document.createElement("p");
  paragraph1.classList.add("card-text");
  paragraph1.textContent = ubicacion;

  // Creación del segundo párrafo
  const paragraph2 = document.createElement("p");
  paragraph2.classList.add("card-text");
  paragraph2.textContent = telefono;

  // Creación del enlace de editar
  const editLink = document.createElement("a");
  editLink.href = "#";
  editLink.classList.add("btn", "btn-light");
  //editLink.setAttribute("data-bs-toggle", "modal");
  //editLink.setAttribute("data-bs-target", "#exampleModal");
  //editLink.setAttribute("data-bs-whatever", "@mdo");
  editLink.textContent = "Añadir a Favoritos";
  editLink.value = "ok";
  editLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (editLink.value == "ok") {
      editLink.textContent = "Quitar de Favoritos";
      editLink.value = "no";

      axios
        .post("localhost:3000/addFavorito", {
          idTienda: idTienda,
          idUser: localStorage.getItem("user"),
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.error(
            "Ocurrió un error al realizar la solicitud POST:",
            error
          );
        });
    } else {
      axios
        .post("localhost:3000/elimFavorito", {
          idTienda: idTienda,
          idUser: localStorage.getItem("user"),
        })
        .then(function (response) {
          // console.log(response.data);
          window.location.reload();
        })
        .catch(function (error) {
          console.error(
            "Ocurrió un error al realizar la solicitud POST:",
            error
          );
        });
      editLink.textContent = "Añadir a Favoritos";
      editLink.value = "ok";
    }
  });

  // Creación del enlace de eliminar
  /* const deleteLink = document.createElement("a");
  deleteLink.addEventListener("click", (e) => {
    e.preventDefault();
    eliminar(idTienda);
    alert("Tienda eliminada correctamente");
  });
  deleteLink.href = "#";
  deleteLink.classList.add("btn", "btn-light");
  deleteLink.textContent = "Eliminar"; */

  // Agregar el título, los párrafos y los enlaces al cuerpo de la tarjeta
  cardBody.appendChild(title);
  cardBody.appendChild(paragraph1);
  cardBody.appendChild(paragraph2);
  if (rol != "?") {
    cardBody.appendChild(editLink);
  }
  cardBody.appendChild(botonInfo);

  //cardBody.appendChild(deleteLink);

  // Agregar el cuerpo de la tarjeta a la columna del cuerpo de la tarjeta
  bodyColumn.appendChild(cardBody);

  // Agregar la columna de la imagen y la columna del cuerpo de la tarjeta a la fila
  row.appendChild(imgColumn);
  row.appendChild(bodyColumn);

  // Agregar la fila a la tarjeta
  card.appendChild(row);

  // Agregar la tarjeta al documento
  document.body.appendChild(card);
}

function cargarTiendas() {
  axios
    .get("http://192.168.20.50:3000/tiendas", {})
    .then(function (response) {
      // console.log(response.data);
      localStorage.setItem("data", JSON.stringify(response.data));
      datos = JSON.parse(localStorage.getItem("data"));
      response.data.forEach((element) => {
        generarTienda(element);
      });
    })
    .catch(function (error) {
      console.error("Ocurrió un error al realizar la solicitud POST:", error);
    });
}