import Chat from "../../chat.js";
import Index from "../../index.js";

let content = document.getElementById("root");
const db = firebase.firestore();
const userCol = db.collection("users");
const chatMainCol = db.collection("chatMain");
let nick, lastMsjId;
const alertModal = new bootstrap.Modal(document.getElementById("modalAlert"), {
    keyboard: false,
    backdrop: "static",
});


/*------ FUNCION ENVIAR MENSAJE ------*/
const  sendMsj = () => {
    /*--- CHEQUEAR SI ESTA VACIO O CON ESPACIOS ---*/
    let strmsj = document.getElementById("inputChat").value;
    strmsj = strmsj.trim();

    if (strmsj.length > 0) {
        let mensaje = document.getElementById("inputChat").value;
        let dato = {
            id: nick,
            mensaje: mensaje,
            hora: firebase.firestore.Timestamp.fromDate(new Date()),
        };

        chatMainCol.add(dato);
        document.getElementById("inputChat").value = "";
    } else {
        alert('Escribe un mensaje.')
    
    }
}

const router = (route, emailUser) => {
    content.innerHTML = "";

    switch (route) {
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
            document.getElementById("btnEnviarMensaje")
                .addEventListener("click", sendMsj);

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
                            let trash = document.getElementById('trash'+a)
                            trash.addEventListener('click', ()=>{
                                alertModal.show();
                                document.getElementById('btnBorrar').addEventListener('click', ()=> {
                                    chatMainCol.doc(doc.id).delete()
                                        .then(() => {
                                            console.log("Mensaje borrado pa");
                                            alertModal.hide();
                                        })
                                        .catch((error) => {
                                            console.error("No se borro el mensaje pa: ", error);
                                        });
                                });
                            });
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

            break;
        default:
            return console.log("404");
    }
};

export { router };
export { sendMsj };