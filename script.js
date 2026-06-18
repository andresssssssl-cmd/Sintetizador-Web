// ==========================================
// 1. GENERACIÓN DINÁMICA DE LA INTERFAZ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    const modulesData = [
        { id: 'o1', name: 'Oscilador 1', isNoise: false, waveOpts: '<option value="sawtooth">Sierra</option><option value="square">Cuadrada</option><option value="sine">Seno</option><option value="triangle">Triángulo</option>', defVol: 0.5, defSemi: 0 },
        { id: 'o2', name: 'Oscilador 2', isNoise: false, waveOpts: '<option value="square">Cuadrada</option><option value="sawtooth">Sierra</option><option value="sine">Seno</option><option value="triangle">Triángulo</option>', defVol: 0.0, defSemi: -12 },
        { id: 'o3', name: 'Oscilador 3', isNoise: false, waveOpts: '<option value="sine">Seno</option><option value="square">Cuadrada</option><option value="sawtooth">Sierra</option><option value="triangle">Triángulo</option>', defVol: 0.0, defSemi: 7 },
        { id: 'n', name: 'Generador Ruido', isNoise: true, waveOpts: '<option value="white">Blanco</option><option value="pink">Rosa</option>', defVol: 0.0, defSemi: 0 }
    ];

    const rack = document.getElementById('synth-rack');
    modulesData.forEach(m => {
        rack.innerHTML += `
        <div class="module ${m.isNoise ? 'noise' : ''}">
            <h3>${m.name}</h3>
            <label>Tipo: <select id="${m.id}-type">${m.waveOpts}</select></label>
            <label>Volumen (<span class="val">${m.defVol}</span>) <input type="range" id="${m.id}-vol" min="0" max="1" step="0.01" value="${m.defVol}"></label>
            ${!m.isNoise ? `
            <label>Semitonos (<span class="val">${m.defSemi}</span>) <input type="range" id="${m.id}-semi" min="-24" max="24" step="1" value="${m.defSemi}"></label>
            <label>Centésimas (<span class="val">0</span>) <input type="range" id="${m.id}-cents" min="-50" max="50" step="1" value="0"></label>
            ` : ''}
            <label>Filtro LP (<span class="val">20000</span>Hz) <input type="range" id="${m.id}-lp" min="20" max="20000" step="1" value="20000"></label>
            <label>Filtro HP (<span class="val">20</span>Hz) <input type="range" id="${m.id}-hp" min="20" max="20000" step="1" value="20"></label>
            
            <h4>Envolvente ADSR</h4>
            <label>A (<span class="val">0.05</span>s) <input type="range" id="${m.id}-a" min="0.01" max="2" step="0.01" value="0.05"></label>
            <label>D (<span class="val">0.3</span>s) <input type="range" id="${m.id}-d" min="0.01" max="2" step="0.01" value="0.3"></label>
            <label>S (<span class="val">0.5</span>) <input type="range" id="${m.id}-s" min="0" max="1" step="0.01" value="0.5"></label>
            <label>R (<span class="val">0.5</span>s) <input type="range" id="${m.id}-r" min="0.01" max="3" step="0.01" value="0.5"></label>
            
            <h4>LFO</h4>
            <label>Destino: <select id="${m.id}-lfo-tgt"><option value="none">Off</option>${!m.isNoise ? '<option value="pitch">Pitch</option>' : ''}<option value="lp">Cutoff LP</option><option value="vol">Volumen</option></select></label>
            <label>Rate (<span class="val">5</span>Hz) <input type="range" id="${m.id}-lfo-rt" min="0.1" max="20" step="0.1" value="5"></label>
            <label>Depth (<span class="val">50</span>) <input type="range" id="${m.id}-lfo-dp" min="0" max="100" step="1" value="50"></label>
        </div>`;
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
    });


    // ==========================================
    // 2. MOTOR DE AUDIO (WEB AUDIO API)
    // ==========================================
    let audioCtx, masterGain, analyser, whiteNoiseBuffer, pinkNoiseBuffer;
    const activeVoices = {};

    const canvas = document.getElementById('rta-canvas');
    const canvasCtx = canvas.getContext('2d');
    
    function drawRTA() {
        requestAnimationFrame(drawRTA);
        if(!analyser) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = '#050505';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;
        for(let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] / 2.5;
            canvasCtx.fillStyle = `rgb(${barHeight + 100}, 210, 211)`;
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
    drawRTA();

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

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioCtx.createGain();
            masterGain.gain.value = 0.7; 
            
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 512;
            
            masterGain.connect(analyser);
            analyser.connect(audioCtx.destination);
            createNoiseBuffers();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function getParams(prefix) {
        const getVal = (id, def) => { const el = document.getElementById(id); return el ? parseFloat(el.value) : def; };
        const getStr = (id, def) => { const el = document.getElementById(id); return el ? el.value : def; };
        
        return {
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
            lfoTgt: getStr(`${prefix}-lfo-tgt`, 'none'),
            lfoRt: getVal(`${prefix}-lfo-rt`, 5),
            lfoDp: getVal(`${prefix}-lfo-dp`, 50)
        };
    }

    function buildModuleChain(t, baseFreq, params, isNoise = false) {
        if (params.vol === 0) return null; 

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
            } else if (params.lfoTgt === 'vol') {
                lfoGain.gain.value = params.lfoDp / 100;
                lfoGain.connect(lfoModGain.gain);
            }
            lfo.start(t);
        }

        source.connect(filterHP);
        filterHP.connect(filterLP);
        filterLP.connect(envGain);
        envGain.connect(lfoModGain);
        lfoModGain.connect(masterGain);

        source.start(t);
        return { source, envGain, lfo, lfoModGain, r: params.r };
    }

    function playNote(char) {
        if (activeVoices[char]) return;
        const keyEl = document.querySelector(`.key[data-char="${char}"]`);
        if (!keyEl) return;
        
        initAudio();
        const freq = parseFloat(keyEl.getAttribute('data-freq'));
        keyEl.classList.add('active');
        const t = audioCtx.currentTime;

        const chains = [
            buildModuleChain(t, freq, getParams('o1')),
            buildModuleChain(t, freq, getParams('o2')),
            buildModuleChain(t, freq, getParams('o3')),
            buildModuleChain(t, freq, getParams('n'), true)
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
    // 3. EVENTOS DE ENTRADA (Mause, Táctil, Teclado)
    // ==========================================
    document.querySelectorAll('.key').forEach(key => {
        const char = key.dataset.char;
        key.addEventListener('mousedown', () => playNote(char));
        key.addEventListener('mouseup', () => stopNote(char));
        key.addEventListener('mouseleave', () => stopNote(char));
        key.addEventListener('touchstart', (e) => { e.preventDefault(); playNote(char); });
        key.addEventListener('touchend', (e) => { e.preventDefault(); stopNote(char); });
    });

    window.addEventListener('keydown', e => {
        if (e.repeat) return;
        playNote(e.key.toLowerCase());
    });

    window.addEventListener('keyup', e => {
        stopNote(e.key.toLowerCase());
    });

});