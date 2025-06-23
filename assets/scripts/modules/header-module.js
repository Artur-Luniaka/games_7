// Header Module - PixelVault Gaming Store
const headerModule = {
  headerContainer: null,
  cartItems: [],
  isMenuOpen: false,

  initializeHeader() {
    const headerContainer = document.getElementById("header-container");
    if (!headerContainer) return;

    headerContainer.innerHTML = this.createHeaderHTML();
    this.headerContainer = headerContainer;
    this.attachEventListeners();
    this.loadCartFromStorage();
    this.updateCartCounter();
  },

  createHeaderHTML() {
    return `
            <header class="site-header">
                <div class="header-container">
                    <div class="header-logo">
                        <a href="index.html" class="logo-link">
                            <img src="assets/public/logo-icon.png" alt="PixelVault Gaming Store" class="logo-main-icon">
                        </a>
                    </div>
                    
                    <nav class="header-navigation" role="navigation">
                        <ul class="nav-menu">
                            <li class="nav-item">
                                <a href="index.html" class="nav-link"><span class="gradient-text">Main</span></a>
                            </li>
                            <li class="nav-item">
                                <a href="index.html#trending-section" class="nav-link nav-link-anchor"><span class="gradient-text">Trends</span></a>
                            </li>
                            <li class="nav-item">
                                <a href="catalog.html" class="nav-link"><span class="gradient-text">Games</span></a>
                            </li>
                            <li class="nav-item">
                                <a href="about.html" class="nav-link"><span class="gradient-text">About</span></a>
                            </li>
                            <li class="nav-item">
                                <a href="contact.html" class="nav-link"><span class="gradient-text">Contact</span></a>
                            </li>
                        </ul>
                    </nav>
                    
                    <div class="header-actions">
                        <div class="cart-container">
                            <a href="cart.html" class="cart-button" aria-label="Shopping Cart">
                                <img src="assets/public/basket.png" alt="Cart" class="cart-icon-img">
                                <span class="cart-counter" id="cart-counter">0</span>
                            </a>
                        </div>
                        
                        <button class="mobile-menu-toggle" aria-label="Toggle Menu" aria-expanded="false">
                            <img src="assets/public/burger-icon.png" alt="Menu" class="burger-icon">
                        </button>
                    </div>
                </div>
                
                <div class="mobile-menu" id="mobile-menu">
                    <ul class="mobile-nav-menu">
                        <li class="mobile-nav-item">
                            <a href="index.html" class="mobile-nav-link"><span class="gradient-text">Main</span></a>
                        </li>
                        <li class="mobile-nav-item">
                            <a href="index.html#trending-section" class="mobile-nav-link nav-link-anchor"><span class="gradient-text">Trends</span></a>
                        </li>
                        <li class="mobile-nav-item">
                            <a href="catalog.html" class="mobile-nav-link"><span class="gradient-text">Games</span></a>
                        </li>
                        <li class="mobile-nav-item">
                            <a href="about.html" class="mobile-nav-link"><span class="gradient-text">About</span></a>
                        </li>
                        <li class="mobile-nav-item">
                            <a href="contact.html" class="mobile-nav-link"><span class="gradient-text">Contact</span></a>
                        </li>
                    </ul>
                </div>
            </header>
        `;
  },

  attachEventListeners() {
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener("click", () => {
        this.toggleMobileMenu();
      });
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        this.handleNavigation(event);
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (event) => {
      if (!this.isMenuOpen) return; // Only run if the menu is open

      const mobileMenu = document.getElementById("mobile-menu");
      const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");

      const isClickInsideMenu = mobileMenu?.contains(event.target);
      const isClickOnToggle = mobileMenuToggle?.contains(event.target);

      if (!isClickInsideMenu && !isClickOnToggle) {
        this.closeMobileMenu();
      }
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Плавная прокрутка для якорных ссылок
    setTimeout(() => {
      document
        .querySelectorAll(".nav-link-anchor, .mobile-nav-link.nav-link-anchor")
        .forEach((link) => {
          link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            const [path, hash] = href.split("#");

            if (
              window.location.pathname.endsWith(path) ||
              (window.location.pathname === "/" && path === "index.html")
            ) {
              // Если мы на той же странице, что и ссылка
              if (hash) {
                e.preventDefault();
                const target = document.getElementById(hash);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
                if (window.innerWidth <= 768) {
                  headerModule.closeMobileMenu();
                }
              }
            }
            // Иначе, просто переходим по ссылке (на другую страницу)
          });
        });
    }, 0);
  },

  toggleMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");

    if (!mobileMenu || !mobileMenuToggle) return;

    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  },

  openMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");

    if (!mobileMenu || !mobileMenuToggle) return;

    mobileMenu.classList.add("mobile-menu-open");
    mobileMenuToggle.setAttribute("aria-expanded", "true");
    mobileMenuToggle.classList.add("menu-open");
    this.isMenuOpen = true;

    // Animate menu items
    const menuItems = mobileMenu.querySelectorAll(".mobile-nav-item");
    menuItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      item.classList.add("menu-item-enter");
    });
  },

  closeMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");

    if (!mobileMenu || !mobileMenuToggle) return;

    mobileMenu.classList.remove("mobile-menu-open");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileMenuToggle.classList.remove("menu-open");
    this.isMenuOpen = false;

    // Remove animation classes
    const menuItems = mobileMenu.querySelectorAll(".mobile-nav-item");
    menuItems.forEach((item) => {
      item.classList.remove("menu-item-enter");
      item.style.animationDelay = "";
    });
  },

  handleNavigation(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");

    // Add loading state
    link.classList.add("nav-link-loading");

    // Simulate navigation delay for better UX
    setTimeout(() => {
      link.classList.remove("nav-link-loading");
      // In a real app, this would navigate to the page
      console.log(`Navigating to: ${href}`);
    }, 300);
  },

  addToCart(gameData) {
    const existingItem = this.cartItems.find((item) => item.id === gameData.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({
        ...gameData,
        quantity: 1,
      });
    }

    this.saveCartToStorage();
    this.updateCartCounter();
    this.showAddToCartNotification(gameData.title);
  },

  removeFromCart(gameId) {
    this.cartItems = this.cartItems.filter((item) => item.id !== gameId);
    this.saveCartToStorage();
    this.updateCartCounter();
  },

  updateCartQuantity(gameId, quantity) {
    const item = this.cartItems.find((item) => item.id === gameId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(gameId);
      } else {
        item.quantity = quantity;
        this.saveCartToStorage();
        this.updateCartCounter();
      }
    }
  },

  updateCartCounter() {
    const cartCounter = document.getElementById("cart-counter");
    if (cartCounter) {
      const totalItems = this.cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      cartCounter.textContent = totalItems;

      // Add animation class
      cartCounter.classList.add("cart-counter-update");
      setTimeout(() => {
        cartCounter.classList.remove("cart-counter-update");
      }, 300);
    }
  },

  showAddToCartNotification(gameTitle) {
    const notification = document.createElement("div");
    notification.className = "add-to-cart-notification";
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✅</span>
                <span class="notification-text">${gameTitle} added to cart!</span>
            </div>
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add("notification-show");
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove("notification-show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  },

  saveCartToStorage() {
    try {
      localStorage.setItem("pixelvault-cart", JSON.stringify(this.cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  },

  loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem("pixelvault-cart");
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      this.cartItems = [];
    }
  },

  getCartItems() {
    return [...this.cartItems];
  },

  clearCart() {
    this.cartItems = [];
    this.saveCartToStorage();
    this.updateCartCounter();
  },
};

// Initialize header when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  headerModule.initializeHeader();
});

// Export for use in other modules
export default headerModule;
