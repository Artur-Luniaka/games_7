// Catalog Page Module
class CatalogPageManager {
  constructor() {
    this.gamesData = [];
    this.filteredGames = [];
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.currentView = "grid";
    this.filters = {
      search: "",
      platforms: ["PC", "Xbox"],
      genres: [],
      maxPrice: 100,
      minRating: 0,
      availability: [],
    };

    this.init();
  }

  async init() {
    await this.loadGamesData();
    this.setupEventListeners();
    this.loadGenreFilters();
    this.applyFilters();
  }

  async loadGamesData() {
    try {
      const response = await fetch("assets/data/games-catalog.json");
      this.gamesData = await response.json();
      this.filteredGames = [...this.gamesData];
    } catch (error) {
      console.error("Error loading games data:", error);
      this.showNotification("Error loading games data", "error");
    }
  }

  loadGenreFilters() {
    const genreFiltersContainer = document.getElementById("genre-filters");
    if (!genreFiltersContainer) return;

    const genres = [...new Set(this.gamesData.map((game) => game.genre))];

    genreFiltersContainer.innerHTML = genres
      .map(
        (genre) => `
      <label class="filter-option">
        <input type="checkbox" value="${genre}" />
        <span class="checkmark"></span>
        ${genre}
      </label>
    `
      )
      .join("");
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filters.search = e.target.value;
        this.debounceSearch();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        this.applyFilters();
      });
    }

    // Platform filters
    const platformCheckboxes = document.querySelectorAll(
      'input[value="PC"], input[value="Xbox"]'
    );
    platformCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.updatePlatformFilters();
      });
    });

    // Genre filters
    document.addEventListener("change", (e) => {
      if (e.target.closest("#genre-filters")) {
        this.updateGenreFilters();
      }
    });

    // Price range
    const priceSlider = document.getElementById("price-slider");
    const priceValue = document.getElementById("price-value");

    if (priceSlider) {
      priceSlider.addEventListener("input", (e) => {
        const value = e.target.value;
        this.filters.maxPrice = parseInt(value);
        priceValue.textContent = value === "100" ? "$100+" : `$${value}`;
      });
    }

    // Rating filters
    const ratingCheckboxes = document.querySelectorAll(
      'input[value="4.5"], input[value="4.0"], input[value="3.5"]'
    );
    ratingCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.updateRatingFilters();
      });
    });

    // Availability filters
    const availabilityCheckboxes = document.querySelectorAll(
      'input[value="on-sale"], input[value="new-release"], input[value="pre-order"]'
    );
    availabilityCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.updateAvailabilityFilters();
      });
    });

    // Filter buttons
    const clearFiltersBtn = document.getElementById("clear-filters");
    const applyFiltersBtn = document.getElementById("apply-filters");

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => {
        this.clearAllFilters();
      });
    }

    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener("click", () => {
        this.applyFilters();
      });
    }

    // Sort functionality
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortGames(e.target.value);
      });
    }

    // View switching
    const viewBtns = document.querySelectorAll(".view-btn");
    viewBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.switchView(e.target.dataset.view);
      });
    });

    // Pagination
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        this.goToPage(this.currentPage - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.goToPage(this.currentPage + 1);
      });
    }
  }

  updatePlatformFilters() {
    const platformCheckboxes = document.querySelectorAll(
      'input[value="PC"], input[value="Xbox"]'
    );
    this.filters.platforms = Array.from(platformCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
  }

  updateGenreFilters() {
    const genreCheckboxes = document.querySelectorAll(
      '#genre-filters input[type="checkbox"]'
    );
    this.filters.genres = Array.from(genreCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
  }

  updateRatingFilters() {
    const ratingCheckboxes = document.querySelectorAll(
      'input[value="4.5"], input[value="4.0"], input[value="3.5"]'
    );
    const checkedRatings = Array.from(ratingCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => parseFloat(checkbox.value));

    this.filters.minRating =
      checkedRatings.length > 0 ? Math.max(...checkedRatings) : 0;
  }

  updateAvailabilityFilters() {
    const availabilityCheckboxes = document.querySelectorAll(
      'input[value="on-sale"], input[value="new-release"], input[value="pre-order"]'
    );
    this.filters.availability = Array.from(availabilityCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
  }

  clearAllFilters() {
    // Reset search
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.value = "";
      this.filters.search = "";
    }

    // Reset platforms
    const platformCheckboxes = document.querySelectorAll(
      'input[value="PC"], input[value="Xbox"]'
    );
    platformCheckboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
    this.filters.platforms = ["PC", "Xbox"];

    // Reset genres
    const genreCheckboxes = document.querySelectorAll(
      '#genre-filters input[type="checkbox"]'
    );
    genreCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    this.filters.genres = [];

    // Reset price
    const priceSlider = document.getElementById("price-slider");
    const priceValue = document.getElementById("price-value");
    if (priceSlider) {
      priceSlider.value = 100;
      this.filters.maxPrice = 100;
      priceValue.textContent = "$100+";
    }

    // Reset rating
    const ratingCheckboxes = document.querySelectorAll(
      'input[value="4.5"], input[value="4.0"], input[value="3.5"]'
    );
    ratingCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    this.filters.minRating = 0;

    // Reset availability
    const availabilityCheckboxes = document.querySelectorAll(
      'input[value="on-sale"], input[value="new-release"], input[value="pre-order"]'
    );
    availabilityCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    this.filters.availability = [];

    this.applyFilters();
  }

  applyFilters() {
    this.filteredGames = this.gamesData.filter((game) => {
      // Search filter
      if (
        this.filters.search &&
        !game.title.toLowerCase().includes(this.filters.search.toLowerCase())
      ) {
        return false;
      }

      // Platform filter
      if (
        this.filters.platforms.length > 0 &&
        !this.filters.platforms.includes(game.platform)
      ) {
        return false;
      }

      // Genre filter
      if (
        this.filters.genres.length > 0 &&
        !this.filters.genres.includes(game.genre)
      ) {
        return false;
      }

      // Price filter
      if (game.price > this.filters.maxPrice) {
        return false;
      }

      // Rating filter
      if (this.filters.minRating > 0 && game.rating < this.filters.minRating) {
        return false;
      }

      // Availability filters
      if (this.filters.availability.length > 0) {
        const hasMatchingAvailability = this.filters.availability.some(
          (filter) => {
            switch (filter) {
              case "on-sale":
                return game.originalPrice && game.originalPrice > game.price;
              case "new-release":
                return game.isNewRelease;
              case "pre-order":
                return game.isPreOrder;
              default:
                return false;
            }
          }
        );
        if (!hasMatchingAvailability) return false;
      }

      return true;
    });

    this.currentPage = 1;
    this.updateResultsCount();
    this.renderGames();
    this.updatePagination();
  }

  sortGames(sortType) {
    switch (sortType) {
      case "name-asc":
        this.filteredGames.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        this.filteredGames.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price-low":
        this.filteredGames.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        this.filteredGames.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        this.filteredGames.sort((a, b) => b.rating - a.rating);
        break;
      case "release-date":
        this.filteredGames.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        break;
      default:
        // Relevance - keep original order
        break;
    }

    this.currentPage = 1;
    this.renderGames();
    this.updatePagination();
  }

  switchView(viewType) {
    this.currentView = viewType;

    // Update view buttons
    const viewBtns = document.querySelectorAll(".view-btn");
    viewBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewType);
    });

    // Update grid class
    const catalogGrid = document.getElementById("catalog-grid");
    if (catalogGrid) {
      catalogGrid.classList.toggle("list-view", viewType === "list");
    }

    this.renderGames();
  }

  renderGames() {
    const catalogGrid = document.getElementById("catalog-grid");
    if (!catalogGrid) return;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const gamesToShow = this.filteredGames.slice(startIndex, endIndex);

    if (gamesToShow.length === 0) {
      catalogGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎮</div>
          <h3>No games found</h3>
          <p>Try adjusting your filters or search terms to find more games.</p>
        </div>
      `;
      return;
    }

    catalogGrid.innerHTML = gamesToShow
      .map((game) => this.createGameCard(game))
      .join("");

    // Add click event listeners to game cards
    const gameCards = catalogGrid.querySelectorAll(".game-card");
    gameCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".add-to-cart-btn")) {
          const gameId = card.dataset.gameId;
          window.location.href = `game-detail.html?id=${gameId}`;
        }
      });
    });

    // Add event listeners to add to cart buttons
    const addToCartBtns = catalogGrid.querySelectorAll(".add-to-cart-btn");
    addToCartBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const gameId = btn.dataset.gameId;
        this.addToCart(gameId);
      });
    });
  }

  createGameCard(game) {
    const isOnSale = game.originalPrice && game.originalPrice > game.price;
    const discount = isOnSale
      ? Math.round(
          ((game.originalPrice - game.price) / game.originalPrice) * 100
        )
      : 0;

    return `
      <div class="game-card ${
        this.currentView === "list" ? "list-view" : ""
      }" data-game-id="${game.id}">
        <img src="${game.image}" alt="${
      game.title
    }" class="game-image" loading="lazy">
        <div class="game-info">
          <h3 class="game-title">${game.title}</h3>
          <p class="game-genre">${game.genre} • ${game.platform}</p>
          <div class="game-rating">
            <span class="rating-stars">${"⭐".repeat(
              Math.floor(game.rating)
            )}</span>
            <span class="rating-text">${game.rating}/5 (${
      game.reviewCount
    } reviews)</span>
          </div>
          <div class="game-price">
            <div>
              <span class="price-current">$${game.price}</span>
              ${
                isOnSale
                  ? `<span class="price-original">$${game.originalPrice}</span>`
                  : ""
              }
            </div>
            ${
              isOnSale
                ? `<span class="discount-badge">-${discount}%</span>`
                : ""
            }
          </div>
          <button class="add-to-cart-btn" data-game-id="${game.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  }

  updateResultsCount() {
    const resultsCount = document.getElementById("results-count");
    if (resultsCount) {
      resultsCount.textContent = this.filteredGames.length;
    }
  }

  updatePagination() {
    const totalPages = Math.ceil(this.filteredGames.length / this.itemsPerPage);
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");
    const pageNumbers = document.getElementById("page-numbers");

    if (prevBtn) {
      prevBtn.disabled = this.currentPage <= 1;
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentPage >= totalPages;
    }

    if (pageNumbers) {
      pageNumbers.innerHTML = this.generatePageNumbers(totalPages);
    }
  }

  generatePageNumbers(totalPages) {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (this.currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages
      .map((page) => {
        if (page === "...") {
          return '<span class="page-ellipsis">...</span>';
        }
        return `
        <button class="page-number ${
          page === this.currentPage ? "active" : ""
        }" 
                data-page="${page}">
          ${page}
        </button>
      `;
      })
      .join("");
  }

  goToPage(page) {
    const totalPages = Math.ceil(this.filteredGames.length / this.itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.renderGames();
      this.updatePagination();

      // Scroll to top of catalog
      const catalogMain = document.querySelector(".catalog-main");
      if (catalogMain) {
        catalogMain.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  addToCart(gameId) {
    const game = this.gamesData.find((g) => g.id === gameId);
    if (!game) return;

    // Import cart management functionality
    import("./cart-management.js")
      .then((module) => {
        const cartManager = module.default;
        cartManager.addToCart(game);
        this.showNotification(`${game.title} added to cart!`, "success");
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        this.showNotification("Error adding to cart", "error");
      });
  }

  showNotification(message, type = "info") {
    // Import notification system
    import("./notification-system.js")
      .then((module) => {
        const notificationSystem = module.default;
        notificationSystem.showNotification(message, type);
      })
      .catch((error) => {
        console.error("Error showing notification:", error);
      });
  }

  debounceSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 300);
  }
}

// Initialize catalog page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CatalogPageManager();
});

export default CatalogPageManager;
