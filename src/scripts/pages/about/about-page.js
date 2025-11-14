export default class AboutPage {
  async render() {
    return `
      <section class="about-container">
        <div class="container">
          <article class="about-content">
            <h1>About Story Map</h1>
            
            <section class="about-section">
              <h2>What is Story Map?</h2>
              <p>
                Story Map is an interactive web application that allows users to share their stories 
                with the world by pinning them on a map. Each story includes a photo, description, 
                and location, making it easy to explore stories from different places.
              </p>
            </section>

            <section class="about-section">
              <h2>Features</h2>
              <ul class="feature-list">
                <li>📍 <strong>Interactive Map:</strong> View all stories on an interactive map with multiple tile layers</li>
                <li>📸 <strong>Photo Sharing:</strong> Upload photos directly or capture them using your camera</li>
                <li>🗺️ <strong>Location Tagging:</strong> Tag your stories with precise locations</li>
                <li>🔐 <strong>Secure Authentication:</strong> Register and login to manage your stories</li>
                <li>📱 <strong>Responsive Design:</strong> Works seamlessly on mobile, tablet, and desktop</li>
                <li>♿ <strong>Accessible:</strong> Built with accessibility standards in mind</li>
              </ul>
            </section>

            <section class="about-section">
              <h2>Technology Stack</h2>
              <ul class="tech-list">
                <li>HTML5, CSS3, JavaScript (ES6+)</li>
                <li>Vite - Build tool</li>
                <li>Leaflet.js - Interactive maps</li>
                <li>Story API by Dicoding</li>
                <li>Web APIs: MediaDevices, Geolocation, View Transitions</li>
              </ul>
            </section>

            <section class="about-section">
              <h2>Developer</h2>
              <p>
                This project is developed as part of the Dicoding submission for 
                "Menjadi Front-End Web Developer Expert" course.
              </p>
            </section>

            <div class="about-actions">
              <a href="#/" class="btn-primary">Start Exploring Stories</a>
              <a href="#/add-story" class="btn-secondary">Share Your Story</a>
            </div>
          </article>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Add any interactive features if needed
  }
}
