async function swRegister() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker not supported in this browser");
    return;
  }

  try {
    // Get the correct path for GitHub Pages
    const swPath =
      import.meta.env.MODE === "production" ? "/story-map-app/sw.js" : "/sw.js";

    const registration = await navigator.serviceWorker.register(swPath, {
      scope: import.meta.env.MODE === "production" ? "/story-map-app/" : "/",
    });

    console.log("Service Worker registered successfully:", registration);

    // Check for updates
    registration.addEventListener("updatefound", () => {
      console.log("Service Worker update found");
      const newWorker = registration.installing;

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          console.log("New Service Worker available. Refresh to update.");
        }
      });
    });

    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
}

export default swRegister;
