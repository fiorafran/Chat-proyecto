import Chat from '../../chat.js';

let content = document.getElementById('root');

const router = (route) => {
    content.innerHTML = '';

    switch(route) {
        case '':
            return console.log('Inicio');
            /*{
            return content.append(Chat());
            }*/
        case '#/':
            return console.log('Inicio');
        case '#/chat':
            {
            return content.append(Chat());
            }
        default: 
            return console.log('404');
    }

}

export { router };
