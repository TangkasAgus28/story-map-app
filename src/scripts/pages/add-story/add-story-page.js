import StoryAPI from "../../data/api";
import AuthHelper from "../../utils/auth";

export default class AddStoryPage {
  constructor() {
    this.selectedLocation = null;
    this.map = null;
    this.marker = null;
    this.mediaStream = null;
    this.cameraMode = false;
  }

  async render() {
    return `
      <section class="add-story-container">
        <div class="container">
          <h1>Add New Story</h1>
          
          <form id="add-story-form" class="story-form" novalidate>
            <div class="form-group">
              <label for="story-description">Story Description *</label>
              <textarea 
                id="story-description" 
                name="description" 
                required 
                rows="4"
                aria-label="Story description"
                aria-describedby="description-help"
                aria-required="true"
                placeholder="Tell your story..."
              ></textarea>
              <small id="description-help" class="help-text">Describe your story (minimum 10 characters)</small>
              <span class="error-text" id="description-error" role="alert"></span>
            </div>

            <div class="form-group">
              <label for="story-photo">Photo *</label>
              <div class="photo-options">
                <button 
                  type="button" 
                  id="toggle-camera-btn" 
                  class="btn-secondary"
                  aria-label="Toggle camera to capture photo"
                >
                  📷 Use Camera
                </button>
                <label for="story-photo" class="file-input-label">
                  📁 Choose File
                </label>
                <input 
                  type="file" 
                  id="story-photo" 
                  name="photo" 
                  accept="image/*"
                  aria-label="Upload photo file"
                  aria-describedby="photo-help"
                  aria-required="true"
                  style="display: none;"
                />
                <span id="file-name" class="file-name">No file chosen</span>
              </div>
              <small id="photo-help" class="help-text">Upload an image or use camera (max 1MB)</small>
              <span class="error-text" id="photo-error" role="alert"></span>
            </div>

            <!-- Camera Stream -->
            <div id="camera-container" class="camera-container" style="display: none;">
              <video 
                id="camera-stream" 
                autoplay 
                playsinline
                aria-label="Camera live stream"
              ></video>
              <canvas id="camera-canvas" style="display: none;"></canvas>
              <div class="camera-controls">
                <button 
                  type="button" 
                  id="capture-btn" 
                  class="btn-primary"
                  aria-label="Capture photo from camera"
                >
                  📸 Capture Photo
                </button>
                <button 
                  type="button" 
                  id="close-camera-btn" 
                  class="btn-secondary"
                  aria-label="Close camera"
                >
                  ✕ Close Camera
                </button>
              </div>
            </div>

            <!-- Preview -->
            <div id="preview-container" class="preview-container" style="display: none;" role="region" aria-label="Photo preview">
              <img id="preview-image" src="" alt="Photo preview" />
            </div>

            <div class="form-group">
              <label for="add-map">Location * (Click on map to select)</label>
              <div 
                id="add-map" 
                class="map-container"
                role="application"
                aria-label="Interactive map for selecting location"
                tabindex="0"
              ></div>
              <small class="help-text">Click anywhere on the map to set your story location</small>
              <div id="location-display" role="status" aria-live="polite"></div>
              <span class="error-text" id="location-error" role="alert"></span>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn-primary" 
                id="submit-btn"
                aria-label="Submit your story"
              >
                📤 Submit Story
              </button>
              <a href="#/" class="btn-secondary" role="button">Cancel</a>
            </div>
          </form>

          <div id="form-message" class="form-message" role="alert" aria-live="polite"></div>
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

    // Initialize map
    this.initMap();

    // Setup camera
    this.setupCamera();

    // Setup form
    this.setupForm();

    // Setup file input display
    this.setupFileInput();
  }

  setupFileInput() {
    const fileInput = document.querySelector("#story-photo");
    const fileNameDisplay = document.querySelector("#file-name");

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        fileNameDisplay.textContent = e.target.files[0].name;
        this.previewFile(e.target.files[0]);
        document.querySelector("#photo-error").textContent = "";
      } else {
        fileNameDisplay.textContent = "No file chosen";
      }
    });
  }

  initMap() {
    // Initialize map
    this.map = L.map("add-map").setView([-2.5489, 118.0149], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Click event to select location
    this.map.on("click", (e) => {
      this.setLocation(e.latlng);
    });
  }

  setLocation(latlng) {
    this.selectedLocation = latlng;

    // Remove existing marker
    if (this.marker) {
      this.marker.remove();
    }

    // Add new marker
    this.marker = L.marker([latlng.lat, latlng.lng])
      .addTo(this.map)
      .bindPopup("Selected Location")
      .openPopup();

    // Display location
    document.querySelector("#location-display").innerHTML = `
      <p class="selected-location">
        📍 Selected location: Latitude ${latlng.lat.toFixed(
          6
        )}, Longitude ${latlng.lng.toFixed(6)}
      </p>
    `;

    document.querySelector("#location-error").textContent = "";
  }

  setupCamera() {
    const toggleCameraBtn = document.querySelector("#toggle-camera-btn");
    const cameraContainer = document.querySelector("#camera-container");
    const closeCameraBtn = document.querySelector("#close-camera-btn");
    const captureBtn = document.querySelector("#capture-btn");

    toggleCameraBtn.addEventListener("click", async () => {
      if (!this.cameraMode) {
        await this.startCamera();
      }
    });

    closeCameraBtn.addEventListener("click", () => {
      this.stopCamera();
    });

    captureBtn.addEventListener("click", () => {
      this.capturePhoto();
    });
  }

  async startCamera() {
    try {
      // Request camera access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      const video = document.querySelector("#camera-stream");
      video.srcObject = this.mediaStream;

      document.querySelector("#camera-container").style.display = "block";
      document.querySelector("#toggle-camera-btn").textContent =
        "🎥 Camera Active";
      this.cameraMode = true;
    } catch (error) {
      alert("Failed to access camera: " + error.message);
    }
  }

  stopCamera() {
    if (this.mediaStream) {
      // Stop all tracks
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    document.querySelector("#camera-container").style.display = "none";
    document.querySelector("#toggle-camera-btn").textContent = "📷 Use Camera";
    this.cameraMode = false;
  }

  capturePhoto() {
    const video = document.querySelector("#camera-stream");
    const canvas = document.querySelector("#camera-canvas");
    const context = canvas.getContext("2d");

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });

      // Create FileList-like object
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      document.querySelector("#story-photo").files = dataTransfer.files;

      // Update file name display
      document.querySelector("#file-name").textContent = file.name;

      // Preview
      this.previewFile(file);

      // Stop camera
      this.stopCamera();
    }, "image/jpeg");
  }

  previewFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.querySelector("#preview-image");
      preview.src = e.target.result;
      document.querySelector("#preview-container").style.display = "block";
    };
    reader.readAsDataURL(file);
  }

  setupForm() {
    const form = document.querySelector("#add-story-form");
    const messageDiv = document.querySelector("#form-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validation
      if (!this.validateForm()) {
        messageDiv.className = "form-message error";
        messageDiv.textContent = "❌ Please fill all required fields correctly";
        return;
      }

      const submitBtn = document.querySelector("#submit-btn");
      submitBtn.disabled = true;
      submitBtn.textContent = "⏳ Uploading...";

      try {
        const formData = new FormData();
        formData.append(
          "description",
          document.querySelector("#story-description").value
        );
        formData.append(
          "photo",
          document.querySelector("#story-photo").files[0]
        );

        if (this.selectedLocation) {
          formData.append("lat", this.selectedLocation.lat);
          formData.append("lon", this.selectedLocation.lng);
        }

        const token = AuthHelper.getToken();
        await StoryAPI.addStory(token, formData);

        messageDiv.className = "form-message success";
        messageDiv.textContent = "✅ Story added successfully! Redirecting...";

        setTimeout(() => {
          window.location.hash = "#/";
        }, 1500);
      } catch (error) {
        messageDiv.className = "form-message error";
        messageDiv.textContent = "❌ Failed to add story: " + error.message;

        submitBtn.disabled = false;
        submitBtn.textContent = "📤 Submit Story";
      }
    });
  }

  validateForm() {
    let isValid = true;

    // Validate description
    const description = document
      .querySelector("#story-description")
      .value.trim();
    const descError = document.querySelector("#description-error");
    if (description.length < 10) {
      descError.textContent = "⚠️ Description must be at least 10 characters";
      isValid = false;
    } else {
      descError.textContent = "";
    }

    // Validate photo
    const photo = document.querySelector("#story-photo").files[0];
    const photoError = document.querySelector("#photo-error");
    if (!photo) {
      photoError.textContent = "⚠️ Please select a photo";
      isValid = false;
    } else if (photo.size > 1048576) {
      // 1MB
      photoError.textContent = "⚠️ Photo size must be less than 1MB";
      isValid = false;
    } else {
      photoError.textContent = "";
    }

    // Validate location
    const locationError = document.querySelector("#location-error");
    if (!this.selectedLocation) {
      locationError.textContent = "⚠️ Please select a location on the map";
      isValid = false;
    } else {
      locationError.textContent = "";
    }

    return isValid;
  }
}
