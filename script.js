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
    rack.innerHTML = ''; 
    
    modulesData.forEach(m => {
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

    rack.addEventListener('click', (e) => {
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

    // INYECCIÓN DINÁMICA DE LOS CONTROLES MONO/POLY
    document.getElementById('keyboard').insertAdjacentHTML('beforebegin', `
        <div class="voicing-section" style="background:#151518; border: 1px solid #333; border-radius: 4px; padding: 10px; margin-bottom: 15px; display: flex; flex-wrap: wrap; gap: 15px; align-items: center;">
            <strong style="color:#ff9f43; margin-right: 10px;">MODO:</strong>
            <label style="cursor:pointer;"><input type="radio" name="voicing" value="poly" checked> Poly</label>
            <label style="cursor:pointer;"><input type="radio" name="voicing" value="mono"> Mono</label>
            <div id="mono-settings" style="display: none; gap: 15px; align-items: center; border-left: 1px solid #444; padding-left: 15px; margin-left: 5px;">
                <label>Glide (<span class="val">0.10</span>s) <input type="range" id="mono-glide" min="0" max="2" step="0.01" value="0.10"></label>
                <label style="cursor:pointer;"><input type="checkbox" id="mono-retrigger"> Retrigger</label>
                <label style="cursor:pointer;"><input type="checkbox" id="mono-fingered" checked> Fingered</label>
            </div>
        </div>
    `);

    // Utilidad para actualizar parámetros en vivo (tanto para Mono como Poly)
    function updateLiveParams(chains, targetId, now) {
        chains.forEach(chain => {
            if (targetId.startsWith(chain.prefix)) {
                const p = getParams(chain.prefix);
                if (chain.filterLP) chain.filterLP.frequency.setTargetAtTime(p.lp, now, 0.05);
                if (chain.filterHP) chain.filterHP.frequency.setTargetAtTime(p.hp, now, 0.05);
                if (!chain.isNoise && chain.source) {
                    const pitchShift = p.semi + (p.cents / 100);
                    chain.source.frequency.setTargetAtTime(chain.baseFreq * Math.pow(2, pitchShift / 12), now, 0.05);
                }
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
    }

    document.addEventListener('input', e => {
        if (e.target.type === 'range') {
            const span = e.target.parentElement.querySelector('.val');
            if (span) span.innerText = e.target.value;
        }

        // Lógica de visualización del panel Mono
        if (e.target.name === 'voicing') {
            synthMode = e.target.value;
            const monoSettings = document.getElementById('mono-settings');
            if (monoSettings) monoSettings.style.display = synthMode === 'mono' ? 'flex' : 'none';
            
            // Cortar notas Mono si se regresa a Poly de golpe
            if (synthMode === 'poly' && monoChains) {
                monoChains.forEach(c => { try { c.source.stop(); c.source.disconnect(); } catch(err){} });
                monoChains = null;
                heldNotes = [];
            }
        }

        if (e.target.id === 'master-vol') {
            const masterVal = document.getElementById('master-vol-val');
            if (masterVal) masterVal.innerText = e.target.value;
            if (typeof masterGain !== 'undefined' && masterGain) {
                masterGain.gain.value = parseFloat(e.target.value);
            }
        }

        if (typeof audioCtx !== 'undefined' && audioCtx) {
            ['o1', 'o2', 'o3', 'n'].forEach(id => {
                if (e.target.id.startsWith(id) && busses && busses[id]) {
                    busses[id].update(getParams(id));
                }
            });

            const now = audioCtx.currentTime;
            // Actualizar voces Poly
            Object.values(activeVoices).forEach(chains => {
                updateLiveParams(chains, e.target.id, now);
            });
            // Actualizar voces Mono
            if (monoChains) {
                updateLiveParams(monoChains, e.target.id, now);
            }
        }
    });

    // ==========================================
    // 2. MOTOR DE AUDIO (WEB AUDIO API)
    // ==========================================
    let audioCtx, masterGain, analyser, whiteNoiseBuffer, pinkNoiseBuffer;
    let currentFundamentalFreq = 0;
    
    // Variables de Estado (Poly vs Mono)
    const activeVoices = {};
    const busses = {};
    let synthMode = 'poly';
    let heldNotes = []; 
    let monoChains = null; 

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

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = '#050505';
        canvasCtx.fillRect(0, 0, width, height);

        const fMin = 20;
        const fMax = 20000;
        const logFMin = Math.log10(fMin);
        const logFMax = Math.log10(fMax);

        for (let i = 0; i < bufferLength; i++) {
            const freqCenter = (i * nyquist) / bufferLength;
            const freqNext = ((i + 1) * nyquist) / bufferLength;
            if (freqCenter < fMin || freqCenter > fMax) continue;

            const x = ((Math.log10(Math.max(fMin, freqCenter)) - logFMin) / (logFMax - logFMin)) * width;
            const xNext = ((Math.log10(Math.min(fMax, freqNext)) - logFMin) / (logFMax - logFMin)) * width;
            
            const barW = Math.max(1, xNext - x - 0.2); 
            const barHeight = (dataArray[i] / 255) * height;
            canvasCtx.fillStyle = `rgb(${dataArray[i] + 50}, 210, 211)`;
            canvasCtx.fillRect(x, height - barHeight, barW, barHeight);
        }

        canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        canvasCtx.font = '10px monospace';
        canvasCtx.textAlign = 'left';
        const dbs = [0, -25, -50, -75];
        dbs.forEach(db => {
            const y = height - ((db + 100) / 100) * height;
            canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            canvasCtx.beginPath(); canvasCtx.moveTo(0, y); canvasCtx.lineTo(width, y); canvasCtx.stroke();
            canvasCtx.fillText(db + 'dB', 5, Math.max(10, y - 2));
        });

        const iso31Bands = [
            20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800,
            1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000
        ];
        
        canvasCtx.textAlign = 'center';
        canvasCtx.font = '9px monospace';
        iso31Bands.forEach((f, index) => {
            const x = ((Math.log10(f) - logFMin) / (logFMax - logFMin)) * width;
            canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            canvasCtx.beginPath(); canvasCtx.moveTo(x, 0); canvasCtx.lineTo(x, height); canvasCtx.stroke();

            const isTop = index % 2 === 0;
            const yText = isTop ? height - 16 : height - 4;
            let text = f >= 1000 ? (f / 1000) + 'k' : Math.round(f);
            
            canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            const textWidth = canvasCtx.measureText(text).width;
            canvasCtx.fillRect(x - textWidth/2 - 2, yText - 8, textWidth + 4, 10);
            
            canvasCtx.fillStyle = '#ff9f43';
            canvasCtx.fillText(text, x, yText);
        });

        const waveBuffer = analyser.fftSize;
        const waveData = new Uint8Array(waveBuffer);
        analyser.getByteTimeDomainData(waveData);

        const wWidth = waveCanvas.width;
        const wHeight = waveCanvas.height;

        waveCtx.fillStyle = '#050505';
        waveCtx.fillRect(0, 0, wWidth, wHeight);

        waveCtx.lineWidth = 1;
        waveCtx.strokeStyle = 'rgba(51, 51, 51, 0.5)';
        waveCtx.beginPath(); waveCtx.moveTo(0, wHeight/2); waveCtx.lineTo(wWidth, wHeight/2); waveCtx.stroke();
        waveCtx.beginPath(); waveCtx.moveTo(wWidth/2, 0); waveCtx.lineTo(wWidth/2, wHeight); waveCtx.stroke();

        let minVal = 255, maxVal = 0;
        for(let i=0; i<waveBuffer; i++) {
            if(waveData[i] < minVal) minVal = waveData[i];
            if(waveData[i] > maxVal) maxVal = waveData[i];
        }
        
        let peak = Math.max(Math.abs(maxVal - 128), Math.abs(minVal - 128));
        // CORRECCIÓN: Umbral estricto para no amplificar visualmente el ruido de fondo
        let scaleY = peak < 10 ? 1 : ((wHeight / 2) * 0.9) / peak;

        let triggerIndex = 0;
        for (let i = 0; i < waveBuffer / 2; i++) {
            if (waveData[i] < 128 && waveData[i + 1] >= 128) {
                triggerIndex = i;
                break;
            }
        }

        waveCtx.lineWidth = 2;
        waveCtx.strokeStyle = '#ff9f43';
        waveCtx.beginPath();

        const muestrasADibujar = Math.floor(waveBuffer * 0.6); 
        const incrementoX = wWidth / muestrasADibujar;
        let xWave = 0;

        for (let i = 0; i < muestrasADibujar; i++) {
            const idxData = triggerIndex + i;
            if (idxData >= waveBuffer) break;

            const v = waveData[idxData] - 128;
            const y = (wHeight / 2) - (v * scaleY); 

            if (i === 0) waveCtx.moveTo(xWave, y);
            else waveCtx.lineTo(xWave, y);
            
            xWave += incrementoX;
        }
        waveCtx.stroke();
    }
    
    drawVisualizers();

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

    function createReverbIR(type, time) {
        if (!audioCtx) return null;
        const sampleRate = audioCtx.sampleRate;
        const length = Math.floor(Math.max(1, sampleRate * time)); 
        const impulse = audioCtx.createBuffer(2, length, sampleRate);
        
        for (let i = 0; i < 2; i++) {
            const channel = impulse.getChannelData(i);
            for (let j = 0; j < length; j++) {
                let n = (Math.random() * 2 - 1); 
                if (type === 'spring') n *= Math.sin(j * 0.05) * Math.exp(-j / length * 10);
                else if (type === 'plate') n *= (Math.random() > 0.5 ? 1 : -1); 
                else if (type === 'room') n *= Math.exp(-j / (length * 0.5)); 
                
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

    function createBus(id) {
        const input = audioCtx.createGain();
        const output = audioCtx.createGain();

        function createInsertFx() {
            const inNode = audioCtx.createGain();
            const outNode = audioCtx.createGain();
            const dry = audioCtx.createGain();
            const wet = audioCtx.createGain();
            inNode.connect(dry);
            dry.connect(outNode);
            return { in: inNode, out: outNode, dry, wet };
        }

        const odNode = createInsertFx();
        const drive = audioCtx.createWaveShaper();
        odNode.in.connect(drive);
        drive.connect(odNode.wet);
        odNode.wet.connect(odNode.out);
        input.connect(odNode.in);

        const phsNode = createInsertFx();
        const phaser = audioCtx.createBiquadFilter(); phaser.type = 'allpass';
        const pLfo = audioCtx.createOscillator(); pLfo.start();
        const pDepth = audioCtx.createGain();
        const phsFb = audioCtx.createGain();
        pLfo.connect(pDepth);
        pDepth.connect(phaser.frequency);
        odNode.out.connect(phsNode.in);
        phsNode.in.connect(phaser);
        phaser.connect(phsNode.wet);
        phsNode.wet.connect(phsNode.out);
        phaser.connect(phsFb);
        phsFb.connect(phaser); 

        const flgNode = createInsertFx();
        const flanger = audioCtx.createDelay(2.0); 
        flanger.delayTime.value = 0.005;
        const fLfo = audioCtx.createOscillator(); fLfo.start();
        const fDepth = audioCtx.createGain();
        const flgFb = audioCtx.createGain();
        fLfo.connect(fDepth);
        fDepth.connect(flanger.delayTime);
        phsNode.out.connect(flgNode.in);
        flgNode.in.connect(flanger);
        flanger.connect(flgNode.wet);
        flgNode.wet.connect(flgNode.out);
        flanger.connect(flgFb);
        flgFb.connect(flanger); 
        
        flgNode.out.connect(output); 

        const sendNode = flgNode.out;

        const dlyIn = audioCtx.createGain();
        const dlyWet = audioCtx.createGain();
        const delayNode = audioCtx.createDelay(10.0);
        const dlyFb = audioCtx.createGain();
        const dlyHc = audioCtx.createBiquadFilter(); dlyHc.type = 'lowpass';
        const dlyPan = audioCtx.createStereoPanner();
        
        sendNode.connect(dlyIn);
        dlyIn.connect(delayNode);
        delayNode.connect(dlyHc);
        dlyHc.connect(dlyFb);
        dlyFb.connect(delayNode); 
        delayNode.connect(dlyPan);
        dlyPan.connect(dlyWet);
        dlyWet.connect(output);

        const revIn = audioCtx.createGain();
        const revWet = audioCtx.createGain();
        const preDelay = audioCtx.createDelay(5.0);
        const revLc = audioCtx.createBiquadFilter(); revLc.type = 'highpass';
        const revHc = audioCtx.createBiquadFilter(); revHc.type = 'lowpass';
        const convolver = audioCtx.createConvolver();
        
        sendNode.connect(revIn);
        revIn.connect(preDelay);
        preDelay.connect(revLc);
        revLc.connect(revHc);
        revHc.connect(convolver);
        convolver.connect(revWet);
        revWet.connect(output);

        let currentRevState = { typ: '', tm: 0 };

        sendNode.connect(output);       
        output.connect(masterGain);     
        
        return {
            input,
            update: (p) => {
                drive.curve = makeDistortionCurve(p.odDrv);
                odNode.wet.gain.value = p.odMix; 
                odNode.dry.gain.value = 1 - p.odMix;
                
                pLfo.frequency.value = p.phsRt; 
                pDepth.gain.value = p.phsDp;
                phsFb.gain.value = p.phsFb;
                phsNode.wet.gain.value = p.phsMix; 
                phsNode.dry.gain.value = 1 - p.phsMix;

                fLfo.frequency.value = p.flgRt; 
                fDepth.gain.value = p.flgDp;
                flgFb.gain.value = p.flgFb;
                flgNode.wet.gain.value = p.flgMix; 
                flgNode.dry.gain.value = 1 - p.flgMix;

                delayNode.delayTime.value = Math.max(0.01, Math.min(p.dlyTm, 5.0));
                dlyFb.gain.value = p.dlyFb;
                dlyHc.frequency.value = Math.max(20, Math.min(p.dlyHc, 20000));
                dlyWet.gain.value = p.dlyMix;
                
                if(p.dlyTyp === 'mono') dlyPan.pan.value = 0;
                else if(p.dlyTyp === 'stereo') dlyPan.pan.value = 0.5; 
                else if(p.dlyTyp === 'pan') dlyPan.pan.value = -0.8; 
                
                preDelay.delayTime.value = Math.max(0, Math.min(p.revPd, 2.0));
                revLc.frequency.value = Math.max(20, Math.min(p.revLc, 20000));
                revHc.frequency.value = Math.max(20, Math.min(p.revHc, 20000));
                revWet.gain.value = p.revMix;

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
        filterHP.type = 'highpass'; 
        filterHP.frequency.value = Math.max(20, Math.min(params.hp, 20000));

        const filterLP = audioCtx.createBiquadFilter();
        filterLP.type = 'lowpass'; 
        filterLP.frequency.value = Math.max(20, Math.min(params.lp, 20000));

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
        lfoModGain.connect(panner);
        panner.connect(busses[prefix].input); 

        source.start(t);
        return { source, envGain, lfo, lfoGain, lfoModGain, filterLP, filterHP, panner, baseFreq, r: params.r, prefix, isNoise };
    }

    // CORRECCIÓN: Motor principal reescrito para soportar Mono (Legato) y Poly
    function playNote(charId, explicitFreq = null) {
        let freq = explicitFreq;
        const keyEl = document.querySelector(`.key[data-char="${charId}"]`);
        
        if (!freq) {
            if (!keyEl) return;
            freq = parseFloat(keyEl.getAttribute('data-freq'));
        }
        
        if (keyEl) keyEl.classList.add('active');
        
        initAudio();
        currentFundamentalFreq = freq;
        const t = audioCtx.currentTime;

        if (synthMode === 'poly') {
            if (activeVoices[charId]) return;
            const chains = [
                buildModuleChain(t, freq, getParams('o1'), 'o1'),
                buildModuleChain(t, freq, getParams('o2'), 'o2'),
                buildModuleChain(t, freq, getParams('o3'), 'o3'),
                buildModuleChain(t, freq, getParams('n'), 'n', true)
            ].filter(c => c !== null); 
            activeVoices[charId] = chains;
        } else {
            // Lógica Monofónica
            heldNotes = heldNotes.filter(n => n.id !== charId); 
            heldNotes.push({ id: charId, freq: freq });
            
            const glideTime = parseFloat(document.getElementById('mono-glide').value);
            const isRetrigger = document.getElementById('mono-retrigger').checked;
            const isFingered = document.getElementById('mono-fingered').checked;

            if (!monoChains) {
                monoChains = [
                    buildModuleChain(t, freq, getParams('o1'), 'o1'),
                    buildModuleChain(t, freq, getParams('o2'), 'o2'),
                    buildModuleChain(t, freq, getParams('o3'), 'o3'),
                    buildModuleChain(t, freq, getParams('n'), 'n', true)
                ].filter(c => c !== null);
            } else {
                const actualGlide = (isFingered && heldNotes.length === 1) ? 0.005 : glideTime;
                
                monoChains.forEach(chain => {
                    chain.baseFreq = freq;
                    if (!chain.isNoise && chain.source) {
                        const p = getParams(chain.prefix);
                        const pitchShift = p.semi + (p.cents / 100);
                        const finalFreq = freq * Math.pow(2, pitchShift / 12);
                        chain.source.frequency.cancelScheduledValues(t);
                        chain.source.frequency.setTargetAtTime(finalFreq, t, Math.max(0.005, actualGlide / 3)); 
                    }
                    if (isRetrigger) {
                        const p = getParams(chain.prefix);
                        chain.envGain.gain.cancelScheduledValues(t);
                        chain.envGain.gain.setValueAtTime(0, t);
                        chain.envGain.gain.linearRampToValueAtTime(p.vol, t + p.a);
                        chain.envGain.gain.linearRampToValueAtTime(p.vol * p.s, t + p.a + p.d);
                    }
                });
            }
        }
    }

    function stopNote(charId) {
        const keyEl = document.querySelector(`.key[data-char="${charId}"]`);
        if(keyEl) keyEl.classList.remove('active');
        
        if (!audioCtx) return;
        const now = audioCtx.currentTime;

        if (synthMode === 'poly') {
            if (!activeVoices[charId]) return;
            const chains = activeVoices[charId];
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

            delete activeVoices[charId];
        } else {
            // Lógica Monofónica
            heldNotes = heldNotes.filter(n => n.id !== charId);
            
            if (heldNotes.length === 0) {
                if (monoChains) {
                    const chainsToStop = monoChains;
                    monoChains = null;
                    let maxRelease = 0;
                    chainsToStop.forEach(chain => {
                        chain.envGain.gain.cancelScheduledValues(now);
                        chain.envGain.gain.setTargetAtTime(0, now, chain.r / 5); 
                        if (chain.r > maxRelease) maxRelease = chain.r;
                    });
                    setTimeout(() => {
                        chainsToStop.forEach(chain => {
                            try { chain.source.stop(); } catch(e){}
                            if(chain.lfo) try { chain.lfo.stop(); } catch(e){}
                            try { chain.source.disconnect(); chain.envGain.disconnect(); chain.lfoModGain.disconnect(); } catch(e){}
                        });
                    }, maxRelease * 1000 + 200);
                }
            } else {
                // Hay notas debajo siendo sostenidas, hacer glide de regreso
                const prevNote = heldNotes[heldNotes.length - 1];
                currentFundamentalFreq = prevNote.freq;
                const glideTime = parseFloat(document.getElementById('mono-glide').value);
                const isFingered = document.getElementById('mono-fingered').checked;
                const actualGlide = isFingered ? glideTime : 0.005; 
                
                if (monoChains) {
                    monoChains.forEach(chain => {
                        chain.baseFreq = prevNote.freq;
                        if (!chain.isNoise && chain.source) {
                            const p = getParams(chain.prefix);
                            const pitchShift = p.semi + (p.cents / 100);
                            const finalFreq = prevNote.freq * Math.pow(2, pitchShift / 12);
                            chain.source.frequency.cancelScheduledValues(now);
                            chain.source.frequency.setTargetAtTime(finalFreq, now, Math.max(0.005, actualGlide / 3)); 
                        }
                    });
                }
            }
        }
    }

    // ==========================================
    // 3. EVENTOS DE ENTRADA (Mouse, Táctil, Teclado)
    // ==========================================
    document.querySelectorAll('.key').forEach(key => {
        const char = key.dataset.char;
        
        key.addEventListener('mousedown', () => playNote(char));
        key.addEventListener('mouseup', () => stopNote(char));
        key.addEventListener('mouseleave', () => stopNote(char));
        
        key.addEventListener('mouseenter', (e) => {
            if (e.buttons === 1) {
                playNote(char);
            }
        });

        key.addEventListener('touchstart', (e) => { e.preventDefault(); playNote(char); });
        key.addEventListener('touchend', (e) => { e.preventDefault(); stopNote(char); });
    });

    document.addEventListener('mouseup', (e) => {
        // CORRECCIÓN: Solo quitar foco a los deslizadores (inputs tipo range)
        if (e.target.tagName === 'INPUT' && e.target.type === 'range') {
            e.target.blur(); 
        }
    });

    document.addEventListener('change', (e) => {
        // CORRECCIÓN: Los selectores se desenfocan al elegirlos, no al dar clic
        if (e.target.tagName === 'SELECT' || e.target.type === 'radio' || e.target.type === 'checkbox') {
            e.target.blur(); 
        }
    });

    window.addEventListener('keydown', e => {
        if (e.repeat) return;
        if (e.target.tagName === 'INPUT' && (e.target.type === 'text' || e.target.type === 'email' || e.target.type === 'password' || e.target.type === 'number')) return;
        playNote(e.key.toLowerCase());
    });

    window.addEventListener('keyup', e => {
        if (e.target.tagName === 'INPUT' && (e.target.type === 'text' || e.target.type === 'email' || e.target.type === 'password' || e.target.type === 'number')) return;
        stopNote(e.key.toLowerCase());
    });

    // ==========================================
    // 4. SOPORTE MIDI (Web MIDI API)
    // ==========================================
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    }

    function onMIDISuccess(midiAccess) {
        for (let input of midiAccess.inputs.values()) {
            input.onmidimessage = getMIDIMessage;
        }
        console.log("Interfaz MIDI lista y escuchando.");
    }

    function onMIDIFailure() {
        console.warn("No se pudo acceder a los dispositivos MIDI o el navegador no lo soporta.");
    }

    function getMIDIMessage(message) {
        const command = message.data[0];
        const note = message.data[1];
        const velocity = (message.data.length > 2) ? message.data[2] : 0;

        // CORRECCIÓN: ID universal y Frecuencia matemática para soportar TODAS las octavas
        const voiceKey = 'midi-' + note;
        const freq = 440 * Math.pow(2, (note - 69) / 12);

        // Mapeo opcional para iluminar las teclas virtuales si están en el rango
        const midiMap = {
            48: 'z', 49: 's', 50: 'x', 51: 'd', 52: 'c', 53: 'v', 54: 'g', 55: 'b',
            56: 'h', 57: 'n', 58: 'j', 59: 'm', 60: 'q', 61: '2', 62: 'w', 63: '3',
            64: 'e', 65: 'r', 66: '5', 67: 't', 68: '6', 69: 'y', 70: '7', 71: 'u', 72: 'i'
        };
        const mappedChar = midiMap[note];

        if (command === 144 && velocity > 0) {
            playNote(mappedChar || voiceKey, freq);
        } 
        else if (command === 128 || (command === 144 && velocity === 0)) {
            stopNote(mappedChar || voiceKey);
        }
    }
});
