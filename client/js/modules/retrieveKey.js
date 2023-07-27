const retrievePrivateKeyBtn = document.querySelector(".btn-confirm");

retrievePrivateKeyBtn.addEventListener("click", async () => {
  const modalBodyPrivateKey = document.querySelector(".private-key");
  const triggerBtn = document.querySelector(".btn-trigger-retrieve-2");

  const response = await fetch("/user/private");
  const result = await response.json();
  const { success } = result;

  if (success) {
    const { private_key } = result;
    modalBodyPrivateKey.textContent = private_key;
    triggerBtn.click();
  } else {
    console.log(result);
  }
});

const topRightCloseBtn = document.querySelector(".btn-close-right-top");
const bottomCloseBtn = document.querySelector(".btn-close-bottom");

function logOut() {
  Cookies.remove("JWT");
  location.assign("/");
}

topRightCloseBtn.addEventListener("click", () => {
  logOut();
});

bottomCloseBtn.addEventListener("click", () => {
  logOut();
});
