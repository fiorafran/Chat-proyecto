import Chat from '../../chat.js';

let content = document.getElementById('nuevo');

const router = (route) => {
    content.innerHTML = '';

    switch(route) {
        case '':
            console.log('Inicio');
            {
            return content.append(Chat());
            }
            case '#/':
            console.log('Inicio');
            {
            return content.append(Chat());
            }
        case '#/Ruta':
            return  console.log('Ruta');
        default: 
            return console.log('404');
    }

}

export { router };
