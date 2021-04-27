export default () => {
	const vista = `
		<div class="container mt-5">
      <div class="row">
        <div class="col-sm-8 box-ventanaG">
          <h1 style="color: white">SALA DE CHAT</h1>

          <div class="box-ventana-chat">Ventana de chat</div>

          <div class="row barra-chat">
            <div class="col-sm-10">
              <input
                type="text"
                id="inputChat"
                placeholder="Escribir mensaje..."
              />
            </div>
            <div class="col-sm-2">
              <button class="btn btn-primary" id="btnEnviarMensaje">
                Enviar
              </button>
            </div>
          </div>
        </div>
        <div class="col-sm-4 box-ventanaC">
          <h1 style="color: white">Usuarios Online</h1>
          <div class="columna-usuarios">
            <p>se genera una lista con los usuarios conectados</p>
            <p>se genera una lista con los usuarios conectados</p>
            <p>se genera una lista con los usuarios conectados</p>
            <p>se genera una lista con los usuarios conectados</p>
            <p>se genera una lista con los usuarios conectados</p>
            <p>se genera una lista con los usuarios conectados</p>
          </div>
        </div>
      </div>
    </div>
	`;

	const divElement = document.createElement('div');
	divElement.innerHTML = vista;
  console.log("chat");
	return divElement;
}