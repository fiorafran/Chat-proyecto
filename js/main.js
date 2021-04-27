import { router } from "./router/chat.routes.js";

const db = firebase.firestore();
const userCol = db.collection("users");

const myModal = new bootstrap.Modal(document.getElementById("modalRegistro"), {
	keyboard: false,
	backdrop: "static",
});

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
			alert("Registro correcto " + user);
			userCol.doc(email).set({
				usuario: nickname,
				estado: false
			})
			.then(() => {
			    console.log("Document successfully written!");
				document.getElementById("registroCorreo").value = "";
				document.getElementById("registroContraseña").value = "";
				myModal.hide();
			})
			.catch((error) => {
			    console.error("Error writing document: ", error);
			});
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
document.getElementById("btnIniciar").addEventListener("click", function () {
	let email = document.getElementById("inputCorreo").value;
	let password = document.getElementById("inputContraseña").value;

	firebase
		.auth()
		.signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// Signed in
			let user = userCredential.user;
			console.log("usuario iniciado");
			document.location.href = "index.html#/chat";
			window.addEventListener("hashchange", () => {
				router(window.location.hash);
			});
		})
		.catch((error) => {
			let errorCode = error.code;
			let errorMessage = error.message;
			console.log(errorMessage + " " + errorCode);
		});
});

/*---------- RUTAS ----------*/

/*router(window.location.hash);

window.addEventListener("hashchange", () => {
	router(window.location.hash);
});
*/
