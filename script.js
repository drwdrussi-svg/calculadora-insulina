document.addEventListener('DOMContentLoaded', () => {

    // --- BASE DE DATOS DE INSULINAS COMERCIALIZADAS EN COLOMBIA (EN ESFEROS/PLUMONES) ---
    const insulinas = {
        // SANOFI
        "Lantus Solostar (Glargina) - 100U/mL (plumón 3mL)": 300,
        "Toujeo Solostar (Glargina) - 300U/mL (plumón 1.5mL)": 450,
        "Apidra Solostar (Glulisina) - 100U/mL (plumón 3mL)": 300,

        // NOVO NORDISK
        "NovoRapid FlexPen (Aspart) - 100U/mL (plumón 3mL)": 300,
        "NovoMix 30 FlexPen (Bifásica) - 100U/mL (plumón 3mL)": 300,
        "Tresiba FlexPen (Degludec) - 100U/mL (plumón 3mL)": 300,
        "Tresiba FlexPen (Degludec) - 200U/mL (plumón 3mL)": 600,
        "Levemir FlexPen (Detemir) - 100U/mL (plumón 3mL)": 300,

        // ELI LILLY
        "Humalog KwikPen (Lispro) - 100U/mL (plumón 3mL)": 300,

        // BIOCOSUR (Laboratorio Nacional)
        "Bioglarina Pen (Glargina) - 100U/mL (plumón 3mL)": 300,
        "Biolispro Pen (Lispro) - 100U/mL (plumón 3mL)": 300,
    };

    // --- REFERENCIAS A ELEMENTOS DEL DOM ---
    // Formulario de Esferos
    const formularioInsulina = document.getElementById('formularioInsulina');
    const tipoInsulinaSelect = document.getElementById('tipoInsulina');
    const dosisInput = document.getElementById('dosisUnidades');
    const inyeccionesInput = document.getElementById('inyeccionesDia');
    const mesesInput = document.getElementById('mesesFormulacion');
    const btnCalcular = document.getElementById('btnCalcular');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const resultadosSection = document.getElementById('resultados');
    const contenidoResultados = document.getElementById('contenidoResultados');

    // Formulario de Dosis
    const formularioDosis = document.getElementById('formularioDosis');
    const pesoInput = document.getElementById('pesoPaciente');
    const factorTotalInput = document.getElementById('factorTotal');
    const btnCalcularDosis = document.getElementById('btnCalcularDosis');
    const btnLimpiarDosis = document.getElementById('btnLimpiarDosis');
    const resultadosDosisSection = document.getElementById('resultados-dosis');
    const contenidoResultadosDosis = document.getElementById('contenidoResultadosDosis');


    // --- FUNCIONES ---
    function populateInsulinDropdown() {
        tipoInsulinaSelect.innerHTML = '<option value="">-- Selecciona una insulina --</option>';
        for (const key in insulinas) {
            const option = document.createElement('option');
            option.value = insulinas[key];
            option.textContent = key;
            tipoInsulinaSelect.appendChild(option);
        }
    }

    // Función para calcular esferos
    function calcular() {
        const tipoInsulinaText = tipoInsulinaSelect.options[tipoInsulinaSelect.selectedIndex].text;
        const unidadesPorEsfero = parseInt(tipoInsulinaSelect.value);
        const dosisPorInyeccion = parseInt(dosisInput.value);
        const inyeccionesPorDia = parseInt(inyeccionesInput.value);
        const meses = parseInt(mesesInput.value);

        if (!unidadesPorEsfero || !dosisPorInyeccion || !inyeccionesPorDia || !meses) {
            alert('Por favor, completa todos los campos con valores válidos.');
            return;
        }

        const diasPorMes = 30;
        const dosisTotalDiaria = dosisPorInyeccion * inyeccionesPorDia;
        const unidadesTotales = dosisTotalDiaria * diasPorMes * meses;
        const cantidadEsferos = Math.ceil(unidadesTotales / unidadesPorEsfero);

        contenidoResultados.innerHTML = `
            <p><strong>Insulina seleccionada:</strong> ${tipoInsulinaText}</p>
            <p><strong>Dosis total diaria:</strong> ${dosisTotalDiaria} unidades.</p>
            <p><strong>Total de unidades requeridas para ${meses} mes(es):</strong> ${unidadesTotales} unidades.</p>
            <hr>
            <h3>Cantidad a Formular:</h3>
            <p style="font-size: 24px; color: var(--primary-color); font-weight: bold;">
                ${cantidadEsferos} esfero(s) de ${tipoInsulinaText}
            </p>
        `;
        
        resultadosSection.classList.remove('hidden');
    }

    // Función para calcular dosis iniciales
    function calcularDosisIniciales() {
        const peso = parseFloat(pesoInput.value);
        const factorTotal = parseFloat(factorTotalInput.value);

        if (!peso || !factorTotal) {
            alert('Por favor, completa todos los campos para calcular la dosis.');
            return;
        }

        const tdd = peso * factorTotal;
        const dosisBasal = 0.5 * tdd;
        const dosisPrandialTotal = 0.5 * tdd;
        const dosisPorComida = dosisPrandialTotal / 3;

        contenidoResultadosDosis.innerHTML = `
            <p><strong>Dosis Total Diaria (TDD):</strong> ${tdd.toFixed(1)} U</p>
            <p><strong>Dosis Basal:</strong> ${dosisBasal.toFixed(1)} U (aproximadamente)</p>
            <p><strong>Dosis Prandial Total:</strong> ${dosisPrandialTotal.toFixed(1)} U</p>
            <hr>
            <h3>Dosis por Comida (Bolo):</h3>
            <p style="font-size: 24px; color: var(--primary-color); font-weight: bold;">
                ${dosisPorComida.toFixed(1)} U antes de cada comida (desayuno, almuerzo, cena)
            </p>
        `;
        
        resultadosDosisSection.classList.remove('hidden');
    }

    // Funciones para limpiar
    function limpiar() {
        formularioInsulina.reset();
        resultadosSection.classList.add('hidden');
    }

    function limpiarDosis() {
        formularioDosis.reset();
        resultadosDosisSection.classList.add('hidden');
    }

    // --- EVENT LISTENERS ---
    btnCalcular.addEventListener('click', calcular);
    btnLimpiar.addEventListener('click', limpiar);
    btnCalcularDosis.addEventListener('click', calcularDosisIniciales);
    btnLimpiarDosis.addEventListener('click', limpiarDosis);

    // --- INICIALIZACIÓN ---
    populateInsulinDropdown();

});