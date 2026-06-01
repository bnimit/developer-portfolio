/**
 * NIMIT BHANDARI — TERMINAL PORTFOLIO
 * Boot sequence · Typewriter · Uptime · Scroll animations
 */

// ============================================
// BOOT SEQUENCE
// ============================================
const bootLines = [
    { text: 'BIOS Date: 06/01/26 10:01:33', type: 'info', delay: 0 },
    { text: 'CPU: AMD Ryzen 9 7950X @ 5.7GHz', type: 'info', delay: 80 },
    { text: 'Memory Test: 65536K OK', type: 'ok', delay: 160 },
    { text: 'Loading kernel...', type: 'info', delay: 320 },
    { text: '[ OK ] Mounted /dev/sda1', type: 'ok', delay: 480 },
    { text: '[ OK ] Started Networking', type: 'ok', delay: 560 },
    { text: '[ OK ] Started SSH server', type: 'ok', delay: 640 },
    { text: 'Mounting portfolio filesystem...', type: 'info', delay: 800 },
    { text: '[ OK ] Mounted /home/nimit/portfolio', type: 'ok', delay: 960 },
    { text: 'Initializing user session...', type: 'info', delay: 1120 },
    { text: 'Welcome, visitor.', type: 'ok', delay: 1400 },
    { text: 'Type \'help\' for available commands.', type: 'dim', delay: 1500 },
];

const bootLog = document.getElementById('boot-log');
const bootScreen = document.getElementById('boot');

function runBoot() {
    bootLines.forEach((line, i) => {
        setTimeout(() => {
            const el = document.createElement('span');
            el.className = `boot-line ${line.type}`;
            el.textContent = line.text;
            bootLog.appendChild(el);
            bootLog.appendChild(document.createElement('br'));
        }, line.delay + i * 40);
    });

    setTimeout(() => {
        bootScreen.classList.add('done');
        setTimeout(() => {
            typeHeroCmd();
            typeContactCmd();
            startUptime();
        }, 600);
    }, 2200);
}

// ============================================
// TYPEWRITER
// ============================================
function typewriter(element, text, speed = 40) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = '';
        function tick() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(tick, speed + Math.random() * 20);
            } else {
                resolve();
            }
        }
        tick();
    });
}

function typeHeroCmd() {
    const cmd = document.getElementById('hero-cmd');
    const cursor = document.getElementById('hero-cursor');
    const output = document.getElementById('hero-output');
    if (!cmd) return;

    typewriter(cmd, 'whoami').then(() => {
        cursor.classList.remove('blink');
        setTimeout(() => {
            output.style.display = 'block';
            cursor.style.display = 'none';
        }, 400);
    });
}

function typeContactCmd() {
    const cmd = document.getElementById('contact-cmd');
    if (!cmd) return;
    typewriter(cmd, 'ssh nimit@outlook.com', 30);
}

// ============================================
// UPTIME
// ============================================
function startUptime() {
    const el = document.getElementById('uptime');
    if (!el) return;
    const start = Date.now();
    function tick() {
        const diff = Math.floor((Date.now() - start) / 1000);
        const m = Math.floor(diff / 60);
        const s = diff % 60;
        el.textContent = `uptime: ${m}m ${s.toString().padStart(2, '0')}s`;
        requestAnimationFrame(tick);
    }
    tick();
}

// ============================================
// SCROLL REVEAL FOR BARS
// ============================================
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
                    bar.style.width = width;
                }, i * 100);
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.neofetch-info').forEach(el => barObserver.observe(el));

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // 'h' or '?' for help
    if (e.key === 'h' || e.key === '?') {
        alert('Keyboard shortcuts:\n\nh / ? — Help\ng — Go to GitHub\nm — Send email\n1-5 — Jump to sections');
    }
    // 'g' for github
    if (e.key === 'g') {
        window.open('https://github.com/bnimit', '_blank');
    }
    // 'm' for mail
    if (e.key === 'm') {
        window.location.href = 'mailto:nimitbhandari@outlook.com';
    }
    // Number keys for sections
    const sections = ['hero', 'about', 'experience', 'skills', 'projects'];
    const num = parseInt(e.key);
    if (num >= 1 && num <= 5) {
        document.getElementById(sections[num - 1]).scrollIntoView({ behavior: 'smooth' });
    }
});

// ============================================
// EXPANDABLE EXPERIENCE DETAILS
// ============================================
const expFiles = {
    eukarya: 'cat eukarya.md',
    clikdone: 'cat clikdone.md',
    dome: 'cat dome_global.md',
    mavenlink: 'cat mavenlink.md',
    gs: 'cat goldman_sachs.md',
    hitachi: 'cat hitachi_rd.md',
    oracle: 'cat oracle_india.md',
    hp: 'cat hp_india.md'
};

const activeExpTypewriters = new Map();

function toggleExpDetail(row) {
    const company = row.dataset.company;
    const detail = document.getElementById(`exp-${company}`);
    const cmdEl = detail.querySelector('.exp-cmd-line .cmd');
    const cursor = detail.querySelector('.exp-cmd-line .cursor');
    const isOpen = detail.classList.contains('open');

    // Close all others (accordion style — optional, remove if you want multiple open)
    document.querySelectorAll('.exp-detail.open').forEach(openDetail => {
        if (openDetail !== detail) {
            openDetail.classList.remove('open');
            const openRow = document.querySelector(`.ls-row[data-company="${openDetail.id.replace('exp-', '')}"]`);
            if (openRow) openRow.classList.remove('open');
            openRow?.setAttribute('aria-expanded', 'false');
        }
    });

    if (isOpen) {
        detail.classList.remove('open');
        row.classList.remove('open');
        row.setAttribute('aria-expanded', 'false');
        // cancel any ongoing typewriter
        if (activeExpTypewriters.has(company)) {
            clearTimeout(activeExpTypewriters.get(company));
            activeExpTypewriters.delete(company);
        }
        return;
    }

    detail.classList.add('open');
    row.classList.add('open');
    row.setAttribute('aria-expanded', 'true');

    // Type the command
    const text = expFiles[company] || `cat ${company}.md`;
    cmdEl.textContent = '';
    cursor.classList.add('blink');

    // Cancel any previous typewriter for this company
    if (activeExpTypewriters.has(company)) {
        clearTimeout(activeExpTypewriters.get(company));
    }

    let i = 0;
    function tick() {
        if (i < text.length) {
            cmdEl.textContent += text.charAt(i);
            i++;
            const timeoutId = setTimeout(tick, 30 + Math.random() * 20);
            activeExpTypewriters.set(company, timeoutId);
        } else {
            cursor.classList.remove('blink');
            cursor.style.opacity = '0';
            activeExpTypewriters.delete(company);
        }
    }
    tick();
}

document.querySelectorAll('.ls-row[data-company]').forEach(row => {
    row.addEventListener('click', () => toggleExpDetail(row));
    row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpDetail(row);
        }
    });
});

// ============================================
// INIT
// ============================================
runBoot();
