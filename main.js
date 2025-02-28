// Function to check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}

// Function to handle scroll animation
function handleScrollAnimation() {
  const skillsSection = document.querySelector(".skills-section");

  if (
    skillsSection &&
    isInViewport(skillsSection) &&
    !skillsSection.classList.contains("visible")
  ) {
    skillsSection.classList.add("visible");
  }
}

// Add event listeners
window.addEventListener("scroll", handleScrollAnimation);
window.addEventListener("load", handleScrollAnimation);

// Lazy loading for skills section
document.addEventListener("DOMContentLoaded", function () {
  // Observer options
  const options = {
    root: null, // Use viewport as root
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% of the element is visible
  };

  // Create observer for skills section
  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // When skills section comes into view
        const skillsSection = entry.target;

        // Mark section as visible (for fade-in animations)
        skillsSection.classList.add("visible");

        // Process each experience bar
        const skillItems = skillsSection.querySelectorAll(".skill-list li");
        skillItems.forEach((item) => {
          const bar = item.querySelector(".experience-level");
          const barContainer = item.querySelector(".experience-bar");

          if (bar && barContainer) {
            // Get the width percentage
            const width = bar.style.width;
            const percentValue = width.replace("%", "");

            // Store as custom property
            barContainer.style.setProperty("--skill-level", width);

            // Reset initial width for animation
            bar.style.width = "0%";

            // Create percentage indicator if it doesn't exist
            if (!item.querySelector(".percent-indicator")) {
              const percentIndicator = document.createElement("span");
              percentIndicator.className = "percent-indicator";
              percentIndicator.textContent = width; // Display the full percentage value

              // Position it as the first child of the list item for better positioning
              item.insertBefore(percentIndicator, item.firstChild);
            }
          }
        });

        // Unobserve after animation is triggered
        observer.unobserve(skillsSection);
      }
    });
  }, options);

  // Observe all skill categories
  const skillsSection = document.querySelector(".skills-section");
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // Add touch support for mobile
  const skillItems = document.querySelectorAll(".skill-list li");
  skillItems.forEach((item) => {
    item.addEventListener("touchstart", function (e) {
      e.preventDefault();
      // Toggle active class
      const isActive = this.classList.contains("active-skill");

      // Remove active from all
      skillItems.forEach((i) => i.classList.remove("active-skill"));

      // Add active to current if not already active
      if (!isActive) {
        this.classList.add("active-skill");
      }
    });
  });
});

function scrollToSkills() {
  const skillsSection = document.getElementById("skills");
  skillsSection.scrollIntoView({ behavior: "smooth" });
}

// Add click event listener to scroll arrow
document.addEventListener("DOMContentLoaded", function () {
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", scrollToSkills);
  }
});

// Back to Top button functionality
document.addEventListener("DOMContentLoaded", function () {
  const backToTopButton = document.getElementById("backToTop");

  // Show/hide button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });

  // Smooth scroll to top when clicked
  backToTopButton.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

// Debug function to help identify issues
function debugSkillStyles() {
  console.log("Debugging skill styles");

  const skillBars = document.querySelectorAll(".experience-level");
  console.log(`Found ${skillBars.length} skill bars`);

  skillBars.forEach((bar, index) => {
    console.log(`Bar ${index}:`);
    console.log(`- Style attribute: ${bar.getAttribute("style")}`);
    console.log(`- Computed background: ${getComputedStyle(bar).background}`);
    console.log(`- Has inline background: ${bar.style.background !== ""}`);

    // Check for conflicting styles
    const styles = document.styleSheets;
    let conflictingRules = [];

    for (let i = 0; i < styles.length; i++) {
      try {
        const rules = styles[i].cssRules || styles[i].rules;
        for (let j = 0; j < rules.length; j++) {
          if (
            rules[j].selectorText &&
            rules[j].selectorText.includes("experience-level") &&
            rules[j].style.background
          ) {
            conflictingRules.push({
              selector: rules[j].selectorText,
              background: rules[j].style.background,
            });
          }
        }
      } catch (e) {
        // CORS error with external stylesheets
        console.log(`Could not check stylesheet ${i}`);
      }
    }

    console.log("- Potentially conflicting CSS rules:", conflictingRules);
  });
}

// Call the debug function
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(debugSkillStyles, 1000);
});

// Detect when CTA section is in view and add visible class
document.addEventListener("DOMContentLoaded", function () {
  const ctaSection = document.querySelector(".cta-section");

  function checkCTAVisibility() {
    const rect = ctaSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight - 100) {
      ctaSection.classList.add("visible");
      window.removeEventListener("scroll", checkCTAVisibility);
    }
  }

  window.addEventListener("scroll", checkCTAVisibility);
  // Check immediately in case it's already in view
  checkCTAVisibility();
});

