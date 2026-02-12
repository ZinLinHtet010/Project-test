(() => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      nav.classList.toggle("is-open", !isExpanded);
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (nav.classList.contains("is-open") && !target.closest(".site-header")) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 767) closeMenu();
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });

      if (history.replaceState) {
        history.replaceState(null, "", href);
      }

      closeMenu();
    });
  });

  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
  if (revealItems.length > 0) {
    if (!reducedMotion && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -8% 0px"
        }
      );

      revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 55, 260)}ms`;
        observer.observe(item);
      });
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
  }

  const parallaxNode = document.querySelector("[data-parallax]");
  if (parallaxNode && !reducedMotion) {
    let ticking = false;

    const updateParallax = () => {
      const yOffset = Math.min(window.scrollY * 0.08, 28);
      parallaxNode.style.transform = `translateY(${yOffset}px)`;
      ticking = false;
    };

    const requestParallax = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    };

    window.addEventListener("scroll", requestParallax, { passive: true });
    requestParallax();
  }

  const yearNode = document.getElementById("year");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  const inquiryForm = document.querySelector("[data-inquiry-form]");
  if (inquiryForm instanceof HTMLFormElement) {
    const status = inquiryForm.querySelector(".form-status");
    const requiredFieldNames = ["name", "email", "destination_interest", "travel_month", "group_size"];

    const getField = (name) => inquiryForm.elements.namedItem(name);

    const clearError = (field) => {
      const container = field.closest(".field");
      if (!container) return;
      container.classList.remove("is-invalid");
      field.setAttribute("aria-invalid", "false");
      const error = container.querySelector(".field-error");
      if (error) error.textContent = "";
    };

    const setError = (field, message) => {
      const container = field.closest(".field");
      if (!container) return;
      container.classList.add("is-invalid");
      field.setAttribute("aria-invalid", "true");
      const error = container.querySelector(".field-error");
      if (error) error.textContent = message;
    };

    const validateField = (field) => {
      const value = (field.value || "").trim();
      clearError(field);

      if (field.hasAttribute("required") && value.length === 0) {
        setError(field, "This field is required.");
        return false;
      }

      if (field.name === "email" && value.length > 0) {
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
        if (!emailOk) {
          setError(field, "Enter a valid email address.");
          return false;
        }
      }

      if (field.name === "travel_month" && value.length > 0) {
        const monthOk = /^\d{4}-\d{2}$/.test(value);
        if (!monthOk) {
          setError(field, "Use the month picker format.");
          return false;
        }
      }

      return true;
    };

    requiredFieldNames.forEach((fieldName) => {
      const field = getField(fieldName);
      if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement)) return;

      field.addEventListener("input", () => validateField(field));
      field.addEventListener("blur", () => validateField(field));
    });

    inquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();

      let isFormValid = true;
      requiredFieldNames.forEach((fieldName) => {
        const field = getField(fieldName);
        if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement)) return;
        if (!validateField(field)) isFormValid = false;
      });

      if (!status) return;

      if (!isFormValid) {
        status.textContent = "Please review the highlighted fields.";
        status.classList.add("is-error");
        status.classList.remove("is-success");

        const firstInvalid = inquiryForm.querySelector(".field.is-invalid input, .field.is-invalid select");
        if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
        return;
      }

      inquiryForm.reset();
      status.textContent = "Thank you. AURA Travel will contact you within one business day.";
      status.classList.add("is-success");
      status.classList.remove("is-error");

      window.setTimeout(() => {
        status.textContent = "";
        status.classList.remove("is-success", "is-error");
      }, 5000);
    });
  }
})();
