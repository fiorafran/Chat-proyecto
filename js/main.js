import { router, sendMsj, sendMsjPriv } from "./router/chat.routes.js";

document.location.href = "index.html#/";

const db = firebase.firestore();
const userCol = db.collection("users");
const chatMainCol = db.collection("chatMain");

const myModal = new bootstrap.Modal(document.getElementById("modalRegistro"), {
	keyboard: false,
	backdrop: "static",
});
/*---------- EVENTO PRESIONAR ENTER ----------*/
function keyEnter(evt) {
	let key = evt.keyCode;
	if (key == 13) {
		if (window.location.hash == "#/") {
			console.log('hola presionaste enter');
			LogIn();
		} else if(window.location.hash == "#/chat") {
			sendMsj();
		} else {
			sendMsjPriv();
		}
	}
}

window.onkeydown = keyEnter;

/*---------- INICIAR SESION ----------*/

const LogIn = () => {
	let email = document.getElementById("inputCorreo").value;
	let password = document.getElementById("inputContraseña").value;

	firebase.auth().signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// Signed in
			let user = userCredential.user;
			console.log("usuario iniciado");
			document.location.href = "index.html#/chat";
			window.addEventListener("hashchange", () => {
				router(window.location.hash, email);
			});
			userCol
				.doc(email)
				.update({
					estado: true,
				})
				.then(() => {
					console.log("Document successfully updated!");
				})
				.catch((error) => {
					// The document probably doesn't exist.
					console.error("Error updating document: ", error);
				});
		})
		.catch((error) => {
			let errorCode = error.code;
			let errorMessage = error.message;
			console.log(errorMessage + " " + errorCode);
		});
}


/*---------- REGISTRO MODAL ----------*/
const signUp = () => {
	let email = document.getElementById("registroCorreo").value;
	let password = document.getElementById("registroContraseña").value;
	let nickname = document.getElementById("registroNickname").value;

	firebase
		.auth()
		.createUserWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// Signed in
			var user = userCredential.user;
			alert("Registro correcto ");
			userCol
				.doc(email)
				.set({
					usuario: nickname,
					estado: false,
				})
		})
		.catch((error) => {
			let errorCode = error.code;
			let errorMessage = error.message;
			alert(errorMessage + " " + errorCode);
		});
};

/*---------- REGISTRO ----------*/
document.getElementById("btnRegistrar").addEventListener("click", signUp);

document.getElementById("btnCancelar").addEventListener("click", () => {
	document.getElementById("registroCorreo").value = "";
	document.getElementById("registroContraseña").value = "";
});

/*---------- LOGIN AUTENTICACIÓN ----------*/
document.getElementById("btnIniciar").addEventListener("click", LogIn);











/*----CONSULTA USUSARIOS-----*/

/*db.collection("users").where("estado", "==", true)
    .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.data().usuario);
        });
    });*/

/*---------- RUTAS ----------*/

/*router(window.location.hash);

window.addEventListener("hashchange", () => {
	router(window.location.hash);
});
*/
