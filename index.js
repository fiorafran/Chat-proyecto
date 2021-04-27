export default () => {
  const vista = `
    <nav class="navbar navbar-dark bg-dark">
          <div class="container-fluid">
            <span class="navbar-brand mb-0 h1">ChatProyecto</span>
            <a href="" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modalRegistro">Registrarse</a>
          </div>
        </nav>

      <!-- Login -->
        <div class="container mt-5">
            <div class="row mb-3">
                <label for="correo" class="col-sm-2 col-form-label">Correo</label>
                <div class="col-sm-10">
                <input type="email" class="form-control" id="inputCorreo">
                </div>
            </div>
            <div class="row mb-3">
                <label for="contraseña" class="col-sm-2 col-form-label">Contraseña</label>
                <div class="col-sm-10">
                <input type="password" class="form-control" id="inputContraseña">
                </div>
            </div>
              <div class="container text-center">
                <button class="col-sm-3 btn btn-primary" id="btnIniciar"> Iniciar </button>
              </div>
        </div>
  `;

  const divElement = document.createElement("div");
  divElement.innerHTML = vista;
  console.log("index");
  return divElement;
};
