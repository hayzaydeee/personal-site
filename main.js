// ====== UTILITY FUNCTIONS ======
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}

function isMobile() {
  return window.innerWidth <= 1024;
}

// ====== DOM CONTENT LOADED HANDLER ======
document.addEventListener("DOMContentLoaded", function() {
  // Initialize all functionality
  initThemeToggle();
  initScrollEffects();
  initSkillsSection();
  initResumeModal();
  initPageTransitions();
  initTypingAnimation();
  initBackgroundReveal();
  
  // Mark page as loaded (for animations)
  document.body.classList.add("loaded");
});

// ====== THEME FUNCTIONALITY ======
function initThemeToggle() {
  // Create the toggle button
  const themeToggle = document.createElement("button");
  themeToggle.className = "theme-toggle";
  themeToggle.setAttribute("aria-label", "Toggle dark/light mode");
  themeToggle.innerHTML = `
    <svg class="icon sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
    <svg class="icon moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  `;
  
  // Find the header-right element to append the toggle to
  const headerRight = document.querySelector('.header-right');
  if (headerRight) {
    // Insert before the hamburger
    headerRight.insertBefore(themeToggle, headerRight.firstChild);
  } else {
    // Fallback to body if header-right doesn't exist
    document.body.appendChild(themeToggle);
  }
  
  // Check for saved theme preference
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const savedTheme = localStorage.getItem("theme");
  
  // Set initial theme
  if (savedTheme === "dark" || (!savedTheme && prefersDarkScheme.matches)) {
    document.body.classList.add("dark-mode");
  }
  
  // Toggle theme function
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
  });
}

// ====== SCROLL EFFECTS ======
function initScrollEffects() {
  // Header scroll effect
  const topHeader = document.querySelector('.top-header');
  if (topHeader) {
    const updateHeaderOnScroll = () => {
      topHeader.classList.toggle('scrolled', window.scrollY > 50);
    };
    
    // Set initial state and add listener
    updateHeaderOnScroll();
    window.addEventListener('scroll', updateHeaderOnScroll);
  }
  
  // Back to Top button
  const backToTopButton = document.getElementById("backToTop");
  if (backToTopButton) {
    // Show/hide based on scroll position
    window.addEventListener("scroll", () => {
      backToTopButton.classList.toggle("visible", window.scrollY > 300);
    });
    
    // Smooth scroll to top
    backToTopButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  
  // Scroll to Skills section
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", () => {
      const skillsSection = document.getElementById("skills");
      if (skillsSection) {
        skillsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
  
  // CTA section visibility
  const ctaSection = document.querySelector(".cta-section");
  if (ctaSection) {
    const checkCTAVisibility = () => {
      if (ctaSection.getBoundingClientRect().top < window.innerHeight - 100) {
        ctaSection.classList.add("visible");
        window.removeEventListener("scroll", checkCTAVisibility);
      }
    };
    
    window.addEventListener("scroll", checkCTAVisibility);
    checkCTAVisibility(); // Check immediately
  }
  
  // General scroll animation handler
  window.addEventListener("scroll", () => {
    const skillsSection = document.querySelector(".skills-section");
    if (skillsSection && isInViewport(skillsSection) && 
        !skillsSection.classList.contains("visible")) {
      skillsSection.classList.add("visible");
    }
  });
}

// ====== SKILLS SECTION ======
function initSkillsSection() {
  // Configure IntersectionObserver for skills
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const skillsSection = entry.target;
        skillsSection.classList.add("visible");

        // Process each experience bar
        skillsSection.querySelectorAll(".skill-list li").forEach((item) => {
          const bar = item.querySelector(".experience-level");
          const barContainer = item.querySelector(".experience-bar");

          if (bar && barContainer) {
            // Get the width percentage
            const width = bar.style.width;
            
            // Store as custom property
            barContainer.style.setProperty("--skill-level", width);
            
            // Reset initial width for animation
            bar.style.width = "0%";

            // Create percentage indicator if needed
            if (!item.querySelector(".percent-indicator")) {
              const percentIndicator = document.createElement("span");
              percentIndicator.className = "percent-indicator";
              percentIndicator.textContent = width;
              item.insertBefore(percentIndicator, item.firstChild);
            }
          }
        });

        skillsObserver.unobserve(skillsSection);
      }
    });
  }, options);

  // Observe skills section
  const skillsSection = document.querySelector(".skills-section");
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // Touch support for mobile
  document.querySelectorAll(".skill-list li").forEach((item) => {
    item.addEventListener("touchstart", function(e) {
      e.preventDefault();
      const isActive = this.classList.contains("active-skill");
      
      // Remove active from all
      document.querySelectorAll(".skill-list li").forEach((i) => 
        i.classList.remove("active-skill"));
      
      // Add active to current if not already active
      if (!isActive) {
        this.classList.add("active-skill");
      }
    });
  });
}

