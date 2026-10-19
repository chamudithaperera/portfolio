import { gsap } from 'gsap';
// Adapted from the supplied Cinematic Welcome Intro.html.
export function playWelcomeIntro(root, onComplete) {
    const CONFIG = {
        welcomeText: 'WELCOME',
        t: { welcomeIn: 0, welcomeDur: .85, mistStart: .85, mistDur: .85, brandIn: 1.6, brandDur: .85,
            moveUp: 2.45, moveDur: .85, subIn: 2.6, subDur: .7, outStart: 3.3, outDur: .7 }
    };
    const welcome = root.querySelector('.welcome'), brand = root.querySelector('.brand'), sub = root.querySelector('.sub'), cv = root.querySelector('canvas'), glow = root.querySelector('.bgglow');
    let tl, exitTween, done = false, disposed = false, fontTimer;
    const finish = () => { if (done || disposed)
        return; done = true; tl?.kill(); exitTween?.kill(); onComplete(); };
    const safetyTimer = window.setTimeout(finish, 6500);
    /* ---------- mist: text-alpha-mask sampled into noise-driven wisps ---------- */
    const ctx = cv.getContext("2d");
    let pts = [], W = 0, H = 0, mp = 0;
    function hash(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
    function noise(x, y) {
        const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
        return (hash(xi, yi) * (1 - u) + hash(xi + 1, yi) * u) * (1 - v) + (hash(xi, yi + 1) * (1 - u) + hash(xi + 1, yi + 1) * u) * v;
    }
    function sample() {
        W = cv.width = root.clientWidth;
        H = cv.height = root.clientHeight;
        const r = welcome.getBoundingClientRect(), cs = getComputedStyle(welcome);
        const off = document.createElement("canvas");
        off.width = W;
        off.height = H;
        const o = off.getContext("2d");
        if (!o)
            return;
        o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        o.textAlign = "center";
        o.textBaseline = "middle";
        o.fillStyle = "#fff";
        if ("letterSpacing" in o)
            o.letterSpacing = cs.letterSpacing;
        o.fillText(CONFIG.welcomeText, r.left + r.width / 2, r.top + r.height / 2 + parseFloat(cs.fontSize) * .04);
        const d = o.getImageData(0, 0, W, H).data;
        let step = 2;
        pts = [];
        const bbW = Math.min(W, r.width);
        step = Math.max(2, Math.round(bbW * parseFloat(cs.fontSize) / (9000 * 6)));
        for (let y = 0; y < H; y += step)
            for (let x = 0; x < W; x += step) {
                if (d[(y * W + x) * 4 + 3] > 128) {
                    const n = noise(x * .006, y * .009);
                    pts.push({ x, y, d: n * .5 + Math.random() * .08, a: Math.random() * 6.28, s: 20 + Math.random() * 60, r: Math.random() });
                }
            }
        if (pts.length > 14000) {
            pts = pts.filter((_, i) => i % Math.ceil(pts.length / 14000) === 0);
        }
        step = step || 2;
        sample.step = step;
    }
    function draw() {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#D6DBE5";
        const sz = sample.step + 0.4;
        for (const p of pts) {
            const q = Math.min(1, Math.max(0, (mp - p.d) / 0.5));
            if (q >= 1)
                continue;
            const e = q * q;
            const x = p.x + Math.cos(p.a) * p.s * e * .6 + (noise(p.x * .01 + mp * 2, p.y * .01) - .5) * 40 * e;
            const y = p.y - (14 + p.s * 1.1) * e;
            ctx.globalAlpha = Math.pow(1 - q, 1.6) * (.95 - .35 * p.r * q);
            const s = sz + e * 2.2 * p.r;
            ctx.fillRect(x, y, s, s);
        }
        ctx.globalAlpha = 1;
    }
    function onResize() { if (mp > 0 && mp < 1) {
        sample();
        draw();
    } }
    window.addEventListener("resize", onResize);
    const mist = { set p(v) { mp = v; }, get p() { return mp; } };
    /* ---------- master timeline ---------- */
    function build() {
        const T = CONFIG.t, ease = "power3.out", chars = brand.querySelectorAll(".c");
        gsap.set(welcome, { opacity: 0, scale: 1.06, filter: "blur(14px)" });
        gsap.set(sub, { opacity: 0, filter: "blur(6px)" });
        gsap.set(chars, { opacity: 0, y: 16, filter: "blur(6px)" });
        tl = gsap.timeline({ onComplete: finish });
        tl.to(welcome, { opacity: 1, scale: 1, filter: "blur(0px)", duration: T.welcomeDur, ease }, T.welcomeIn)
            .to(glow, { opacity: 1, duration: T.welcomeDur, ease: "sine.out" }, T.welcomeIn);
        if (Boolean(ctx)) {
            tl.call(() => { sample(); draw(); cv.style.opacity = 1; }, null, T.mistStart)
                .to(welcome, { opacity: 0, filter: "blur(5px)", duration: .22, ease: "power1.in" }, T.mistStart + .02)
                .to(mist, { p: 1.0, duration: T.mistDur, ease: "power1.in", onUpdate: draw,
                onComplete() { ctx.clearRect(0, 0, W, H); cv.style.opacity = 0; } }, T.mistStart)
                .to(glow, { opacity: .35, duration: T.mistDur, ease: "sine.inOut" }, T.mistStart);
        }
        else { // lightweight fallback: soft blur + rise + fade
            tl.to(welcome, { opacity: 0, y: -18, scale: 1.03, filter: "blur(16px)", duration: T.mistDur, ease: "power2.in" }, T.mistStart);
        }
        tl.to(chars, { opacity: 1, y: 0, filter: "blur(0px)", duration: T.brandDur, ease, stagger: .022 }, T.brandIn)
            .to(brand, { y: () => -Math.min(30, Math.max(14, window.innerWidth * .036)), duration: T.moveDur, ease: "sine.inOut" }, T.moveUp)
            .to(sub, { opacity: 1, y: 0, filter: "blur(0px)", duration: T.subDur, ease: "power2.out" }, T.subIn)
            .to([brand, sub], { opacity: 0, duration: .35, ease: "power1.inOut" }, T.outStart)
            .to(glow, { opacity: 0, duration: T.outDur, ease: "sine.inOut" }, T.outStart)
            .to(root, { backgroundColor: "rgba(8,9,13,0)", duration: T.outDur - .1, ease: "sine.inOut" }, T.outStart + .1);
        tl.timeScale(1);
    }
    const skip = () => {
        if (done || disposed)
            return;
        tl?.kill();
        exitTween = gsap.to(root, { opacity: 0, duration: .25, ease: 'power1.out', onComplete: finish });
    };
    const keydown = event => {
        if (event.key === 'Escape') {
            event.preventDefault();
            skip();
        }
        // The intro has one interactive control; keep keyboard focus within it.
        if (event.key === 'Tab') {
            event.preventDefault();
            root.querySelector('.skip')?.focus();
        }
    };
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionChanged = () => { if (motion.matches)
        finish(); };
    root.querySelector('.skip').addEventListener('click', skip);
    window.addEventListener('keydown', keydown);
    motion.addEventListener('change', motionChanged);
    const fonts = document.fonts?.ready || Promise.resolve();
    Promise.race([fonts, new Promise(resolve => { fontTimer = window.setTimeout(resolve, 1200); })])
        .then(() => { window.clearTimeout(fontTimer); if (!done && !disposed) {
        try {
            build();
        }
        catch (error) {
            finish();
        }
    } })
        .catch(finish);
    return () => {
        disposed = true;
        tl?.kill();
        exitTween?.kill();
        window.clearTimeout(safetyTimer);
        window.clearTimeout(fontTimer);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('keydown', keydown);
        motion.removeEventListener('change', motionChanged);
        root.querySelector('.skip')?.removeEventListener('click', skip);
    };
}
