const logInBtn = document.querySelector(".btn-login");

logInBtn.addEventListener("click", async () => {
  const email = document.querySelector(".email-login").value;
  const password = document.querySelector(".password-login").value;

  const response = await fetch("/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: { email, password } }),
  });

  const result = await response.json();

  if (result.error) {
    iziToast.show({
      theme: "dark",
      iconUrl: "/images/error.png",
      title: `${result.error.message}`,
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
  }

  const trigger2FAVerifyModalBtn = document.querySelector(
    ".btn-trigger-2fa-verify"
  );
  if (result.data.second_FA) {
    trigger2FAVerifyModalBtn.click();

    return;
  }

  if (result.data.redirect) {
    location.assign(`${result.data.redirect}`);

    return;
  }
});

//-------------

const boxInputs = document.querySelectorAll(".input-2fa-wrapper-box");

boxInputs.forEach((boxInput, index) => {
  boxInput.addEventListener("input", () => {
    if (boxInput.value.length > 1) {
      boxInput.value = boxInput.value.slice(0, 1);
    }

    if (boxInput.value.length === 1) {
      if (boxInputs[index + 1]) {
        boxInputs[index + 1].focus();
      }
    }
  });
});

boxInputs.forEach((boxInput, index) => {
  boxInput.addEventListener("input", () => {
    if (boxInput.value.length === 0) {
      if (boxInputs[index - 1]) {
        boxInputs[index - 1].focus();
      }
    }
  });
});

boxInputs.forEach((boxInput, index) => {
  boxInput.addEventListener("keydown", (event) => {
    if (
      event.key === "e" ||
      event.key === "E" ||
      event.key === "+" ||
      event.key === "-"
    ) {
      event.preventDefault();
    }

    if (event.key === "Backspace" && boxInput.value.length === 0) {
      if (boxInputs[index - 1]) {
        boxInputs[index - 1].focus();
      }
    }
  });
});

//-------------

const secondFAVerifyBtn = document.querySelector(".btn-2fa-verify");

secondFAVerifyBtn.addEventListener("click", async () => {
  const email = document.querySelector(".email-login").value;
  const boxInputs = document.querySelectorAll(".input-2fa-wrapper-box");
  let token = "";
  boxInputs.forEach((boxInput) => {
    token += boxInput.value;
  });

  const response = await fetch("/user/2fa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: { email, token } }),
  });

  const result = await response.json();

  if (result.error) {
    iziToast.show({
      theme: "dark",
      iconUrl: "/images/error.png",
      title: `${result.error.message}`,
      titleSize: 18,
      messageSize: 18,
      position: "topCenter",
      maxWidth: 700,
      timeout: 3000,
      pauseOnHover: true,
      drag: true,
      displayMode: 2,
    });

    return;
  }

  if (result.data.redirect) {
    location.assign(`${result.data.redirect}`);
  }
});