// ====== RESUME MODAL ======
function initResumeModal() {
  const resumeBtns = document.querySelectorAll(".resume-btn");
  if (resumeBtns.length === 0) return;

  // Create or find modal
  let modal = document.getElementById("resume-modal");
  if (!modal) {
    modal = createResumeModal();
  }

  const closeBtn = modal.querySelector(".close-modal");
  
  // Open modal handler
  resumeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  // Close modal function
  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  // Close button handler
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  // Outside click handler
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC key handler
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });

  // Check hash for direct link
  if (window.location.hash === "#resume-modal") {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

// ===== DYNAMICALLY CREATE RESUME MODAL =====
function createResumeModal() {
  const modal = document.createElement("div");
  modal.id = "resume-modal";
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>my résumé</h2>
      <div class="resume-container">
        <iframe src="media/Divine's CVV.pdf" frameborder="0"></iframe>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

// ====== PAGE TRANSITIONS ======
function initPageTransitions() {
  // Create transition overlay
  const transitionOverlay = document.createElement("div");
  transitionOverlay.className = "page-transition-overlay";
  
  const pageName = document.createElement("h2");
  pageName.className = "transition-page-name";
  
  transitionOverlay.appendChild(pageName);
  document.body.appendChild(transitionOverlay);

  // Navigation link handlers
  document.querySelectorAll(".navbar a:not(.resume-btn)").forEach((link) => {
    link.addEventListener("click", function(e) {
      // Skip for hash links and active page
      if (this.getAttribute("href").startsWith("#")) return;
      if (this.classList.contains("active")) return;

      e.preventDefault();
      const targetHref = this.getAttribute("href");
      const targetPage = this.textContent.trim();

      // Transition sequence
      transitionOverlay.style.pointerEvents = "auto";
      pageName.textContent = targetPage;
      
      // Animation sequence
      transitionOverlay.classList.add("visible", "exit-animation");
      
      setTimeout(() => {
        transitionOverlay.classList.add("centered");
      }, 100);
      
      setTimeout(() => {
        transitionOverlay.classList.add("fullscreen");
      }, 700);
      
      setTimeout(() => {
        window.location.href = targetHref;
      }, 1200);
    });
  });
}

// ====== TYPING ANIMATION ======
function initTypingAnimation() {
  const highlightText = document.querySelector(".highlight-text");
  if (!highlightText) return;
  
  const roles = [
    "web developer",
    "mobile developer",
    "UI designer",
    "problem solver.",
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  // Start with empty text
  highlightText.textContent = "";

  function typeRole() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      highlightText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      highlightText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Typing finished
    if (!isDeleting && charIndex === currentRole.length) {
      // Stop on final role
      if (roleIndex === roles.length - 1) return;
      
      isDeleting = true;
      typingSpeed = 1500;
    } 
    // Deleting finished
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(typeRole, typingSpeed);
  }

  // Start with a small delay
  setTimeout(typeRole, 800);
}

// ====== BACKGROUND REVEAL ======
function initBackgroundReveal() {
  const navbar = document.querySelector(".navbar");
  const brand = document.querySelector(".brand");
  const scrollIndicator = document.querySelector(".scroll-indicator");
  const topHeader = document.querySelector(".top-header");
  const menuToggle = document.getElementById("menu-toggle");

  // Function to reset menu state
  const resetMobileMenu = () => {
    if (menuToggle && isMobile()) {
      menuToggle.checked = false;
    }
  };

  // Handle viewport changes
  window.addEventListener("resize", resetMobileMenu);

  // First visit animation
  if (!sessionStorage.getItem("backgroundRevealed")) {
    // Create dark overlay
    const darkOverlay = document.createElement("div");
    darkOverlay.className = "dark-overlay";
    document.body.appendChild(darkOverlay);

    // Create progress indicator
    const progressBar = document.createElement("div");
    progressBar.className = "reveal-progress";
    document.body.appendChild(progressBar);

    // Add animation classes based on device
    if (navbar) {
      if (!isMobile()) {
        navbar.classList.add("delayed-reveal");
      } else {
        resetMobileMenu();
      }
    }

    if (brand) {
      brand.classList.add(isMobile() ? "visible" : "delayed-reveal");
    }

    if (scrollIndicator) {
      scrollIndicator.classList.add("delayed-reveal");
    }
    
    if (topHeader) {
      if (isMobile()) {
        topHeader.style.opacity = "1";
        topHeader.style.transform = "none";
      } else {
        topHeader.classList.add("delayed-reveal");
      }
    }

    // Cleanup progress bar
    setTimeout(() => {
      progressBar.style.opacity = "0";
      setTimeout(() => progressBar.remove(), 1000);
    }, 15000);

    sessionStorage.setItem("backgroundRevealed", "true");
  } 
  // Return visit - show elements immediately
  else {
    if (navbar && !isMobile()) navbar.classList.add("visible");
    if (brand && !isMobile()) brand.classList.add("visible");
    if (scrollIndicator) scrollIndicator.classList.add("visible");
    
    if (topHeader) {
      if (isMobile()) {
        topHeader.style.opacity = "1";
        topHeader.style.transform = "none";
      } else {
        topHeader.classList.add("visible");
      }
    }
  }
}
