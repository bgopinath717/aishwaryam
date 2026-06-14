/**
 * Aishwaryam Old Age Home Care — Interactive Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons (loaded via CDN)
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // ==========================================
  // Header / Navbar Scroll State
  // ==========================================
  const header = document.querySelector("header");
  const updateHeaderState = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  // ==========================================
  // Mobile Navigation Menu Toggle
  // ==========================================
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  
  if (menuToggle && mobileMenu) {
    const toggleIcon = menuToggle.querySelector("i");
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      
      // Update menu button aria label
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      
      // Update Lucide icon dynamically
      if (toggleIcon) {
        if (isOpen) {
          toggleIcon.setAttribute("data-lucide", "x");
        } else {
          toggleIcon.setAttribute("data-lucide", "menu");
        }
        lucide.createIcons({
          attrs: { class: "h-5 w-5" },
          nameAttr: "data-lucide"
        });
      }
    });

    // Close mobile menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        if (toggleIcon) {
          toggleIcon.setAttribute("data-lucide", "menu");
          lucide.createIcons({
            attrs: { class: "h-5 w-5" },
            nameAttr: "data-lucide"
          });
        }
      });
    });
  }

  // ==========================================
  // Intersection Observer for Scroll Reveals
  // ==========================================
  const revealElements = document.querySelectorAll(".reveal, .stagger-group");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // trigger animation only once
      }
    });
  }, {
    root: null,
    rootMargin: "-60px",
    threshold: 0.1
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ==========================================
  // Statistics Counter Animation
  // ==========================================
  const statsSection = document.querySelector(".stats-bar");
  const counterElements = document.querySelectorAll(".counter-value");
  
  const animateCounters = () => {
    counterElements.forEach(el => {
      const target = parseInt(el.getAttribute("data-target"), 10);
      const duration = 1600; // ms
      const start = performance.now();

      const updateCounter = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // cubic ease out
        const currentValue = Math.round(eased * target);
        
        el.textContent = currentValue;

        if (p < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  if (statsSection) {
    let triggered = false;
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: "-40px",
      threshold: 0.1
    });
    statsObserver.observe(statsSection);
  }

  // Also animate the floating badge counter in the About section
  const badgeSection = document.querySelector(".about-floating-badge");
  const badgeCounter = document.querySelector(".badge-counter-value");
  if (badgeSection && badgeCounter) {
    let triggered = false;
    const badgeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          const target = parseInt(badgeCounter.getAttribute("data-target"), 10);
          const duration = 1600;
          const start = performance.now();
          const update = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            badgeCounter.textContent = Math.round(eased * target);
            if (p < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: "-40px",
      threshold: 0.1
    });
    badgeObserver.observe(badgeSection);
  }

  // ==========================================
  // Gallery Categorized Filter & Lightbox
  // ==========================================
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  // Gallery Filters
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Toggle active class
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");

      // Filter gallery items
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        if (category === "All" || itemCategory === category) {
          item.style.display = "block";
          // Quick trigger reflow to restart entrance animation
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          }, 10);
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.95)";
          // Delay display setting to allow fade out transition
          setTimeout(() => {
            item.style.display = "none";
          }, 200);
        }
      });
    });
  });

  // Lightbox Functionality
  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden"; // Disable page scroll
      }
    });
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove("open");
      document.body.style.overflow = ""; // Re-enable page scroll
      setTimeout(() => {
        if (lightboxImg) lightboxImg.src = ""; // Clear src
      }, 300);
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      // Close only if click is directly on the overlay backdrop, not the image itself
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on ESC key press
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
      }
    });
  }

  // ==========================================
  // Testimonials Slider (Carousel)
  // ==========================================
  const slides = document.querySelectorAll(".testimonial-slide");
  const dotsContainer = document.getElementById("carousel-dots");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  
  if (slides.length > 0) {
    let currentIdx = 0;
    let autoplayTimer = null;

    // Create dots indicator
    slides.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.className = `carousel-dot ${idx === 0 ? "active" : ""}`;
      dot.setAttribute("aria-label", `Go to testimonial slide ${idx + 1}`);
      dot.addEventListener("click", () => {
        goToSlide(idx);
        resetAutoplay();
      });
      if (dotsContainer) dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".carousel-dot");

    const goToSlide = (idx) => {
      // Remove active class from current slide and dot
      slides[currentIdx].classList.remove("active");
      if (dots.length > 0) dots[currentIdx].classList.remove("active");

      // Update index
      currentIdx = (idx + slides.length) % slides.length;

      // Add active class to new slide and dot
      slides[currentIdx].classList.add("active");
      if (dots.length > 0) dots[currentIdx].classList.add("active");
    };

    const nextSlide = () => {
      goToSlide(currentIdx + 1);
    };

    const prevSlide = () => {
      goToSlide(currentIdx - 1);
    };

    // Control triggers
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoplay();
      });
    }

    // Autoplay setup
    const startAutoplay = () => {
      autoplayTimer = setInterval(nextSlide, 6000);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayTimer);
      startAutoplay();
    };

    startAutoplay();
  }

  // ==========================================
  // FAQ Accordion logic
  // ==========================================
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const btn = item.querySelector(".faq-question-btn");
    const pane = item.querySelector(".faq-answer-pane");

    if (btn && pane) {
      btn.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
            otherItem.querySelector(".faq-answer-pane").style.maxHeight = null;
            otherItem.querySelector(".faq-question-btn").setAttribute("aria-expanded", "false");
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove("active");
          pane.style.maxHeight = null;
          btn.setAttribute("aria-expanded", "false");
        } else {
          item.classList.add("active");
          pane.style.maxHeight = pane.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
        }
      });
    }
  });

  // Set first FAQ item open by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstBtn = firstItem.querySelector(".faq-question-btn");
    const firstPane = firstItem.querySelector(".faq-answer-pane");
    firstItem.classList.add("active");
    if (firstPane) firstPane.style.maxHeight = firstPane.scrollHeight + "px";
    if (firstBtn) firstBtn.setAttribute("aria-expanded", "true");
  }

  // ==========================================
  // Contact Form Validation & Submission
  // ==========================================
  const contactForm = document.getElementById("contact-form");
  
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const phoneInput = document.getElementById("phone");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");
      const submitBtn = contactForm.querySelector("button[type='submit']");

      let hasErrors = false;

      // Helper to set errors
      const setError = (inputEl, message) => {
        const group = inputEl.closest(".form-group");
        let errorEl = group.querySelector(".form-error-msg");
        
        if (!errorEl) {
          errorEl = document.createElement("p");
          errorEl.className = "form-error-msg";
          group.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        inputEl.style.borderColor = "var(--destructive)";
        hasErrors = true;
      };

      // Helper to clear errors
      const clearError = (inputEl) => {
        const group = inputEl.closest(".form-group");
        const errorEl = group.querySelector(".form-error-msg");
        if (errorEl) {
          errorEl.remove();
        }
        inputEl.style.borderColor = "";
      };

      // Validate Name
      const nameVal = nameInput.value.trim();
      if (!nameVal) {
        setError(nameInput, "Please enter your name");
      } else if (nameVal.length < 2) {
        setError(nameInput, "Name must be at least 2 characters");
      } else {
        clearError(nameInput);
      }

      // Validate Phone
      const phoneVal = phoneInput.value.trim();
      if (!phoneVal) {
        setError(phoneInput, "Please enter a valid phone number");
      } else if (phoneVal.length < 7) {
        setError(phoneInput, "Phone number must be at least 7 characters");
      } else {
        clearError(phoneInput);
      }

      // Validate Email
      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        setError(emailInput, "Please enter a valid email");
      } else if (!emailRegex.test(emailVal)) {
        setError(emailInput, "Please enter a valid email address");
      } else {
        clearError(emailInput);
      }

      // Validate Message
      const messageVal = messageInput.value.trim();
      if (!messageVal) {
        setError(messageInput, "Please write a short message");
      } else if (messageVal.length < 5) {
        setError(messageInput, "Message must be at least 5 characters");
      } else {
        clearError(messageInput);
      }

      // Stop submission if validation failed
      if (hasErrors) return;

      // Simulate submission
      if (submitBtn) {
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <i data-lucide="loader" class="h-5 w-5 animate-spin"></i> Sending...
        `;
        lucide.createIcons({
          attrs: { class: "h-5 w-5 animate-spin" },
          nameAttr: "data-lucide"
        });

        setTimeout(() => {
          // Reset button
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <i data-lucide="check-circle-2" class="h-5 w-5"></i> Message Sent
          `;
          lucide.createIcons({
            attrs: { class: "h-5 w-5" },
            nameAttr: "data-lucide"
          });

          // Reset form fields
          contactForm.reset();

          // Show Toast notification
          showToast("Thank you! We'll get back to you very soon.");

          // Reset button back to normal after some time
          setTimeout(() => {
            submitBtn.innerHTML = originalContent;
            lucide.createIcons({
              attrs: { class: "h-5 w-5" },
              nameAttr: "data-lucide"
            });
          }, 4000);

        }, 1200);
      }
    });
  }

  // ==========================================
  // Custom Toast notification Insertion
  // ==========================================
  const showToast = (message) => {
    let toast = document.getElementById("custom-toast");
    
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "custom-toast";
      toast.className = "toast-container";
      document.body.appendChild(toast);
    }
    
    toast.innerHTML = `
      <i data-lucide="check-circle-2" class="toast-icon"></i>
      <span>${message}</span>
    `;
    lucide.createIcons({
      attrs: { class: "toast-icon" },
      nameAttr: "data-lucide"
    });

    // Animate in
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // Animate out
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  };
});
