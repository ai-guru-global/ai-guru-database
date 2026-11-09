document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initTabs();
    initCopy();
    initScrollReveal();
    initHeroDemo();
});

function initNav() {
    const btn = document.getElementById('menu-btn');
    const links = document.getElementById('nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        links.classList.toggle('open');
    });

    links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => links.classList.remove('open'));
    });
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const cmd = document.getElementById('install-command');
    const cmds = {
        mac: 'curl -sSL https://get.ai-news-database.dev | bash',
        linux: 'curl -sSL https://get.ai-news-database.dev | bash',
        windows: 'irm https://get.ai-news-database.dev | iex'
    };
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (cmd && cmds[tab.dataset.os]) {
                cmd.style.opacity = '0';
                setTimeout(() => {
                    cmd.textContent = cmds[tab.dataset.os];
                    cmd.style.opacity = '1';
                }, 100);
            }
        });
    });
}

function initCopy() {
    const btn = document.querySelector('.copy-btn');
    const cmd = document.getElementById('install-command');
    if (!btn || !cmd) return;

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(cmd.textContent);
            const orig = btn.innerHTML;
            btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
            setTimeout(() => { btn.innerHTML = orig; }, 1200);
        } catch (e) { /* noop */ }
    });
}

function initScrollReveal() {
    const els = document.querySelectorAll('.feat, .source');
    if (!els.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
        return;
    }

    let sectionIndex = 0;
    const sectionEls = new Map();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    els.forEach((el) => {
        const parent = el.parentElement;
        if (!sectionEls.has(parent)) {
            sectionEls.set(parent, 0);
        }
        const idx = sectionEls.get(parent);
        sectionEls.set(parent, idx + 1);

        el.style.opacity = '0';
        el.style.transform = 'translateY(6px)';
        el.style.transition = `opacity 0.35s ease ${idx * 50}ms, transform 0.35s ease ${idx * 50}ms`;
        observer.observe(el);
    });
}

function initHeroDemo() {
    const demo = document.getElementById('hero-demo');
    if (!demo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        demo.style.opacity = '1';
        demo.style.transform = 'none';
        return;
    }
    setTimeout(() => demo.classList.add('visible'), 300);
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 56, behavior: 'smooth' });
        }
    });
});
