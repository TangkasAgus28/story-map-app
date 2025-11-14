async function swRegister() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker not supported in this browser");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    console.log("Service Worker registered successfully:", registration);

    // Check for updates
    registration.addEventListener("updatefound", () => {
      console.log("Service Worker update found");
    });

    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
  }
}

export default swRegister;