// Resume Modal Functionality - Fix to prevent page reload
document.addEventListener("DOMContentLoaded", function () {
  const resumeBtns = document.querySelectorAll(".resume-btn");

  // First, check if we're on a page with the resume button
  if (resumeBtns.length === 0) return;

  // Create or find the modal
  let modal = document.getElementById("resume-modal");

  // If modal doesn't exist or is commented out, create it dynamically
  if (!modal) {
    console.log("Creating resume modal dynamically");

    // Create modal elements
    modal = document.createElement("div");
    modal.id = "resume-modal";
    modal.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const closeBtn = document.createElement("span");
    closeBtn.className = "close-modal";
    closeBtn.innerHTML = "&times;";

    const modalTitle = document.createElement("h2");
    modalTitle.textContent = "my résumé";

    const resumeContainer = document.createElement("div");
    resumeContainer.className = "resume-container";

    // Create iframe for PDF
    const iframe = document.createElement("iframe");
    iframe.src = "media/Divine's CVV.pdf";
    iframe.setAttribute("frameborder", "0");

    // Assemble modal
    resumeContainer.appendChild(iframe);
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(resumeContainer);
    modal.appendChild(modalContent);

    // Add to DOM
    document.body.appendChild(modal);
  }

  // Now we're sure we have a modal element
  const closeBtn = modal.querySelector(".close-modal");

  // Open modal with animation - PREVENT DEFAULT to avoid hash navigation
  resumeBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault(); // Critical - prevent default hash behavior

      // Show modal with CSS
      modal.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent scrolling
    });
  });

  // Close modal with animation
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  }

  // Close when X is clicked
  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      closeModal();
    });
  }

  // Close when clicking outside the modal
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close with ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Check if we should open modal based on hash (e.g., direct link)
  if (window.location.hash === "#resume-modal") {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Add fade-in animation to page content
  document.body.classList.add("loaded");
});

// Page transition animation - ONLY when clicking navigation links
document.addEventListener("DOMContentLoaded", function () {
  // Create transition overlay
  const transitionOverlay = document.createElement("div");
  transitionOverlay.className = "page-transition-overlay";

  // Create page name element
  const pageName = document.createElement("h2");
  pageName.className = "transition-page-name";

  // Add to DOM
  transitionOverlay.appendChild(pageName);
  document.body.appendChild(transitionOverlay);

  // Handle navigation links for exit animations
  document.querySelectorAll(".navbar a:not(.resume-btn)").forEach((link) => {
    link.addEventListener("click", function (e) {
      // Only handle internal navigation to other pages
      if (this.getAttribute("href").startsWith("#")) return;
      if (this.classList.contains("active")) return;

      e.preventDefault();
      const targetHref = this.getAttribute("href");
      const targetPage = this.textContent.trim();

      // Make overlay block interactions during transition
      transitionOverlay.style.pointerEvents = "auto";
      pageName.textContent = targetPage;

      // Start with the name in the navbar position
      transitionOverlay.classList.add("visible", "exit-animation");

      // Move to center
      setTimeout(() => {
        transitionOverlay.classList.add("centered");
      }, 100);

      // Full screen overlay for transition
      setTimeout(() => {
        transitionOverlay.classList.add("fullscreen");
      }, 700); // Give time for centering animation

      // Navigate after animation
      setTimeout(() => {
        window.location.href = targetHref;
      }, 1200); // Total exit animation time ~1.1s
    });
  });
});

// // Service worker registration
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then((reg) => console.log("Service worker registered"))
//       .catch((err) => console.log("Service worker not registered", err));
//   });
// }

// Typing animation for the role text - plays only once and stops on "problem solver"
document.addEventListener("DOMContentLoaded", function () {
  const roles = [
    "web developer",
    "mobile developer",
    "UI designer",
    "problem solver.",
  ];
  const highlightText = document.querySelector(".highlight-text");
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  // Make sure we have the highlight-text element
  if (!highlightText) return;

  // Start with empty text
  highlightText.textContent = "";

  function typeRole() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      // Deleting text
      highlightText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Faster when deleting
    } else {
      // Typing text
      highlightText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal typing speed
    }

    // If finished typing the word
    if (!isDeleting && charIndex === currentRole.length) {
      // If we're on the final role ("problem solver"), don't delete it
      if (roleIndex === roles.length - 1) {
        return; // Stop the animation completely
      }

      isDeleting = true;
      typingSpeed = 1500; // Pause at the end of the word
    }
    // If finished deleting the word
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length; // Move to next role
      typingSpeed = 500; // Pause before typing next word
    }

    // Continue animation until we reach the final state
    setTimeout(typeRole, typingSpeed);
  }

  // Start the typing animation with a small initial delay
  setTimeout(typeRole, 800);
});

