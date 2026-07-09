// ==========================================
// 1. GENERACIÓN DINÁMICA DE LA INTERFAZ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    const modulesData = [
        { id: 'o1', name: 'Oscilador 1', isNoise: false, waveOpts: '<option value="sawtooth">Sierra</option><option value="square">Cuadrada</option><option value="sine">Seno</option><option value="triangle">Triángulo</option>', defVol: 0.5, defSemi: 0 },
        { id: 'o2', name: 'Oscilador 2', isNoise: false, waveOpts: '<option value="square">Cuadrada</option><option value="sawtooth">Sierra</option><option value="sine">Seno</option><option value="triangle">Triángulo</option>', defVol: 0.0, defSemi: -12 },
        { id: 'o3', name: 'Oscilador 3', isNoise: false, waveOpts: '<option value="sine">Seno</option><option value="square">Cuadrada</option><option value="sawtooth">Sierra</option><option value="triangle">Triángulo</option>', defVol: 0.0, defSemi: 7 },
        { id: 'n', name: 'Ruido', isNoise: true, waveOpts: '<option value="white">Blanco</option><option value="pink">Rosa</option>', defVol: 0.0, defSemi: 0 }
    ];

    const rack = document.getElementById('synth-rack');
    rack.innerHTML = ''; // Limpiar rack antes de inyectar
    
    modulesData.forEach(m => {
        // Determinar el sufijo numérico correcto para las etiquetas de las pestañas
        const labelNum = m.isNoise ? 'N' : m.id.replace('o', '');

        rack.innerHTML += `
        <div class="module ${m.isNoise ? 'noise' : ''}" data-module="${m.id}">
            <div class="module-header">
                <h3>${m.name}</h3>
                <label class="switch-label"><input type="checkbox" id="${m.id}-active" checked> ON</label>
            </div>
            
            <div class="module-tabs">
                <button type="button" class="tab-btn active" data-tab="osc">OSC ${labelNum}</button>
                <button type="button" class="tab-btn" data-tab="adsr">ADSR ${labelNum}</button>
                <button type="button" class="tab-btn" data-tab="fx">FX ${labelNum}</button>
                <button type="button" class="tab-btn" data-tab="lfo">LFO ${labelNum}</button>
            </div>

            <div class="tab-panel" id="panel-${m.id}-osc">
                <label>Tipo: <select id="${m.id}-type">${m.waveOpts}</select></label>
                <label>Volumen (<span class="val">${m.defVol}</span>) <input type="range" id="${m.id}-vol" min="0" max="1" step="0.01" value="${m.defVol}"></label>
                ${!m.isNoise ? `
                <label>Semitonos (<span class="val">${m.defSemi}</span>) <input type="range" id="${m.id}-semi" min="-24" max="24" step="1" value="${m.defSemi}"></label>
                <label>Centésimas (<span class="val">0</span>) <input type="range" id="${m.id}-cents" min="-50" max="50" step="1" value="0"></label>
                ` : ''}
                <label>Filtro LP (<span class="val">20000</span>Hz) <input type="range" id="${m.id}-lp" min="20" max="20000" step="1" value="20000"></label>
                <label>Filtro HP (<span class="val">20</span>Hz) <input type="range" id="${m.id}-hp" min="20" max="20000" step="1" value="20"></label>
            </div>

            <div class="tab-panel hidden" id="panel-${m.id}-adsr">
                <h4>Envolvente ADSR</h4>
                <label>A (<span class="val">0.05</span>s) <input type="range" id="${m.id}-a" min="0.01" max="2" step="0.01" value="0.05"></label>
                <label>D (<span class="val">0.3</span>s) <input type="range" id="${m.id}-d" min="0.01" max="2" step="0.01" value="0.3"></label>
                <label>S (<span class="val">0.5</span>) <input type="range" id="${m.id}-s" min="0" max="1" step="0.01" value="0.5"></label>
                <label>R (<span class="val">0.5</span>s) <input type="range" id="${m.id}-r" min="0.01" max="3" step="0.01" value="0.5"></label>
            </div>
            
            <div class="tab-panel hidden" id="panel-${m.id}-fx">
                <div class="fx-tabs">
                    <button type="button" class="fx-tab-btn active" data-fxtab="rev">Reverb</button>
                    <button type="button" class="fx-tab-btn" data-fxtab="dly">Delay</button>
                    <button type="button" class="fx-tab-btn" data-fxtab="phs">Phaser</button>
                    <button type="button" class="fx-tab-btn" data-fxtab="flg">Flanger</button>
                    <button type="button" class="fx-tab-btn" data-fxtab="od">OD</button>
                </div>
                
                <div class="fx-panel" id="fx-${m.id}-rev">
                    <label>Tipo: <select id="${m.id}-rev-typ"><option value="hall">Hall</option><option value="plate">Plate</option><option value="room">Room</option><option value="ambience">Ambience</option><option value="spring">Spring</option></select></label>
                    <label>Time (<span class="val">2</span>s) <input type="range" id="${m.id}-rev-tm" min="0.1" max="10" step="0.1" value="2"></label>
                    <label>Pre-Delay (<span class="val">0</span>s) <input type="range" id="${m.id}-rev-pd" min="0" max="0.2" step="0.01" value="0"></label>
                    <label>Low Cut (<span class="val">100</span>Hz) <input type="range" id="${m.id}-rev-lc" min="20" max="1000" step="10" value="100"></label>
                    <label>High Cut (<span class="val">10000</span>Hz) <input type="range" id="${m.id}-rev-hc" min="1000" max="20000" step="100" value="10000"></label>
                    <label>Mix (<span class="val">0</span>) <input type="range" id="${m.id}-rev-mix" min="0" max="1" step="0.01" value="0"></label>
                </div>

                <div class="fx-panel hidden" id="fx-${m.id}-dly">
                    <label>Tipo: <select id="${m.id}-dly-typ"><option value="mono">Mono</option><option value="stereo">Stereo</option><option value="pan">Pan</option></select></label>
                    <label>Time (<span class="val">0.33</span>s) <input type="range" id="${m.id}-dly-tm" min="0.01" max="2" step="0.01" value="0.33"></label>
                    <label>Feedback (<span class="val">0.4</span>) <input type="range" id="${m.id}-dly-fb" min="0" max="0.95" step="0.01" value="0.4"></label>
                    <label>High Cut (<span class="val">5000</span>Hz) <input type="range" id="${m.id}-dly-hc" min="500" max="20000" step="100" value="5000"></label>
                    <label>Mix (<span class="val">0</span>) <input type="range" id="${m.id}-dly-mix" min="0" max="1" step="0.01" value="0"></label>
                </div>

                <div class="fx-panel hidden" id="fx-${m.id}-phs">
                    <label>Rate (<span class="val">1</span>Hz) <input type="range" id="${m.id}-phs-rt" min="0.1" max="10" step="0.1" value="1"></label>
                    <label>Depth (<span class="val">800</span>) <input type="range" id="${m.id}-phs-dp" min="100" max="2000" step="10" value="800"></label>
                    <label>Feedback (<span class="val">0.5</span>) <input type="range" id="${m.id}-phs-fb" min="0" max="0.9" step="0.01" value="0.5"></label>
                    <label>Mix (<span class="val">0</span>) <input type="range" id="${m.id}-phs-mix" min="0" max="1" step="0.01" value="0"></label>
                </div>

                <div class="fx-panel hidden" id="fx-${m.id}-flg">
                    <label>Rate (<span class="val">0.5</span>Hz) <input type="range" id="${m.id}-flg-rt" min="0.1" max="5" step="0.1" value="0.5"></label>
                    <label>Depth (<span class="val">0.003</span>) <input type="range" id="${m.id}-flg-dp" min="0.001" max="0.01" step="0.001" value="0.003"></label>
                    <label>Feedback (<span class="val">0.5</span>) <input type="range" id="${m.id}-flg-fb" min="0" max="0.9" step="0.01" value="0.5"></label>
                    <label>Mix (<span class="val">0</span>) <input type="range" id="${m.id}-flg-mix" min="0" max="1" step="0.01" value="0"></label>
                </div>

                <div class="fx-panel hidden" id="fx-${m.id}-od">
                    <label>Saturación (<span class="val">0</span>) <input type="range" id="${m.id}-od-drv" min="0" max="100" step="1" value="0"></label>
                    <label>Mix (<span class="val">0</span>) <input type="range" id="${m.id}-od-mix" min="0" max="1" step="0.01" value="0"></label>
                </div>
            </div>

            <div class="tab-panel hidden" id="panel-${m.id}-lfo">
                <h4>LFO</h4>
                <label>Destino: <select id="${m.id}-lfo-tgt"><option value="none">Off</option>${!m.isNoise ? '<option value="pitch">Pitch</option>' : ''}<option value="lp">Cutoff LP</option><option value="hp">Cutoff HP</option><option value="vol">Volumen</option><option value="pan">Paneo</option></select></label>
                <label>Rate (<span class="val">5</span>Hz) <input type="range" id="${m.id}-lfo-rt" min="0.1" max="20" step="0.1" value="5"></label>
                <label>Depth (<span class="val">50</span>) <input type="range" id="${m.id}-lfo-dp" min="0" max="100" step="1" value="50"></label>
            </div>
        </div>`;
    });

    // Controlador lógico unificado para Pestañas y Sub-Pestañas
    rack.addEventListener('click', (e) => {
        // Pestañas Principales
        if (e.target.classList.contains('tab-btn')) {
            const clickedTab = e.target;
            const moduleContainer = clickedTab.closest('.module');
            const moduleId = moduleContainer.dataset.module;
            const targetPanelType = clickedTab.dataset.tab;

            moduleContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            clickedTab.classList.add('active');

            moduleContainer.querySelectorAll('.tab-panel').forEach(panel => panel.classList.add('hidden'));
            const activePanel = moduleContainer.querySelector(`#panel-${moduleId}-${targetPanelType}`);
            if (activePanel) activePanel.classList.remove('hidden');
        }
        
        // Sub-Pestañas de Efectos
        if (e.target.classList.contains('fx-tab-btn')) {
            const clickedTab = e.target;
            const fxContainer = clickedTab.closest('.tab-panel');
            const moduleId = clickedTab.closest('.module').dataset.module;
            const targetFxType = clickedTab.dataset.fxtab;

            fxContainer.querySelectorAll('.fx-tab-btn').forEach(btn => btn.classList.remove('active'));
            clickedTab.classList.add('active');

            fxContainer.querySelectorAll('.fx-panel').forEach(panel => panel.classList.add('hidden'));
            fxContainer.querySelector(`#fx-${moduleId}-${targetFxType}`).classList.remove('hidden');
        }
    });
    
    const keyMap = [
        { char: 'z', note: 'C3', freq: 130.81, black: false }, { char: 's', note: 'C#3', freq: 138.59, black: true, offset: 30 },
        { char: 'x', note: 'D3', freq: 146.83, black: false }, { char: 'd', note: 'D#3', freq: 155.56, black: true, offset: 75 },
        { char: 'c', note: 'E3', freq: 164.81, black: false }, { char: 'v', note: 'F3', freq: 174.61, black: false },
        { char: 'g', note: 'F#3', freq: 185.00, black: true, offset: 165 }, { char: 'b', note: 'G3', freq: 196.00, black: false },
        { char: 'h', note: 'G#3', freq: 207.65, black: true, offset: 210 }, { char: 'n', note: 'A3', freq: 220.00, black: false },
        { char: 'j', note: 'A#3', freq: 233.08, black: true, offset: 255 }, { char: 'm', note: 'B3', freq: 246.94, black: false },
        { char: 'q', note: 'C4', freq: 261.63, black: false }, { char: '2', note: 'C#4', freq: 277.18, black: true, offset: 345 },
        { char: 'w', note: 'D4', freq: 293.66, black: false }, { char: '3', note: 'D#4', freq: 311.13, black: true, offset: 390 },
        { char: 'e', note: 'E4', freq: 329.63, black: false }, { char: 'r', note: 'F4', freq: 349.23, black: false },
        { char: '5', note: 'F#4', freq: 369.99, black: true, offset: 480 }, { char: 't', note: 'G4', freq: 392.00, black: false },
        { char: '6', note: 'G#4', freq: 415.30, black: true, offset: 525 }, { char: 'y', note: 'A4', freq: 440.00, black: false },
        { char: '7', note: 'A#4', freq: 466.16, black: true, offset: 570 }, { char: 'u', note: 'B4', freq: 493.88, black: false },
        { char: 'i', note: 'C5', freq: 523.25, black: false }
    ];

    document.getElementById('keyboard').innerHTML = keyMap.map(k => `
        <div class="key ${k.black ? 'black' : 'white'}" data-char="${k.char}" data-freq="${k.freq}" style="${k.black ? `left: ${k.offset}px;` : ''}">
            <span class="label">${k.note}</span><span class="bind">${k.char.toUpperCase()}</span>
        </div>
    `).join('');

