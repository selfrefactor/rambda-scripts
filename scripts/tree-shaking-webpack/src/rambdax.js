import { adjust } from 'rambdax'

function component() {
    const element = document.createElement('div');
    const a = adjust(0, [0, 0], (x => x + 1));
    element.innerHTML = a[0].toString();
    return element;
}

document.body.appendChild(component());
