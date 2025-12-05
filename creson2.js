      document.addEventListener('DOMContentLoaded', () => {
        const tabs = document.querySelectorAll(".tabs");
        // We select the content divs based on the order in the HTML or by ID mapping
        // The original code used index mapping, so we must ensure the order of .tabs matches the order of content IDs
        // Order: Home, Schedule, Party, Gallery, Story, Things
        const contents = [
          document.getElementById('home'),
          document.getElementById('story'),
          document.getElementById('party'),
          document.getElementById('gallery'),
          document.getElementById('schedule'),
          document.getElementById('things')
        ];

        tabs.forEach((tab, index) => {
          tab.addEventListener("click", () => {
            // Remove active state from all tabs + contents
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => {
              if(c) c.classList.remove("active");
            });

            // Add active state to clicked tab + matching content
            tab.classList.add("active");
            if(contents[index]) contents[index].classList.add("active");
          });
        });
        
        // Ensure first tab is active on load if not already handled by HTML class
        // (The HTML above already has class="active" on the first tab/content)
      });

      /* --- COUNTDOWN & CONFETTI LOGIC --- */

// 1. Set the date we're counting down to
const weddingDate = new Date("December 20, 2025 00:00:00").getTime();

// 2. Countdown Function
function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const countdownTimer = document.getElementById("countdown-timer");
  const weddingMessage = document.getElementById("wedding-day-message");
  
  // Elements
  const d = document.getElementById("days");
  const h = document.getElementById("hours");
  const m = document.getElementById("minutes");
  const s = document.getElementById("seconds");

  if (!d || !h || !m || !s) return; // Safety check

  // Check if it's the wedding day (24 hour window)
  const isWeddingDay = distance <= 0 && distance > -86400000;
  // Check if wedding is over
  const isOver = distance <= -86400000;

  if (isWeddingDay) {
    countdownTimer.style.display = "none";
    weddingMessage.style.display = "block";
    return "WEDDING_DAY";
  } else if (isOver) {
    // Hide everything after the date
    document.getElementById("countdown-wrapper").style.display = "none";
    return "OVER";
  } else {
    // Show Countdown
    countdownTimer.style.display = "flex";
    weddingMessage.style.display = "none";

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    d.innerHTML = days < 10 ? "0" + days : days;
    h.innerHTML = hours < 10 ? "0" + hours : hours;
    m.innerHTML = minutes < 10 ? "0" + minutes : minutes;
    s.innerHTML = seconds < 10 ? "0" + seconds : seconds;
    
    return "COUNTING";
  }
}

// Update every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Run immediately

// 3. Confetti Logic
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let confettiParticles = [];

function resizeCanvas() {
  if(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createConfetti() {
  const colors = ['#a99d1f', '#f5efe8', '#eebb33', '#ffffff'];
  for (let i = 0; i < 100; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height, // Start above screen
      w: Math.random() * 10 + 5,
      h: Math.random() * 5 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.2
    });
  }
}

function drawConfetti() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  confettiParticles.forEach((p, index) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
    
    p.y += p.speed;
    p.angle += p.rotationSpeed;
    
    // Remove if off screen
    if (p.y > canvas.height) {
      confettiParticles.splice(index, 1);
    }
  });
  
  if (confettiParticles.length > 0) {
    requestAnimationFrame(drawConfetti);
  }
}

function popConfetti() {
  if(!ctx) return;
  createConfetti();
  drawConfetti();
}

// 4. Hook into Schedule Tab Click
// Find the schedule tab text and add listener
const allTabs = document.querySelectorAll(".tabs");
allTabs.forEach(tab => {
  if (tab.innerText.trim() === "Schedule") {
    tab.addEventListener("click", () => {
      // Check status directly
      const status = updateCountdown();
      if (status === "WEDDING_DAY") {
        popConfetti();
      }
    });
  }
});