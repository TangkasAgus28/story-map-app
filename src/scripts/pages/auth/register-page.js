import StoryAPI from "../../data/api";

export default class RegisterPage {
  async render() {
    return `
      <section class="auth-container">
        <div class="auth-card">
          <h1>Register</h1>
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="register-name">Full Name</label>
              <input 
                type="text" 
                id="register-name" 
                name="name" 
                required 
                aria-label="Full name"
                aria-describedby="name-help"
                placeholder="Your full name"
              />
              <small id="name-help" class="help-text">Enter your full name</small>
            </div>
            
            <div class="form-group">
              <label for="register-email">Email</label>
              <input 
                type="email" 
                id="register-email" 
                name="email" 
                required 
                aria-label="Email address"
                aria-describedby="email-help"
                placeholder="your@email.com"
              />
              <small id="email-help" class="help-text">Must be a valid and unique email</small>
            </div>
            
            <div class="form-group">
              <label for="register-password">Password</label>
              <input 
                type="password" 
                id="register-password" 
                name="password" 
                required 
                minlength="8"
                aria-label="Password"
                aria-describedby="password-help"
                placeholder="Min. 8 characters"
              />
              <small id="password-help" class="help-text">Minimum 8 characters required</small>
            </div>
            
            <button type="submit" class="btn-primary" aria-label="Create new account">
              Register
            </button>
            <p class="auth-link">
              Already have an account? <a href="#/login">Login here</a>
            </p>
          </form>
          <div id="error-message" class="error-message" role="alert" aria-live="polite"></div>
          <div id="success-message" class="success-message" role="status" aria-live="polite"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector("#register-form");
    const errorDiv = document.querySelector("#error-message");
    const successDiv = document.querySelector("#success-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.querySelector("#register-name").value;
      const email = document.querySelector("#register-email").value;
      const password = document.querySelector("#register-password").value;

      try {
        errorDiv.textContent = "";
        successDiv.textContent = "Creating account...";

        await StoryAPI.register(name, email, password);

        successDiv.textContent =
          "Account created successfully! Redirecting to login...";
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 2000);
      } catch (error) {
        successDiv.textContent = "";
        errorDiv.textContent =
          error.message || "Registration failed. Please try again.";
      }
    });
  }
}
