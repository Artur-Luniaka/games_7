// Cart Management Module - PixelVault Gaming Store
const cartManagementModule = {
  cartItems: [],
  isCartOpen: false,

  initializeCart() {
    this.loadCartFromStorage();
    this.setupCartEventListeners();
    this.updateCartDisplay();
  },

  setupCartEventListeners() {
    document.addEventListener("openCart", (event) => {
      this.openCartModal();
    });

    // Close cart when clicking outside
    document.addEventListener("click", (event) => {
      if (this.isCartOpen && !event.target.closest(".cart-modal")) {
        this.closeCartModal();
      }
    });

    // Close cart with Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.isCartOpen) {
        this.closeCartModal();
      }
    });
  },

  openCartModal() {
    if (this.isCartOpen) return;

    this.createCartModal();
    this.isCartOpen = true;

    // Animate in
    setTimeout(() => {
      const modal = document.querySelector(".cart-modal");
      if (modal) {
        modal.classList.add("cart-modal-open");
      }
    }, 10);
  },

  closeCartModal() {
    const modal = document.querySelector(".cart-modal");
    if (!modal) return;

    modal.classList.remove("cart-modal-open");

    setTimeout(() => {
      modal.remove();
      this.isCartOpen = false;
    }, 300);
  },

  createCartModal() {
    const modal = document.createElement("div");
    modal.className = "cart-modal";
    modal.innerHTML = this.generateCartHTML();

    document.body.appendChild(modal);
    this.attachCartEventListeners(modal);
  },

  generateCartHTML() {
    if (this.cartItems.length === 0) {
      return `
                <div class="cart-modal-content">
                    <div class="cart-header">
                        <h2>Shopping Cart</h2>
                        <button class="cart-close-btn" aria-label="Close cart">×</button>
                    </div>
                    <div class="cart-empty">
                        <div class="cart-empty-icon">🛒</div>
                        <h3>Your cart is empty</h3>
                        <p>Start shopping to add some amazing games to your cart!</p>
                        <button class="btn primary-btn" onclick="this.closeCartModal()">Continue Shopping</button>
                    </div>
                </div>
            `;
    }

    const cartItemsHTML = this.cartItems
      .map(
        (item) => `
            <div class="cart-item" data-game-id="${item.id}">
                <div class="cart-item-image">
                    <div class="cart-item-cover" style="background: ${this.getGameCoverGradient(
                      item
                    )}"></div>
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-developer">${item.developer}</p>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus-btn" data-game-id="${
                      item.id
                    }">−</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn plus-btn" data-game-id="${
                      item.id
                    }">+</button>
                </div>
                <div class="cart-item-total">$${(
                  item.price * item.quantity
                ).toFixed(2)}</div>
                <button class="cart-item-remove" data-game-id="${
                  item.id
                }" aria-label="Remove item">×</button>
            </div>
        `
      )
      .join("");

    const total = this.calculateCartTotal();

    return `
            <div class="cart-modal-content">
                <div class="cart-header">
                    <h2>Shopping Cart (${this.getTotalItems()})</h2>
                    <button class="cart-close-btn" aria-label="Close cart">×</button>
                </div>
                <div class="cart-items">
                    ${cartItemsHTML}
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span class="cart-total-amount">$${total.toFixed(
                          2
                        )}</span>
                    </div>
                    <div class="cart-actions">
                        <button class="btn secondary-btn" onclick="this.closeCartModal()">Continue Shopping</button>
                        <button class="btn primary-btn checkout-btn">Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        `;
  },

  attachCartEventListeners(modal) {
    const closeBtn = modal.querySelector(".cart-close-btn");
    const removeBtns = modal.querySelectorAll(".cart-item-remove");
    const quantityBtns = modal.querySelectorAll(".quantity-btn");
    const checkoutBtn = modal.querySelector(".checkout-btn");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeCartModal());
    }

    removeBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const gameId = event.currentTarget.getAttribute("data-game-id");
        this.removeFromCart(gameId);
      });
    });

    quantityBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const gameId = event.currentTarget.getAttribute("data-game-id");
        const isPlus = event.currentTarget.classList.contains("plus-btn");
        this.updateQuantity(gameId, isPlus ? 1 : -1);
      });
    });

    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => this.proceedToCheckout());
    }
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
    this.updateCartDisplay();
    this.showAddToCartNotification(gameData.title);
  },

  removeFromCart(gameId) {
    this.cartItems = this.cartItems.filter((item) => item.id !== gameId);
    this.saveCartToStorage();
    this.updateCartDisplay();
    this.refreshCartModal();
  },

  updateQuantity(gameId, change) {
    const item = this.cartItems.find((item) => item.id === gameId);
    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      this.removeFromCart(gameId);
    } else {
      item.quantity = newQuantity;
      this.saveCartToStorage();
      this.updateCartDisplay();
      this.refreshCartModal();
    }
  },

  refreshCartModal() {
    if (!this.isCartOpen) return;

    const modal = document.querySelector(".cart-modal");
    if (modal) {
      modal.innerHTML = this.generateCartHTML();
      this.attachCartEventListeners(modal);
    }
  },

  calculateCartTotal() {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  getTotalItems() {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  },

  getGameCoverGradient(gameData) {
    const gradients = [
      "linear-gradient(135deg, #e67e22, #f39c12)",
      "linear-gradient(135deg, #d35400, #e67e22)",
      "linear-gradient(135deg, #f39c12, #f1c40f)",
      "linear-gradient(135deg, #e67e22, #d35400)",
      "linear-gradient(135deg, #f1c40f, #f39c12)",
    ];

    const index = gameData.id.length % gradients.length;
    return gradients[index];
  },

  updateCartDisplay() {
    const cartCounter = document.getElementById("cart-counter");
    if (cartCounter) {
      cartCounter.textContent = this.getTotalItems();
    }
  },

  showAddToCartNotification(gameTitle) {
    const notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✅</span>
                <span class="notification-text">${gameTitle} added to cart!</span>
            </div>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("notification-show");
    }, 100);

    setTimeout(() => {
      notification.classList.remove("notification-show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  },

  proceedToCheckout() {
    if (this.cartItems.length === 0) return;

    // In a real app, this would redirect to checkout page
    console.log("Proceeding to checkout with items:", this.cartItems);
    alert("Checkout functionality would be implemented here!");
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

  clearCart() {
    this.cartItems = [];
    this.saveCartToStorage();
    this.updateCartDisplay();
    if (this.isCartOpen) {
      this.refreshCartModal();
    }
  },
};

// Initialize cart when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  cartManagementModule.initializeCart();
});

// Export for use in other modules
export default cartManagementModule;
