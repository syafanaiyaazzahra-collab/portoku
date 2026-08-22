/**
 * PORTFOLIO JAVASCRIPT - ANYA (SYAFA NAIYA AZ ZAHRA)
 * Features:
 * 1. Three.js 3D Interactive Cyber Geometry (Mouse/Touch Drag & Parallax)
 * 2. Supabase Real-time Rating & Feedback Database
 * 3. GitHub API Live Repositories Integration
 * 4. Certificate Gallery 3-Category Filter & Modal Lightbox
 * 5. Typewriter, Scroll Progress, Scroll Reveal, Theme Switcher & Toast
 */

// SUPABASE CREDENTIALS
const SUPABASE_URL = 'https://iorssmjivxszetxdscxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvcnNzbWppdnhzemV0eGRzY3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxODkwODEsImV4cCI6MjEwMjc2NTA4MX0.MEDJFu2I-IUT5Jmq4AqrRA7q0QUFtJxeDjcQN0PJ-Z4';

// GITHUB CONFIG
const GITHUB_USERNAME = 'syafanaiyaazzahra-collab';

document.addEventListener('DOMContentLoaded', () => {
  init3DHeroCanvas();
  initTypewriter();
  initScrollProgress();
  initNavbarScroll();
  initScrollReveal();
  initSkillBars();
  initProjectFilter();
  initCertFilter();
  initGitHubIntegration();
  initThemeToggle();
  initContactForm();
  initBackToTop();
  initSupabaseRatings();
});

/* ==========================================================================
   1. THREE.JS 3D INTERACTIVE HERO SCENE
   ========================================================================== */
