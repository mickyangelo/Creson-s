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

/* --- UPDATED COUNTDOWN & CONFETTI LOGIC --- */

const weddingDate = new Date("December 20, 2025 00:00:00").getTime();

// Helper function to update a specific set of IDs
function updateTimerUI(prefix, days, hours, minutes, seconds, isWeddingDay, isOver) {
  const timer = document.getElementById(prefix + "countdown-timer");
  const message = document.getElementById(prefix + "wedding-day-message");
  const wrapper = document.getElementById(prefix + "countdown-wrapper");
  
  const d = document.getElementById(prefix + "days");
  const h = document.getElementById(prefix + "hours");
  const m = document.getElementById(prefix + "minutes");
  const s = document.getElementById(prefix + "seconds");

  if (!d) return; // Skip if element not found

  if (isWeddingDay) {
    if(timer) timer.style.display = "none";
    if(message) message.style.display = "block";
  } else if (isOver) {
    if(wrapper) wrapper.style.display = "none";
  } else {
    if(timer) timer.style.display = "flex";
    if(message) message.style.display = "none";
    
    d.innerHTML = days < 10 ? "0" + days : days;
    h.innerHTML = hours < 10 ? "0" + hours : hours;
    m.innerHTML = minutes < 10 ? "0" + minutes : minutes;
    s.innerHTML = seconds < 10 ? "0" + seconds : seconds;
  }
}

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const isWeddingDay = distance <= 0 && distance > -86400000;
  const isOver = distance <= -86400000;
  
  // Calculate time components
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Update Schedule Tab Timer (IDs: days, hours...)
  updateTimerUI("", days, hours, minutes, seconds, isWeddingDay, isOver);

  // Update Home Tab Timer (IDs: home-days, home-hours...)
  updateTimerUI("home-", days, hours, minutes, seconds, isWeddingDay, isOver);

  if (isWeddingDay) return "WEDDING_DAY";
  return "COUNTING";
}

setInterval(updateCountdown, 1000);
updateCountdown(); 


// --- CONFETTI LOGIC ---
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
      y: Math.random() * canvas.height - canvas.height, 
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

// Check on Tab Clicks (Home OR Schedule)
const allTabs = document.querySelectorAll(".tabs");
allTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const tabName = tab.innerText.trim();
    if (tabName === "Schedule" || tabName === "Home") {
      const status = updateCountdown();
      if (status === "WEDDING_DAY") {
        popConfetti();
      }
    }
  });
});

// Check on Load (Since Home is default)
window.addEventListener('load', () => {
  const status = updateCountdown();
  if (status === "WEDDING_DAY") {
    popConfetti();
  }
});