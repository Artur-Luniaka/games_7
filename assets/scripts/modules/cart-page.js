// Cart Page Module
class CartPageManager {
  constructor() {
    this.cartItems = [];
    this.promoCode = null;
    this.discountAmount = 0;
    this.init();
  }

  init() {
    this.loadCartItems();
    this.setupEventListeners();
    this.renderCartItems();
    this.updateCartSummary();
    this.loadRecommendedGames();
  }

  loadCartItems() {
    const savedCart = localStorage.getItem("pixelVaultCart");
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }
  }

  setupEventListeners() {
    // Clear cart button
    const clearCartBtn = document.getElementById("clear-cart-btn");
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => this.clearCart());
    }

    // Proceed to checkout button
    const proceedCheckoutBtn = document.getElementById("proceed-checkout-btn");
    if (proceedCheckoutBtn) {
      proceedCheckoutBtn.addEventListener("click", () =>
        this.openCheckoutModal()
      );
    }

    // Promo code
    const applyPromoBtn = document.getElementById("apply-promo-btn");
    const promoInput = document.getElementById("promo-code-input");

    if (applyPromoBtn) {
      applyPromoBtn.addEventListener("click", () => this.applyPromoCode());
    }

    if (promoInput) {
      promoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.applyPromoCode();
        }
      });
    }

    // Checkout modal events
    this.setupCheckoutModalEvents();

    // Listen for cart updates from other pages
    window.addEventListener("addToCart", (e) => {
      this.addItemToCart(e.detail);
    });
  }

  renderCartItems() {
    const cartItemsList = document.getElementById("cart-items-list");
    const cartItemsCount = document.getElementById("cart-items-count");
    const emptyCartMessage = document.getElementById("empty-cart-message");

    if (!cartItemsList) return;

    if (this.cartItems.length === 0) {
      cartItemsList.innerHTML = "";
      if (emptyCartMessage) {
        emptyCartMessage.style.display = "block";
      }
      if (cartItemsCount) {
        cartItemsCount.textContent = "0";
      }
      return;
    }

    if (emptyCartMessage) {
      emptyCartMessage.style.display = "none";
    }

    if (cartItemsCount) {
      cartItemsCount.textContent = this.cartItems.length;
    }

    cartItemsList.innerHTML = "";

    this.cartItems.forEach((item, index) => {
      const cartItemElement = this.createCartItemElement(item, index);
      cartItemsList.appendChild(cartItemElement);
    });
  }

  createCartItemElement(item, index) {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-image" />
      <div class="cart-item-details">
        <h3>${item.title}</h3>
        <div class="cart-item-meta">Digital Download</div>
      </div>
      <div class="cart-item-price">$${(item.price * item.quantity).toFixed(
        2
      )}</div>
      <div class="cart-item-actions">
        <div class="quantity-controls">
          <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
        </div>
        <button class="remove-item-btn" data-index="${index}">Remove</button>
      </div>
    `;

    // Add event listeners for quantity controls
    const decreaseBtn = cartItem.querySelector('[data-action="decrease"]');
    const increaseBtn = cartItem.querySelector('[data-action="increase"]');
    const removeBtn = cartItem.querySelector(".remove-item-btn");

    decreaseBtn.addEventListener("click", () => this.updateQuantity(index, -1));
    increaseBtn.addEventListener("click", () => this.updateQuantity(index, 1));
    removeBtn.addEventListener("click", () => this.removeItem(index));

    return cartItem;
  }

  updateQuantity(index, change) {
    const newQuantity = this.cartItems[index].quantity + change;

    if (newQuantity <= 0) {
      this.removeItem(index);
    } else {
      this.cartItems[index].quantity = newQuantity;
      this.saveCart();
      this.renderCartItems();
      this.updateCartSummary();
    }
  }

  removeItem(index) {
    this.cartItems.splice(index, 1);
    this.saveCart();
    this.renderCartItems();
    this.updateCartSummary();
    this.showNotification("Item removed from cart", "info");
  }

  clearCart() {
    if (this.cartItems.length === 0) return;

    if (confirm("Are you sure you want to clear your cart?")) {
      this.cartItems = [];
      this.promoCode = null;
      this.discountAmount = 0;
      this.saveCart();
      this.renderCartItems();
      this.updateCartSummary();
      this.clearPromoMessage();
      this.showNotification("Cart cleared", "info");
    }
  }

  updateCartSummary() {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax(subtotal);
    const total = subtotal + tax - this.discountAmount;

    // Update summary items
    this.renderSummaryItems();

    // Update totals
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");
    const discountRow = document.getElementById("discount-row");
    const discountAmount = document.getElementById("discount-amount");

    if (subtotalElement)
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

    // Show/hide discount row
    if (discountRow && discountAmount) {
      if (this.discountAmount > 0) {
        discountRow.style.display = "flex";
        discountAmount.textContent = `-$${this.discountAmount.toFixed(2)}`;
      } else {
        discountRow.style.display = "none";
      }
    }

    // Update checkout button state
    const proceedCheckoutBtn = document.getElementById("proceed-checkout-btn");
    if (proceedCheckoutBtn) {
      proceedCheckoutBtn.disabled = this.cartItems.length === 0;
    }
  }

  renderSummaryItems() {
    const summaryItems = document.getElementById("summary-items");
    if (!summaryItems) return;

    summaryItems.innerHTML = "";

    this.cartItems.forEach((item) => {
      const summaryItem = document.createElement("div");
      summaryItem.className = "summary-item";
      summaryItem.innerHTML = `
        <span class="summary-item-name">${item.title} (x${item.quantity})</span>
        <span class="summary-item-price">$${(
          item.price * item.quantity
        ).toFixed(2)}</span>
      `;
      summaryItems.appendChild(summaryItem);
    });
  }

  calculateSubtotal() {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  calculateTax(subtotal) {
    return subtotal * 0.08; // 8% tax rate
  }

  applyPromoCode() {
    const promoInput = document.getElementById("promo-code-input");
    const promoMessage = document.getElementById("promo-message");

    if (!promoInput || !promoMessage) return;

    const code = promoInput.value.trim().toUpperCase();

    if (!code) {
      this.showPromoMessage("Please enter a promo code", "error");
      return;
    }

    // Simulate promo code validation
    const validPromoCodes = {
      WELCOME10: 0.1,
      GAMER20: 0.2,
      SAVE15: 0.15,
    };

    if (validPromoCodes[code]) {
      this.promoCode = code;
      const subtotal = this.calculateSubtotal();
      this.discountAmount = subtotal * validPromoCodes[code];
      this.updateCartSummary();
      this.showPromoMessage(
        `Promo code applied! ${validPromoCodes[code] * 100}% discount`,
        "success"
      );
      promoInput.disabled = true;
    } else {
      this.showPromoMessage("Invalid promo code", "error");
    }
  }

  showPromoMessage(message, type) {
    const promoMessage = document.getElementById("promo-message");
    if (promoMessage) {
      promoMessage.textContent = message;
      promoMessage.className = `promo-message ${type}`;
    }
  }

  clearPromoMessage() {
    const promoMessage = document.getElementById("promo-message");
    if (promoMessage) {
      promoMessage.textContent = "";
      promoMessage.className = "promo-message";
    }
  }

  setupCheckoutModalEvents() {
    const checkoutModal = document.getElementById("checkout-modal");
    const modalClose = document.getElementById("checkout-modal-close");
    const cancelBtn = document.getElementById("cancel-checkout");
    const checkoutForm = document.getElementById("checkout-form");

    if (modalClose) {
      modalClose.addEventListener("click", () => this.closeCheckoutModal());
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.closeCheckoutModal());
    }

    if (checkoutModal) {
      checkoutModal.addEventListener("click", (e) => {
        if (e.target === checkoutModal) {
          this.closeCheckoutModal();
        }
      });
    }

    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => this.handleCheckout(e));
    }
  }

  openCheckoutModal() {
    const checkoutModal = document.getElementById("checkout-modal");
    if (checkoutModal) {
      checkoutModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  closeCheckoutModal() {
    const checkoutModal = document.getElementById("checkout-modal");
    if (checkoutModal) {
      checkoutModal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  }

  async handleCheckout(e) {
    e.preventDefault();

    const placeOrderBtn = document.getElementById("place-order-btn");
    const spinner = document.getElementById("order-spinner");

    if (placeOrderBtn && spinner) {
      placeOrderBtn.disabled = true;
      spinner.style.display = "inline";
    }

    try {
      // Simulate payment processing
      await this.simulatePaymentProcessing();

      // Process order
      this.processOrder();

      // Close modal and redirect
      this.closeCheckoutModal();
      this.showNotification("Order placed successfully!", "success");

      // Clear cart and redirect to confirmation
      setTimeout(() => {
        this.cartItems = [];
        this.saveCart();
        window.location.href = "index.html?order=success";
      }, 2000);
    } catch (error) {
      this.showNotification("Payment failed. Please try again.", "error");
    } finally {
      if (placeOrderBtn && spinner) {
        placeOrderBtn.disabled = false;
        spinner.style.display = "none";
      }
    }
  }

  simulatePaymentProcessing() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  processOrder() {
    // Generate order number
    const orderNumber = "PV" + Date.now().toString().slice(-8);

    // Save order to localStorage (in a real app, this would go to a database)
    const order = {
      orderNumber,
      items: this.cartItems,
      subtotal: this.calculateSubtotal(),
      tax: this.calculateTax(this.calculateSubtotal()),
      discount: this.discountAmount,
      total:
        this.calculateSubtotal() +
        this.calculateTax(this.calculateSubtotal()) -
        this.discountAmount,
      date: new Date().toISOString(),
      status: "completed",
    };

    const orders = JSON.parse(localStorage.getItem("pixelVaultOrders") || "[]");
    orders.push(order);
    localStorage.setItem("pixelVaultOrders", JSON.stringify(orders));
  }

  async loadRecommendedGames() {
    try {
      const response = await fetch("assets/data/games-catalog.json");
      const gamesData = await response.json();

      // Get random games that are not in cart
      const cartGameIds = this.cartItems.map((item) => item.id);
      const availableGames = gamesData.games.filter(
        (game) => !cartGameIds.includes(game.id)
      );
      const recommendedGames = this.shuffleArray(availableGames).slice(0, 4);

      this.renderRecommendedGames(recommendedGames);
    } catch (error) {
      console.error("Error loading recommended games:", error);
    }
  }

  renderRecommendedGames(games) {
    const recommendedContainer = document.getElementById("recommended-games");
    if (!recommendedContainer) return;

    recommendedContainer.innerHTML = "";

    games.forEach((game) => {
      const gameCard = this.createRecommendedGameCard(game);
      recommendedContainer.appendChild(gameCard);
    });
  }

  createRecommendedGameCard(game) {
    const card = document.createElement("div");
    card.className = "game-card";
    card.addEventListener("click", () => {
      window.location.href = `game-detail.html?id=${game.id}`;
    });

    card.innerHTML = `
      <div class="game-card-image">
        <img src="${game.media.coverImage}" alt="${game.title}" />
        <div class="game-card-overlay">
          <button class="quick-add-btn" data-game-id="${
            game.id
          }">Add to Cart</button>
        </div>
      </div>
      <div class="game-card-content">
        <h3>${game.title}</h3>
        <div class="game-card-price">$${game.price.toFixed(2)}</div>
      </div>
    `;

    // Add quick add to cart functionality
    const quickAddBtn = card.querySelector(".quick-add-btn");
    quickAddBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.addItemToCart({
        id: game.id,
        title: game.title,
        price: game.price,
        image: game.media.coverImage,
        quantity: 1,
      });
    });

    return card;
  }

  addItemToCart(item) {
    const existingItemIndex = this.cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      this.cartItems[existingItemIndex].quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }

    this.saveCart();
    this.renderCartItems();
    this.updateCartSummary();
    this.showNotification("Game added to cart!", "success");
  }

  saveCart() {
    localStorage.setItem("pixelVaultCart", JSON.stringify(this.cartItems));
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  showNotification(message, type = "info") {
    const event = new CustomEvent("showNotification", {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  }
}

// Initialize cart page manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CartPageManager();
});
