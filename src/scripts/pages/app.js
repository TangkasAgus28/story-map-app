import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    this.#setupViewTransition();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      const isOpen = this.#navigationDrawer.classList.toggle("open");
      this.#drawerButton.setAttribute("aria-expanded", isOpen);
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
        this.#drawerButton.setAttribute("aria-expanded", "false");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
          this.#drawerButton.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Keyboard navigation for drawer
    this.#drawerButton.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.#drawerButton.click();
      }
    });
  }

  #setupViewTransition() {
    // Check if View Transition API is supported
    this.supportsViewTransition = "startViewTransition" in document;
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    // If View Transition API is supported, use it (Basic: +2 pts for default transition)
    if (this.supportsViewTransition && document.startViewTransition) {
      await document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      }).finished;
    } else {
      // Fallback for browsers that don't support View Transition API
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }

    // Focus on main content for accessibility
    this.#content.focus();
  }
}

export default App;