function init3DHeroCanvas() {
  const container = document.getElementById('threeCanvasContainer');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group to rotate together
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. Core Glowing Icosahedron (Inner Tech Core)
  const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
  const coreMat = new THREE.MeshPhongMaterial({
    color: 0x00d2ff,
    wireframe: true,
    transparent: true,
    opacity: 0.65,
    shininess: 100
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  mainGroup.add(coreMesh);

  // 2. Outer Torus Ring
  const torusGeo = new THREE.TorusGeometry(2.4, 0.04, 16, 100);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0.75
  });
  const torusMesh = new THREE.Mesh(torusGeo, torusMat);
  torusMesh.rotation.x = Math.PI / 3;
  mainGroup.add(torusMesh);

  // 3. Second Slanted Outer Ring
  const ringGeo = new THREE.TorusGeometry(2.7, 0.03, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.45
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.y = Math.PI / 4;
  ringMesh.rotation.x = -Math.PI / 6;
  mainGroup.add(ringMesh);

  // 4. Orbiting Cyber Particles
  const particleCount = 180;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    const r = 2.2 + Math.random() * 1.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    particlePos[i] = r * Math.sin(phi) * Math.cos(theta);
    particlePos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    particlePos[i + 2] = r * Math.cos(phi);
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00d2ff,
    size: 0.06,
    transparent: true,
    opacity: 0.8
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  mainGroup.add(particleSystem);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x00d2ff, 2.5, 20);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x6366f1, 2, 20);
  pointLight2.position.set(-5, -5, 3);
  scene.add(pointLight2);

  // Interactive Mouse/Touch Rotation
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    } else {
      // Subtle Parallax on Hover
      const rect = container.getBoundingClientRect();
      const mouseNormX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const mouseNormY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotationY = mouseNormX * 0.4;
      targetRotationX = -mouseNormY * 0.4;
    }
  });

  // Touch Support for Mobile
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  });

  container.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Render Loop
  function animate() {
    requestAnimationFrame(animate);

    // Continuous smooth rotation
    coreMesh.rotation.y += 0.005;
    coreMesh.rotation.x += 0.003;
    torusMesh.rotation.z += 0.006;
    ringMesh.rotation.z -= 0.004;
    particleSystem.rotation.y += 0.002;

    // Smooth drag interpolation
    mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.08;
    mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.08;

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* ==========================================================================
   2. GITHUB LIVE INTEGRATION (REPOSITORIES API)
   ========================================================================== */
async function initGitHubIntegration() {
  const container = document.getElementById('githubRepoContainer');
  if (!container) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
    if (!res.ok) {
      throw new Error('Gagal memuat repositori GitHub.');
    }
    const repos = await res.json();

    if (!repos || repos.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-dim);">Belum ada public repository ditemukan.</div>`;
      return;
    }

    container.innerHTML = repos.map(repo => {
      const lang = repo.language || 'Code';
      const stars = repo.stargazers_count || 0;
      const forks = repo.forks_count || 0;
      const desc = repo.description || 'Proyek pengembangan software & implementasi kode di GitHub.';
      
      return `
        <div class="project-card" style="animation: fadeIn 0.4s ease;">
          <div>
            <div class="project-card-top">
              <div class="project-icon-box"><i class="fa-brands fa-github"></i></div>
              <span class="tech-tag" style="background: rgba(0, 210, 255, 0.12); border-color: rgba(0, 210, 255, 0.35); color: var(--accent);">
                ${lang}
              </span>
            </div>
            <h3 style="font-size: 1.25rem;">${escapeHtml(repo.name)}</h3>
            <p>${escapeHtml(desc)}</p>
            <div style="display: flex; gap: 14px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-dim); margin-bottom: 20px;">
              <span><i class="fa-regular fa-star" style="color: #F59E0B;"></i> ${stars} stars</span>
              <span><i class="fa-solid fa-code-fork"></i> ${forks} forks</span>
              <span><i class="fa-regular fa-clock"></i> Updated ${new Date(repo.updated_at).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
          <div class="project-actions">
            <a href="${repo.html_url}" target="_blank" class="project-link-btn" style="color: var(--accent);">
              <i class="fa-brands fa-github"></i> Buka Repository
            </a>
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>` : ''}
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Error fetching GitHub repos:', err);
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 20px; font-family: var(--font-mono);">
        <p>⚠️ Tidak dapat menghubungkan ke GitHub API saat ini.</p>
        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="btn btn-outline" style="margin-top: 12px; font-size: 0.82rem;">
          <i class="fa-brands fa-github"></i> Kunjungi Profil GitHub Langsung
        </a>
      </div>
    `;
  }
}

/* ==========================================================================
   3. CERTIFICATES 3-CATEGORY FILTER & MODAL LIGHTBOX
   ========================================================================== */
function initCertFilter() {
  const certBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.cert-card');
  const countDisplay = document.getElementById('certCountDisplay');

  certBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      certBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-cert');
      let visible = 0;

      certCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease forwards';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countDisplay) {
        countDisplay.textContent = `Menampilkan ${visible} Sertifikat`;
      }
    });
  });
}

// Global modal handlers
window.openCertModal = function(title, issuer, imgSrc, desc) {
  const modal = document.getElementById('certModal');
  const modalTitle = document.getElementById('certModalTitle');
  const modalSub = document.getElementById('certModalSub');
  const modalDesc = document.getElementById('certModalDesc');

  if (modalTitle) modalTitle.textContent = title;
  if (modalSub) modalSub.textContent = issuer;
  if (modalDesc) modalDesc.textContent = desc;

  if (modal) modal.classList.add('open');
};

window.closeCertModal = function() {
  const modal = document.getElementById('certModal');
  if (modal) modal.classList.remove('open');
};

// Close modal on click outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('certModal');
  if (e.target === modal) {
    closeCertModal();
  }
});

/* ==========================================================================
   4. SUPABASE PORTFOLIO RATING SYSTEM
   ========================================================================== */
let selectedStarRating = 5;

function initSupabaseRatings() {
  const starPicker = document.getElementById('starRatingPicker');
  const ratingForm = document.getElementById('ratingForm');
  
  if (starPicker) {
    const stars = starPicker.querySelectorAll('i');
    updateStarPickerVisual(5);

    stars.forEach((star) => {
      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.getAttribute('data-value'), 10);
        updateStarPickerVisual(val);
      });

      star.addEventListener('click', () => {
        selectedStarRating = parseInt(star.getAttribute('data-value'), 10);
        updateStarPickerVisual(selectedStarRating);
      });
    });

    starPicker.addEventListener('mouseleave', () => {
      updateStarPickerVisual(selectedStarRating);
    });
  }

  if (ratingForm) {
    ratingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedbackInput = document.getElementById('ratingFeedback');
      const submitBtn = document.getElementById('btnSubmitRating');
      const message = feedbackInput ? feedbackInput.value.trim() : '';

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan ke Supabase...`;

      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio_reviews`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            rating: selectedStarRating,
            message: message || 'Rating bintang ' + selectedStarRating
          })
        });

        if (res.ok) {
          showToast('⭐ Terima kasih! Rating berhasil disimpan di Supabase.');
          if (feedbackInput) feedbackInput.value = '';
          selectedStarRating = 5;
          updateStarPickerVisual(5);
          loadSupabaseRatings(); // Refresh feed
        } else {
          showToast('⚠️ Gagal menyimpan rating ke database.');
        }
      } catch (err) {
        console.error('Error submitting rating:', err);
        showToast('⚠️ Koneksi ke Supabase terganggu.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Kirim Rating & Ulasan</span> <i class="fa-solid fa-paper-plane"></i>`;
      }
    });
  }

  loadSupabaseRatings();
}

function updateStarPickerVisual(rating) {
  const starPicker = document.getElementById('starRatingPicker');
  if (!starPicker) return;
  const stars = starPicker.querySelectorAll('i');
  stars.forEach((s) => {
    const val = parseInt(s.getAttribute('data-value'), 10);
    if (val <= rating) {
      s.className = 'fa-solid fa-star active';
    } else {
      s.className = 'fa-regular fa-star';
    }
  });
}

