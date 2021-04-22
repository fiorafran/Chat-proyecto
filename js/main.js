import { router } from './router/chat.routes.js';


const myModal = new bootstrap.Modal(document.getElementById('modalRegistro'), {
  keyboard: false,
  backdrop: 'static'
});

/*---------- REGISTRO MODAL ----------*/
const signUp = () => {
	email = document.getElementById('registroCorreo').value;
	password = document.getElementById('registroContraseña').value;

	firebase.auth().createUserWithEmailAndPassword(email, password)
 	.then((userCredential) => {
    	// Signed in
    	var user = userCredential.user;
    	alert('Registro correcto '+ user);
    	document.getElementById('registroCorreo').value = "";
    	document.getElementById('registroContraseña').value = "";
    	myModal.hide();
  	})
  	.catch((error) => {
    	let errorCode = error.code;
    	let errorMessage = error.message;
    	alert(errorMessage+' '+errorCode);
  	});
}

/*---------- REGISTRO ----------*/
document.getElementById('btnRegistrar').addEventListener('click', signUp);

document.getElementById('btnCancelar').addEventListener('click', ()=>{
	document.getElementById('registroCorreo').value = "";
	document.getElementById('registroContraseña').value = "";
})


/*---------- LOGIN AUTENTICACIÓN ----------*/
document.getElementById('btnIniciar').addEventListener('click', function(){

	let email = document.getElementById('inputCorreo').value;
	let password = document.getElementById('inputContraseña').value;

	firebase.auth().signInWithEmailAndPassword(email, password)
	.then((userCredential) => {
		// Signed in
		let user = userCredential.user;
		console.log('usuario iniciado')
	})
	.catch((error) => {
		let errorCode = error.code;
		let errorMessage = error.message;
		console.log(errorMessage+' '+errorCode);
	});
})

/*---------- RUTAS ----------*/

const Ruta = document.querySelector('#Ruta');

router(window.location.hash);

window.addEventListener('hashchange', ()=>{
	router(window.location.hash);
})
