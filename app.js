let participantes = [];

// Cache de elementos DOM
const DOM = {
    input: document.getElementById('amigo'),
    lista: document.getElementById('listaAmigos'),
    resultado: document.getElementById('resultado'),
    sortearBtn: document.getElementById('sortear'), // Nuevo botón para sortear
    eliminarBtn: document.createElement('button') // Botón para eliminar
};

DOM.eliminarBtn.textContent = 'Eliminar';
DOM.eliminarBtn.classList.add('eliminar-btn');
DOM.eliminarBtn.addEventListener('click', eliminarAmigo);

// Expresión regular para validación de nombres
const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s']+$/;

// Sanitización en tiempo real del input
DOM.input.addEventListener('input', function (e) {
    this.value = this.value
        .replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s']/g, '')  // Elimina caracteres inválidos
        .replace(/\s{2,}/g, ' ')  // Reduce múltiples espacios a uno
        .trimStart();  // Evita espacios al inicio
});

function capitalizarNombre(nombre) {
    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) throw new Error('Nombre vacío');
    if (!nombreValido.test(nombreLimpio)) throw new Error('Caracteres inválidos');

    // Normaliza espacios y capitaliza
    return nombreLimpio
        .replace(/\s{2,}/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

function generarSugerencia(nombreBase) {
    const nombresSimilares = participantes.filter(n =>
        n.startsWith(nombreBase + ' ') || n === nombreBase
    );

    // Buscar números existentes
    const numeros = nombresSimilares.map(n => {
        const match = n.match(/ (\d+)$/);
        return match ? parseInt(match[1]) : 0;
    });

    const maxNumero = Math.max(...numeros, 0);

    // Sugerir siguiente número o inicial
    if (maxNumero > 0) {
        return `${nombreBase} ${maxNumero + 1}`;
    }

    // Si no hay números, sugerir inicial
    const letras = nombresSimilares.map(n => {
        const match = n.match(/ ([A-Z])$/);
        return match ? match[1] : null;
    }).filter(Boolean);

    if (letras.length > 0) {
        const ultimaLetra = letras[letras.length - 1].charCodeAt(0);
        return `${nombreBase} ${String.fromCharCode(ultimaLetra + 1)}`;
    }

    return `${nombreBase} 2`;  // Primera sugerencia numérica
}

function agregarAmigo() {
    try {
        const nombre = capitalizarNombre(DOM.input.value);

        if (participantes.includes(nombre)) {
            const nombreBase = nombre.split(' ')[0];
            const sugerencia = generarSugerencia(nombreBase);

            throw new Error(`Nombre duplicado. ¿Quizás: ${sugerencia}?`);
        }

        participantes.push(nombre);
        actualizarLista();
        DOM.input.value = '';

        DOM.lista.style.display = 'block';
        DOM.resultado.style.display = 'none';

    } catch (error) {
        const mensajes = {
            'Nombre vacío': 'Por favor ingresa un nombre válido',
            'Caracteres inválidos': 'Solo se permiten letras y espacios',
            'Nombre duplicado': error.message // Mensaje personalizado
        };

        alert(mensajes[error.message] || 'Error desconocido');
    }
}

function actualizarLista() {
    const lista = document.getElementById('listaAmigos');
    lista.innerHTML = participantes.map(nombre => `<li>${nombre} ${DOM.eliminarBtn.outerHTML}</li>`).join('');

    // Agregar event listeners a los botones de eliminar
    const botonesEliminar = lista.querySelectorAll('.eliminar-btn');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', eliminarAmigo);
    });
}

function eliminarAmigo(event) {
    const li = event.target.closest('li');
    const nombre = li.textContent.replace('x', '').trim();
    participantes = participantes.filter(p => p !== nombre);
    actualizarLista();
}

function sortearAmigo() {
    try {
        if (participantes.length < 2) throw new Error('Mínimo 2 participantes');

        const pares = generarParesAleatorios();
        mostrarResultados(pares);

        DOM.lista.style.display = 'none';
        DOM.resultado.style.display = 'block';

    } catch (error) {
        alert(error.message === 'Mínimo 2 participantes'
            ? '¡Necesitas al menos 2 participantes!'
            : 'Error al generar los pares');
    }
}
function sortearTodos() {
    try {
        if (participantes.length < 2) throw new Error('Mínimo 2 participantes');

        const pares = generarParesAleatorios();
        mostrarResultados(pares);

        DOM.lista.style.display = 'none';
        DOM.resultado.style.display = 'block';

    } catch (error) {
        alert(error.message === 'Mínimo 2 participantes'
            ? '¡Necesitas al menos 2 participantes!'
            : 'Error al generar los pares');
    }
}

function sortearUno() {
    try {
        if (participantes.length < 1) throw new Error('Mínimo 1 participante');

        const ganador = participantes[Math.floor(Math.random() * participantes.length)];
        mostrarResultados({
            '¡El ganador es!': ganador
        }); // Mostrar ganador único

        DOM.lista.style.display = 'none';
        DOM.resultado.style.display = 'block';

    } catch (error) {
        alert(error.message === 'Mínimo 1 participante'
            ? '¡Necesitas al menos 1 participante!'
            : 'Error al elegir ganador');
    }
}

// Función mejorada para evitar autoemparejamientos
function generarParesAleatorios() {
    const receivers = derangement(participantes);
    return Object.fromEntries(
        participantes.map((nombre, i) => [nombre, receivers[i]])
    );
}

// Derangement con límite de intentos
function derangement(arr) {
    if (arr.length < 2) return arr;

    let deranged;
    let intentos = 0;
    const maxIntentos = 5;

    do {
        deranged = mezclarArray([...arr]);
        intentos++;
    } while (!esDerangementValido(arr, deranged) && intentos < maxIntentos);

    if (intentos >= maxIntentos) throw new Error('No se pudo generar emparejamientos');

    return deranged;
}

function esDerangementValido(original, deranged) {
    return original.every((nombre, index) => nombre !== deranged[index]);
}

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
    resultado.innerHTML = Object.entries(pares)
        .map(([dador, receptor]) => `
            <li class="result-item">
                ${dador} ➔ ${receptor}
            </li>
        `).join('');
}

// Event listener mejorado para Enter
DOM.input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        agregarAmigo();
    }
});