// Background and navbar reveal animation
document.addEventListener("DOMContentLoaded", function () {
  // Get navbar and brand elements
  const navbar = document.querySelector(".navbar");
  const brand = document.querySelector(".brand");
  const scrollIndicator = document.querySelector(".scroll-indicator");
  const topHeader = document.querySelector(".top-header"); // Add this line
  const menuToggle = document.getElementById("menu-toggle");

  // Helper function to check for mobile
  function isMobile() {
    return window.innerWidth <= 1024;
  }

  // Function to reset menu state (important for page transitions)
  function resetMobileMenu() {
    if (menuToggle && isMobile()) {
      menuToggle.checked = false;
    }
  }

  // Handle viewport changes
  window.addEventListener("resize", function () {
    // If switching between mobile/desktop, ensure menu is closed
    resetMobileMenu();
  });

  // Check if this is the first visit in this session
  if (!sessionStorage.getItem("backgroundRevealed")) {
    console.log("First visit - setting up animations");

    // Create dark overlay
    const darkOverlay = document.createElement("div");
    darkOverlay.className = "dark-overlay";
    document.body.appendChild(darkOverlay);

    // Create progress indicator
    const progressBar = document.createElement("div");
    progressBar.className = "reveal-progress";
    document.body.appendChild(progressBar);

    // Add animation classes based on device
    if (navbar && !isMobile()) {
      navbar.classList.add("delayed-reveal");
      console.log("Added delayed-reveal to navbar");
    } else if (navbar && isMobile()) {
      // On mobile, we'll handle differently
      console.log("Mobile detected - not adding delayed-reveal to navbar");
      // Reset mobile menu to ensure clean state
      resetMobileMenu();
    }

    if (brand) {
      if (!isMobile()) {
        brand.classList.add("delayed-reveal");
        console.log("Added delayed-reveal to brand");
      } else {
        brand.classList.add("visible");
        console.log("Mobile detected - added visible to brand");
      }
    }

    // Add delayed reveal to scroll indicator on both mobile and desktop
    if (scrollIndicator) {
      scrollIndicator.classList.add("delayed-reveal");
      console.log("Added delayed-reveal to scroll indicator");
    }
    
    // Make sure top header animation is synchronized
    if (topHeader && !isMobile()) {
      // Force opacity to 0 initially
      topHeader.style.opacity = "0";
      setTimeout(() => {
        topHeader.classList.add("delayed-reveal");
        console.log("Added delayed-reveal to top header");
      }, 50);
    }

    // Handle progress bar cleanup
    setTimeout(() => {
      console.log("Animation completed - cleaning up progress bar");
      progressBar.style.opacity = "0";
      setTimeout(() => {
        progressBar.remove();
      }, 1000);
    }, 15000);

    // Mark that we've shown the effect
    sessionStorage.setItem("backgroundRevealed", "true");
  } else {
    console.log("Return visit - showing elements immediately");
    // For returning visitors, show elements immediately
    if (navbar && !isMobile()) {
      navbar.classList.add("visible");
    }

    if (brand && !isMobile()) {
      brand.classList.add("visible");
    }

    // Make scroll indicator visible for return visitors
    if (scrollIndicator) {
      scrollIndicator.classList.add("visible");
    }
    
    // Show header immediately for return visitors
    if (topHeader && !isMobile()) {
      topHeader.classList.add("visible");
    }
  }
});

// Theme toggle functionality
document.addEventListener("DOMContentLoaded", function() {
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
    // Fallback to body if header-right doesn't exist yet
    document.body.appendChild(themeToggle);
  }
  
  // Get the top header for animation
  const topHeader = document.querySelector('.top-header');
  
  // Helper function to check for mobile
  function isMobile() {
    return window.innerWidth <= 1024;
  }
  
  // Check for saved theme preference
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const savedTheme = localStorage.getItem("theme");
  
  // Set initial theme
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else if (savedTheme === "light" || !prefersDarkScheme.matches) {
    document.body.classList.remove("dark-mode");
  } else if (prefersDarkScheme.matches) {
    document.body.classList.add("dark-mode");
  }
  
  // Apply animation class to header based on first visit
  if (topHeader) {
    if (!sessionStorage.getItem('backgroundRevealed') && !isMobile()) {
      topHeader.classList.add('delayed-reveal');
    } else if (!isMobile()) {
      topHeader.classList.add('visible');
    }
    // On mobile, header is always visible without animation
    
    // Set initial header background state based on scroll position
    updateHeaderOnScroll();
    
    // Add scroll event listener to update header background
    window.addEventListener('scroll', updateHeaderOnScroll);
    
    // Function to update header based on scroll position
    function updateHeaderOnScroll() {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add or remove scrolled class based on 50px threshold
      if (scrollPosition > 50) {
        topHeader.classList.add('scrolled');
      } else {
        topHeader.classList.remove('scrolled');
      }
    }

  }
  
  // Toggle theme function
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
});
