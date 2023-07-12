const continueBtn = document.querySelector(".btn-continue");
const trigger2fa2Btn = document.querySelector(".btn-trigger-2fa-2");

continueBtn.addEventListener("click", async () => {
  const imgQRcode = document.querySelector(".img-qrcode");

  const response = await fetch("/user/2fa");
  const result = await response.json();
  if (result.error) {
    const message = document
      .querySelector(".modal-2fa-2")
      .querySelector(".message");
    console.log(result.error.message);

    imgQRcode.setAttribute("src", "../../images/error.png");
    imgQRcode.style.width = "96px";
    imgQRcode.style.height = "96px";
    message.textContent = result.error.message;

    trigger2fa2Btn.click();

    return;
  }

  const { QRcode } = result.data;

  imgQRcode.setAttribute("src", QRcode);

  trigger2fa2Btn.click();
});
