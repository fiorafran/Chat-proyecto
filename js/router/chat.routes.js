import Chat from "../../chat.js";
import Index from "../../index.js";

let content = document.getElementById("root");
const db = firebase.firestore();
const userCol = db.collection("users");
const chatMainCol = db.collection("chatMain");

const router = (route, emailUser, nickname) => {
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

            /*---CONSULTA USUARIOS CONECTADOS---*/
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

            /* SCROLL DIV */
            function scrollDiv(){
             
                var div = document.getElementById('ventanaChat');
                div.scrollTop = '9999';
             
            }

            document
                .getElementById("btnEnviarMensaje")
                .addEventListener("click", function () {
                    let mensaje = document.getElementById("inputChat").value;
                    let dato = {
                        id: emailUser,
                        mensaje: mensaje,
                        hora: firebase.firestore.Timestamp.fromDate(new Date()),
                    };

                    chatMainCol.add(dato);
                    document.getElementById("inputChat").value = "";
                });

            let chatcito = chatMainCol.orderBy("hora", "asc");
            chatcito.onSnapshot((querySnapshot) => {
                document.getElementById("ventanaChat").innerHTML = "";
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                    const mensajeEnviados = document.createElement(
                        "mensajeEnviados"
                    );

                    let obtenerNanos = doc.data().hora.nanoseconds;
                    let obtenerSecs = doc.data().hora.seconds;
                    let nts = obtenerNanos/1000000000;
                    let obtenerHoras = nts + obtenerSecs;                                                       
                    let fechayhora = new Date(obtenerHoras * 1000);
                    let stringFechaHora = fechayhora.toString();
                    stringFechaHora = stringFechaHora.replace(/Mon|May|03|2021|GMT-0300| |hora estándar de Argentina|/g, "").replace("(", "").replace(")", "");
                    console.log(stringFechaHora);

                    mensajeEnviados.innerHTML =
                        `<div>
                            <p>` + doc.data().id + `</p>
                            <p>` + doc.data().mensaje + `</p>
                            <p>` + doc.data().hora.Time + `</p>
                        </div>`;
                    document
                        .getElementById("ventanaChat")
                        .append(mensajeEnviados);
                    scrollDiv();
                });
            });


            break;
        default:
            return console.log("404");
    }
};

export { router };