async function loadSupabaseRatings() {
  const scoreNum = document.getElementById('ratingScoreNum');
  const starsDisplay = document.getElementById('ratingStarsDisplay');
  const countDisplay = document.getElementById('ratingCountDisplay');
  const reviewsFeed = document.getElementById('reviewsFeed');

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio_reviews?select=*&order=id.desc&limit=15`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!res.ok) return;

    const data = await res.json();
    if (!data || data.length === 0) return;

    const total = data.reduce((acc, curr) => acc + (curr.rating || 5), 0);
    const avg = (total / data.length).toFixed(1);

    if (scoreNum) scoreNum.textContent = avg;
    if (countDisplay) countDisplay.textContent = `Berdasarkan ${data.length} ulasan pengunjung (Supabase DB)`;

    if (starsDisplay) {
      let starsHtml = '';
      const rounded = Math.round(avg);
      for (let i = 1; i <= 5; i++) {
        starsHtml += i <= rounded ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
      }
      starsDisplay.innerHTML = starsHtml;
    }

    if (reviewsFeed) {
      reviewsFeed.innerHTML = data.map(item => {
        const starCount = item.rating || 5;
        let starStr = '';
        for (let i = 0; i < starCount; i++) starStr += '★';
        return `
          <div class="review-item-card">
            <div class="review-header">
              <span class="review-stars">${starStr} (${starCount}/5)</span>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">#Review-${item.id}</span>
            </div>
            <p class="review-text">${escapeHtml(item.message || 'Rating bintang ' + starCount)}</p>
          </div>
        `;
      }).join('');
    }
  } catch (err) {
    console.error('Error fetching Supabase reviews:', err);
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   5. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriterText');
  if (!target) return;

  const roles = [
    "Full-Stack Web Developer",
    "Informatics Engineering @ UKSW",
    "Software & Frontend Engineer",
    "Algorithms & System Builder"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      delay = 45;
    } else {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      delay = 110;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      delay = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   6. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  });
}

/* ==========================================================================
   7. NAVBAR SCROLL & MOBILE MENU
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('header.navbar');
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   8. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach(item => observer.observe(item));
}

/* ==========================================================================
   9. SKILL BARS ON SCROLL
   ========================================================================== */
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  if (!skillSection) return;

  const fills = document.querySelectorAll('.progress-fill');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fills.forEach(fill => {
            const width = fill.getAttribute('data-level') || '75%';
            fill.style.width = width;
          });
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(skillSection);
}

/* ==========================================================================
   10. PROJECT CATEGORY FILTER
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const countLabel = document.getElementById('projectCount');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      let visibleCount = 0;

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || (cat && cat.includes(filter))) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countLabel) {
        countLabel.textContent = `${visibleCount} project ditampilkan`;
      }
    });
  });
}

/* ==========================================================================
   11. THEME TOGGLE (CYBER TECH / MIDNIGHT GOLD)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const themeLabel = document.getElementById('themeLabel');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('anya_theme') || 'dev';
  if (savedTheme === 'gold') {
    document.body.setAttribute('data-mode', 'gold');
    if (themeLabel) themeLabel.textContent = 'Gold Studio';
  } else {
    document.body.removeAttribute('data-mode');
    if (themeLabel) themeLabel.textContent = 'Cyber Tech';
  }

  toggleBtn.addEventListener('click', () => {
    const isGold = document.body.getAttribute('data-mode') === 'gold';
    if (isGold) {
      document.body.removeAttribute('data-mode');
      if (themeLabel) themeLabel.textContent = 'Cyber Tech';
      localStorage.setItem('anya_theme', 'dev');
      showToast('⚡ Mode switched: Cyber Tech');
    } else {
      document.body.setAttribute('data-mode', 'gold');
      if (themeLabel) themeLabel.textContent = 'Gold Studio';
      localStorage.setItem('anya_theme', 'gold');
      showToast('✨ Mode switched: Gold Studio');
    }
  });
}

/* ==========================================================================
   12. CONTACT FORM (WHATSAPP DIRECT)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const subject = document.getElementById('senderSubject').value.trim();
    const message = document.getElementById('senderMsg').value.trim();

    if (!name || !message) {
      showToast('⚠️ Harap isi nama dan pesan.');
      return;
    }

    const waText = `Halo Anya!%0A%0A*Nama:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Topik:* ${encodeURIComponent(subject)}%0A%0A*Pesan:*%0A${encodeURIComponent(message)}`;
    const waUrl = `https://wa.me/6288226696662?text=${waText}`;

    showToast('🚀 Mengalihkan ke WhatsApp Anya...');
    setTimeout(() => {
      window.open(waUrl, '_blank');
      form.reset();
    }, 800);
  });

  window.copyToClipboard = function(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`📋 Berhasil disalin: ${label}`);
    }).catch(() => {
      showToast(`Gagal menyalin.`);
    });
  };
}

/* ==========================================================================
   13. TOAST NOTIFICATION
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent);"></i> ${message}`;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   14. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
