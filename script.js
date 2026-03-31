/* === Phase 3: Splash Screen Loader & Scroll Progress === */
window.addEventListener('load', hideLoader);
document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 2000));

function hideLoader() {
    const loader = document.getElementById('loader');
    if(loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.visibility = 'hidden', 600);
    }
}

window.addEventListener('scroll', () => {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    const scrollBar = document.getElementById('scroll-progress');
    if(scrollBar) scrollBar.style.width = scrolled + "%";
    
    // Navbar styling
    const header = document.getElementById('navbar');
    if(winScroll > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

/* === Phase 3: 3D Holographic Tilt physics for Cards === */
const tiltCards = document.querySelectorAll('.card-3d');

if (window.matchMedia("(pointer: fine)").matches) {
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calculate mouse position relative to card center
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Adjust multiplier to increase/decrease tilt intensity (15 is smooth)
            const rotateX = ((y - centerY) / centerY) * -12; 
            const rotateY = ((x - centerX) / centerX) * 12;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.boxShadow = `0 30px 50px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(0, 255, 163, 0.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset nicely
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.boxShadow = `0 4px 30px rgba(0, 0, 0, 0.1)`;
        });
    });
}

/* === Glowing Cursor Physics === */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hoverTargets = document.querySelectorAll('a, button, input, textarea, .hover-target');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let outlineX = mouseX, outlineY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    if(cursorDot) { cursorDot.style.left = `${mouseX}px`; cursorDot.style.top = `${mouseY}px`; }
});

function animateCursor() {
    let dx = mouseX - outlineX, dy = mouseY - outlineY;
    outlineX += dx * 0.12; outlineY += dy * 0.12;
    if(cursorOutline) { cursorOutline.style.left = `${outlineX}px`; cursorOutline.style.top = `${outlineY}px`; }
    requestAnimationFrame(animateCursor);
}
animateCursor();

hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        if(cursorDot) cursorDot.classList.add('active'); 
        if(cursorOutline) cursorOutline.classList.add('active');
    });
    target.addEventListener('mouseleave', () => {
        if(cursorDot) cursorDot.classList.remove('active'); 
        if(cursorOutline) cursorOutline.classList.remove('active');
    });
});

/* === Terminal Typewriter Effect === */
const terminalLines = [
    { text: "whoami", type: "command" },
    { text: "Abhinav S Mallan", type: "output" },
    { text: "Class 12 CS Student at SN Public School.", type: "output" },
    { text: "./fetch-passion.sh", type: "command" },
    { text: "Extracting core modules...", type: "comment" },
    { text: ">> Coding.jar [Loaded]", type: "output" },
    { text: ">> Creative-Editor.exe [Running]", type: "output" }
];
const termBox = document.getElementById('terminal-text');
const termInput = document.getElementById('terminal-cursor-line');
let terminalTriggered = false;

async function typeTerminal() {
    termInput.style.opacity = "0"; 
    for (let i = 0; i < terminalLines.length; i++) {
        const line = terminalLines[i];
        const row = document.createElement('div');
        termBox.appendChild(row);
        
        if (line.type === "command") {
            row.innerHTML = `<span class="prompt-user">admin@abhinav-pc</span><span class="prompt-char">~$</span> <span class="cmd-highlight"></span>`;
            const cmdSpan = row.querySelector('.cmd-highlight');
            for(let c = 0; c < line.text.length; c++) {
                cmdSpan.innerHTML += line.text[c];
                await new Promise(r => setTimeout(r, Math.random() * 40 + 40));
            }
            await new Promise(r => setTimeout(r, 300));
        } else if (line.type === "comment") {
            row.innerHTML = `<span class="terminal-comment">${line.text}</span>`;
            await new Promise(r => setTimeout(r, 500));
        } else {
            row.innerHTML = `<span class="terminal-output">${line.text}</span>`;
            await new Promise(r => setTimeout(r, 200));
        }
    }
    termInput.style.opacity = "1";
}

/* === Intersection Observers (Fades & Terminal Start) === */
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if(entry.target.classList.contains('terminal-container') && !terminalTriggered) {
                terminalTriggered = true; setTimeout(typeTerminal, 400); 
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
document.querySelectorAll('.appear').forEach(el => observer.observe(el));
document.querySelectorAll('.appear').forEach(el => observer.observe(el));

/* === Canvas Particles === */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [], w, h;
function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

class Particle {
    constructor() {
        this.x = Math.random() * w; this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.8 - 0.4; this.speedY = Math.random() * 0.8 - 0.4;
        this.color = Math.random() > 0.5 ? 'rgba(0, 225, 255, 0.25)' : 'rgba(0, 255, 163, 0.25)';
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > w) this.x = 0; if (this.x < 0) this.x = w;
        if (this.y > h) this.y = 0; if (this.y < 0) this.y = h;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    }
}
function initParticles() {
    particles = [];
    const count = window.innerWidth > 768 ? 60 : 25;
    for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    for(let i = 0; i < particles.length; i++) {
        particles[i].update(); particles[i].draw();
        for(let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            if(distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 - distance/1500})`;
                ctx.lineWidth = 0.5; ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* === Forms and Smooth Scroll === */
const contactForm = document.getElementById('contact-form');
const modal = document.getElementById('popup-modal');
const closeModal = document.getElementById('close-modal');

contactForm.addEventListener('submit', (e) => { e.preventDefault(); modal.classList.remove('hidden'); contactForm.reset(); });
closeModal.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.add('hidden'); });

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
