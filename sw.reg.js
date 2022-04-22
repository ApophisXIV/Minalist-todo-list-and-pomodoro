if ("serviceWorker" in navigator)
    window.addEventListener("load", () =>
        navigator.serviceWorker
            .register("./sw.main.js")
            .then((registration) => console.log("Service Worker Registered"))
            .catch((err) => console.log("Service Worker Failed to Register"))
    )