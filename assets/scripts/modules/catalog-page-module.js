// Catalog Page Module - PixelVault Gaming Store
// This module handles ONLY the catalog page, separate from homepage logic

const catalogPageModule = {
  gamesData: [],
  filters: {
    platforms: ["PC", "Xbox"],
    genres: [],
    price: 100,
    ratings: [],
    availability: [],
    search: "",
  },
  currentSort: "featured",

  async initialize() {
    try {
      await this.loadGamesData();
      this.renderFilteredGames();
      this.attachEventListeners();
      this.initGenreFilters();
      this.initFilterUI();
    } catch (error) {
      console.error("Failed to initialize catalog page:", error);
    }
  },

  async loadGamesData() {
    try {
      const response = await fetch("assets/data/games-catalog.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.gamesData = data.featured_games;
    } catch (error) {
      console.error("Failed to load games data:", error);
      this.gamesData = [];
    }
  },

  renderFilteredGames() {
    let filteredGames = [...this.gamesData];
    const { platforms, genres, price, ratings, availability, search } =
      this.filters;

    // Поиск
    if (search && search.trim()) {
      filteredGames = filteredGames.filter(
        (game) =>
          game.title.toLowerCase().includes(search.toLowerCase()) ||
          game.developer.toLowerCase().includes(search.toLowerCase()) ||
          game.genres.some((genre) =>
            genre.toLowerCase().includes(search.toLowerCase())
          ) ||
          game.tags.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    // Платформы
    if (platforms.length > 0) {
      filteredGames = filteredGames.filter((game) =>
        game.platforms.some((p) => platforms.includes(p))
      );
    }

    // Жанры
    if (genres.length > 0) {
      filteredGames = filteredGames.filter((game) =>
        game.genres.some((g) => genres.includes(g))
      );
    }

    // Цена
    if (typeof price === "number") {
      filteredGames = filteredGames.filter((game) => game.price <= price);
    }

    // Рейтинг
    if (ratings.length > 0) {
      filteredGames = filteredGames.filter((game) =>
        ratings.some((r) => game.rating >= parseFloat(r))
      );
    }

    // Доступность
    if (availability.length > 0) {
      filteredGames = filteredGames.filter((game) => {
        return availability.some((a) => {
          if (a === "on-sale") return game.discount_percent > 0;
          if (a === "new-release")
            return (
              new Date(game.release_date) >
              new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
            );
          if (a === "pre-order") return game.tags.includes("Pre-Order");
          return false;
        });
      });
    }

    // Apply sorting
    switch (this.currentSort) {
      case "price-low":
        filteredGames.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredGames.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredGames.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filteredGames.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        break;
      case "oldest":
        filteredGames.sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        );
        break;
      case "name-asc":
        filteredGames.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filteredGames.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Keep original order for 'featured' and 'relevance'
        break;
    }

    this.renderGames(filteredGames);
  },

  renderGames(games) {
    const gamesGrid = document.getElementById("catalog-grid");
    const resultsCount = document.getElementById("results-count");

    if (!gamesGrid || !resultsCount) return;

    gamesGrid.innerHTML = "";
    resultsCount.textContent = games.length;

    if (games.length === 0) {
      gamesGrid.innerHTML = `
        <div class="no-games-found">
          <div class="no-games-icon">🎮</div>
          <h3>No games found</h3>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      `;
      return;
    }

    games.forEach((game, index) => {
      const gameCard = this.createCatalogGameCard(game, index);
      gamesGrid.appendChild(gameCard);
    });
  },

  createCatalogGameCard(gameData, index) {
    const card = document.createElement("div");
    card.className = `game-card game-card-${index + 1}`;
    card.setAttribute("data-game-id", gameData.id);

    // Remove unique styling - all cards should be straight
    // const cardStyles = this.getUniqueCardStyles(index);
    // card.style.cssText = cardStyles;

    card.innerHTML = `
      <div class="game-card-image">
        <div class="game-cover" style="background-image: ${this.getGameCoverGradient(
          gameData
        )}">
          <div class="game-overlay">
            <div class="game-platforms">
              ${gameData.platforms
                .map(
                  (platform) =>
                    `<span class="platform-badge">${platform}</span>`
                )
                .join("")}
            </div>
            <div class="game-rating">
              <span class="rating-stars">${this.generateStars(
                gameData.rating
              )}</span>
              <span class="rating-score">${gameData.rating}</span>
            </div>
          </div>
          ${
            gameData.discount_percent > 0
              ? `<div class="discount-badge">-${gameData.discount_percent}%</div>`
              : ""
          }
        </div>
      </div>
      
      <div class="game-card-content">
        <div class="game-header">
          <h3 class="game-title">${gameData.title}</h3>
          <div class="game-developer">${gameData.developer}</div>
        </div>
        
        <div class="game-description">
          ${this.truncateText(gameData.description, 120)}
        </div>
        
        <div class="game-tags">
          ${gameData.tags
            .slice(0, 3)
            .map((tag) => `<span class="game-tag">${tag}</span>`)
            .join("")}
        </div>
        
        <div class="game-footer">
          <div class="game-price">
            ${
              gameData.discount_percent > 0
                ? `<span class="original-price">$${gameData.original_price}</span>`
                : ""
            }
            <span class="current-price">$${gameData.price}</span>
          </div>
          
          <button class="add-to-cart-btn" data-game-id="${gameData.id}">
            <span class="btn-icon">🛒</span>
            <span class="btn-text">Add to Cart</span>
          </button>
        </div>
      </div>
    `;

    // Remove unique hover effects - all cards should behave the same
    // this.addUniqueHoverEffects(card, index);

    return card;
  },

  getUniqueCardStyles(index) {
    const styles = [
      "transform: rotate(-1deg);",
      "transform: rotate(1deg);",
      "transform: scale(1.02);",
      "transform: translateY(-5px);",
      "transform: rotate(0.5deg) scale(1.01);",
      "transform: translateX(-3px);",
      "transform: rotate(-0.5deg) translateY(-3px);",
      "transform: scale(1.03);",
      "transform: rotate(1.5deg);",
      "transform: translateY(-8px) rotate(-1deg);",
      "transform: scale(1.01) translateX(2px);",
      "transform: rotate(0.8deg) scale(1.02);",
    ];

    return styles[index % styles.length];
  },

  getGameCoverGradient(gameData) {
    // Return the actual image URL from the JSON data instead of gradients
    return `url(assets/public/${gameData.media.cover_image})`;
  },

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
    );
  },

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  },

  addUniqueHoverEffects(card, index) {
    const effects = [
      () => (card.style.transform = "rotate(-2deg) scale(1.05)"),
      () => (card.style.transform = "rotate(2deg) scale(1.05)"),
      () => (card.style.transform = "scale(1.08) translateY(-10px)"),
      () => (card.style.transform = "translateY(-15px) rotate(1deg)"),
      () => (card.style.transform = "rotate(-1deg) scale(1.06)"),
      () => (card.style.transform = "translateX(-5px) scale(1.05)"),
      () => (card.style.transform = "rotate(1.5deg) translateY(-8px)"),
      () => (card.style.transform = "scale(1.07)"),
      () => (card.style.transform = "rotate(2.5deg) scale(1.04)"),
      () => (card.style.transform = "translateY(-12px) rotate(-1.5deg)"),
      () => (card.style.transform = "scale(1.06) translateX(3px)"),
      () => (card.style.transform = "rotate(1deg) scale(1.05)"),
    ];

    const resetEffects = [
      () => (card.style.transform = "rotate(-1deg)"),
      () => (card.style.transform = "rotate(1deg)"),
      () => (card.style.transform = "scale(1.02)"),
      () => (card.style.transform = "translateY(-5px)"),
      () => (card.style.transform = "rotate(0.5deg) scale(1.01)"),
      () => (card.style.transform = "translateX(-3px)"),
      () => (card.style.transform = "rotate(-0.5deg) translateY(-3px)"),
      () => (card.style.transform = "scale(1.03)"),
      () => (card.style.transform = "rotate(1.5deg)"),
      () => (card.style.transform = "translateY(-8px) rotate(-1deg)"),
      () => (card.style.transform = "scale(1.01) translateX(2px)"),
      () => (card.style.transform = "rotate(0.8deg) scale(1.02)"),
    ];

    card.addEventListener("mouseenter", effects[index % effects.length]);
    card.addEventListener(
      "mouseleave",
      resetEffects[index % resetEffects.length]
    );
  },

  attachEventListeners() {
    document.addEventListener("click", (event) => {
      if (event.target.closest(".add-to-cart-btn")) {
        const button = event.target.closest(".add-to-cart-btn");
        const gameId = button.getAttribute("data-game-id");
        this.handleAddToCart(gameId, button);
      }

      if (event.target.closest(".game-card")) {
        const card = event.target.closest(".game-card");
        const gameId = card.getAttribute("data-game-id");
        if (!event.target.closest(".add-to-cart-btn")) {
          this.handleGameCardClick(gameId);
        }
      }
    });

    // Sort functionality
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (event) => {
        const sortValue = event.target.value;
        // Map catalog.html sort values to our sort values
        const sortMap = {
          "price-low": "price-low",
          "price-high": "price-high",
          rating: "rating",
          "release-date": "newest",
          "name-asc": "name-asc",
          "name-desc": "name-desc",
          relevance: "featured",
        };
        this.sortGames(sortMap[sortValue] || "featured");
      });
    }

    // Search functionality
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        this.filters.search = event.target.value;
        this.renderFilteredGames();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        const query = searchInput ? searchInput.value : "";
        this.filters.search = query;
        this.renderFilteredGames();
      });
    }

    // Кнопка применения фильтров
    const applyBtn = document.getElementById("apply-filters");
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        this.collectFiltersFromUI();
        this.renderFilteredGames();
      });
    }
    // Кнопка очистки фильтров
    const clearBtn = document.getElementById("clear-filters");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.resetFilters();
        this.renderFilteredGames();
        this.initFilterUI();
      });
    }
    // Слайдер цены
    const priceSlider = document.getElementById("price-slider");
    const priceValue = document.getElementById("price-value");
    if (priceSlider && priceValue) {
      priceSlider.addEventListener("input", (e) => {
        priceValue.textContent = `$${e.target.value}${
          e.target.value == 100 ? "+" : ""
        }`;
      });
    }
  },

  handleAddToCart(gameId, button) {
    const game = this.gamesData.find((g) => g.id === gameId);
    if (!game) return;

    // Set processing state WITH icon
    button.innerHTML =
      '<span class="btn-icon">⏳</span><span class="btn-text">Processing...</span>';
    button.disabled = true;

    // Simulate API call and adding to cart
    setTimeout(() => {
      // Import header module to add to cart
      import("./header-module.js").then((module) => {
        const headerModule = module.default;
        headerModule.addToCart(game);

        // Update button to "Added!"
        button.innerHTML =
          '<span class="btn-icon">✅</span><span class="btn-text">Added!</span>';

        // Revert button text after a delay
        setTimeout(() => {
          button.disabled = false;
          // Important: restore original structure
          button.innerHTML =
            '<span class="btn-icon">🛒</span><span class="btn-text">Add to Cart</span>';
        }, 1500);
      });
    }, 500);
  },

  handleGameCardClick(gameId) {
    // Navigate to game detail page
    window.location.href = `game-detail.html?id=${gameId}`;
  },

  sortGames(sortBy) {
    this.currentSort = sortBy;
    this.renderFilteredGames();
  },

  collectFiltersFromUI() {
    // Платформы
    const platformCheckboxes = document.querySelectorAll(
      '.filter-section input[type="checkbox"][value="PC"], .filter-section input[type="checkbox"][value="Xbox"]'
    );
    this.filters.platforms = Array.from(platformCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    // Жанры
    const genreCheckboxes = document.querySelectorAll(
      '#genre-filters input[type="checkbox"]'
    );
    this.filters.genres = Array.from(genreCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    // Цена
    const priceSlider = document.getElementById("price-slider");
    this.filters.price = priceSlider ? parseInt(priceSlider.value) : 100;
    // Рейтинг
    const ratingCheckboxes = document.querySelectorAll(
      '.filter-section input[type="checkbox"][value="4.5"], .filter-section input[type="checkbox"][value="4.0"], .filter-section input[type="checkbox"][value="3.5"]'
    );
    this.filters.ratings = Array.from(ratingCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    // Доступность
    const availCheckboxes = document.querySelectorAll(
      '.filter-section input[type="checkbox"][value="on-sale"], .filter-section input[type="checkbox"][value="new-release"], .filter-section input[type="checkbox"][value="pre-order"]'
    );
    this.filters.availability = Array.from(availCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
  },

  resetFilters() {
    this.filters = {
      platforms: ["PC", "Xbox"],
      genres: [],
      price: 100,
      ratings: [],
      availability: [],
      search: "",
    };
  },

  initGenreFilters() {
    // Автоматически подгружать жанры из данных
    const genreFilters = document.getElementById("genre-filters");
    if (!genreFilters) return;
    const allGenres = new Set();
    this.gamesData.forEach((game) =>
      game.genres.forEach((g) => allGenres.add(g))
    );
    genreFilters.innerHTML = Array.from(allGenres)
      .sort()
      .map(
        (genre) =>
          `<label class="filter-option"><input type="checkbox" value="${genre}"><span class="checkmark"></span>${genre}</label>`
      )
      .join("");
  },

  initFilterUI() {
    // Сбросить все чекбоксы и слайдеры в UI
    // Платформы
    const platformCheckboxes = document.querySelectorAll(
      '.filter-section input[type="checkbox"][value="PC"], .filter-section input[type="checkbox"][value="Xbox"]'
    );
    platformCheckboxes.forEach((cb) => {
      cb.checked = true;
    });
    // Жанры
    const genreCheckboxes = document.querySelectorAll(
      '#genre-filters input[type="checkbox"]'
    );
    genreCheckboxes.forEach((cb) => {
      cb.checked = false;
    });
    // Цена
    const priceSlider = document.getElementById("price-slider");
    const priceValue = document.getElementById("price-value");
    if (priceSlider && priceValue) {
      priceSlider.value = 100;
      priceValue.textContent = "$100+";
    }
    // Рейтинг
    const ratingCheckboxes = document.querySelectorAll(
      '.filter-section input[type="checkbox"][value="4.5"], .filter-section input[type="checkbox"][value="4.0"], .filter-section input[type="checkbox"][value="3.5"]'
    );
    ratingCheckboxes.forEach((cb) => {
      cb.checked = false;
    });
    // Доступность
    const availCheckboxes = document.querySelectorAll(
      '.filter-section input[type="checkbox"][value="on-sale"], .filter-section input[type="checkbox"][value="new-release"], .filter-section input[type="checkbox"][value="pre-order"]'
    );
    availCheckboxes.forEach((cb) => {
      cb.checked = false;
    });
    // Поиск
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";
  },
};

// Initialize catalog page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  catalogPageModule.initialize();
});

export default catalogPageModule;
