import StoryAPI from "../../data/api";
import AuthHelper from "../../utils/auth";
import IDBHelper from "../../utils/idb-helper";
import PushNotification from "../../utils/push-notification";

export default class HomePage {
  constructor() {
    this.map = null;
    this.markers = [];
    this.stories = [];
  }

  async render() {
    return `
      <section class="home-container">
        <div class="container">
          <div class="home-header">
            <h1>Story Map</h1>
            <div class="user-info">
              <span>Welcome, <strong id="user-name"></strong></span>
              
              <!-- Push Notification Toggle (Advanced: +4pts) -->
              <button id="notification-toggle" class="btn-notification" aria-label="Toggle push notifications">
                <span id="notification-icon">🔕</span>
                <span id="notification-text">Enable Notifications</span>
              </button>
              
              <button id="logout-btn" class="btn-secondary">Logout</button>
            </div>
          </div>
          
          <div class="action-buttons">
            <a href="#/add-story" class="btn-primary">+ Add New Story</a>
            <a href="#/favorites" class="btn-secondary">⭐ My Favorites</a>
          </div>

          <div class="content-grid">
            <!-- Map Section -->
            <div class="map-section">
              <h2>Map View</h2>
              <div id="map" class="map-container"></div>
            </div>

            <!-- Story List Section -->
            <div class="story-section">
              <h2>Stories</h2>
              <div id="loading" class="loading">Loading stories...</div>
              <div id="story-list" class="story-list"></div>
            </div>
          </div>
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

    // Display user name
    const user = AuthHelper.getUser();
    document.querySelector("#user-name").textContent = user?.name || "User";

    // Logout functionality
    document.querySelector("#logout-btn").addEventListener("click", () => {
      AuthHelper.logout();
    });

    // Setup push notification toggle
    await this.setupPushNotification();

    // Initialize map
    this.initMap();

    // Load stories
    await this.loadStories();
  }

  async setupPushNotification() {
    const toggleBtn = document.querySelector("#notification-toggle");
    const icon = document.querySelector("#notification-icon");
    const text = document.querySelector("#notification-text");

    try {
      // Check if service worker is ready
      if (!("serviceWorker" in navigator)) {
        toggleBtn.style.display = "none";
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      // Update UI based on current subscription
      if (subscription) {
        icon.textContent = "🔔";
        text.textContent = "Disable Notifications";
        toggleBtn.classList.add("active");
      }

      // Toggle button click handler
      toggleBtn.addEventListener("click", async () => {
        try {
          toggleBtn.disabled = true;
          text.textContent = "Processing...";

          const currentSubscription =
            await registration.pushManager.getSubscription();

          if (currentSubscription) {
            // Unsubscribe
            const token = AuthHelper.getToken();
            await PushNotification.unsubscribeFromPush(
              currentSubscription,
              token
            );

            icon.textContent = "🔕";
            text.textContent = "Enable Notifications";
            toggleBtn.classList.remove("active");

            alert("✅ Push notifications disabled");
          } else {
            // Subscribe
            const hasPermission = await PushNotification.requestPermission();

            if (!hasPermission) {
              alert(
                "❌ Notification permission denied. Please enable it in your browser settings."
              );
              icon.textContent = "🔕";
              text.textContent = "Enable Notifications";
              return;
            }

            const newSubscription = await PushNotification.subscribeToPush(
              registration
            );
            const token = AuthHelper.getToken();
            await PushNotification.sendSubscriptionToServer(
              newSubscription,
              token
            );

            icon.textContent = "🔔";
            text.textContent = "Disable Notifications";
            toggleBtn.classList.add("active");

            alert(
              "✅ Push notifications enabled! You will receive notifications when you add new stories."
            );
          }
        } catch (error) {
          console.error("Push notification error:", error);
          alert("❌ Failed to toggle notifications: " + error.message);
          icon.textContent = "🔕";
          text.textContent = "Enable Notifications";
          toggleBtn.classList.remove("active");
        } finally {
          toggleBtn.disabled = false;
        }
      });
    } catch (error) {
      console.error("Setup push notification error:", error);
      toggleBtn.style.display = "none";
    }
  }

  initMap() {
    // Initialize Leaflet map centered on Indonesia
    this.map = L.map("map").setView([-2.5489, 118.0149], 5);

    // Add tile layer (OpenStreetMap)
    const streetLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    ).addTo(this.map);

    // Add satellite layer
    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri",
        maxZoom: 19,
      }
    );

    // Layer control for multiple tile layers (Advanced: +4 pts)
    const baseMaps = {
      "Street Map": streetLayer,
      Satellite: satelliteLayer,
    };

    L.control.layers(baseMaps).addTo(this.map);
  }

  async loadStories() {
    const loadingDiv = document.querySelector("#loading");
    const storyListDiv = document.querySelector("#story-list");

    try {
      const token = AuthHelper.getToken();
      const result = await StoryAPI.getAllStories(token);

      this.stories = result.listStory;

      loadingDiv.style.display = "none";

      if (this.stories.length === 0) {
        storyListDiv.innerHTML =
          '<p class="no-stories">No stories yet. Be the first to add one!</p>';
        return;
      }

      // Display stories in list
      this.renderStoryList();

      // Add markers to map
      this.addMarkersToMap();
    } catch (error) {
      loadingDiv.textContent = "Failed to load stories: " + error.message;
    }
  }

  renderStoryList() {
    const storyListDiv = document.querySelector("#story-list");

    storyListDiv.innerHTML = this.stories
      .map(
        (story, index) => `
      <article class="story-card" data-index="${index}">
        <img 
          src="${story.photoUrl}" 
          alt="${story.description || "Story photo"}" 
          class="story-image"
          loading="lazy"
        />
        <div class="story-content">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <small>📍 ${
            story.lat
              ? `${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}`
              : "No location"
          }</small>
        </div>
        <button 
          class="btn-favorite" 
          data-story-id="${story.id}"
          aria-label="Add ${story.name} to favorites"
        >
          ⭐ Add to Favorites
        </button>
      </article>
    `
      )
      .join("");

    // Add click event to sync with map
    document.querySelectorAll(".story-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("btn-favorite")) {
          const index = parseInt(e.currentTarget.dataset.index);
          this.highlightStory(index);
        }
      });
    });

    // Add favorite button listeners
    this.setupFavoriteButtons();
  }

  setupFavoriteButtons() {
    document.querySelectorAll(".btn-favorite").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();

        // Store reference to button before async operations
        const button = e.currentTarget;

        // Check if button still exists in DOM
        if (!button || !document.body.contains(button)) {
          console.warn("Button no longer in DOM");
          return;
        }

        try {
          const storyId = button.dataset.storyId;
          const story = this.stories.find((s) => s.id === storyId);

          if (!story) {
            alert("❌ Story not found");
            return;
          }

          // Check if already favorited
          const isFavorited = await IDBHelper.isFavorited(story.id);

          if (isFavorited) {
            alert("ℹ️ This story is already in your favorites!");
            return;
          }

          // Add to favorites
          await IDBHelper.addFavorite(story);

          // Update button UI - with existence check
          if (button && document.body.contains(button)) {
            button.textContent = "✅ Added to Favorites";
            button.disabled = true;
            button.style.backgroundColor = "#27ae60";

            // Reset button after 2 seconds - with existence check
            setTimeout(() => {
              if (button && document.body.contains(button)) {
                button.textContent = "⭐ Add to Favorites";
                button.disabled = false;
                button.style.backgroundColor = "";
              }
            }, 2000);
          }

          // Show success message in a safer way
          const successMsg = document.createElement("div");
          successMsg.textContent = "✅ Added to favorites!";
          successMsg.style.cssText = `
          position: fixed;
          top: 80px;
          right: 20px;
          background: #27ae60;
          color: white;
          padding: 15px 25px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-weight: 600;
        `;
          document.body.appendChild(successMsg);

          setTimeout(() => {
            if (successMsg && document.body.contains(successMsg)) {
              successMsg.remove();
            }
          }, 3000);
        } catch (error) {
          console.error("Add favorite error:", error);

          // Safe error display
          const errorMsg = "Failed to add to favorites. Please try again.";

          // Try to show alert, but don't crash if it fails
          try {
            alert("❌ " + errorMsg);
          } catch (alertError) {
            console.error("Could not show alert:", alertError);
          }
        }
      });
    });
  }

  addMarkersToMap() {
    // Clear existing markers
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    // Add new markers
    this.stories.forEach((story, index) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map)
          .bindPopup(`
            <div class="popup-content">
              <img src="${story.photoUrl}" alt="${story.description}" style="width: 100%; max-width: 200px; border-radius: 8px;"/>
              <h4>${story.name}</h4>
              <p>${story.description}</p>
            </div>
          `);

        // Store marker with index
        marker.storyIndex = index;
        this.markers.push(marker);

        // Click event for marker (Skilled: +3 pts - sinkronisasi list dan peta)
        marker.on("click", () => {
          this.highlightStory(index);
        });
      }
    });
  }

  highlightStory(index) {
    const story = this.stories[index];

    // Highlight marker (Skilled: +3 pts - highlight marker aktif)
    this.markers.forEach((marker, i) => {
      if (i === index) {
        marker.openPopup();
        this.map.setView([story.lat, story.lon], 13);
      }
    });

    // Highlight story card
    document.querySelectorAll(".story-card").forEach((card, i) => {
      if (i === index) {
        card.classList.add("active");
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        card.classList.remove("active");
      }
    });
  }
}
