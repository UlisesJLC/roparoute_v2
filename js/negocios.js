let btnAceptar = document.getElementById("btnAceptar");
let editNombre = document.getElementById("editNombre");
let editUbicacion = document.getElementById("editUbicacion");
let editDescrip = document.getElementById("editDescrip");
let editTelefono = document.getElementById("editTelefono");
let idTiendaActualizar = null;

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
  window.location.href = "index.html";
});

btnAceptar.addEventListener("click", () => {
  // Obtener los valores de los campos
  const nombre = editNombre.value.trim();
  const ubicacion = editUbicacion.value.trim();
  const telefono = editTelefono.value.trim();
  const descripcion = editDescrip.value.trim();

  // Validar que ningún campo esté vacío
  if (nombre === '' || ubicacion === '' || telefono === '' || descripcion === '') {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Validar que el número de teléfono tenga exactamente 10 dígitos
  if (telefono.length !== 10 || isNaN(telefono)) {
    alert("Por favor, ingresa un número de teléfono válido de 10 dígitos.");
    return;
  }
});

btnAceptar.addEventListener("click", ()=>{
  //console.log(idTiendaActualizar);
  axios
  .post("http://localhost:3000/actualizarTienda", {

    idTienda: idTiendaActualizar,
    nombre: nombre,
    ubicacion: ubicacion,
    telefono: telefono,
    descripcion: descripcion
  })
  .then(function (response) {
    console.log("Actualización correcta");
    window.location.reload();
  })
  .catch(function (error) {
    console.error("Ocurrió un error al realizar la solicitud POST:", error);
  });
});


function cargarTiendas(){
  axios
  .post("http://localhost:3000/tiendas", {
    id: localStorage.getItem("user"),
  })
  .then(function (response) {
    response.data.forEach((element) => {
      generarTienda(element);
    });
  })
  .catch(function (error) {
    console.error("Ocurrió un error al realizar la solicitud POST:", error);
  });
}

document.addEventListener("DOMContentLoaded", function (e) {
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
  const card = document.createElement("div");
  card.classList.add("card", "mt-2");
  card.style.width = "25rem";
  card.style.marginLeft = "3px";

  const row = document.createElement("div");
  row.classList.add("row", "no-gutters");

  const imgColumn = document.createElement("div");
  imgColumn.classList.add("col-md-4");

  const img = document.createElement("img");
  img.src = "shopping-store.png";
  img.classList.add("card-img");
  img.alt = "";

  imgColumn.appendChild(img);

  const bodyColumn = document.createElement("div");
  bodyColumn.classList.add("col-md-8");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const title = document.createElement("h5");
  title.classList.add("card-title");
  title.textContent = nombre;

  const paragraph1 = document.createElement("p");
  paragraph1.classList.add("card-text");
  paragraph1.textContent = ubicacion;

  const paragraph2 = document.createElement("p");
  paragraph2.classList.add("card-text");
  paragraph2.textContent = "Uriangato, Guanajuato, México";

  const editLink = document.createElement("a");
  editLink.href = "#";
  editLink.classList.add("btn", "btn-light");
  editLink.setAttribute("data-bs-toggle", "modal");
  editLink.setAttribute("data-bs-target", "#exampleModal");
  editLink.textContent = "Editar";
  editLink.addEventListener("click", (e) => {
    e.preventDefault();
    editNombre.value = nombre;
    editUbicacion.value = ubicacion;
    editTelefono.value = telefono;
    editDescrip.value = descripcion;
    idTiendaActualizar = idTienda;
  });

  const deleteLink = document.createElement("a");
  deleteLink.addEventListener("click", (e) => {
    e.preventDefault();
    eliminar(idTienda);
    alert("Tienda eliminada correctamente");
  });
  deleteLink.href = "#";
  deleteLink.classList.add("btn", "btn-light");
  deleteLink.textContent = "Eliminar";

  cardBody.appendChild(title);
  cardBody.appendChild(paragraph1);
  cardBody.appendChild(paragraph2);
  cardBody.appendChild(editLink);
  cardBody.appendChild(deleteLink);

  bodyColumn.appendChild(cardBody);

  row.appendChild(imgColumn);
  row.appendChild(bodyColumn);

  card.appendChild(row);

  document.body.appendChild(card);
}

function eliminar(id) {
  axios
  .post("http://localhost:3000/eliminarTienda", {
      id: id
    })
    .then(function (response) {
      //console.log(response);
    })
    .catch(function (error) {
      console.error("Ocurrió un error al realizar la solicitud POST:", error);
    });
  }