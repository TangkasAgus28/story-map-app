import IDBHelper from "../../utils/idb-helper";
import AuthHelper from "../../utils/auth";

export default class FavoritesPage {
  constructor() {
    this.favorites = [];
    this.filteredFavorites = [];
    this.sortBy = "createdAt";
    this.sortOrder = "desc";
  }

  async render() {
    return `
      <section class="favorites-container">
        <div class="container">
          <h1>My Favorite Stories</h1>
          
          <!-- Search and Sort Controls (Skilled: +3pts) -->
          <div class="favorites-controls">
            <div class="search-box">
              <label for="search-input" class="sr-only">Search favorites</label>
              <input 
                type="text" 
                id="search-input" 
                placeholder="🔍 Search by name or description..."
                aria-label="Search favorites"
              />
            </div>
            
            <div class="sort-controls">
              <label for="sort-select">Sort by:</label>
              <select id="sort-select" aria-label="Sort favorites">
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>

            <button id="clear-all-btn" class="btn-danger" aria-label="Clear all favorites">
              🗑️ Clear All
            </button>
          </div>

          <!-- Favorites List -->
          <div id="favorites-loading" class="loading">Loading favorites...</div>
          <div id="favorites-list" class="favorites-list"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Check authentication
    if (!AuthHelper.isAuthenticated()) {
      window.location.hash = "#/login";
      return;
    }

    // Load favorites
    await this.loadFavorites();

    // Setup event listeners
    this.setupSearch();
    this.setupSort();
    this.setupClearAll();
  }

  async loadFavorites() {
    const loadingDiv = document.querySelector("#favorites-loading");
    const listDiv = document.querySelector("#favorites-list");

    try {
      this.favorites = await IDBHelper.getAllFavorites();
      this.filteredFavorites = [...this.favorites];

      loadingDiv.style.display = "none";

      if (this.favorites.length === 0) {
        listDiv.innerHTML = `
          <div class="empty-state">
            <p>📭 No favorite stories yet</p>
            <p>Go to <a href="#/">home page</a> and add some stories to your favorites!</p>
          </div>
        `;
        return;
      }

      this.renderFavoritesList();
    } catch (error) {
      loadingDiv.textContent = "Failed to load favorites: " + error.message;
    }
  }

  renderFavoritesList() {
    const listDiv = document.querySelector("#favorites-list");

    listDiv.innerHTML = this.filteredFavorites
      .map(
        (story) => `
      <article class="favorite-card" data-id="${story.id}">
        <img 
          src="${story.photoUrl}" 
          alt="${story.description || "Story photo"}" 
          class="favorite-image"
          loading="lazy"
        />
        <div class="favorite-content">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <small>📍 ${
            story.lat
              ? `${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}`
              : "No location"
          }</small>
          <small class="favorite-date">⏰ Added: ${new Date(
            story.createdAt
          ).toLocaleDateString()}</small>
        </div>
        <button 
          class="btn-remove" 
          data-id="${story.id}"
          aria-label="Remove ${story.name} from favorites"
        >
          ❌ Remove
        </button>
      </article>
    `
      )
      .join("");

    // Add remove event listeners
    document.querySelectorAll(".btn-remove").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        await this.removeFavorite(id);
      });
    });

    // Add click event to view on map
    document.querySelectorAll(".favorite-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("btn-remove")) {
          window.location.hash = "#/";
        }
      });
    });
  }

  setupSearch() {
    const searchInput = document.querySelector("#search-input");

    searchInput.addEventListener("input", async (e) => {
      const query = e.target.value.trim();

      if (query === "") {
        this.filteredFavorites = [...this.favorites];
      } else {
        this.filteredFavorites = await IDBHelper.searchFavorites(query);
      }

      this.renderFavoritesList();
    });
  }

  setupSort() {
    const sortSelect = document.querySelector("#sort-select");

    sortSelect.addEventListener("change", async (e) => {
      const [sortBy, order] = e.target.value.split("-");
      this.sortBy = sortBy;
      this.sortOrder = order;

      this.filteredFavorites = await IDBHelper.sortFavorites(sortBy, order);
      this.renderFavoritesList();
    });
  }

  setupClearAll() {
    const clearBtn = document.querySelector("#clear-all-btn");

    clearBtn.addEventListener("click", async () => {
      const confirmed = confirm(
        "Are you sure you want to remove all favorites? This action cannot be undone."
      );

      if (confirmed) {
        try {
          await IDBHelper.clearAllFavorites();
          this.favorites = [];
          this.filteredFavorites = [];
          await this.loadFavorites();
        } catch (error) {
          alert("Failed to clear favorites: " + error.message);
        }
      }
    });
  }

  async removeFavorite(id) {
    try {
      await IDBHelper.deleteFavorite(id);

      // Update local arrays
      this.favorites = this.favorites.filter((s) => s.id !== id);
      this.filteredFavorites = this.filteredFavorites.filter(
        (s) => s.id !== id
      );

      // Re-render
      if (this.favorites.length === 0) {
        await this.loadFavorites();
      } else {
        this.renderFavoritesList();
      }
    } catch (error) {
      alert("Failed to remove favorite: " + error.message);
    }
  }
}
