// Preloader
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader")
  setTimeout(() => {
    preloader.classList.add("fade-out")
    setTimeout(() => {
      preloader.style.display = "none"
    }, 500)
  }, 1000)
})

// Mobile Navigation
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active")
    navMenu.classList.remove("active")
  })
})

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle")
const body = document.body

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem("theme") || "light"
body.setAttribute("data-theme", currentTheme)

// Update theme toggle icon
function updateThemeIcon() {
  const icon = themeToggle.querySelector("i")
  if (body.getAttribute("data-theme") === "dark") {
    icon.className = "fas fa-sun"
  } else {
    icon.className = "fas fa-moon"
  }
}

updateThemeIcon()

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  body.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon()
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const offsetTop = target.offsetTop - 70
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  })
})

// Navbar scroll effect
const navbar = document.getElementById("navbar")
let lastScrollTop = 0

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  // Add scrolled class for styling
  if (scrollTop > 100) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }

  // Hide/show navbar on scroll
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    navbar.style.transform = "translateY(-100%)"
  } else {
    navbar.style.transform = "translateY(0)"
  }

  lastScrollTop = scrollTop
})

// Active navigation link highlighting
const sections = document.querySelectorAll("section[id]")
const navLinks = document.querySelectorAll(".nav-link")

window.addEventListener("scroll", () => {
  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.clientHeight

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
})

// Project toggle functionality
function toggleProject(projectId) {
  const projectDetails = document.getElementById(projectId)
  const toggleBtn = projectDetails.parentElement.querySelector(".project-toggle")

  // Close all other projects
  document.querySelectorAll(".project-details").forEach((detail) => {
    if (detail.id !== projectId) {
      detail.classList.remove("active")
    }
  })

  document.querySelectorAll(".project-toggle").forEach((btn) => {
    if (btn !== toggleBtn) {
      btn.classList.remove("active")
    }
  })

  // Toggle current project
  projectDetails.classList.toggle("active")
  toggleBtn.classList.toggle("active")
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up")
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".timeline-item, .skill-category, .project-card, .education-card, .about-text, .about-image",
  )

  animateElements.forEach((el) => {
    observer.observe(el)
  })
})

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
  let i = 0
  element.innerHTML = ""

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }
  type()
}

// Initialize typing effect
window.addEventListener("load", () => {
  setTimeout(() => {
    const heroName = document.querySelector(".hero-name")
    if (heroName) {
      const originalText = heroName.textContent
      typeWriter(heroName, originalText, 100)
    }
  }, 1500)
})

// Parallax effect for floating icons
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const floatingIcons = document.querySelectorAll(".floating-icon")

  floatingIcons.forEach((icon, index) => {
    const speed = 0.5 + index * 0.1
    const yPos = -(scrolled * speed)
    icon.style.transform = `translateY(${yPos}px)`
  })
})

// Add smooth reveal animation for sections
const revealSections = () => {
  const sections = document.querySelectorAll("section")

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top
    const windowHeight = window.innerHeight

    if (sectionTop < windowHeight * 0.8) {
      section.style.opacity = "1"
      section.style.transform = "translateY(0)"
    }
  })
}

// Initialize section reveal
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section")
  sections.forEach((section) => {
    section.style.opacity = "0"
    section.style.transform = "translateY(30px)"
    section.style.transition = "opacity 0.8s ease, transform 0.8s ease"
  })

  revealSections()
})

window.addEventListener("scroll", revealSections)

// Add loading states for images
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img")

  images.forEach((img) => {
    img.addEventListener("load", () => {
      img.style.opacity = "1"
    })

    img.style.opacity = "0"
    img.style.transition = "opacity 0.3s ease"
  })
})

// Add click effect for buttons
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".btn, .project-toggle, .theme-toggle")

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
})

// Add ripple effect CSS
const rippleStyle = document.createElement("style")
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn, .project-toggle, .theme-toggle {
        position: relative;
        overflow: hidden;
    }
