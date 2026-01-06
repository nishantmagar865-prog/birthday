// 1. SET THE TARGET DATE
const birthdayDate = new Date("2026-01-07T00:00:00").getTime(); 

let heartsActive = true; // Hearts start as active for the countdown

// --- GLOBAL HEART SPAWNER ---
setInterval(() => {
    if (!heartsActive) return; // Stop spawning if heartsActive is false

    const heart = document.createElement("div");
    const colors = ["❤️", "💖", "💝", "💕", "💗", "💓", "🌸","🤍"];
    heart.className = "floating-heart";
    heart.innerText = colors[Math.floor(Math.random() * colors.length)];
    heart.style.left = Math.random() * 100 + "vw";
    
    const size = Math.random() * 20 + 20; 
    heart.style.fontSize = size + "px";
    
    const duration = Math.random() * 3 + 3;
    heart.style.animationDuration = duration + "s";

    document.body.appendChild(heart);
    setTimeout(() => { heart.remove(); }, duration * 1000);
}, 300);

// --- COUNTDOWN LOGIC ---
const countdownTimer = setInterval(() => {
    const now = new Date().getTime();
    const distance = birthdayDate - now;

    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("timer").innerHTML = (days > 0 ? days + "d " : "") + hours + "h " + minutes + "m " + seconds + "s";
    } 
    else {
        clearInterval(countdownTimer);
        document.getElementById("countdown-screen").classList.add("hidden");
        startFireworks();
    }
}, 1000);

// --- FIREWORKS ---
function startFireworks() {
    heartsActive = false; // Stop hearts during fireworks & video
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y; this.color = color;
            this.velocity = { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 };
            this.alpha = 1;
        }
        draw() {
            ctx.save(); ctx.globalAlpha = this.alpha; ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); ctx.fillStyle = this.color;
            ctx.fill(); ctx.restore();
        }
        update() { this.x += this.velocity.x; this.y += this.velocity.y; this.alpha -= 0.012; }
    }

    const fwInterval = setInterval(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height / 2);
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        for (let i = 0; i < 50; i++) particles.push(new Particle(x, y, color));
    }, 500);

    function animate() {
        if (canvas.style.display === "none") return;
        requestAnimationFrame(animate);
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            if (p.alpha > 0) { p.update(); p.draw(); } else { particles.splice(i, 1); }
        });
    }
    animate();

    setTimeout(() => {
        clearInterval(fwInterval);
        canvas.style.display = "none";
        document.getElementById("letter-container").classList.remove("hidden");
        document.getElementById("letter-container").classList.add("active-section");
    }, 6000);
}

// --- NAVIGATION ---
function openLetter() {
    document.getElementById("letter-container").classList.add("hidden");
    document.getElementById("video-container").classList.remove("hidden");
    document.getElementById("video-container").classList.add("active-section");
    const vid = document.getElementById("birthdayVideo");
    vid.play();
    vid.onended = () => { 
        setTimeout(showGallery, 2000); 
    };
}

function showGallery() {
    heartsActive = true; // RESTART HEARTS for the gallery!
    document.getElementById("video-container").classList.add("hidden");
    document.getElementById("gallery-section").classList.remove("hidden");
    document.getElementById("gallery-section").classList.add("active-section");
}

const photos = ["img1.jpeg", "img5.jpeg", "img7.jpeg", "img9.jpeg", "img2.jpeg","img4.jpeg","img6.jpeg","img8.jpeg","img10.jpeg","img3.jpeg"];
let photoIdx = 0;
function nextPhoto() {
    photoIdx++;
    if(photoIdx < photos.length) {
        document.getElementById("current-img").style.opacity = 0;
        setTimeout(() => {
            document.getElementById("current-img").src = photos[photoIdx];
            document.getElementById("current-img").style.opacity = 1;
        }, 300);
    } else {
        document.getElementById("gallery-section").classList.add("hidden");
        document.getElementById("final-msg").classList.remove("hidden");
        document.getElementById("final-msg").classList.add("active-section");
    }
}