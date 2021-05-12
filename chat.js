export default () => {
  const vista = `
    <div class="container m-0 alt">
      <div class="row">
        <div class="col" id="new">
          Aca abajo deberia crearse lo nuevo
        </div>
        <div class="col-8 box-ventanaG">
          <h1 style="color: white" id="nombreUser"></h1>

          <div class="overflow-auto box-ventana-chat" id="ventanaChat"></div>

          <div class="row barra-chat">
            <div class="col-sm-10">
              <input
                type="text"
                id="inputChat"
                placeholder="Escribir mensaje..."
              />
            </div>
            <div class="col-2">
              <button class="btn btn-primary" id="btnEnviarMensaje">
                Enviar
              </button>
            </div>
          </div>
        </div>
        <div class="col box-ventanaC">
          <h1 style="color: white">Usuarios</h1>
          <div class="columna-usuarios">
          <ul class="online" id="usuariosConectados">

          </ul>
          <br/>           
          <ul class="offline" id="usuariosDesconectados">
          </ul>
          </div>
          <div class="col">
              <button class="btn btn-danger" id="btnLogOut">
                Salir
              </button>
            </div>
        </div>
      </div>
    </div>
  `;

  const divElement = document.createElement("div");
  divElement.innerHTML = vista;
  console.log("chat");
  return divElement;
};
