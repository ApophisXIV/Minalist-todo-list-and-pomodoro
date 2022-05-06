class Pomolist_Notification {
	constructor() {
		if ("Notification" in window && navigator.serviceWorker) {
			Notification.requestPermission((permission) => {
				if (permission === "granted") {
					navigator.serviceWorker.ready.then((registration) => {
						registration.showNotification("Pomolist", {
							body: "Thanks for using Pomolist!",
							icon: "assets/images/icons/icon-512.png",
							vibrate: [200, 100, 200, 100, 200, 100, 200],
							tag: "pomolist-notification",
						});
					});
				}
			});
		}
	}

	notify = (message, sound, delay = 10, callback, callback_err) => {
		if (Notification.permission != "granted") return;

		navigator.serviceWorker
			.getRegistration()
			.then((registration) => {
				registration.showNotification("Pomolist", {
					body: message,
					icon: "assets/images/icons/icon-512.png",
					vibrate: [200, 100, 200, 100, 200, 100, 200],
					tag: "pomolist-notification",
					requireInteraction: true,
				});

				if (sound) new Audio("assets/sounds/" + sound + ".mp3").play();

				// Close notifications after delay
				setTimeout(() => {
					registration.getNotifications({ tag: "pomolist-notification" }).then((notifications) => {
						notifications.forEach((notification) => {
							notification.close();
						});
					});
				}, delay * 1000);
			})
			.catch((err) => {
				if (callback_err) callback_err(err);
				console.error(err);
			});
	};
}

const notification = new Pomolist_Notification();
export { notification };
