export default () => {
	const vista = `
		<div class="container mt-5">


		     <div class="row">

		      <div class="col-sm-9 box-ventana">
		        <h1 style="color: white;">SALA DE CHAT</h1>

		        <div class="box-ventana-chat"> Ventana de chat</div>

		        <div class="row barra-chat">
		          <div class="col-sm-10">
		            <input type="text" id="inputChat" placeholder="Escribir mensaje...">
		          </div>
		          <div class="col-sm-2 ">
		            <button class="btn btn-primary" id="btnEnviarMensaje">Enviar</button>
		          </div>
		        </div>


		      </div>

		      <div class="col-sm-3">
		       <h5> Usuarios Online</h5>
		       <div>
		         <p>Usuario</p>
		         <p>Usuario</p>
		         <p>Usuario</p>
		         <p>Usuario</p>
		         <p>Usuario</p>
		         <p>Usuario</p>
		       </div>
		     </div>

		     </div>

		    </div>
	`;

	const divElement = document.createElement('div');
	divElement.innerHTML = vista;

	return divElement;
}