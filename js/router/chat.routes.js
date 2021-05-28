import Index from "../../index.js";
import Chat from "../../chat.js";
import PrivateChat from "../../privateChat.js"

let content = document.getElementById("root");
const db = firebase.firestore();
const userCol = db.collection("users");
const chatMainCol = db.collection("chatMain");
const privateChat = db.collection('privateChat');
let nick, lastMsjId, emailGlobal, emailPrivado, user, unsubscribe, rutaUsuario;
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
            email: emailGlobal,
            mensaje: mensaje,
            hora: firebase.firestore.Timestamp.fromDate(new Date()),
        };

        chatMainCol.add(dato);
        document.getElementById("inputChat").value = "";
    } else {
        alert('Escribe un mensaje.')
    
    }
}

const  sendMsjPriv = () => {
    /*--- CHEQUEAR SI ESTA VACIO O CON ESPACIOS ---*/
    let strmsj = document.getElementById("inputChatPrivado").value;
    strmsj = strmsj.trim();

    if (strmsj.length > 0) {
        let mensaje = document.getElementById("inputChatPrivado").value;
        let dato = {
            id: nick,
            mensaje: mensaje,
            hora: firebase.firestore.Timestamp.fromDate(new Date()),
        };

        privateChat.doc(emailGlobal).collection(emailPrivado).add(dato);
        document.getElementById("inputChatPrivado").value = "";
    } else {
        alert('Escribe un mensaje.')
    
    }
}

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

