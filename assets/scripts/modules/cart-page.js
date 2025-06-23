// Cart Page Module - PixelVault Gaming Store

document.addEventListener("DOMContentLoaded", () => {
  const cartPageModule = {
    cartItems: [],
    cartItemsContainer: document.getElementById("cart-items-container"),
    cartSummaryContainer: document.getElementById("cart-summary-container"),

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

      if (this.cartItems.length === 0) {
        this.renderEmptyCart();
      } else {
        this.renderCartItems();
        this.renderCartSummary();
      }
    },

    renderEmptyCart() {
      this.cartItemsContainer.innerHTML = `
        <div class="empty-cart-message">
          <h2>Your Cart is Empty</h2>
          <p>You haven't added any games to your cart yet.</p>
          <a href="catalog.html" class="btn primary-btn">Explore Games</a>
        </div>
      `;
      this.cartSummaryContainer.style.display = "none";
    },

    renderCartItems() {
      this.cartItemsContainer.innerHTML = this.cartItems
        .map(
          (item) => `
          <div class="cart-page-item" data-game-id="${item.id}">
            <div class="item-details">
              <div class="item-image" style="background: linear-gradient(135deg, #e67e22, #f39c12);"></div>
              <div>
                <h3 class="item-title">${item.title}</h3>
                <p class="item-developer">${item.developer}</p>
                <button class="item-remove-btn" data-game-id="${
                  item.id
                }">Remove</button>
              </div>
            </div>
            <div class="item-price">$${item.price.toFixed(2)}</div>
            <div class="item-quantity">
              <button class="quantity-btn" data-action="decrease" data-game-id="${
                item.id
              }">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn" data-action="increase" data-game-id="${
                item.id
              }">+</button>
            </div>
            <div class="item-total-price">$${(
              item.price * item.quantity
            ).toFixed(2)}</div>
          </div>
        `
        )
        .join("");

      this.attachItemEventListeners();
    },

    renderCartSummary() {
      const subtotal = this.calculateSubtotal();
      const tax = subtotal * 0.08; // Example 8% tax
      const total = subtotal + tax;

      this.cartSummaryContainer.innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Estimated Tax</span>
          <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-row total-row">
          <span>Total</span>
          <span>$${total.toFixed(2)}</span>
        </div>
        <button class="btn primary-btn checkout-btn-page">Proceed to Checkout</button>
      `;

      const checkoutButton =
        this.cartSummaryContainer.querySelector(".checkout-btn-page");
      if (checkoutButton) {
        checkoutButton.addEventListener("click", () =>
          this.openCheckoutModal()
        );
      }
    },

    attachItemEventListeners() {
      this.cartItemsContainer.addEventListener("click", (event) => {
        const target = event.target;

        if (target.matches(".item-remove-btn")) {
          const gameId = target.dataset.gameId;
          this.removeFromCart(gameId);
        }

        if (target.matches(".quantity-btn")) {
          const gameId = target.dataset.gameId;
          const action = target.dataset.action;
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
        this.renderCartPage();
      }
    },

    removeFromCart(gameId) {
      this.cartItems = this.cartItems.filter((item) => item.id !== gameId);
      this.saveCartToStorage();
      this.renderCartPage();
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

    openCheckoutModal() {
      const modal = document.getElementById("checkout-modal");
      if (modal) {
        modal.classList.add("active");
      }
    },

    closeCheckoutModal() {
      const modal = document.getElementById("checkout-modal");
      if (modal) {
        modal.classList.remove("active");
      }
    },

    setupCheckoutModalEvents() {
      const modal = document.getElementById("checkout-modal");
      if (!modal) return;

      const closeButton = modal.querySelector("#checkout-modal-close");
      const cancelButton = modal.querySelector("#cancel-checkout");

      closeButton?.addEventListener("click", () => this.closeCheckoutModal());
      cancelButton?.addEventListener("click", () => this.closeCheckoutModal());

      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          this.closeCheckoutModal();
        }
      });
    },
  };

  cartPageModule.initialize();
});