`
document.head.appendChild(rippleStyle)

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
  // Your scroll handling code here
}, 16) // ~60fps

// Add error handling for missing elements
function safeQuerySelector(selector) {
  const element = document.querySelector(selector)
  if (!element) {
    console.warn(`Element not found: ${selector}`)
  }
  return element
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("Modern Portfolio website loaded successfully!")

  // Add any additional initialization code here
  const heroSection = safeQuerySelector("#home")
  if (heroSection) {
    heroSection.style.opacity = "1"
  }
})

// Lightbox functionality
let currentGallery = []
let currentImageIndex = 0
let currentGalleryName = ""

const galleries = {
  "vvn-gallery": [
    { src: "/placeholder.svg?height=600&width=400", alt: "VVN Eats Home Screen - Main dashboard with menu categories" },
    { src: "/placeholder.svg?height=600&width=400", alt: "VVN Eats Menu Screen - Detailed menu items with prices" },
    {
      src: "/placeholder.svg?height=600&width=400",
      alt: "VVN Eats Details Screen - Individual item details and nutrition info",
    },
    { src: "/placeholder.svg?height=600&width=400", alt: "VVN Eats Profile Screen - User profile and preferences" },
  ],
  "fpt-gallery": [
    { src: "/placeholder.svg?height=600&width=400", alt: "FPT Login Screen - Secure authentication interface" },
    { src: "/placeholder.svg?height=600&width=400", alt: "FPT Scanner Screen - Barcode scanning functionality" },
    { src: "/placeholder.svg?height=600&width=400", alt: "FPT Dashboard - Real-time tracking and analytics" },
    {
      src: "/placeholder.svg?height=600&width=400",
      alt: "FPT Reports Screen - Detailed reports and data visualization",
    },
  ],
}

function openLightbox(galleryName, imageIndex) {
  currentGallery = galleries[galleryName]
  currentImageIndex = imageIndex
  currentGalleryName = galleryName

  const lightbox = document.getElementById("lightbox-overlay")
  const lightboxImage = document.getElementById("lightbox-image")
  const lightboxCaption = document.getElementById("lightbox-caption")
  const thumbnailsContainer = document.getElementById("lightbox-thumbnails")

  // Set current image
  lightboxImage.src = currentGallery[currentImageIndex].src
  lightboxCaption.textContent = currentGallery[currentImageIndex].alt

  // Create thumbnails
  thumbnailsContainer.innerHTML = ""
  currentGallery.forEach((image, index) => {
    const thumbnail = document.createElement("img")
    thumbnail.src = image.src
    thumbnail.className = `lightbox-thumbnail ${index === currentImageIndex ? "active" : ""}`
    thumbnail.onclick = () => goToImage(index)
    thumbnailsContainer.appendChild(thumbnail)
  })

  // Show lightbox
  lightbox.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox-overlay")
  lightbox.classList.remove("active")
  document.body.style.overflow = "auto"
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % currentGallery.length
  updateLightboxImage()
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length
  updateLightboxImage()
}

function goToImage(index) {
  currentImageIndex = index
  updateLightboxImage()
}

function updateLightboxImage() {
  const lightboxImage = document.getElementById("lightbox-image")
  const lightboxCaption = document.getElementById("lightbox-caption")
  const thumbnails = document.querySelectorAll(".lightbox-thumbnail")

  // Update image and caption
  lightboxImage.src = currentGallery[currentImageIndex].src
  lightboxCaption.textContent = currentGallery[currentImageIndex].alt

  // Update active thumbnail
  thumbnails.forEach((thumb, index) => {
    thumb.classList.toggle("active", index === currentImageIndex)
  })
}

// Keyboard navigation for lightbox
document.addEventListener("keydown", (e) => {
  const lightbox = document.getElementById("lightbox-overlay")
  if (lightbox.classList.contains("active")) {
    switch (e.key) {
      case "Escape":
        closeLightbox()
        break
      case "ArrowLeft":
        prevImage()
        break
      case "ArrowRight":
        nextImage()
        break
    }
  }
})

// Prevent lightbox from closing when clicking on content
document.querySelector(".lightbox-container").addEventListener("click", (e) => {
  e.stopPropagation()
})

// Initialize AOS (Animate On Scroll)
document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  window.AOS = window.AOS || {}
  window.AOS.init = window.AOS.init || (() => {})
  window.AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    offset: 100,
  })

  // Add scroll animations to existing elements
  const animateElements = document.querySelectorAll(
    ".hero-text, .hero-image, .about-text, .about-image, .skill-category, .project-card, .education-card",
  )

  animateElements.forEach((el, index) => {
    el.setAttribute("data-aos", "fade-up")
    el.setAttribute("data-aos-delay", (index * 100).toString())
  })

  // Refresh AOS to apply new attributes
  window.AOS.refresh = window.AOS.refresh || (() => {})
  window.AOS.refresh()
})

// Enhanced scroll animations
const observeElements = () => {
  const elements = document.querySelectorAll(".fade-in-up:not(.animated)")

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("animated")
      element.style.opacity = "1"
      element.style.transform = "translateY(0)"
    }
  })
}

// Smooth scroll reveal with stagger effect
const revealOnScroll = () => {
  const reveals = document.querySelectorAll(".timeline-item, .skill-category, .project-card")

  reveals.forEach((element, index) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      setTimeout(() => {
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }, index * 100)
    }
  })
}

// Enhanced parallax effect
const parallaxEffect = () => {
  const scrolled = window.pageYOffset
  const parallaxElements = document.querySelectorAll(".hero-shape, .floating-icon")

  parallaxElements.forEach((element, index) => {
    const speed = 0.5 + index * 0.1
    const yPos = -(scrolled * speed)
    element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`
  })
}

// Optimized scroll handler
let ticking = false

const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      observeElements()
      revealOnScroll()
      parallaxEffect()
      ticking = false
    })
    ticking = true
  }
}

window.addEventListener("scroll", handleScroll)

// Add loading animation for gallery images
document.addEventListener("DOMContentLoaded", () => {
  const galleryImages = document.querySelectorAll(".gallery-item img")

  galleryImages.forEach((img) => {
    img.addEventListener("load", () => {
      img.style.opacity = "1"
      img.style.transform = "scale(1)"
    })

    img.style.opacity = "0"
    img.style.transform = "scale(0.8)"
    img.style.transition = "opacity 0.5s ease, transform 0.5s ease"
  })
})

// Add hover effects for experience cards
document.addEventListener("DOMContentLoaded", () => {
  const experienceCards = document.querySelectorAll(".experience-card")

  experienceCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)"
    })
  })
})
