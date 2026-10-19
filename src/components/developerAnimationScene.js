import * as THREE from 'three';
// Device choreography and canvas screens adapted from the supplied HeroDeveloperAnimation.html.
export function mountDeveloperAnimation(st, { onError, onReady }) {
    let environment, resizeObserver, animationId, observer;
    let disposed = false, visible = true;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const resize = () => {
        if (!renderer || !cam || disposed)
            return;
        const width = st.clientWidth, height = st.clientHeight;
        if (!width || !height)
            return;
        renderer.setSize(width, height, false);
        cam.aspect = width / height;
        cam.updateProjectionMatrix();
        render(reducedMotion.matches ? 12.9 : clock);
    };
    /* ---------- config (props of <HeroDeveloperAnimation />) ---------- */
    const CFG = { speed: 1, quality: 2, autoplay: true, colors: { metal: '#4a4b50', phone: '#5d5e63', accent: '#0a84ff' } };
    const DUR = 14, clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, eo = x => 1 - Math.pow(1 - x, 3);
    const P = (t, a, b, f = ease) => f(clamp((t - a) / (b - a)));
    const T = (c, s, x, y, f, col, al = 'left') => { c.font = f; c.fillStyle = col; c.textAlign = al; c.fillText(s, x, y); };
    const RR = (c, x, y, w, h, r, fill) => { c.beginPath(); c.roundRect(x, y, w, h, r); if (fill) {
        c.fillStyle = fill;
        c.fill();
    } };
    const mk = (w, h) => { const k = document.createElement('canvas'); k.width = w; k.height = h; return k; };
    const MW = 1200, MH = 780, PW = 540, PH = 1170, SANS = '-apple-system,"SF Pro Display","Helvetica Neue",Arial,sans-serif', MONO = '"SF Mono",Menlo,Consolas,monospace';
    const mcv = mk(MW, MH), mc = mcv.getContext('2d'), pcv = mk(PW, PH), pc = pcv.getContext('2d');
    /* ---------- Mac screen content ---------- */
    const CODE = [
        [['import ', '#c586c0'], ['{ useState } ', '#9cdcfe'], ['from ', '#c586c0'], ["'react'", '#ce9178']],
        [['export function ', '#c586c0'], ['Hero', '#4ec9b0'], ['() {', '#d4d4d4']],
        [['  const ', '#569cd6'], ['[open, setOpen] = ', '#9cdcfe'], ['useState', '#dcdcaa'], ['(false)', '#d4d4d4']],
        [['  return ', '#c586c0'], ['<Showcase ', '#4ec9b0'], ['onOpen', '#9cdcfe'], ['={() => ', '#d4d4d4'], ['setOpen', '#dcdcaa'], ['(true)} />', '#d4d4d4']],
        [['}', '#d4d4d4']]
    ];
    function ide(c, t) {
        c.fillStyle = '#1e1e24';
        c.fillRect(0, 0, MW, MH);
        c.fillStyle = '#2a2a31';
        c.fillRect(0, 0, MW, 40);
        ['#ff5f57', '#febc2e', '#28c840'].forEach((k, i) => { c.fillStyle = k; c.beginPath(); c.arc(24 + i * 22, 20, 6, 0, 7); c.fill(); });
        T(c, 'orbit-web — Hero.tsx', MW / 2, 26, '14px ' + SANS, '#9a9aa5', 'center');
        c.fillStyle = '#17171c';
        c.fillRect(0, 40, 230, MH - 40);
        T(c, 'EXPLORER', 20, 72, '600 12px ' + SANS, '#8a8a95');
        ['▾ src', '   Hero.tsx', '   Card.tsx', '   App.tsx', '   main.tsx', '  package.json', '  vite.config.ts'].forEach((s, i) => {
            if (i === 1) {
                c.fillStyle = '#2a2d3a';
                c.fillRect(0, 92, 230, 28);
            }
            T(c, s, 20, 112 + i * 28, '15px ' + SANS, i === 1 ? '#fff' : '#b4b4be');
        });
        c.fillStyle = '#25252c';
        c.fillRect(230, 40, MW - 230, 40);
        RR(c, 236, 46, 150, 34, [6, 6, 0, 0], '#1e1e24');
        T(c, 'Hero.tsx', 256, 69, '15px ' + SANS, '#e8e8ee');
        let n = Math.max(0, Math.floor((t - 1.8) * 38)), cur = null;
        CODE.forEach((ln, i) => {
            const y = 140 + i * 38;
            T(c, String(i + 1), 290, y, '18px ' + MONO, '#5a5a66', 'right');
            let x = 320;
            const typed = i === 2 || i === 3;
            for (const [s, col] of ln) {
                let part = s;
                if (typed) {
                    part = s.slice(0, Math.max(0, n));
                    n -= s.length;
                }
                c.font = '20px ' + MONO;
                c.fillStyle = col;
                c.textAlign = 'left';
                c.fillText(part, x, y);
                x += c.measureText(part).width;
                if (typed && part.length && part.length <= s.length && n <= 0 && !cur)
                    cur = [x, y];
            }
            if (typed && n > 0)
                cur = null;
        });
        if (!cur && t > 1.7)
            cur = [320, 140 + 2 * 38];
        if (cur && (Math.floor(t * 2.2) % 2 === 0)) {
            c.fillStyle = '#fff';
            c.fillRect(cur[0] + 1, cur[1] - 20, 2, 26);
        }
        const th = 270 * P(t, 2.6, 3.1, eo), y0 = MH - th;
        if (th > 1) {
            c.fillStyle = '#121216';
            c.fillRect(230, y0, MW - 230, th);
            c.fillStyle = '#2a2a31';
            c.fillRect(230, y0, MW - 230, 1);
            T(c, 'TERMINAL', 256, y0 + 30, '600 12px ' + SANS, '#9a9aa5');
            const cmd = '$ npm run dev', k = Math.floor(clamp((t - 3.25) * 30, 0, cmd.length));
            T(c, cmd.slice(0, k), 256, y0 + 72, '20px ' + MONO, '#e8e8ee');
            if (t > 3.85) {
                T(c, '  VITE v5.4.0  ready in 312 ms', 256, y0 + 112, '20px ' + MONO, '#4ade80');
                T(c, '  ➜  Local:   http://localhost:5173/', 256, y0 + 146, '20px ' + MONO, '#7dd3fc');
            }
            else if (Math.floor(t * 2.2) % 2 === 0 && t > 3.2) {
                c.fillStyle = '#fff';
                c.fillRect(256 + c.measureText(cmd.slice(0, k)).width + 2, y0 + 54, 10, 22);
            }
        }
    }
    function site(c, t) {
        c.save();
        const sc = .97 + .03 * P(t, 4.15, 4.7, eo);
        c.translate(MW / 2, MH / 2);
        c.scale(sc, sc);
        c.translate(-MW / 2, -MH / 2);
        c.fillStyle = '#fafafc';
        c.fillRect(0, 0, MW, MH);
        const scroll = 560 * P(t, 4.95, 6.1);
        c.save();
        c.beginPath();
        c.rect(0, 70, MW, MH - 70);
        c.clip();
        c.translate(0, 70 - scroll);
        T(c, 'Nova', 60, 48, '700 26px ' + SANS, '#1d1d1f');
        ['Work', 'Studio', 'Journal', 'Contact'].forEach((s, i) => T(c, s, 780 + i * 100, 46, '17px ' + SANS, '#555'));
        T(c, 'Build things', MW / 2, 210, '700 84px ' + SANS, '#1d1d1f', 'center');
        T(c, 'people love.', MW / 2, 300, '700 84px ' + SANS, '#0a84ff', 'center');
        T(c, 'Modern web and mobile software, crafted with care.', MW / 2, 355, '24px ' + SANS, '#6e6e73', 'center');
        const gr = [['#ff9a9e', '#fad0c4'], ['#a1c4fd', '#c2e9fb'], ['#d4fc79', '#96e6a1'], ['#fbc2eb', '#a6c1ee'], ['#ffecd2', '#fcb69f'], ['#84fab0', '#8fd3f4']], nm = ['Atlas', 'Pulse', 'Meridian', 'Lumen', 'Drift', 'Canvas'];
        gr.forEach((g, i) => {
            const x = 75 + (i % 3) * 360, y = 420 + Math.floor(i / 3) * 250, gg = c.createLinearGradient(x, y, x + 330, y + 220);
            gg.addColorStop(0, g[0]);
            gg.addColorStop(1, g[1]);
            RR(c, x, y, 330, 220, 26, gg);
            T(c, nm[i], x + 28, y + 178, '600 28px ' + SANS, '#1d1d1f');
            RR(c, x + 28, y + 28, 90, 10, 5, 'rgba(255,255,255,.7)');
            RR(c, x + 28, y + 50, 60, 10, 5, 'rgba(255,255,255,.5)');
        });
        RR(c, 75, 960, 1050, 230, 34, '#111114');
        T(c, 'Take it everywhere.', MW / 2, 1040, '700 46px ' + SANS, '#f5f5f7', 'center');
        const press = t > 6.55 && t < 6.8, hov = t > 6.25, bs = press ? .95 : 1;
        c.save();
        c.translate(MW / 2, 1120);
        c.scale(bs, bs);
        RR(c, -160, -35, 320, 70, 35, press ? '#0060c0' : hov ? '#2b95ff' : '#0a84ff');
        T(c, 'Open Mobile App', 0, 9, '600 24px ' + SANS, '#fff', 'center');
        c.restore();
        c.restore();
        c.fillStyle = '#e9e9ee';
        c.fillRect(0, 0, MW, 70);
        ['#ff5f57', '#febc2e', '#28c840'].forEach((k, i) => { c.fillStyle = k; c.beginPath(); c.arc(30 + i * 22, 35, 6, 0, 7); c.fill(); });
        RR(c, 300, 18, 600, 36, 18, '#fff');
        T(c, 'localhost:5173', 600, 43, '16px ' + SANS, '#555', 'center');
        const ca = P(t, 5.2, 5.4);
        if (ca > 0) {
            const k = P(t, 5.3, 6.25, eo), x = 880 - 260 * k, y = 300 + 310 * k;
            c.globalAlpha *= ca;
            c.save();
            c.translate(x, y);
            if (press)
                c.scale(.9, .9);
            c.beginPath();
            c.moveTo(0, 0);
            c.lineTo(0, 30);
            c.lineTo(8, 23);
            c.lineTo(14, 36);
            c.lineTo(19, 34);
            c.lineTo(13, 21);
            c.lineTo(23, 21);
            c.closePath();
            c.fillStyle = '#fff';
            c.fill();
            c.strokeStyle = '#000';
            c.lineWidth = 2;
            c.stroke();
            c.restore();
        }
        c.restore();
    }
    function macDraw(t) {
        const c = mc;
        c.globalAlpha = 1;
        ide(c, t);
        const a = P(t, 4.15, 4.6);
        if (a > 0) {
            c.globalAlpha = a;
            site(c, t);
            c.globalAlpha = 1;
        }
        if (t < 1.7) {
            c.fillStyle = 'rgba(0,0,0,' + (1 - P(t, 1.3, 1.7)) + ')';
            c.fillRect(0, 0, MW, MH);
        }
        macTex.needsUpdate = true;
    }
    /* ---------- Phone screen content ---------- */
    function icon(c, x, y, s) {
        const g = c.createLinearGradient(x, y, x + s, y + s);
        g.addColorStop(0, '#7d7aff');
        g.addColorStop(1, '#0a84ff');
        RR(c, x, y, s, s, s * .225, g);
        c.save();
        c.translate(x + s / 2, y + s / 2);
        c.rotate(-.5);
        c.strokeStyle = '#fff';
        c.lineWidth = s * .05;
        c.beginPath();
        c.ellipse(0, 0, s * .33, s * .14, 0, 0, 7);
        c.stroke();
        c.fillStyle = '#fff';
        c.beginPath();
        c.arc(s * .33, 0, s * .06, 0, 7);
        c.fill();
        c.beginPath();
        c.arc(0, 0, s * .13, 0, 7);
        c.fill();
        c.restore();
    }
    function status(c, col) {
        T(c, '9:41', 60, 52, '600 20px ' + SANS, col, 'center');
        RR(c, PW / 2 - 65, 18, 130, 38, 19, '#000');
        RR(c, 430, 36, 34, 16, 4, col);
        RR(c, 468, 41, 3, 6, 1.5, col);
    }
    function store(c, t) {
        c.fillStyle = '#fff';
        c.fillRect(0, 0, PW, PH);
        status(c, '#000');
        icon(c, 36, 100, 150);
        T(c, 'Orbit', 210, 150, '700 38px ' + SANS, '#000');
        T(c, 'Plan. Focus. Orbit.', 210, 182, '20px ' + SANS, '#8a8a8e');
        const pr = t > 10.5 && t < 10.68;
        c.save();
        c.translate(272, 238);
        if (pr)
            c.scale(.93, .93);
        RR(c, -62, -23, 124, 46, 23, '#0a84ff');
        T(c, 'OPEN', 0, 8, '700 20px ' + SANS, '#fff', 'center');
        c.restore();
        T(c, '•••', 480, 248, '24px ' + SANS, '#0a84ff', 'center');
        c.fillStyle = '#e5e5ea';
        c.fillRect(36, 300, PW - 72, 1);
        [['4.9', '★★★★★'], ['#3', 'Productivity'], ['4+', 'Age']].forEach((r, i) => { T(c, r[0], 95 + i * 175, 350, '700 28px ' + SANS, '#555', 'center'); T(c, r[1], 95 + i * 175, 378, '14px ' + SANS, '#8a8a8e', 'center'); });
        T(c, 'Preview', 36, 445, '700 26px ' + SANS, '#000');
        [['#7d7aff', '#0a84ff'], ['#ff9f0a', '#ff375f'], ['#30d158', '#0a84ff']].forEach((g, i) => {
            const x = 36 + i * 190, gg = c.createLinearGradient(x, 470, x + 170, 940);
            gg.addColorStop(0, g[0]);
            gg.addColorStop(1, g[1]);
            RR(c, x, 470, 170, 370, 26, gg);
            RR(c, x + 18, 500, 90, 12, 6, 'rgba(255,255,255,.8)');
            RR(c, x + 18, 525, 60, 10, 5, 'rgba(255,255,255,.5)');
            for (let k = 0; k < 3; k++)
                RR(c, x + 16, 570 + k * 85, 138, 70, 14, 'rgba(255,255,255,.28)');
        });
        T(c, 'Orbit keeps your day in orbit. Track focus,', 36, 900, '20px ' + SANS, '#3a3a3c');
        T(c, 'plan tasks and see progress at a glance.', 36, 928, '20px ' + SANS, '#3a3a3c');
        const fa = P(t, 9.95, 10.1) * (1 - P(t, 10.75, 10.9));
        if (fa > 0) {
            const k = P(t, 10, 10.45, eo);
            c.fillStyle = 'rgba(90,90,100,' + .35 * fa + ')';
            c.beginPath();
            c.arc(430 - 158 * k, 720 - 482 * k, pr ? 20 : 26, 0, 7);
            c.fill();
        }
        const rp = P(t, 10.45, 10.85, eo);
        if (rp > 0 && rp < 1) {
            c.strokeStyle = 'rgba(10,132,255,' + (1 - rp) + ')';
            c.lineWidth = 4;
            c.beginPath();
            c.arc(272, 238, 20 + 60 * rp, 0, 7);
            c.stroke();
        }
    }
    function splash(c, t) {
        const g = c.createLinearGradient(0, 0, PW, PH);
        g.addColorStop(0, '#5e5ce6');
        g.addColorStop(1, '#0a84ff');
        c.fillStyle = g;
        c.fillRect(0, 0, PW, PH);
        const s = .8 + .2 * P(t, 11, 12, eo);
        c.save();
        c.translate(PW / 2, PH / 2 - 20);
        c.scale(s, s);
        c.strokeStyle = '#fff';
        c.lineWidth = 9;
        c.save();
        c.rotate(-.5);
        c.beginPath();
        c.ellipse(0, 0, 100, 44, 0, 0, 7);
        c.stroke();
        c.fillStyle = '#fff';
        c.beginPath();
        c.arc(100, 0, 17, 0, 7);
        c.fill();
        c.restore();
        c.beginPath();
        c.arc(0, 0, 38, 0, 7);
        c.fill();
        c.restore();
        T(c, 'Orbit', PW / 2, PH / 2 + 130, '600 36px ' + SANS, '#fff', 'center');
    }
    function dash(c, t) {
        const k = P(t, 11.9, 12.6, eo);
        c.fillStyle = '#f2f2f7';
        c.fillRect(0, 0, PW, PH);
        status(c, '#000');
        T(c, 'Good morning', 36, 120, '22px ' + SANS, '#8a8a8e');
        T(c, 'Alex', 36, 170, '700 46px ' + SANS, '#000');
        const ag = c.createLinearGradient(440, 100, 500, 160);
        ag.addColorStop(0, '#7d7aff');
        ag.addColorStop(1, '#0a84ff');
        c.fillStyle = ag;
        c.beginPath();
        c.arc(472, 140, 32, 0, 7);
        c.fill();
        const cd = (i, f) => { const o = (1 - clamp(k * 1.6 - i * .3)) * 60; c.save(); c.translate(0, o); c.globalAlpha *= clamp(k * 1.6 - i * .3); f(); c.restore(); };
        cd(0, () => {
            const g = c.createLinearGradient(36, 220, 504, 520);
            g.addColorStop(0, '#5e5ce6');
            g.addColorStop(1, '#0a84ff');
            RR(c, 36, 220, 468, 290, 34, g);
            c.lineWidth = 18;
            c.lineCap = 'round';
            c.strokeStyle = 'rgba(255,255,255,.25)';
            c.beginPath();
            c.arc(160, 365, 70, 0, 7);
            c.stroke();
            c.strokeStyle = '#fff';
            c.beginPath();
            c.arc(160, 365, 70, -1.57, -1.57 + 6.28 * .72 * k);
            c.stroke();
            T(c, Math.round(72 * k) + '%', 160, 376, '700 32px ' + SANS, '#fff', 'center');
            T(c, 'Focus today', 260, 340, '20px ' + SANS, 'rgba(255,255,255,.8)');
            T(c, '4h 12m', 260, 392, '700 44px ' + SANS, '#fff');
            T(c, '+18% vs last week', 260, 428, '18px ' + SANS, 'rgba(255,255,255,.8)');
        });
        cd(1, () => {
            RR(c, 36, 540, 224, 150, 28, '#fff');
            T(c, 'Tasks', 58, 586, '18px ' + SANS, '#8a8a8e');
            T(c, '8 / 11', 58, 646, '700 38px ' + SANS, '#000');
            RR(c, 280, 540, 224, 150, 28, '#fff');
            T(c, 'Streak', 302, 586, '18px ' + SANS, '#8a8a8e');
            T(c, '21 days', 302, 646, '700 38px ' + SANS, '#ff9f0a');
        });
        cd(2, () => { ['Design review', 'Ship v2.1 build', 'Weekly planning'].forEach((s, i) => { RR(c, 36, 720 + i * 100, 468, 84, 24, '#fff'); c.fillStyle = ['#0a84ff', '#30d158', '#ff9f0a'][i]; c.beginPath(); c.arc(78, 762 + i * 100, 14, 0, 7); c.fill(); T(c, s, 110, 771 + i * 100, '600 22px ' + SANS, '#000'); }); });
        RR(c, 24, 1060, PW - 48, 86, 43, 'rgba(255,255,255,.92)');
        ['Home', 'Plan', 'Stats', 'Me'].forEach((s, i) => { const x = 90 + i * 120; c.fillStyle = i ? '#c7c7cc' : '#0a84ff'; c.beginPath(); c.arc(x, 1090, 12, 0, 7); c.fill(); T(c, s, x, 1128, '13px ' + SANS, i ? '#8a8a8e' : '#0a84ff', 'center'); });
    }
    function phoneDraw(t) {
        const c = pc;
        c.clearRect(0, 0, PW, PH);
        c.save();
        c.beginPath();
        c.roundRect(0, 0, PW, PH, 60);
        c.clip();
        c.globalAlpha = 1;
        const sp = P(t, 10.95, 11.35), dp = P(t, 11.85, 12.4);
        store(c, t);
        if (sp > 0) {
            c.globalAlpha = sp;
            splash(c, t);
            c.globalAlpha = 1;
        }
        if (dp > 0) {
            c.globalAlpha = dp;
            dash(c, t);
            c.globalAlpha = 1;
        }
        c.restore();
        phoneTex.needsUpdate = true;
    }
    /* ---------- Three scene ---------- */
    let renderer, scene, cam, mac, lid, phone, streak, macTex, phoneTex, clock = 0;
    function rbox(w, h, d, r, flat) {
        const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
        s.moveTo(x + r, y);
        s.lineTo(x + w - r, y);
        s.quadraticCurveTo(x + w, y, x + w, y + r);
        s.lineTo(x + w, y + h - r);
        s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        s.lineTo(x + r, y + h);
        s.quadraticCurveTo(x, y + h, x, y + h - r);
        s.lineTo(x, y + r);
        s.quadraticCurveTo(x, y, x + r, y);
        const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: .012, bevelSize: .012, bevelSegments: 3, curveSegments: 10 });
        g.translate(0, 0, -d / 2);
        if (flat)
            g.rotateX(-Math.PI / 2);
        return g;
    }
    function init() {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, premultipliedAlpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(devicePixelRatio, CFG.quality));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        st.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        scene.background = null;
        cam = new THREE.PerspectiveCamera(22, 1, .1, 60);
        const ec = mk(1024, 512), e = ec.getContext('2d'), eg = e.createLinearGradient(0, 0, 0, 512);
        eg.addColorStop(0, '#33363f');
        eg.addColorStop(.5, '#0c0c10');
        eg.addColorStop(1, '#050506');
        e.fillStyle = eg;
        e.fillRect(0, 0, 1024, 512);
        e.fillStyle = '#fff';
        [[100, 80, 280, 70], [620, 50, 240, 60], [430, 190, 36, 220], [880, 170, 60, 170]].forEach(r => e.fillRect(...r));
        const et = new THREE.CanvasTexture(ec);
        et.mapping = THREE.EquirectangularReflectionMapping;
        const pmrem = new THREE.PMREMGenerator(renderer);
        environment = pmrem.fromEquirectangular(et);
        scene.environment = environment.texture;
        pmrem.dispose();
        et.dispose();
        const key = new THREE.DirectionalLight(0xffffff, .5);
        key.position.set(3, 5, 6);
        scene.add(key);
        const tex = (cv) => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
        macTex = tex(mcv);
        phoneTex = tex(pcv);
        const alu = new THREE.MeshStandardMaterial({ color: CFG.colors.metal, metalness: 1, roughness: .3 }), blk = new THREE.MeshStandardMaterial({ color: 0x07070a, roughness: .45, metalness: .3 });
        mac = new THREE.Group();
        mac.add(new THREE.Mesh(rbox(3.2, 2.2, .1, .12, true), alu));
        const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(.18, .016, .15), blk, 70), d = new THREE.Object3D();
        let n = 0;
        for (let r = 0; r < 5; r++)
            for (let k = 0; k < 14; k++) {
                d.position.set(-1.27 + k * .196, .07, -.86 + r * .18);
                d.updateMatrix();
                keys.setMatrixAt(n++, d.matrix);
            }
        mac.add(keys);
        const tp = new THREE.Mesh(new THREE.BoxGeometry(1.1, .004, .62), new THREE.MeshStandardMaterial({ color: 0x55565b, metalness: 1, roughness: .2 }));
        tp.position.set(0, .064, .68);
        mac.add(tp);
        lid = new THREE.Group();
        lid.position.set(0, .11, -1.1);
        mac.add(lid);
        const lm = new THREE.Mesh(rbox(3.2, 2.2, .07, .12, true), alu);
        lm.position.z = 1.1;
        lid.add(lm);
        const bz = new THREE.Mesh(new THREE.PlaneGeometry(3.08, 2.08), blk);
        bz.rotation.x = Math.PI / 2;
        bz.position.set(0, -.049, 1.1);
        lid.add(bz);
        const sc = new THREE.Mesh(new THREE.PlaneGeometry(2.96, 1.92), new THREE.MeshBasicMaterial({ map: macTex, toneMapped: false }));
        sc.rotation.x = Math.PI / 2;
        sc.position.set(0, -.0505, 1.1);
        lid.add(sc);
        scene.add(mac);
        phone = new THREE.Group();
        phone.add(new THREE.Mesh(rbox(1.5, 3.1, .14, .24), new THREE.MeshStandardMaterial({ color: CFG.colors.phone, metalness: 1, roughness: .26 })));
        const pb = new THREE.Mesh(new THREE.PlaneGeometry(1.44, 3.04), blk);
        pb.position.z = .0835;
        phone.add(pb);
        const ps = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 3.03), new THREE.MeshBasicMaterial({ map: phoneTex, transparent: true, toneMapped: false }));
        ps.position.z = .0845;
        phone.add(ps);
        scene.add(phone);
        streak = new THREE.Mesh(new THREE.PlaneGeometry(4.2, .014), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        scene.add(streak);
        resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(st);
        resize();
        phoneDraw(12.9);
    }
    function frame(t) {
        const open = t < 7.9 ? P(t, .15, 1.5) : 0, ex = P(t, 7.1, 7.9);
        lid.rotation.x = -1.85 * open;
        mac.visible = t < 7.9 || t >= 13.7;
        let ms = .95;
        if (t >= 13.7)
            ms *= eo(P(t, 13.7, 14));
        else
            ms *= 1 - ex;
        mac.scale.setScalar(Math.max(ms, .001));
        mac.rotation.y = t < 8 ? -.9 + .78 * P(t, 0, 1.6) - 1.3 * ex : -.9;
        mac.position.y = -.9 * open * (1 - ex * .5);
        cam.position.set(0, t < 8 ? 1.4 - 1.2 * P(t, 0, 1.8) : .2 + 1.2 * P(t, 13.4, 14), 10);
        cam.lookAt(0, -.25, 0);
        const so = Math.sin(Math.PI * clamp((t - 7.4) / .6));
        streak.visible = so > .01;
        streak.material.opacity = so * .9;
        streak.scale.x = 1 - .8 * clamp((t - 7.7) / .3);
        streak.position.set(0, -.4, 0);
        const on = t >= 8 && t < 13.7;
        phone.visible = on;
        if (on) {
            const p = P(t, 8, 9.6, eo), q = P(t, 13.2, 13.7);
            phone.rotation.y = -1.45 * (1 - p) + .1 * p + .6 * q + Math.sin(t * .6) * .03;
            phone.position.y = Math.sin(t * 1.1) * .03;
            phone.scale.setScalar(Math.max((.6 + .4 * p) * (1 - q), .001));
        }
        if (t < 7.9)
            macDraw(t);
        else if (on && t >= 9.4)
            phoneDraw(t);
    }
    function render(t) { frame(t); renderer.render(scene, cam); }
    const dispose = () => {
        disposed = true;
        cancelAnimationFrame(animationId);
        resizeObserver?.disconnect();
        observer?.disconnect();
        document.removeEventListener('visibilitychange', visibilityChanged);
        reducedMotion.removeEventListener('change', motionChanged);
        const geometries = new Set(), materials = new Set(), textures = new Set();
        scene?.traverse(object => {
            if (object.geometry)
                geometries.add(object.geometry);
            if (object.material)
                (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => {
                    materials.add(material);
                    if (material.map)
                        textures.add(material.map);
                });
        });
        geometries.forEach(item => item.dispose());
        materials.forEach(item => item.dispose());
        textures.forEach(item => item.dispose());
        environment?.dispose();
        renderer?.dispose();
        renderer?.domElement.remove();
    };
    let last = performance.now();
    function draw(now) {
        animationId = undefined;
        if (disposed || !visible || document.hidden || reducedMotion.matches)
            return;
        clock = (clock + Math.min((now - last) / 1000, .1) * CFG.speed) % DUR;
        last = now;
        try {
            render(clock);
            animationId = requestAnimationFrame(draw);
        }
        catch (error) {
            dispose();
            onError(error);
        }
    }
    function resume() {
        if (disposed)
            return;
        cancelAnimationFrame(animationId);
        if (reducedMotion.matches) {
            render(12.9);
            return;
        }
        last = performance.now();
        animationId = requestAnimationFrame(draw);
    }
    function visibilityChanged() { resume(); }
    function motionChanged() { resume(); }
    try {
        init();
        render(reducedMotion.matches ? 12.9 : 0);
        observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; resume(); });
        observer.observe(st);
        document.addEventListener('visibilitychange', visibilityChanged);
        reducedMotion.addEventListener('change', motionChanged);
        onReady();
        resume();
    }
    catch (error) {
        dispose();
        onError(error);
    }
    return { dispose };
}
