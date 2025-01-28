let participantes = [];

// Función para capitalizar nombres
function capitalizarNombre(nombre) {
    return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
}

function agregarAmigo() {
    const input = document.getElementById('amigo');
    let nombre = input.value.trim();

    if (!nombre) {
        alert('Por favor ingresa un nombre válido');
        return;
    }

    nombre = capitalizarNombre(nombre);

    if (participantes.includes(nombre)) {
        alert('¡Este nombre ya está en la lista!');
        return;
    }

    participantes.push(nombre);
    actualizarLista();
    input.value = '';

    document.getElementById('listaAmigos').style.display = 'block';
    document.getElementById('resultado').style.display = 'none';
}

function actualizarLista() {
    const lista = document.getElementById('listaAmigos');
    lista.innerHTML = '';
    participantes.forEach(nombre => {
        const li = document.createElement('li');
        li.textContent = nombre;
        lista.appendChild(li);
    });
}

function sortearAmigo() {
    if (participantes.length < 2) {
        alert('¡Necesitas al menos 2 participantes!');
        return;
    }

    const pares = generarParesAleatorios();
    mostrarResultados(pares);

    document.getElementById('listaAmigos').style.display = 'none';
    document.getElementById('resultado').style.display = 'block';
}

// Función faltante que genera los pares
function generarParesAleatorios() {
    const receivers = derangement(participantes);
    const pares = {};

    for (let i = 0; i < participantes.length; i++) {
        pares[participantes[i]] = receivers[i];
    }
    return pares;
}

// Función para evitar auto-emparejamientos
function derangement(arr) {
    if (arr.length < 2) return arr;
    let deranged;

    do {
        deranged = mezclarArray([...arr]);
    } while (!esDerangementValido(arr, deranged));

    return deranged;
}

// Función de validación
function esDerangementValido(original, deranged) {
    return original.every((nombre, index) => nombre !== deranged[index]);
}

// Función para mezclar array
function mezclarArray(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function mostrarResultados(pares) {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '';

    Object.entries(pares).forEach(([dador, receptor]) => {
        const li = document.createElement('li');
        li.textContent = `${dador} ➔ ${receptor}`;
        li.classList.add('result-item');
        resultado.appendChild(li);
    });
}

// Event listener para Enter
document.getElementById('amigo').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        agregarAmigo();
    }
});