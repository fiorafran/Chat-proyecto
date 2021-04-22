var myModal = new bootstrap.Modal(document.getElementById('modalRegistro'), {
  keyboard: false
});

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
    	var errorCode = error.code;
    	var errorMessage = error.message;
    	alert(errorMessage+' '+errorCode);
  	});
}

document.getElementById('btnIniciar').addEventListener('click', function(){
    console.log("Probando get element");
});


/*---------- REGISTRO ----------*/
document.getElementById('btnRegistrar').addEventListener('click', signUp);

document.getElementById('btnCancelar').addEventListener('click', ()=>{
	document.getElementById('registroCorreo').value = "";
	document.getElementById('registroContraseña').value = "";
})


