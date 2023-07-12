import * as logIn from "./modules/logIn.js";

const navUserLinks = document.querySelectorAll(".nav-link-user");

navUserLinks.forEach((userLink) => {
  userLink.addEventListener("click", (event) => {
    event.preventDefault();
    const jwt = Cookies.get("JWT");

    if (jwt === undefined) {
      iziToast.show({
        theme: "dark",
        iconUrl: "../images/error.png",
        title: `Please log in first`,
        titleSize: 18,
        messageSize: 18,
        position: "topCenter",
        maxWidth: 500,
        timeout: 3000,
        pauseOnHover: true,
        drag: true,
        displayMode: 2,
      });

      return;
    } else {
    }

    location.assign(userLink.href);
  });
});
