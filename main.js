/* filepath: /c:/Users/abeck/OneDrive/Documents/GitHub/personal-site/main.js */
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
  const skillsSection = document.querySelector('.skills-section');
  
  if (skillsSection && isInViewport(skillsSection) && !skillsSection.classList.contains('visible')) {
    skillsSection.classList.add('visible');
  }
}

// Add event listeners
window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);

// Lazy loading for skills section
document.addEventListener('DOMContentLoaded', function() {
  // Observer options
  const options = {
    root: null, // Use viewport as root
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
  };
  
  // Create observer for skills section
  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // When skills section comes into view
        const skillsSection = entry.target;
        
        // Mark section as visible (for fade-in animations)
        skillsSection.classList.add('visible');
        
        // Process each experience bar
        const skillItems = skillsSection.querySelectorAll('.skill-list li');
        skillItems.forEach(item => {
          const bar = item.querySelector('.experience-level');
          const barContainer = item.querySelector('.experience-bar');
          
          if (bar && barContainer) {
            // Get the width percentage
            const width = bar.style.width;
            const percentValue = width.replace('%', '');
            
            // Store as custom property
            barContainer.style.setProperty('--skill-level', width);
            
            // Reset initial width for animation
            bar.style.width = '0%';
            
            // Create percentage indicator if it doesn't exist
            if (!item.querySelector('.percent-indicator')) {
              const percentIndicator = document.createElement('span');
              percentIndicator.className = 'percent-indicator';
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
  const skillsSection = document.querySelector('.skills-section');
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }
  
  // Add touch support for mobile
  const skillItems = document.querySelectorAll('.skill-list li');
  skillItems.forEach(item => {
    item.addEventListener('touchstart', function(e) {
      e.preventDefault();
      // Toggle active class
      const isActive = this.classList.contains('active-skill');
      
      // Remove active from all
      skillItems.forEach(i => i.classList.remove('active-skill'));
      
      // Add active to current if not already active
      if (!isActive) {
        this.classList.add('active-skill');
      }
    });
  });
});

function scrollToSkills() {
  const skillsSection = document.getElementById('skills');
  skillsSection.scrollIntoView({ behavior: 'smooth' });
}

// Add click event listener to scroll arrow
document.addEventListener('DOMContentLoaded', function() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', scrollToSkills);
  }
});

// Back to Top button functionality
document.addEventListener('DOMContentLoaded', function() {
  const backToTopButton = document.getElementById('backToTop');
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
  
  // Smooth scroll to top when clicked
  backToTopButton.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

// Debug function to help identify issues
function debugSkillStyles() {
  console.log('Debugging skill styles');
  
  const skillBars = document.querySelectorAll('.experience-level');
  console.log(`Found ${skillBars.length} skill bars`);
  
  skillBars.forEach((bar, index) => {
    console.log(`Bar ${index}:`);
    console.log(`- Style attribute: ${bar.getAttribute('style')}`);
    console.log(`- Computed background: ${getComputedStyle(bar).background}`);
    console.log(`- Has inline background: ${bar.style.background !== ''}`);
    
    // Check for conflicting styles
    const styles = document.styleSheets;
    let conflictingRules = [];
    
    for (let i = 0; i < styles.length; i++) {
      try {
        const rules = styles[i].cssRules || styles[i].rules;
        for (let j = 0; j < rules.length; j++) {
          if (rules[j].selectorText && 
              rules[j].selectorText.includes('experience-level') &&
              rules[j].style.background) {
            conflictingRules.push({
              selector: rules[j].selectorText,
              background: rules[j].style.background
            });
          }
        }
      } catch (e) {
        // CORS error with external stylesheets
        console.log(`Could not check stylesheet ${i}`);
      }
    }
    
    console.log('- Potentially conflicting CSS rules:', conflictingRules);
  });
}

// Call the debug function
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(debugSkillStyles, 1000);
});

// Call the function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Call right away
  applySkillColors();
  
  // Also call when page is fully loaded (with images, etc)
  window.addEventListener('load', function() {
    setTimeout(applySkillColors, 500);
  });
  
  // Call again whenever skills section becomes visible
  const skillsSection = document.getElementById('skills');
  if (skillsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(applySkillColors, 200);
        }
      });
    });
    observer.observe(skillsSection);
  }
});

// Detect when CTA section is in view and add visible class
document.addEventListener('DOMContentLoaded', function() {
    const ctaSection = document.querySelector('.cta-section');
    
    function checkCTAVisibility() {
      const rect = ctaSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight - 100) {
        ctaSection.classList.add('visible');
        window.removeEventListener('scroll', checkCTAVisibility);
      }
    }
    
    window.addEventListener('scroll', checkCTAVisibility);
    // Check immediately in case it's already in view
    checkCTAVisibility();
  });

// Resume Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Modal functionality
  const modal = document.getElementById('resume-modal');
  const resumeBtn = document.getElementById('resume-btn');
  const closeBtn = document.querySelector('.close-modal');
  
  // Open modal with animation when resume button is clicked
  if (resumeBtn) {
    resumeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent scrolling
      
      // Trigger animation after a slight delay for the display change to take effect
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
    });
  }
  
  // Close modal with animation
  function closeModal() {
    modal.classList.remove('show');
    
    // Wait for animation to complete before hiding the modal
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
    }, 400); // Match this to the duration of your CSS transition
  }
  
  // Close when X is clicked
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Close when clicking outside the modal
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close with ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });
  
  // Uncomment the modal actions section in your HTML for the download button
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    // Fix the HTML structure by closing the modal-actions div properly
    const commentedSection = modalContent.innerHTML.match(/<!-- <div class="modal-actions">([\s\S]*?)-->/).pop();
    if (commentedSection) {
      const fixedHTML = commentedSection.replace('<!-- ', '').replace(' -->', '');
      modalContent.innerHTML = modalContent.innerHTML.replace(/<!-- <div class="modal-actions">[\s\S]*?-->/, fixedHTML);
    }
  }
});