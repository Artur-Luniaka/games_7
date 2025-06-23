// Cart Page Module - PixelVault Gaming Store

document.addEventListener("DOMContentLoaded", () => {
  const cartPageModule = {
    cartItems: [],
    cartItemsContainer: document.getElementById("cart-items-container"),
    cartItemsList: document.getElementById("cart-items-list"),
    cartSummaryContainer: document.getElementById("cart-summary-container"),
    cartItemsCount: document.getElementById("cart-items-count"),
    cartContent: document.querySelector(".cart-content"),

    initialize() {
      this.loadCartFromStorage();
      this.renderCartPage();
      this.setupCheckoutModalEvents();
    },

    loadCartFromStorage() {
      try {
        const savedCart = localStorage.getItem("pixelvault-cart");
        this.cartItems = savedCart ? JSON.parse(savedCart) : [];
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
        this.cartItems = [];
      }
    },

    renderCartPage() {
      if (!this.cartItemsContainer || !this.cartSummaryContainer) {
        console.error("Cart containers not found!");
        return;
      }

      this.updateCartItemsCount();

      if (this.cartItems.length === 0) {
        this.renderEmptyCart();
        if (this.cartContent) {
          this.cartContent.classList.add("cart-empty");
        }
      } else {
        this.renderCartItems();
        this.renderCartSummary();
        if (this.cartContent) {
          this.cartContent.classList.remove("cart-empty");
        }
      }
    },

    updateCartItemsCount() {
      if (this.cartItemsCount) {
        const totalItems = this.cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
        this.cartItemsCount.textContent = totalItems;
      }
    },

    renderEmptyCart() {
      if (this.cartItemsList) {
        this.cartItemsList.innerHTML = `
          <div class="empty-cart-message" id="empty-cart-message">
            <div class="empty-cart-icon">
              <img src="assets/public/basket.png" alt="Empty Cart" class="empty-cart-img"/>
            </div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any games to your cart yet.</p>
            <a href="catalog.html" class="browse-games-btn primary-btn">
              Browse Games
            </a>
          </div>
        `;
      }

      if (this.cartSummaryContainer) {
        this.cartSummaryContainer.style.display = "none";
      }
    },

    renderCartItems() {
      if (!this.cartItemsList) return;

      this.cartItemsList.innerHTML = this.cartItems
        .map(
          (item, index) => `
          <div class="wow-cart-item" data-game-id="${
            item.id
          }" style="animation-delay: ${index * 0.1}s">
            <div class="cart-item-image">
              <img src="assets/public/${item.image}" alt="${
            item.title
          }" class="cart-item-cover" />
            </div>
            <div class="cart-item-details">
              <div class="cart-item-title">${item.title}</div>
              <div class="cart-item-platform"><span class="platform-icon">🎮</span> ${
                item.platform || ""
              }</div>
            </div>
            <div class="cart-item-actions">
              <button class="cart-item-remove" data-game-id="${
                item.id
              }" title="Remove"><span class="remove-icon">✖</span></button>
              <div class="quantity-controls">
                <button class="quantity-btn" data-action="decrease" data-game-id="${
                  item.id
                }">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" data-action="increase" data-game-id="${
                  item.id
                }">+</button>
              </div>
            </div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-total">$${(
              item.price * item.quantity
            ).toFixed(2)}</div>
          </div>
        `
        )
        .join("");

      this.attachItemEventListeners();

      // Add entrance animation
      setTimeout(() => {
        const cartItems = this.cartItemsList.querySelectorAll(".wow-cart-item");
        cartItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          }, index * 100);
        });
      }, 100);
    },

    renderCartSummary() {
      if (!this.cartSummaryContainer) return;

      const subtotal = this.calculateSubtotal();
      const tax = subtotal * 0.08; // Example 8% tax
      const total = subtotal + tax;

      this.cartSummaryContainer.style.display = "block";
      this.cartSummaryContainer.innerHTML = `
        <div class="cart-summary-card wow-summary">
          <h3>Order Summary</h3>
          <div class="summary-items" id="summary-items"></div>
          <div class="summary-totals">
            <div class="summary-row">
              <span class="summary-label">Subtotal</span>
              <span class="summary-value" id="subtotal">$${subtotal.toFixed(
                2
              )}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Tax</span>
              <span class="summary-value" id="tax">$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total-row">
              <span class="summary-label">Total</span>
              <span class="summary-value summary-total" id="total">$${total.toFixed(
                2
              )}</span>
            </div>
          </div>
          <div class="checkout-actions">
            <button class="proceed-checkout-btn primary-btn wow-checkout-btn" id="proceed-checkout-btn">
              <span class="lock-icon">🔒</span>
              Proceed to Checkout
            </button>
            <div class="secure-checkout-info">
              <span class="security-icon">🛡️</span>
              <span>Secure checkout powered by Stripe</span>
            </div>
          </div>
        </div>
        <div class="cart-benefits wow-benefits">
          <div class="benefit-item">
            <span class="benefit-icon">⚡</span>
            <div class="benefit-content">
              <h4>Instant Download</h4>
              <p>Get your games immediately after purchase</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">🔄</span>
            <div class="benefit-content">
              <h4>30-Day Refund</h4>
              <p>Not satisfied? Get a full refund within 30 days</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">🛡️</span>
            <div class="benefit-content">
              <h4>Secure Payment</h4>
              <p>Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>
      `;

      const checkoutButton = this.cartSummaryContainer.querySelector(
        "#proceed-checkout-btn"
      );
      if (checkoutButton) {
        checkoutButton.addEventListener("click", () =>
          this.openCheckoutModal()
        );
      }
    },

    attachItemEventListeners() {
      if (!this.cartItemsList) return;

      // Удаляем старые обработчики, чтобы избежать дублирования
      const newContainer = this.cartItemsList.cloneNode(true);
      this.cartItemsList.parentNode.replaceChild(
        newContainer,
        this.cartItemsList
      );
      this.cartItemsList = newContainer;

      this.cartItemsList.addEventListener("click", (event) => {
        const target = event.target;
        const removeButton = target.closest(".cart-item-remove");
        const quantityButton = target.closest(".quantity-btn");

        if (removeButton) {
          const gameId = removeButton.dataset.gameId;
          this.removeFromCart(gameId);
          return;
        }

        if (quantityButton) {
          const gameId = quantityButton.dataset.gameId;
          const action = quantityButton.dataset.action;
          this.updateQuantity(gameId, action === "increase" ? 1 : -1);
        }
      });
    },

    updateQuantity(gameId, change) {
      const item = this.cartItems.find((i) => i.id === gameId);
      if (!item) return;

      item.quantity += change;

      if (item.quantity <= 0) {
        this.removeFromCart(gameId);
      } else {
        this.saveCartToStorage();
        this.updateCartItemsCount();
        this.renderCartPage();
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    },

    removeFromCart(gameId) {
      this.cartItems = this.cartItems.filter((item) => item.id !== gameId);
      this.saveCartToStorage();
      this.updateCartItemsCount();
      this.renderCartPage();
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    },

    saveCartToStorage() {
      localStorage.setItem("pixelvault-cart", JSON.stringify(this.cartItems));
    },

    calculateSubtotal() {
      return this.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    setupCheckoutModalEvents() {
      const modal = document.getElementById("checkout-modal");
      if (!modal) return;

      const closeButton = document.getElementById("checkout-modal-close");
      const cancelButton = document.getElementById("checkout-modal-cancel");
      const form = document.getElementById("checkout-form");
      const closeSuccessBtn = document.getElementById("close-success-btn");
      const clearCartBtn = document.getElementById("clear-cart-btn");

      closeButton.addEventListener("click", () => this.closeCheckoutModal());
      cancelButton.addEventListener("click", () => this.closeCheckoutModal());
      closeSuccessBtn.addEventListener("click", () => {
        window.location.href = "catalog.html";
      });

      // Clear cart button functionality
      if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
          if (this.cartItems.length > 0) {
            if (confirm("Are you sure you want to clear your cart?")) {
              this.clearCart();
            }
          }
        });
      }

      // Click on overlay to close
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          this.closeCheckoutModal();
        }
      });

      // Press Escape key to close
      window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("active")) {
          this.closeCheckoutModal();
        }
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (this.validateForm()) {
          this.showSuccessView();
          this.processOrder();
        }
      });
    },

    validateForm() {
      const form = document.getElementById("checkout-form");
      const fullName = form.querySelector("#full-name");
      const email = form.querySelector("#email");
      const phone = form.querySelector("#phone");
      let isValid = true;

      [fullName, email, phone].forEach((input) => {
        input.parentElement.classList.remove("invalid");
      });

      if (fullName.value.trim().length < 2) {
        fullName.parentElement.classList.add("invalid");
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        email.parentElement.classList.add("invalid");
        isValid = false;
      }

      const phoneRegex = /^[0-9\s\(\)-]{7,}$/;
      if (!phoneRegex.test(phone.value)) {
        phone.parentElement.classList.add("invalid");
        isValid = false;
      }

      return isValid;
    },

    showSuccessView() {
      const checkoutView = document.getElementById("checkout-view");
      const successView = document.getElementById("success-view");
      checkoutView.style.display = "none";
      successView.style.display = "block";

      const checkmark = successView.querySelector(".checkmark-check");
      const circle = successView.querySelector(".checkmark-circle");
      checkmark.style.strokeDashoffset = "48";
      circle.style.strokeDashoffset = "289";

      setTimeout(() => {
        checkmark.style.strokeDashoffset = "0";
        circle.style.strokeDashoffset = "0";
      }, 100);
    },

    resetModal() {
      const checkoutView = document.getElementById("checkout-view");
      const successView = document.getElementById("success-view");
      const form = document.getElementById("checkout-form");

      if (form) {
        form.reset();
        form
          .querySelectorAll(".invalid")
          .forEach((el) => el.classList.remove("invalid"));
      }

      if (checkoutView && successView) {
        checkoutView.style.display = "block";
        successView.style.display = "none";
      }
    },

    processOrder() {
      this.clearCart();
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    },

    clearCart() {
      this.cartItems = [];
      this.saveCartToStorage();
      this.updateCartItemsCount();
      this.renderCartPage();

      // Обновляем счетчик в header
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    },

    openCheckoutModal() {
      const modal = document.getElementById("checkout-modal");
      if (modal) {
        document.body.style.overflow = "hidden";
        modal.classList.add("active");
      }
    },

    closeCheckoutModal() {
      const modal = document.getElementById("checkout-modal");
      if (modal) {
        document.body.style.overflow = "";
        modal.classList.remove("active");
        this.resetModal();
      }
    },
  };

  cartPageModule.initialize();
});
