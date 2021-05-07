import Chat from "../../chat.js";
import Index from "../../index.js";

let content = document.getElementById("root");
const db = firebase.firestore();
const userCol = db.collection("users");
const chatMainCol = db.collection("chatMain");
let nick, lastMsjId;

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
                        nick = doc.data().usuario;
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
            /* SCROLL DIV */
            function scrollDiv(){
                var div = document.getElementById('ventanaChat');
                div.scrollTop = '9999';
            }

            /*---MENSAJES DEL CHAT GENERAL*/
            document
                .getElementById("btnEnviarMensaje")
                .addEventListener("click", function () {
                    let mensaje = document.getElementById("inputChat").value;
                    let dato = {
                        id: nick,
                        mensaje: mensaje,
                        hora: firebase.firestore.Timestamp.fromDate(new Date()),
                    };

                    chatMainCol.add(dato);
                    document.getElementById("inputChat").value = "";
                });

            let a=0;
            let chatcito = chatMainCol.orderBy("hora", "asc");
            chatcito.onSnapshot((querySnapshot) => {
                document.getElementById("ventanaChat").innerHTML = "";
                querySnapshot.forEach((doc) => {
                    /*console.log(doc.data());*/
                    const mensajeEnviados = document.createElement(
                        "mensajeEnviados"
                    );

                    let horasBorrar = doc.data().hora;
                    let obtenerNanos = doc.data().hora.nanoseconds;
                    let obtenerSecs = doc.data().hora.seconds;
                    let nts = obtenerNanos/1000000000;
                    let obtenerHoras = nts + obtenerSecs;                                                       
                    let fechayhora = new Date(obtenerHoras * 1000);
                    let stringFechaHora = fechayhora.toString();
                    stringFechaHora = stringFechaHora.replace(/Mon|May|03|2021|GMT-0300|hora estándar de Argentina|/g, "").replace("(", "").replace(")", "");
                    /*console.log(stringFechaHora);*/

                    /*if (nick != lastMsjId) {*/
                        if (nick == doc.data().id) {
                            a++
                            mensajeEnviados.innerHTML =
                                `<div class="containerMensaje">
                                    <div class="row">
                                        <p class="idMensaje col self-align-left">` + doc.data().id + `</p>
                                        <i class="trash far fa-trash-alt col-1 text-end" id="trash`+a+`"></i>
                                    </div>
                                    <p class="Mensaje">` + doc.data().mensaje + `</p>
                                    <p class="timeMensaje">` + stringFechaHora + `</p>
                                </div>`;
                            document.getElementById("ventanaChat").append(mensajeEnviados);
                            scrollDiv();
                            /*const trash = document.querySelectorAll('.trash');*/
                            let asd = document.getElementById('trash'+a)
                            asd.addEventListener('click', ()=>{
                                console.log(asd.id);
                            })
                        } else {
                            mensajeEnviados.innerHTML =
                                `<div class="containerMensaje">
                                    <div class="row">
                                        <p class="idMensaje col self-align-left">` + doc.data().id + `</p>
                                    </div>
                                    <p class="Mensaje">` + doc.data().mensaje + `</p>
                                    <p class="timeMensaje">` + stringFechaHora + `</p>
                                </div>`;
                            document.getElementById("ventanaChat").append(mensajeEnviados);
                            scrollDiv();
                        }
                   /*     lastMsjId = doc.data().id;
                    } else {
                        mensajeEnviados.innerHTML =
                            `<div class="containerMensaje">
                                <p class="Mensaje">` + doc.data().mensaje + `</p>
                                <p class="timeMensaje">` + stringFechaHora + `</p>
                            </div>`;
                        document.getElementById("ventanaChat").append(mensajeEnviados);
                        scrollDiv();
                        lastMsjId = doc.data().id;
                    }
                    */
                });
            });

            /*setTimeout(function(){
                    console.log('corriendo for')
                    for (var i = 0; i < trash.length; i++) {
                        trash[i].addEventListener('click',()=>{
                            alert('a '+i)
                        })
                    }
                }, 3000);*/

            break;
        default:
            return console.log("404");
    }
};

export { router };
