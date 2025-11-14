import StoryAPI from "../../data/api";
import AuthHelper from "../../utils/auth";

export default class LoginPage {
  async render() {
    return `
      <section class="auth-container">
        <div class="auth-card">
          <h1>Login</h1>
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input 
                type="email" 
                id="login-email" 
                name="email" 
                required 
                aria-label="Email address"
                aria-describedby="email-help"
                placeholder="your@email.com"
              />
              <small id="email-help" class="help-text">Enter your registered email</small>
            </div>
            
            <div class="form-group">
              <label for="login-password">Password</label>
              <input 
                type="password" 
                id="login-password" 
                name="password" 
                required 
                minlength="8"
                aria-label="Password"
                aria-describedby="password-help"
                placeholder="Min. 8 characters"
              />
              <small id="password-help" class="help-text">Minimum 8 characters</small>
            </div>
            
            <button type="submit" class="btn-primary" aria-label="Login to your account">
              Login
            </button>
            <p class="auth-link">
              Don't have an account? <a href="#/register">Register here</a>
            </p>
          </form>
          <div id="error-message" class="error-message" role="alert" aria-live="polite"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector("#login-form");
    const errorDiv = document.querySelector("#error-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.querySelector("#login-email").value;
      const password = document.querySelector("#login-password").value;

      try {
        errorDiv.textContent = "Loading...";
        const result = await StoryAPI.login(email, password);

        AuthHelper.setToken(result.loginResult.token);
        AuthHelper.setUser({
          userId: result.loginResult.userId,
          name: result.loginResult.name,
        });

        errorDiv.textContent = "Login successful! Redirecting...";
        setTimeout(() => {
          window.location.hash = "#/";
        }, 1000);
      } catch (error) {
        errorDiv.textContent =
          error.message || "Login failed. Please check your credentials.";
      }
    });
  }
}
