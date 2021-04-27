import Chat from '../../chat.js';
import Index from '../../index.js';

let content = document.getElementById('root');

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
            {
            return content.append(Chat());
            }
        default: 
            return console.log('404');
    }

}

export { router };
