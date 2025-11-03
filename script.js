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

    // Formulario de Ajuste Basal
    const formularioAjusteBasal = document.getElementById('formularioAjusteBasal');
    const glucemiaAyunasInput = document.getElementById('glucemiaAyunas');
    const dosisBasalActualInput = document.getElementById('dosisBasalActual');
    const btnCalcularAjusteBasal = document.getElementById('btnCalcularAjusteBasal');
    const btnLimpiarAjusteBasal = document.getElementById('btnLimpiarAjusteBasal');
    const resultadosAjusteBasalSection = document.getElementById('resultados-ajuste-basal');
    const contenidoResultadosAjusteBasal = document.getElementById('contenidoResultadosAjusteBasal');

    // Formulario de Ajuste Prandial
    const formularioAjustePrandial = document.getElementById('formularioAjustePrandial');
    const comidaAjusteSelect = document.getElementById('comidaAjuste');
    const glucemiaPostComidaInput = document.getElementById('glucemiaPostComida');
    const dosisBoloActualInput = document.getElementById('dosisBoloActual');
    const btnCalcularAjustePrandial = document.getElementById('btnCalcularAjustePrandial');
    const btnLimpiarAjustePrandial = document.getElementById('btnLimpiarAjustePrandial');
    const resultadosAjustePrandialSection = document.getElementById('resultados-ajuste-prandial');
    const contenidoResultadosAjustePrandial = document.getElementById('contenidoResultadosAjustePrandial');


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
        
        // Aplicamos Math.round() para redondear al número entero más cercano
        const dosisBasal = Math.round(0.5 * tdd);
        const dosisPrandialTotal = Math.round(0.5 * tdd);
        const dosisPorComida = Math.round(dosisPrandialTotal / 3);

        contenidoResultadosDosis.innerHTML = `
            <p><strong>Dosis Total Diaria (TDD) de referencia:</strong> ${tdd.toFixed(1)} U</p>
            <p><strong>Dosis Basal a formular:</strong> ${dosisBasal} U</p>
            <p><strong>Dosis Prandial Total a formular:</strong> ${dosisPrandialTotal} U</p>
            <hr>
            <h3>Dosis por Comida (Bolo):</h3>
            <p style="font-size: 24px; color: var(--primary-color); font-weight: bold;">
                ${dosisPorComida} U antes de cada comida (desayuno, almuerzo, cena)
            </p>
        `;
        
        resultadosDosisSection.classList.remove('hidden');
    }

    // Función para calcular ajuste basal (Basado en ADA 2025)
    function calcularAjusteBasal() {
        const glucemia = parseInt(glucemiaAyunasInput.value);
        const dosisActual = parseInt(dosisBasalActualInput.value);

        if (!glucemia || !dosisActual) {
            alert('Por favor, completa todos los campos para el ajuste basal.');
            return;
        }

        let ajuste = 0;
        let recomendacion = '';
        const objetivoMin = 80;
        const objetivoMax = 130;

        if (glucemia < 70) { // Hipoglucemia
            ajuste = -Math.max(2, Math.round(dosisActual * 0.10));
            recomendacion = 'Hipoglucemia. Reducir dosis basal.';
        } else if (glucemia >= objetivoMin && glucemia <= objetivoMax) {
            ajuste = 0;
            recomendacion = 'Glucemia en meta. Mantener dosis basal.';
        } else if (glucemia > objetivoMax) {
            ajuste = Math.max(2, Math.round(dosisActual * 0.10));
            recomendacion = 'Glucemia por encima de la meta. Aumentar dosis basal.';
        }

        const nuevaDosis = dosisActual + ajuste;
        const dosisFinal = nuevaDosis > 0 ? nuevaDosis : 0;

        contenidoResultadosAjusteBasal.innerHTML = `
            <p><strong>Análisis:</strong> ${recomendacion}</p>
            <p><strong>Ajuste sugerido:</strong> ${ajuste > 0 ? '+' : ''}${ajuste} U (aprox. 10% de la dosis, min 2U)</p>
            <hr>
            <h3>Nueva Dosis Basal Sugerida:</h3>
            <p style="font-size: 24px; color: var(--primary-color); font-weight: bold;">
                ${dosisFinal} U
            </p>
        `;
        resultadosAjusteBasalSection.classList.remove('hidden');
    }

    // Función para calcular ajuste prandial (Basado en ADA 2025)
    function calcularAjustePrandial() {
        const comida = comidaAjusteSelect.value;
        const glucemia = parseInt(glucemiaPostComidaInput.value);
        const dosisActual = parseInt(dosisBoloActualInput.value);

        if (!comida || !glucemia || !dosisActual) {
            alert('Por favor, completa todos los campos para el ajuste prandial.');
            return;
        }

        let ajuste = 0;
        let recomendacion = '';
        const objetivoMax = 180;

        if (glucemia < 70) { // Hipoglucemia
            ajuste = -Math.max(1, Math.round(dosisActual * 0.10));
            recomendacion = `Hipoglucemia post-${comida.toLowerCase()}. Reducir bolo de ${comida}.`;
        } else if (glucemia < objetivoMax) {
            ajuste = 0;
            recomendacion = `Glucemia post-${comida.toLowerCase()} en meta. Mantener bolo.`;
        } else if (glucemia >= objetivoMax) {
            ajuste = Math.max(1, Math.round(dosisActual * 0.10));
            recomendacion = `Glucemia post-${comida.toLowerCase()} por encima de la meta. Aumentar bolo de ${comida}.`;
        }

        const nuevaDosis = dosisActual + ajuste;
        const dosisFinal = nuevaDosis > 0 ? nuevaDosis : 0;

        contenidoResultadosAjustePrandial.innerHTML = `
            <p><strong>Análisis:</strong> ${recomendacion}</p>
            <p><strong>Ajuste sugerido:</strong> ${ajuste > 0 ? '+' : ''}${ajuste} U (aprox. 10% de la dosis, min 1U)</p>
            <hr>
            <h3>Nuevo Bolo Sugerido para ${comida}:</h3>
            <p style="font-size: 24px; color: var(--primary-color); font-weight: bold;">
                ${dosisFinal} U
            </p>
        `;
        resultadosAjustePrandialSection.classList.remove('hidden');
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

    function limpiarAjusteBasal() {
        formularioAjusteBasal.reset();
        resultadosAjusteBasalSection.classList.add('hidden');
    }

    function limpiarAjustePrandial() {
        formularioAjustePrandial.reset();
        resultadosAjustePrandialSection.classList.add('hidden');
    }

    // --- EVENT LISTENERS ---
    btnCalcular.addEventListener('click', calcular);
    btnLimpiar.addEventListener('click', limpiar);
    btnCalcularDosis.addEventListener('click', calcularDosisIniciales);
    btnLimpiarDosis.addEventListener('click', limpiarDosis);
    
    // Nuevos listeners para los ajustes
    btnCalcularAjusteBasal.addEventListener('click', calcularAjusteBasal);
    btnLimpiarAjusteBasal.addEventListener('click', limpiarAjusteBasal);
    btnCalcularAjustePrandial.addEventListener('click', calcularAjustePrandial);
    btnLimpiarAjustePrandial.addEventListener('click', limpiarAjustePrandial);

    // --- INICIALIZACIÓN ---
    populateInsulinDropdown();

});