// Actualizar textos de la interfaz dinámicamente
    document.addEventListener('input', e => {
        if (e.target.type === 'range') {
            const span = e.target.parentElement.querySelector('.val');
            if (span) span.innerText = e.target.value;
        }

        // Control del Volumen Maestro mejorado
        if (e.target.id === 'master-vol') {
            const masterVal = document.getElementById('master-vol-val');
            if (masterVal) masterVal.innerText = e.target.value;
            if (typeof masterGain !== 'undefined' && masterGain) {
                masterGain.gain.value = parseFloat(e.target.value);
            }
        }

        // Control en tiempo real de los parámetros hacia los buses y voces activas
        if (typeof audioCtx !== 'undefined' && audioCtx) {
            
            // 1. Actualizar buses (Efectos globales Delay, Reverb, etc)
            ['o1', 'o2', 'o3', 'n'].forEach(id => {
                if (e.target.id.startsWith(id) && busses && busses[id]) {
                    busses[id].update(getParams(id));
                }
            });

            // 2. Modulación en tiempo real de las notas sostenidas
            const now = audioCtx.currentTime;
            Object.values(activeVoices).forEach(chains => {
                chains.forEach(chain => {
                    // Verifica si el deslizador pertenece a este oscilador
                    if (e.target.id.startsWith(chain.prefix)) {
                        const p = getParams(chain.prefix);
                        
                        // Barrido de Filtros
                        if (chain.filterLP) chain.filterLP.frequency.setTargetAtTime(p.lp, now, 0.05);
                        if (chain.filterHP) chain.filterHP.frequency.setTargetAtTime(p.hp, now, 0.05);
                        
                        // Modificación de Tono (Semitonos y Centésimas)
                        if (!chain.isNoise && chain.source) {
                            const pitchShift = p.semi + (p.cents / 100);
                            chain.source.frequency.setTargetAtTime(chain.baseFreq * Math.pow(2, pitchShift / 12), now, 0.05);
                        }

                        // Modificación de LFO en vivo
                        if (chain.lfo) {
                            chain.lfo.frequency.setTargetAtTime(p.lfoRt, now, 0.05);
                            if (chain.lfoGain) {
                                let newDepth = 0;
                                if (p.lfoTgt === 'pitch') newDepth = p.lfoDp * 5;
                                else if (p.lfoTgt === 'lp') newDepth = p.lfoDp * 50;
                                else if (p.lfoTgt === 'hp') newDepth = p.lfoDp * 50;
                                else if (p.lfoTgt === 'vol') newDepth = p.lfoDp / 100;
                                else if (p.lfoTgt === 'pan') newDepth = p.lfoDp / 100;
                                chain.lfoGain.gain.setTargetAtTime(newDepth, now, 0.05);
                            }
                        }
                    }
                });
            });
        }
    });

  // ==========================================
    // 2. MOTOR DE AUDIO (WEB AUDIO API)
    // ==========================================
    let audioCtx, masterGain, analyser, whiteNoiseBuffer, pinkNoiseBuffer;
    let currentFundamentalFreq = 0;
    const activeVoices = {};
    const busses = {};

    const canvas = document.getElementById('rta-canvas');
    const canvasCtx = canvas.getContext('2d');
    const waveCanvas = document.getElementById('wave-canvas');
    const waveCtx = waveCanvas.getContext('2d');
    
    function drawVisualizers() {
        requestAnimationFrame(drawVisualizers);
        if(!analyser) return;

        const width = canvas.width;
        const height = canvas.height;
        const nyquist = audioCtx ? audioCtx.sampleRate / 2 : 24000;

        // ------------------------------------------------
        // PANTALLA 1: RTA LOGARÍTMICO (20 Hz - 20 kHz)
        // ------------------------------------------------
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = '#050505';
        canvasCtx.fillRect(0, 0, width, height);

        const fMin = 20;
        const fMax = 20000;
        const logFMin = Math.log10(fMin);
        const logFMax = Math.log10(fMax);

        // 1. Dibujar las barras con el estilo original (ajustadas a escala logarítmica)
        for (let i = 0; i < bufferLength; i++) {
            const freqCenter = (i * nyquist) / bufferLength;
            const freqNext = ((i + 1) * nyquist) / bufferLength;

            if (freqCenter < fMin || freqCenter > fMax) continue;

            // Mapear posiciones en el eje X
            const x = ((Math.log10(Math.max(fMin, freqCenter)) - logFMin) / (logFMax - logFMin)) * width;
            const xNext = ((Math.log10(Math.min(fMax, freqNext)) - logFMin) / (logFMax - logFMin)) * width;
            
            // Ancho de la barra, asegurando que no queden huecos feos
            const barW = Math.max(1, xNext - x - 0.2); 

            const barHeight = (dataArray[i] / 255) * height;
            canvasCtx.fillStyle = `rgb(${dataArray[i] + 50}, 210, 211)`;
            canvasCtx.fillRect(x, height - barHeight, barW, barHeight);
        }

        // 2. Escala vertical de Amplitud (dB)
        canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        canvasCtx.font = '10px monospace';
        canvasCtx.textAlign = 'left';
        const dbs = [0, -25, -50, -75];
        dbs.forEach(db => {
            const y = height - ((db + 100) / 100) * height;
            // Línea guía horizontal
            canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            canvasCtx.beginPath(); canvasCtx.moveTo(0, y); canvasCtx.lineTo(width, y); canvasCtx.stroke();
            // Texto dB
            canvasCtx.fillText(db + 'dB', 5, Math.max(10, y - 2));
        });

        // 3. Escala horizontal (31 bandas de 1/3 de Octava)
        const iso31Bands = [
            20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800,
            1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000
        ];
        
        canvasCtx.textAlign = 'center';
        canvasCtx.font = '9px monospace';
        iso31Bands.forEach((f, index) => {
            const x = ((Math.log10(f) - logFMin) / (logFMax - logFMin)) * width;
            
            // Línea guía vertical tenue
            canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            canvasCtx.beginPath(); canvasCtx.moveTo(x, 0); canvasCtx.lineTo(x, height); canvasCtx.stroke();

            // Alternar la altura del texto (zigzag) para evitar que se pisen
            const isTop = index % 2 === 0;
            const yText = isTop ? height - 16 : height - 4;
            
            let text = f >= 1000 ? (f / 1000) + 'k' : Math.round(f);
            
            // Dibujar fondo negro detrás del texto para que no se pierda entre las barras
            canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            const textWidth = canvasCtx.measureText(text).width;
            canvasCtx.fillRect(x - textWidth/2 - 2, yText - 8, textWidth + 4, 10);
            
            canvasCtx.fillStyle = '#ff9f43';
            canvasCtx.fillText(text, x, yText);
        });


        // ------------------------------------------------
        // PANTALLA 2: OSCILOSCOPIO (AUTO-GAIN Y TRIGGER)
        // ------------------------------------------------
        const waveBuffer = analyser.fftSize;
        const waveData = new Uint8Array(waveBuffer);
        analyser.getByteTimeDomainData(waveData);

        const wWidth = waveCanvas.width;
        const wHeight = waveCanvas.height;

        waveCtx.fillStyle = '#050505';
        waveCtx.fillRect(0, 0, wWidth, wHeight);

        // Cuadrícula básica
        waveCtx.lineWidth = 1;
        waveCtx.strokeStyle = 'rgba(51, 51, 51, 0.5)';
        waveCtx.beginPath(); waveCtx.moveTo(0, wHeight/2); waveCtx.lineTo(wWidth, wHeight/2); waveCtx.stroke();
        waveCtx.beginPath(); waveCtx.moveTo(wWidth/2, 0); waveCtx.lineTo(wWidth/2, wHeight); waveCtx.stroke();

        // 1. AUTO-GAIN: Encontrar la amplitud máxima para reescalar visualmente
        let minVal = 255, maxVal = 0;
        for(let i=0; i<waveBuffer; i++) {
            if(waveData[i] < minVal) minVal = waveData[i];
            if(waveData[i] > maxVal) maxVal = waveData[i];
        }
        let peak = Math.max(Math.abs(maxVal - 128), Math.abs(minVal - 128));
        
        // Multiplicador para que la onda siempre ocupe el 90% del lienzo
        let scaleY = peak === 0 ? 1 : ((wHeight / 2) * 0.9) / peak;

        // 2. TRIGGER DE ESTABILIZACIÓN: Encontrar el primer cruce por cero positivo
        let triggerIndex = 0;
        for (let i = 0; i < waveBuffer / 2; i++) {
            if (waveData[i] < 128 && waveData[i + 1] >= 128) {
                triggerIndex = i;
                break;
            }
        }

        // 3. RENDERIZADO: Dibujar la onda
        waveCtx.lineWidth = 2;
        waveCtx.strokeStyle = '#ff9f43';
        waveCtx.beginPath();

        // Ventana estática de dibujo para estabilizar acordes
        const muestrasADibujar = Math.floor(waveBuffer * 0.6); 
        const incrementoX = wWidth / muestrasADibujar;
        let xWave = 0;

        for (let i = 0; i < muestrasADibujar; i++) {
            const idxData = triggerIndex + i;
            if (idxData >= waveBuffer) break;

            const v = waveData[idxData] - 128; // Centrar el valor en 0
            const y = (wHeight / 2) - (v * scaleY); // Aplicar auto-escala e invertir Y

            if (i === 0) waveCtx.moveTo(xWave, y);
            else waveCtx.lineTo(xWave, y);
            
            xWave += incrementoX;
        }
        waveCtx.stroke();
    }
    // Ejecutar el nuevo bucle de animación unificado
    drawVisualizers();

    // Generador de Curva para Overdrive
    function makeDistortionCurve(amount) {
        const k = typeof amount === 'number' ? amount : 50,
            n_samples = 44100,
            curve = new Float32Array(n_samples),
            deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
            const x = i * 2 / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }

    // Generador Dinámico de Respuesta de Impulso para Reverb
    function createReverbIR(type, time) {
        if (!audioCtx) return null;
        const sampleRate = audioCtx.sampleRate;
        const length = Math.max(0.1, sampleRate * time); 
        const impulse = audioCtx.createBuffer(2, length, sampleRate);
        
        for (let i = 0; i < 2; i++) {
            const channel = impulse.getChannelData(i);
            for (let j = 0; j < length; j++) {
                let n = (Math.random() * 2 - 1); // Ruido blanco base
                
                // Algoritmos de emulación acústica por tipo
                if (type === 'spring') n *= Math.sin(j * 0.05) * Math.exp(-j / length * 10);
                else if (type === 'plate') n *= (Math.random() > 0.5 ? 1 : -1); 
                else if (type === 'room') n *= Math.exp(-j / (length * 0.5)); 
                
                // Envolvente general de decaimiento
                let env = Math.pow(1 - j / length, type === 'ambience' ? 4 : 2);
                channel[j] = n * env;
            }
        }
        return impulse;
    }

    function createNoiseBuffers() {
        const bufferSize = audioCtx.sampleRate * 2;
        whiteNoiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const whiteData = whiteNoiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) whiteData[i] = Math.random() * 2 - 1;

        pinkNoiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const pinkData = pinkNoiseBuffer.getChannelData(0);
        let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
        for (let i = 0; i < bufferSize; i++) {
            let w = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
            b2 = 0.96900 * b2 + w * 0.1538520; b3 = 0.86650 * b3 + w * 0.3104856;
            b4 = 0.55000 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.0168980;
            pinkData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
            b6 = w * 0.115926;
        }
    }

    // Creación Avanzada de Bus FX Maestro por Oscilador
    function createBus(id) {
        const input = audioCtx.createGain();
        const output = audioCtx.createGain();

        // Utilidad interna para crear ruteos Dry/Wet en serie (OD, Phaser, Flanger)
        function createInsertFx() {
            const inNode = audioCtx.createGain();
            const outNode = audioCtx.createGain();
            const dry = audioCtx.createGain();
            const wet = audioCtx.createGain();
            inNode.connect(dry).connect(outNode);
            return { in: inNode, out: outNode, dry, wet };
        }

        // --- EFECTOS EN SERIE (Insertos) ---
        // 1. Overdrive
        const odNode = createInsertFx();
        const drive = audioCtx.createWaveShaper();
        odNode.in.connect(drive).connect(odNode.wet).connect(odNode.out);
        input.connect(odNode.in);

        // 2. Phaser
        const phsNode = createInsertFx();
        const phaser = audioCtx.createBiquadFilter(); phaser.type = 'allpass';
        const pLfo = audioCtx.createOscillator(); pLfo.start();
        const pDepth = audioCtx.createGain();
        const phsFb = audioCtx.createGain();
        pLfo.connect(pDepth).connect(phaser.frequency);
        odNode.out.connect(phsNode.in).connect(phaser);
        phaser.connect(phsNode.wet).connect(phsNode.out);
        phaser.connect(phsFb).connect(phaser); // Bucle Feedback

        // 3. Flanger
        const flgNode = createInsertFx();
        const flanger = audioCtx.createDelay(0.02);
        const fLfo = audioCtx.createOscillator(); fLfo.start();
        const fDepth = audioCtx.createGain();
        const flgFb = audioCtx.createGain();
        fLfo.connect(fDepth).connect(flanger.delayTime);
        phsNode.out.connect(flgNode.in).connect(flanger);
        flanger.connect(flgNode.wet).connect(flgNode.out);
        flanger.connect(flgFb).connect(flanger); // Bucle Feedback
        
        flgNode.out.connect(output); // Salida del bloque en serie al master

        // --- EFECTOS EN PARALELO (Envíos) ---
        const sendNode = flgNode.out;

        // 4. Delay Multimodo
        const dlyIn = audioCtx.createGain();
        const dlyWet = audioCtx.createGain();
        const delayNode = audioCtx.createDelay(5.0);
        const dlyFb = audioCtx.createGain();
        const dlyHc = audioCtx.createBiquadFilter(); dlyHc.type = 'lowpass';
        const dlyPan = audioCtx.createStereoPanner();
        
        sendNode.connect(dlyIn).connect(delayNode);
        delayNode.connect(dlyHc).connect(dlyFb).connect(delayNode); // Filtro dentro del feedback
        delayNode.connect(dlyPan).connect(dlyWet).connect(output);

        // 5. Reverb Paramétrico
        const revIn = audioCtx.createGain();
        const revWet = audioCtx.createGain();
        const preDelay = audioCtx.createDelay(1.0);
        const revLc = audioCtx.createBiquadFilter(); revLc.type = 'highpass';
        const revHc = audioCtx.createBiquadFilter(); revHc.type = 'lowpass';
        const convolver = audioCtx.createConvolver();
        
        sendNode.connect(revIn).connect(preDelay).connect(revLc).connect(revHc).connect(convolver).connect(revWet).connect(output);

        // Memoria de estado para no regenerar el IR innecesariamente
        let currentRevState = { typ: '', tm: 0 };
        
        return {
            input,
            update: (p) => {
                // OD
                drive.curve = makeDistortionCurve(p.odDrv);
                odNode.wet.gain.value = p.odMix; odNode.dry.gain.value = 1 - p.odMix;
                
                // Phaser
                pLfo.frequency.value = p.phsRt; pDepth.gain.value = p.phsDp;
                phsFb.gain.value = p.phsFb;
                phsNode.wet.gain.value = p.phsMix; phsNode.dry.gain.value = 1 - p.phsMix;

                // Flanger
                fLfo.frequency.value = p.flgRt; fDepth.gain.value = p.flgDp;
                flgFb.gain.value = p.flgFb;
                flgNode.wet.gain.value = p.flgMix; flgNode.dry.gain.value = 1 - p.flgMix;

                // Delay
                delayNode.delayTime.value = p.dlyTm;
                dlyFb.gain.value = p.dlyFb;
                dlyHc.frequency.value = p.dlyHc;
                dlyWet.gain.value = p.dlyMix;
                if(p.dlyTyp === 'mono') dlyPan.pan.value = 0;
                else if(p.dlyTyp === 'stereo') dlyPan.pan.value = 0.5; // Apertura espacial
                else if(p.dlyTyp === 'pan') dlyPan.pan.value = -0.8; // Simulación asimétrica ping-pong
                
                // Reverb
                preDelay.delayTime.value = p.revPd;
                revLc.frequency.value = p.revLc;
                revHc.frequency.value = p.revHc;
                revWet.gain.value = p.revMix;

                // Regenerar el motor de Convolución únicamente si cambiaste el Tipo o el Tiempo
                if (p.revTyp !== currentRevState.typ || p.revTm !== currentRevState.tm) {
                    convolver.buffer = createReverbIR(p.revTyp, p.revTm);
                    currentRevState.typ = p.revTyp;
                    currentRevState.tm = p.revTm;
                }
            }
        };
    }

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioCtx.createGain();
            
            const masterSlider = document.getElementById('master-vol');
            masterGain.gain.value = masterSlider ? parseFloat(masterSlider.value) : 0.7; 
            
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 8192;
            
            masterGain.connect(analyser);
            analyser.connect(audioCtx.destination);
            
            createNoiseBuffers();
            audioCtx.reverbBuffer = createReverbIR();

            // Iniciar Buses FX
            ['o1', 'o2', 'o3', 'n'].forEach(id => {
                busses[id] = createBus(id);
                busses[id].update(getParams(id));
            });
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function getParams(prefix) {
        const getVal = (id, def) => { const el = document.getElementById(id); return el ? parseFloat(el.value) : def; };
        const getStr = (id, def) => { const el = document.getElementById(id); return el ? el.value : def; };
        
        return {
            active: document.getElementById(`${prefix}-active`)?.checked ?? true,
            type: getStr(`${prefix}-type`, 'sine'),
            vol: getVal(`${prefix}-vol`, 0),
            semi: getVal(`${prefix}-semi`, 0),
            cents: getVal(`${prefix}-cents`, 0),
            lp: getVal(`${prefix}-lp`, 20000),
            hp: getVal(`${prefix}-hp`, 20),
            a: getVal(`${prefix}-a`, 0.05),
            d: getVal(`${prefix}-d`, 0.3),
            s: getVal(`${prefix}-s`, 0.5),
            r: getVal(`${prefix}-r`, 0.5),
            odDrv: getVal(`${prefix}-od-drv`, 0),
            odMix: getVal(`${prefix}-od-mix`, 0),
            phsRt: getVal(`${prefix}-phs-rt`, 1),
            phsDp: getVal(`${prefix}-phs-dp`, 800),
            phsFb: getVal(`${prefix}-phs-fb`, 0.5),
            phsMix: getVal(`${prefix}-phs-mix`, 0),
            flgRt: getVal(`${prefix}-flg-rt`, 0.5),
            flgDp: getVal(`${prefix}-flg-dp`, 0.003),
            flgFb: getVal(`${prefix}-flg-fb`, 0.5),
            flgMix: getVal(`${prefix}-flg-mix`, 0),
            dlyTyp: getStr(`${prefix}-dly-typ`, 'mono'),
            dlyTm: getVal(`${prefix}-dly-tm`, 0.33),
            dlyFb: getVal(`${prefix}-dly-fb`, 0.4),
            dlyHc: getVal(`${prefix}-dly-hc`, 5000),
            dlyMix: getVal(`${prefix}-dly-mix`, 0),
            revTyp: getStr(`${prefix}-rev-typ`, 'hall'),
            revTm: getVal(`${prefix}-rev-tm`, 2),
            revPd: getVal(`${prefix}-rev-pd`, 0),
            revLc: getVal(`${prefix}-rev-lc`, 100),
            revHc: getVal(`${prefix}-rev-hc`, 10000),
            revMix: getVal(`${prefix}-rev-mix`, 0),
            lfoTgt: getStr(`${prefix}-lfo-tgt`, 'none'),
            lfoRt: getVal(`${prefix}-lfo-rt`, 5),
            lfoDp: getVal(`${prefix}-lfo-dp`, 50)
        };
    }

    function buildModuleChain(t, baseFreq, params, prefix, isNoise = false) {
        if (!params.active || params.vol === 0) return null; 

        let source;
        if (isNoise) {
            source = audioCtx.createBufferSource();
            source.buffer = params.type === 'white' ? whiteNoiseBuffer : pinkNoiseBuffer;
            source.loop = true;
        } else {
            source = audioCtx.createOscillator();
            source.type = params.type;
            const pitchShift = params.semi + (params.cents / 100);
            source.frequency.value = baseFreq * Math.pow(2, pitchShift / 12);
        }

        const filterHP = audioCtx.createBiquadFilter();
        filterHP.type = 'highpass'; filterHP.frequency.value = params.hp;

        const filterLP = audioCtx.createBiquadFilter();
        filterLP.type = 'lowpass'; filterLP.frequency.value = params.lp;

        // NUEVO NODO: Paneo Estéreo
        const panner = audioCtx.createStereoPanner();
        panner.pan.value = 0;

        const envGain = audioCtx.createGain();
        const lfoModGain = audioCtx.createGain();

        envGain.gain.setValueAtTime(0, t);
        envGain.gain.linearRampToValueAtTime(params.vol, t + params.a);
        envGain.gain.linearRampToValueAtTime(params.vol * params.s, t + params.a + params.d);

        let lfo = null, lfoGain = null;
        if (params.lfoTgt !== 'none') {
            lfo = audioCtx.createOscillator();
            lfoGain = audioCtx.createGain();
            lfo.frequency.value = params.lfoRt;
            lfo.connect(lfoGain);

            // NUEVAS RUTAS DE MODULACIÓN
            if (params.lfoTgt === 'pitch' && !isNoise) {
                lfoGain.gain.value = params.lfoDp * 5; 
                lfoGain.connect(source.frequency);
            } else if (params.lfoTgt === 'lp') {
                lfoGain.gain.value = params.lfoDp * 50; 
                lfoGain.connect(filterLP.frequency);
            } else if (params.lfoTgt === 'hp') {
                lfoGain.gain.value = params.lfoDp * 50; 
                lfoGain.connect(filterHP.frequency);
            } else if (params.lfoTgt === 'vol') {
                lfoGain.gain.value = params.lfoDp / 100;
                lfoGain.connect(lfoModGain.gain);
            } else if (params.lfoTgt === 'pan') {
                lfoGain.gain.value = params.lfoDp / 100; 
                lfoGain.connect(panner.pan);
            }
            lfo.start(t);
        }

        source.connect(filterHP);
        filterHP.connect(filterLP);
        filterLP.connect(envGain);
        envGain.connect(lfoModGain);
        lfoModGain.connect(panner); // Pasa por el panner estéreo
        panner.connect(busses[prefix].input); // Y entra al bus de efectos

        source.start(t);
        return { source, envGain, lfo, lfoGain, lfoModGain, filterLP, filterHP, panner, baseFreq, r: params.r, prefix, isNoise };
    }

    function playNote(char) {
        if (activeVoices[char]) return;
        const keyEl = document.querySelector(`.key[data-char="${char}"]`);
        if (!keyEl) return;
        
        initAudio();
        const freq = parseFloat(keyEl.getAttribute('data-freq'));
        currentFundamentalFreq = freq; // <-- AÑADE ESTA LÍNEA AQUÍ
        keyEl.classList.add('active');
        const t = audioCtx.currentTime;

        const chains = [
            buildModuleChain(t, freq, getParams('o1'), 'o1'),
            buildModuleChain(t, freq, getParams('o2'), 'o2'),
            buildModuleChain(t, freq, getParams('o3'), 'o3'),
            buildModuleChain(t, freq, getParams('n'), 'n', true)
        ].filter(c => c !== null); 

        activeVoices[char] = chains;
    }

    function stopNote(char) {
        if (!activeVoices[char]) return;
        const chains = activeVoices[char];
        const now = audioCtx.currentTime;
        let maxRelease = 0;

        chains.forEach(chain => {
            chain.envGain.gain.cancelScheduledValues(now);
            chain.envGain.gain.setTargetAtTime(0, now, chain.r / 5); 
            if (chain.r > maxRelease) maxRelease = chain.r;
        });

        setTimeout(() => {
            chains.forEach(chain => {
                try { chain.source.stop(); } catch(e){}
                if(chain.lfo) try { chain.lfo.stop(); } catch(e){}
                try { chain.source.disconnect(); chain.envGain.disconnect(); chain.lfoModGain.disconnect(); } catch(e){}
            });
        }, maxRelease * 1000 + 200);

        delete activeVoices[char];
        const keyEl = document.querySelector(`.key[data-char="${char}"]`);
        if(keyEl) keyEl.classList.remove('active');
    }

    // ==========================================
    // 3. EVENTOS DE ENTRADA (Mouse, Táctil, Teclado)
    // ==========================================
    document.querySelectorAll('.key').forEach(key => {
        const char = key.dataset.char;
        
        key.addEventListener('mousedown', () => playNote(char));
        key.addEventListener('mouseup', () => stopNote(char));
        key.addEventListener('mouseleave', () => stopNote(char));
        
        // Permite tocar notas arrastrando el ratón (Glissando)
        key.addEventListener('mouseenter', (e) => {
            if (e.buttons === 1) {
                playNote(char);
            }
        });

        key.addEventListener('touchstart', (e) => { e.preventDefault(); playNote(char); });
        key.addEventListener('touchend', (e) => { e.preventDefault(); stopNote(char); });
    });

    // Liberar el foco del navegador al soltar los controles
    document.addEventListener('mouseup', (e) => {
        if ((e.target.tagName === 'INPUT' && e.target.type === 'range') || e.target.tagName === 'SELECT') {
            e.target.blur(); 
        }
    });

    window.addEventListener('keydown', e => {
        if (e.repeat) return;
        
        // Solo ignorar el teclado físico si se está escribiendo texto
        if (e.target.tagName === 'INPUT' && (e.target.type === 'text' || e.target.type === 'email' || e.target.type === 'password')) return;
        
        playNote(e.key.toLowerCase());
    });

    window.addEventListener('keyup', e => {
        if (e.target.tagName === 'INPUT' && (e.target.type === 'text' || e.target.type === 'email' || e.target.type === 'password')) return;
        
        stopNote(e.key.toLowerCase());
    });

});
