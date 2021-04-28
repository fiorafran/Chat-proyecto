import Chat from '../../chat.js';
import Index from '../../index.js';

let content = document.getElementById('root');
const db = firebase.firestore();
const userCol = db.collection("users");

const router = (route) => {
    content.innerHTML = '';

    switch(route) {
        case '':
            {
            return content.append(Index());
            }
        case '#/':
            {
            return content.append(Index());
            }
        case '#/chat':
                content.append(Chat());
                userCol.where("estado", "==", true)
                    .onSnapshot((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            console.log(doc.data().usuario);
                        });
                    });
            break;
        default: 
            return console.log('404');
    }

}

export { router };
