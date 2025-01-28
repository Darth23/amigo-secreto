// Cache de elementos DOM
const DOM = {
    input: document.getElementById('amigo'),
    lista: document.getElementById('listaAmigos'),
    resultado: document.getElementById('resultado'),
    btnAdd: document.querySelector('.button-add'),
};

let participantes = [];

// Capitalización consistente
const formatearNombre = nombre => nombre.trim().replace(/\b\w/g, c => c.toUpperCase());

// Función clave: Genera mezcla válida sin autoemparejamientos
const generarMezclaSegura = (arr) => {
    const mezcla = [...arr];
    let intentos = 0;
    const maxIntentos = 100;

    // Algoritmo de Fisher-Yates modificado
    do {
        for (let i = mezcla.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            [mezcla[i], mezcla[j]] = [mezcla[j], mezcla[i]];
        }
        intentos++;
    } while ((mezcla.some((nombre, i) => nombre === arr[i])) && intentos < maxIntentos);

    if (intentos >= maxIntentos) {
        throw new Error('No se pudo generar un emparejamiento válido');
    }

    return mezcla;
};

const agregarAmigo = () => {
    const nombre = formatearNombre(DOM.input.value);

    if (!nombre) return alert('Nombre no válido');
    if (participantes.includes(nombre)) return alert('¡Nombre repetido!');

    participantes = [...participantes, nombre];
    DOM.input.value = '';
    actualizarLista();
    DOM.lista.style.display = 'block';
    DOM.resultado.style.display = 'none';
};

const actualizarLista = () => {
    DOM.lista.innerHTML = participantes.map(nombre => `<li>${nombre}</li>`).join('');
};

const sortearAmigo = () => {
    if (participantes.length < 2) return alert('Mínimo 2 participantes');

    try {
        const mezcla = generarMezclaSegura(participantes);
        const pares = Object.fromEntries(
            participantes.map((nombre, i) => [nombre, mezcla[i]])
        );

        DOM.resultado.innerHTML = Object.entries(pares)
            .map(([dador, receptor]) => `
                <li class="result-item">
                    <span class="dador">${dador}</span>
                    <span class="flecha">→</span>
                    <span class="receptor">${receptor}</span>
                </li>
            `).join('');

        DOM.lista.style.display = 'none';
        DOM.resultado.style.display = 'block';

    } catch (error) {
        alert('Error: Intenta añadir más nombres');
    }
};

// Event listeners
DOM.input.addEventListener('keypress', e => e.key === 'Enter' && agregarAmigo());
DOM.btnAdd.addEventListener('click', agregarAmigo);