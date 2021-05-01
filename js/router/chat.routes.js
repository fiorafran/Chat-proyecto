import Chat from "../../chat.js";
import Index from "../../index.js";

let content = document.getElementById("root");
const db = firebase.firestore();
const userCol = db.collection("users");
const chatMainCol = db.collection("chatMain");


const router = (route, emailUser) => {
    content.innerHTML = "";

    switch (route) {
        case "": {
            return content.append(Index());
        }
        case "#/": {
            return content.append(Index());
        }
        case "#/chat":
            content.append(Chat());

            /*---CONSULTA USUARIO---*/
            userCol
                .doc(emailUser)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        let nick = doc.data().usuario;
                        console.log(doc.data());
                        document.getElementById("nombreUser").append(nick);
                    } else {
                        console.log("No such document!");
                    }
                })
                .catch((error) => {
                    console.log("Error getting document:", error);
                });

            /*---CONSULTA USUARIOS CONECTADOS*/
            userCol.where("estado", "==", true).onSnapshot((querySnapshot) => {
                document.getElementById("usuariosConectados").innerHTML = "";
                querySnapshot.forEach((doc) => {
                    console.log(doc.data().usuario);
                    const li = document.createElement("li");
                    li.innerHTML = "<p>" + doc.data().usuario + "</p>";
                    document.getElementById("usuariosConectados").append(li);
                });
            });

            /*-----LOGOUT------*/
            document
                .getElementById("btnLogOut")
                .addEventListener("click", function () {
                    firebase
                        .auth()
                        .signOut()
                        .then(() => {
                            userCol
                                .doc(emailUser)
                                .update({
                                    estado: false,
                                })
                                .then(() => {
                                    console.log(
                                        "Document successfully updated!"
                                    );
                                    document.location.href = "index.html";
                                    window.addEventListener(
                                        "hashchange",
                                        () => {
                                            router(window.location.hash);
                                        }
                                    );
                                })
                                .catch((error) => {
                                    console.error(
                                        "Error updating document: ",
                                        error
                                    );
                                });
                            console.log("usuario deslogueado");
                        })
                        .catch((error) => {
                            let errorCode = error.code;
                            let errorMessage = error.message;
                            console.log(errorMessage + " " + errorCode);
                        });
                });

            /*---MENSAJES DEL CHAT GENERAL*/
            document.getElementById("btnEnviarMensaje").addEventListener("click", function () {
                let mensaje = document.getElementById("inputChat").value;
                let dato = {
                    usuario: emailUser,
                    msj: mensaje,
                    }

                chatMainCol.doc("chat-general")
                    .update({
                        mensajes: firebase.firestore.FieldValue.arrayUnion(dato)
                    })
            });
            chatMainCol.onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data().mensajes);
                    const mensajesEnviados = document.createElement("mensajesEnviados");
                    mensajesEnviados.innerHTML = "<p>" + doc.data().mensajes + "</p>";
                    document.getElementById("ventanaChat").append(mensajesEnviados);
                });
            });

        break;
        default:
            return console.log("404");
    }
};

export { router };
