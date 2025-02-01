// Módulo de Estado
const State = (() => {
    let participantes = [];
    let modoClasico = true;
    return { participantes, modoClasico };
})();

// Módulo de Utilidades
const Utils = {
    DOM: {
        input: document.getElementById('amigo'),
        lista: document.getElementById('listaAmigos'),
        resultado: document.getElementById('resultado'),
        toggleModo: document.getElementById('toggleModo')
    },

    validaciones: {
        nombreValido: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s']+$/,
        capitalizar: nombre => nombre.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase()),

        sanitizarInput: function (e) {
            e.target.value = e.target.value
                .replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s']/g, '')
                .replace(/\s{2,}/g, ' ')
                .trimStart();
        }
    }
};

// Módulo de Operaciones
const App = {
    init() {
        Utils.DOM.input.addEventListener('input', Utils.validaciones.sanitizarInput);
        Utils.DOM.input.addEventListener('keypress', e => e.key === 'Enter' && this.agregarAmigo());
    },

    agregarAmigo() {
        try {
            const nombre = Utils.validaciones.capitalizar(Utils.DOM.input.value.trim());

            if (!nombre) throw new Error('Nombre vacío');
            if (!Utils.validaciones.nombreValido.test(nombre)) throw new Error('Caracteres inválidos');
            if (State.participantes.includes(nombre)) throw this.generarErrorDuplicado(nombre);

            State.participantes.push(nombre);
            this.actualizarUI();
            Utils.DOM.input.value = '';

        } catch (error) {
            this.mostrarError(error.message);
        }
    },

    generarErrorDuplicado(nombre) {
        const base = nombre.split(' ')[0];
        const sugerencia = this.generarSugerencia(base);
        return new Error(`Nombre duplicado. ¿Quizás: ${sugerencia}?`);
    },

    generarSugerencia(base) {
        const similares = State.participantes.filter(n => n.startsWith(base));
        const numeros = similares.map(n => (n.match(/(\d+)$/) || [0])[1]);
        const maxNum = Math.max(...numeros);

        return numeros.length ? `${base} ${maxNum + 1}` : `${base} 2`;
    },

    eliminarParticipante(index) {
        State.participantes.splice(index, 1);
        this.actualizarUI();
        State.modoClasico && State.participantes.length < 2 && this.reiniciarSorteo();
    },

    sortearAmigo() {
        try {
            if (State.participantes.length < (State.modoClasico ? 2 : 1)) {
                throw new Error(State.modoClasico ? 'Mínimo 2 participantes' : 'Agrega al menos 1 participante');
            }

            const resultado = State.modoClasico
                ? this.generarPares()
                : this.obtenerGanadorUnico();

            this.mostrarResultado(resultado);

        } catch (error) {
            this.mostrarError(error.message);
        }
    },

    generarPares() {
        const shuffled = [...State.participantes].sort(() => Math.random() - 0.5);
        return State.participantes.reduce((acc, curr, i) => {
            acc[curr] = shuffled[i] === curr ? shuffled[(i + 1) % shuffled.length] : shuffled[i];
            return acc;
        }, {});
    },

    obtenerGanadorUnico() {
        return State.participantes[Math.floor(Math.random() * State.participantes.length)];
    },

    toggleModo() {
        State.modoClasico = !State.modoClasico;
        Utils.DOM.toggleModo.textContent = State.modoClasico ? 'Modo Clásico' : 'Modo Sorpresa';
        Utils.DOM.toggleModo.classList.toggle('modo-alternativo', !State.modoClasico);
        this.reiniciarSorteo();
    },

    actualizarUI() {
        Utils.DOM.lista.innerHTML = State.participantes
            .map((n, i) => `
                <li class="list-item">
                    ${n}
                    <button class="button-delete" onclick="App.eliminarParticipante(${i})">×</button>
                </li>`
            ).join('');

        Utils.DOM.lista.style.display = State.participantes.length ? 'block' : 'none';
    },

    mostrarResultado(data) {
        Utils.DOM.resultado.innerHTML = State.modoClasico
            ? Object.entries(data).map(([k, v]) => `<li>${k} ➔ ${v}</li>`).join('')
            : `<div class="resultado-unico">${data}</div>`;

        Utils.DOM.lista.style.display = 'none';
        Utils.DOM.resultado.style.display = 'block';
    },

    reiniciarSorteo() {
        Utils.DOM.resultado.style.display = 'none';
        Utils.DOM.lista.style.display = 'block';
    },

    mostrarError(mensaje) {
        const errorDiv = document.getElementById('errorMsg');
        errorDiv.textContent = mensaje;
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
    }
};

App.init();