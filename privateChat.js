export default () => {
  const vista = `
    <div class="container m-0 alt">
      <div class="row">
      

        <div class="col-sm-9 box-main-chat">
          <h2 style="color: white" id="nombreUserPrivado">@</h2>

          <div class="overflow-auto box-ventana-chat" id="ventanaChatPrivado"></div>

          <div class="row barra-chat">
            <div class="col">
              <input type="text" id="inputChatPrivado" placeholder="Escribir mensaje"/>
            </div>
            <div class="col">
              <button class="btn btn-primary" id="btnEnviarMensajePrivado">
                Enviar
              </button>
            </div>

          </div>

        </div>

        <div class="col box-users">
          <h2 style="color: white">#Usuarios</h2>
          <div class="columna-users">
          <ul class="online" id="usuariosConectadosPrivado">
          </ul>
          <br/>           
          <ul class="offline" id="usuariosDesconectadosPrivado">
          </ul>
          </div>
          <div class="logout">
              <button class="btn btn-danger" id="btnLogOutPrivado">
                Salir
              </button>
          </div>
        </div>

      </div>
    </div>
  ;`

  const divElement = document.createElement("div");
  divElement.innerHTML = vista;
  console.log("chatPrivado");
  return divElement;
};