const router = (route, emailUser) => {
    emailGlobal = emailUser;
    content.innerHTML = "";

    switch (route) {
        case "#/":
             content.append(Index());
             document.getElementById("btnIniciar").addEventListener("click", LogIn);
        break;
        case "#/chat":
            content.append(Chat());

            /*---CONSULTA USUARIO---*/
            userCol.doc(emailUser).get()
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
            unsubscribe = userCol.onSnapshot((querySnapshot) => {
                document.getElementById("usuariosConectados").innerHTML = "";
                document.getElementById("usuariosDesconectados").innerHTML = "";
                querySnapshot.forEach((doc) => {
                    const li = document.createElement("li");
                    const le = document.createElement("li")
                    if (doc.data().estado == true) {       
                        li.innerHTML = "<p id='id_"+doc.data().usuario+"'>" + doc.data().usuario + "</p>";
                        document.getElementById("usuariosConectados").append(li);
                    } else {
                        le.innerHTML = "<p id='id_"+doc.data().usuario+"'>" + doc.data().usuario + "</p>";
                        document.getElementById("usuariosDesconectados").append(le);
                    }
                    const clickUser = document.getElementById('id_'+doc.data().usuario);
                    clickUser.addEventListener('click', ()=>{
                        let id = clickUser.id.replace('id_', "");
                        let em = clickUser.getAttribute('email');
                        user = id;
                        rutaUsuario = user.replace(' ', '');
                        document.location.href = "index.html#/chat/"+rutaUsuario+"";
                    })
                });
            });

            /*----- USUARIOS CON LOS QUE CHATEA -----*/
            /*privateChat.doc(emailUser).collection('chats').onSnapshot((querySnapshot) => {
                document.getElementById("new").innerHTML = "";
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                    const div = document.createElement('div');
                    div.id = doc.data().email;
                    document.getElementById("new").append(div);
                });
            });*/

            /*-----LOGOUT------*/
            document.getElementById("btnLogOut").addEventListener("click", function () {
                firebase.auth().signOut()
                    .then(() => {
                        userCol.doc(emailUser)
                            .update({
                                estado: false,
                            })
                            .then(() => {
                                console.log("Desconectado!");
                                document.location.href = "index.html";
                                window.addEventListener("hashchange", () => {
                                    router(window.location.hash);
                                });
                            })
                            .catch((error) => {
                                console.error("Error updating document: ",error
                                );
                            });
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
            document.getElementById("btnEnviarMensaje").addEventListener("click", sendMsj);

            let a=0;
            let chatcito = chatMainCol.orderBy("hora", "asc");
            chatcito.onSnapshot((querySnapshot) => {
                document.getElementById("ventanaChat").innerHTML = "";
                querySnapshot.forEach((doc) => {
                    const mensajeEnviados = document.createElement("mensajeEnviados");

                    let horasBorrar = doc.data().hora;
                    let obtenerNanos = doc.data().hora.nanoseconds;
                    let obtenerSecs = doc.data().hora.seconds;
                    let nts = obtenerNanos/1000000000;
                    let obtenerHoras = nts + obtenerSecs;                                                       
                    let fechayhora = new Date(obtenerHoras * 1000);
                    let stringFechaHora = fechayhora.toString();
                    stringFechaHora = stringFechaHora.replace(/Mon|May|03|2021|GMT-0300|hora estándar de Argentina|/g, "").replace("(", "").replace(")", "");

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
                        let trash = document.getElementById('trash'+a)
                        trash.addEventListener('click', ()=>{
                            alertModal.show();
                            document.getElementById('btnBorrar').addEventListener('click', ()=> {
                                chatMainCol.doc(doc.id).delete()
                                    .then(() => {
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
                });
            });

            break;
        case "#/chat/"+rutaUsuario+"":
            unsubscribe();
            content.append(PrivateChat());
            document.getElementById("nombreUserPrivado").append(user);

            /* CONSULTA USUARIOS CONECTADOS EN PRIVADO */
            userCol.onSnapshot((querySnapshot) => {
                document.getElementById("usuariosConectadosPrivado").innerHTML = "";
                document.getElementById("usuariosDesconectadosPrivado").innerHTML = "";
                querySnapshot.forEach((doc) => {
                    const li = document.createElement("li");
                    const le = document.createElement("li")
                    if (doc.data().estado == true) {       
                        li.innerHTML = "<p id='id_"+doc.data().usuario+"'>" + doc.data().usuario + "</p>";
                        document.getElementById("usuariosConectadosPrivado").append(li);
                    } else {
                        le.innerHTML = "<p id='id_"+doc.data().usuario+"'>" + doc.data().usuario + "</p>";
                        document.getElementById("usuariosDesconectadosPrivado").append(le);
                    }
                    const clickUser = document.getElementById('id_'+doc.data().usuario);
                    clickUser.addEventListener('click', ()=>{
                        let id = clickUser.id.replace('id_', "");
                        let em = clickUser.getAttribute('email');
                        user = id;
                        rutaUsuario = user.replace(' ', '');
                        document.location.href = "index.html#/chat/"+rutaUsuario+"";
                        /*privateChat.doc(emailUser).collection('chats').add({ mensaje: 'probando', email: em });*/
                    })
                });
            });

            document.getElementById("btnLogOutPrivado").addEventListener("click", function () {
                firebase.auth().signOut()
                    .then(() => {
                        userCol.doc(emailUser)
                            .update({
                                estado: false,
                            })
                            .then(() => {
                                console.log("Desconectado!");
                                document.location.href = "index.html";
                                window.addEventListener("hashchange", () => {
                                    router(window.location.hash);
                                });
                            })
                            .catch((error) => {
                                console.error("Error updating document: ",error
                                );
                            });
                    })
                    .catch((error) => {
                        let errorCode = error.code;
                        let errorMessage = error.message;
                        console.log(errorMessage + " " + errorCode);
                    });
            });

            /*---MENSAJES DEL CHAT PRIVADO*/
            document.getElementById("btnEnviarMensajePrivado").addEventListener("click", sendMsjPriv);
            let b=0;
            let unico = userCol.where("usuario", "==", user).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        emailPrivado = doc.id;
                        privateChat.doc(emailUser).collection(emailPrivado).orderBy("hora", "asc")
                            .onSnapshot((querySnapshot) => {
                                querySnapshot.forEach((msj) => {
                                    console.log(msj.data());
                                    const mensajeEnviadosPrivado = document.createElement("mensajeEnviadosPrivado");

                                    let horasBorrar = msj.data().hora;
                                    let obtenerNanos = msj.data().hora.nanoseconds;
                                    let obtenerSecs = msj.data().hora.seconds;
                                    let nts = obtenerNanos/1000000000;
                                    let obtenerHoras = nts + obtenerSecs;                                                       
                                    let fechayhora = new Date(obtenerHoras * 1000);
                                    let stringFechaHora = fechayhora.toString();
                                    stringFechaHora = stringFechaHora.replace(/Mon|May|03|2021|GMT-0300|hora estándar de Argentina|/g, "").replace("(", "").replace(")", "");

                                    if (nick == msj.data().id) {
                                        b++
                                        mensajeEnviadosPrivado.innerHTML =
                                            `<div class="containerMensaje">
                                                <div class="row">
                                                    <p class="idMensaje col self-align-left">` + msj.data().id + `</p>
                                                    <i class="trash far fa-trash-alt col-1 text-end" id="prash`+b+`"></i>
                                                </div>
                                                <p class="Mensaje">` + msj.data().mensaje + `</p>
                                                <p class="timeMensaje">` + stringFechaHora + `</p>
                                            </div>`;
                                        document.getElementById("ventanaChatPrivado").append(mensajeEnviadosPrivado);
                                        /*scrollDiv();*/
                                        let prash = document.getElementById('prash'+b)
                                        prash.addEventListener('click', ()=>{
                                            /*alertModal.show();
                                            document.getElementById('btnBorrar').addEventListener('click', ()=> {
                                                chatMainCol.doc(doc.id).delete()
                                                    .then(() => {
                                                        alertModal.hide();
                                                    })
                                                    .catch((error) => {
                                                        console.error("No se borro el mensaje pa: ", error);
                                                    });
                                            });*/
                                        });
                                    } else {
                                        mensajeEnviadosPrivado.innerHTML =
                                            `<div class="containerMensaje">
                                                <div class="row">
                                                    <p class="idMensaje col self-align-left">` + msj.data().id + `</p>
                                                </div>
                                                <p class="Mensaje">` + msj.data().mensaje + `</p>
                                                <p class="timeMensaje">` + stringFechaHora + `</p>
                                            </div>`;
                                        document.getElementById("ventanaChatPrivado").append(mensajeEnviadosPrivado);
                                        /*scrollDiv();*/
                                    }


                                });
                        });
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
            /*privateChat.doc(emailUser).collection('chats').onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                });
            });*/



            break;
        default:
            return console.log("404");
    }
};

export { router, sendMsj, sendMsjPriv };