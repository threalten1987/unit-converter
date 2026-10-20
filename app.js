/**
 * Conversor de Unidades - Core Application Logic
 * Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Data Definitions & Unit Schema
  // ==========================================
  const CATEGORIES = {
    length: {
      name: 'Longitud',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      baseUnit: 'm',
      units: {
        mm: { name: 'Milímetros (mm)', factor: 0.001 },
        cm: { name: 'Centímetros (cm)', factor: 0.01 },
        m: { name: 'Metros (m)', factor: 1 },
        km: { name: 'Kilómetros (km)', factor: 1000 },
        in: { name: 'Pulgadas (in)', factor: 0.0254 },
        ft: { name: 'Pies (ft)', factor: 0.3048 },
        yd: { name: 'Yardas (yd)', factor: 0.9144 },
        mi: { name: 'Millas (mi)', factor: 1609.344 },
        nmi: { name: 'Millas Náuticas (nmi)', factor: 1852 }
      }
    },
    mass: {
      name: 'Masa',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/></svg>`,
      baseUnit: 'kg',
      units: {
        mg: { name: 'Miligramos (mg)', factor: 0.000001 },
        g: { name: 'Gramos (g)', factor: 0.001 },
        kg: { name: 'Kilogramos (kg)', factor: 1 },
        t: { name: 'Toneladas (t)', factor: 1000 },
        oz: { name: 'Onzas (oz)', factor: 0.028349523125 },
        lb: { name: 'Libras (lb)', factor: 0.45359237 }
      }
    },
    temperature: {
      name: 'Temperatura',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>`,
      baseUnit: 'C',
      customConvert: true, // Manejo de fórmulas especiales
      units: {
        C: { name: 'Celsius (°C)' },
        F: { name: 'Fahrenheit (°F)' },
        K: { name: 'Kelvin (K)' }
      }
    },
    time: {
      name: 'Tiempo',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      baseUnit: 's',
      units: {
        ms: { name: 'Milisegundos (ms)', factor: 0.001 },
        s: { name: 'Segundos (s)', factor: 1 },
        min: { name: 'Minutos (min)', factor: 60 },
        h: { name: 'Horas (h)', factor: 3600 },
        d: { name: 'Días (d)', factor: 86400 },
        wk: { name: 'Semanas (wk)', factor: 604800 },
        mo: { name: 'Meses (30 días)', factor: 2592000 },
        yr: { name: 'Años (365 días)', factor: 31536000 }
      }
    },
    volume: {
      name: 'Volumen',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
      baseUnit: 'l',
      units: {
        ml: { name: 'Mililitros (mL)', factor: 0.001 },
        l: { name: 'Litros (L)', factor: 1 },
        m3: { name: 'Metros Cúbicos (m³)', factor: 1000 },
        floz: { name: 'Onzas Líquidas US (fl oz)', factor: 0.0295735 },
        cup: { name: 'Tazas US (cup)', factor: 0.24 },
        pt: { name: 'Pintas US (pt)', factor: 0.473176 },
        qt: { name: 'Cuartos US (qt)', factor: 0.946353 },
        gal: { name: 'Galones US (gal)', factor: 3.78541 }
      }
    },
    speed: {
      name: 'Velocidad',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m4.93 19.07 2.83-2.83"/><path d="M2 12h4"/><path d="m19.07 19.07-2.83-2.83"/><path d="M22 12h-4"/><path d="m16.24 7.76 2.83-2.83"/><path d="m7.76 7.76-2.83-2.83"/><circle cx="12" cy="12" r="3"/></svg>`,
      baseUnit: 'mps',
      units: {
        mps: { name: 'Metros/segundo (m/s)', factor: 1 },
        kmh: { name: 'Kilómetros/hora (km/h)', factor: 0.2777777777777778 },
        mph: { name: 'Millas/hora (mph)', factor: 0.44704 },
        kn: { name: 'Nudos (kn)', factor: 0.514444 }
      }
    },
    area: {
      name: 'Área',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V3"/></svg>`,
      baseUnit: 'sqm',
      units: {
        sqcm: { name: 'Centímetros cuadrados (cm²)', factor: 0.0001 },
        sqm: { name: 'Metros cuadrados (m²)', factor: 1 },
        sqkm: { name: 'Kilómetros cuadrados (km²)', factor: 1000000 },
        ha: { name: 'Hectáreas (ha)', factor: 10000 },
        ac: { name: 'Acres (ac)', factor: 4046.8564224 },
        sqft: { name: 'Pies cuadrados (ft²)', factor: 0.09290304 },
        sqin: { name: 'Pulgadas cuadradas (in²)', factor: 0.00064516 }
      }
    },
    data: {
      name: 'Datos',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="14" rx="2"/><rect width="20" height="8" x="2" y="2" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
      baseUnit: 'B',
      units: {
        B: { name: 'Bytes (B)', factor: 1 },
        KB: { name: 'Kilobytes (KB)', factor: 1024 },
        MB: { name: 'Megabytes (MB)', factor: 1048576 },
        GB: { name: 'Gigabytes (GB)', factor: 1073741824 },
        TB: { name: 'Terabytes (TB)', factor: 1099511627776 }
      }
    }
  };

  // State
  let currentCategory = localStorage.getItem('unit_conv_category') || 'length';
  let history = JSON.parse(localStorage.getItem('unit_conv_history') || '[]');
  let historyTimeout = null;

  // DOM Elements
  const categoryGrid = document.getElementById('category-grid');
  const categorySelect = document.getElementById('category-select');
  const fromValueInput = document.getElementById('from-value');
  const fromUnitSelect = document.getElementById('from-unit');
  const toValueInput = document.getElementById('to-value');
  const toUnitSelect = document.getElementById('to-unit');
  const swapBtn = document.getElementById('swap-btn');
  const copyBtn = document.getElementById('copy-btn');
  const copyTooltip = document.getElementById('copy-tooltip');
  const formulaText = document.getElementById('formula-text');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history-btn');

  // ==========================================
  // 2. Initialization & Category Rendering
  // ==========================================
  function init() {
    renderCategoryGrid();
    setCategory(currentCategory);
    renderHistory();

    // Event Listeners
    fromValueInput.addEventListener('input', handleInputChange);
    fromUnitSelect.addEventListener('change', handleUnitChange);
    toUnitSelect.addEventListener('change', handleUnitChange);
    swapBtn.addEventListener('click', handleSwap);
    copyBtn.addEventListener('click', handleCopy);
    clearHistoryBtn.addEventListener('click', handleClearHistory);
  }

  function renderCategoryGrid() {
    categoryGrid.innerHTML = '';
    categorySelect.innerHTML = '';

    Object.keys(CATEGORIES).forEach(catKey => {
      const cat = CATEGORIES[catKey];

      // Native select option (accessibility fallback)
      const option = document.createElement('option');
      option.value = catKey;
      option.textContent = cat.name;
      categorySelect.appendChild(option);

      // Custom button for responsive grid UI
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `category-btn ${catKey === currentCategory ? 'active' : ''}`;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', catKey === currentCategory ? 'true' : 'false');
      btn.innerHTML = `${cat.icon} <span>${cat.name}</span>`;

      btn.addEventListener('click', () => {
        setCategory(catKey);
      });

      categoryGrid.appendChild(btn);
    });

    categorySelect.addEventListener('change', (e) => {
      setCategory(e.target.value);
    });
  }

  function setCategory(catKey) {
    if (!CATEGORIES[catKey]) catKey = 'length';
    currentCategory = catKey;
    localStorage.setItem('unit_conv_category', catKey);

    // Update Category UI states
    const buttons = categoryGrid.querySelectorAll('.category-btn');
    buttons.forEach((btn, index) => {
      const isCurrent = Object.keys(CATEGORIES)[index] === catKey;
      btn.classList.toggle('active', isCurrent);
      btn.setAttribute('aria-checked', isCurrent ? 'true' : 'false');
    });
    categorySelect.value = catKey;

    // Populate Unit Dropdowns
    populateUnits(catKey);
    convert();
  }

  function populateUnits(catKey) {
    const units = CATEGORIES[catKey].units;
    const unitKeys = Object.keys(units);

    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';

    unitKeys.forEach(uKey => {
      const u = units[uKey];
      
      const optFrom = document.createElement('option');
      optFrom.value = uKey;
      optFrom.textContent = u.name;
      fromUnitSelect.appendChild(optFrom);

      const optTo = document.createElement('option');
      optTo.value = uKey;
      optTo.textContent = u.name;
      toUnitSelect.appendChild(optTo);
    });

    // Default select first and second unit if available
    fromUnitSelect.value = unitKeys[0];
    toUnitSelect.value = unitKeys[1] || unitKeys[0];
  }

  // ==========================================
  // 3. Conversion Logic
  // ==========================================
  function convert() {
    const rawVal = fromValueInput.value;
    if (rawVal === '' || isNaN(rawVal)) {
      toValueInput.value = '';
      formulaText.textContent = 'Ingresa un valor numérico válido';
      return;
    }

    const val = parseFloat(rawVal);
    const fromU = fromUnitSelect.value;
    const toU = toUnitSelect.value;
    const cat = CATEGORIES[currentCategory];

    let result = 0;

    if (cat.customConvert && currentCategory === 'temperature') {
      result = convertTemperature(val, fromU, toU);
    } else {
      const fromFactor = cat.units[fromU].factor;
      const toFactor = cat.units[toU].factor;
      const baseValue = val * fromFactor;
      result = baseValue / toFactor;
    }

    const formattedResult = formatNumber(result);
    toValueInput.value = formattedResult;

    // Update Formula Card
    updateFormulaText(val, fromU, toU, result);

    // Queue history item
    debounceAddToHistory(val, fromU, formattedResult, toU);
  }

  function convertTemperature(val, from, to) {
    if (from === to) return val;

    // First convert to Celsius
    let celsius = val;
    if (from === 'F') {
      celsius = (val - 32) * (5 / 9);
    } else if (from === 'K') {
      celsius = val - 273.15;
    }

    // Convert Celsius to Target
    if (to === 'C') return celsius;
    if (to === 'F') return (celsius * (9 / 5)) + 32;
    if (to === 'K') return celsius + 273.15;

    return val;
  }

  function formatNumber(num) {
    if (num === 0) return '0';
    
    // Avoid floating point inaccuracies like 1.0000000000000002
    const precision = 8;
    const rounded = Number(Math.round(num + 'e' + precision) + 'e-' + precision);
    
    // Format large or small numbers neatly
    if (Math.abs(rounded) >= 1e9 || (Math.abs(rounded) < 1e-4 && rounded !== 0)) {
      return rounded.toExponential(4);
    }

    return rounded.toLocaleString('es-ES', { maximumFractionDigits: 8 });
  }

  function updateFormulaText(val, fromU, toU, result) {
    const cat = CATEGORIES[currentCategory];
    const fromName = cat.units[fromU].name;
    const toName = cat.units[toU].name;

    if (fromU === toU) {
      formulaText.textContent = `Ambas unidades son idénticas (${fromName})`;
      return;
    }

    if (currentCategory === 'temperature') {
      if (fromU === 'C' && toU === 'F') formulaText.textContent = `°F = (°C × 9/5) + 32`;
      else if (fromU === 'F' && toU === 'C') formulaText.textContent = `°C = (°F − 32) × 5/9`;
      else if (fromU === 'C' && toU === 'K') formulaText.textContent = `K = °C + 273.15`;
      else if (fromU === 'K' && toU === 'C') formulaText.textContent = `°C = K − 273.15`;
      else if (fromU === 'F' && toU === 'K') formulaText.textContent = `K = (°F − 32) × 5/9 + 273.15`;
      else if (fromU === 'K' && toU === 'F') formulaText.textContent = `°F = (K − 273.15) × 9/5 + 32`;
    } else {
      // Standard factor formula
      const ratio = cat.units[fromU].factor / cat.units[toU].factor;
      const formattedRatio = formatNumber(ratio);
      formulaText.textContent = `1 ${fromName.split(' ')[0]} = ${formattedRatio} ${toName.split(' ')[0]}`;
    }
  }

  // ==========================================
  // 4. Handlers & Micro-Interactions
  // ==========================================
  function handleInputChange() {
    convert();
  }

  function handleUnitChange() {
    convert();
  }

  function handleSwap() {
    const temp = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = temp;
    convert();
  }

  function handleCopy() {
    const textToCopy = toValueInput.value;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      copyTooltip.classList.add('show');
      setTimeout(() => {
        copyTooltip.classList.remove('show');
      }, 1800);
    }).catch(err => {
      console.error('Error al copiar al portapapeles: ', err);
    });
  }

  // ==========================================
  // 5. History Storage & Rendering
  // ==========================================
  function debounceAddToHistory(val, fromU, resStr, toU) {
    clearTimeout(historyTimeout);
    historyTimeout = setTimeout(() => {
      addToHistory(val, fromU, resStr, toU);
    }, 1200);
  }

  function addToHistory(val, fromU, resStr, toU) {
    if (!val || isNaN(val)) return;

    const cat = CATEGORIES[currentCategory];
    const item = {
      id: Date.now(),
      category: cat.name,
      fromText: `${formatNumber(val)} ${fromU}`,
      toText: `${resStr} ${toU}`
    };

    // Prevent consecutive duplicate entries
    if (history.length > 0) {
      const last = history[0];
      if (last.fromText === item.fromText && last.toText === item.toText) return;
    }

    history.unshift(item);
    if (history.length > 10) history.pop();

    localStorage.setItem('unit_conv_history', JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    if (history.length === 0) {
      historyList.innerHTML = `<li class="history-empty">No hay conversiones recientes</li>`;
      return;
    }

    historyList.innerHTML = history.map(item => `
      <li class="history-item">
        <span>${item.category}: ${item.fromText}</span>
        <span class="history-item-value">&rarr; ${item.toText}</span>
      </li>
    `).join('');
  }

  function handleClearHistory() {
    history = [];
    localStorage.removeItem('unit_conv_history');
    renderHistory();
  }

  // Run App
  init();
});
