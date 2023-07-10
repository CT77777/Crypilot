async function buyEth(prime) {
  const jwt = Cookies.get("JWT");
  const tokenAddress = document.querySelector(".contract-address").value;
  const ethAmount = document.querySelector(".amount-token").value;
  const modalDialogContent = document.querySelector(".modal-body");
  const triggerBtn = document.querySelector(".trigger-btn");
  const response = await fetch("/trade/buy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authentication: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      tokenAddress: tokenAddress,
      ethAmount: ethAmount,
    }),
  });
  const result = await response.json();
  if (result.txSending) {
    iziToast.show({
      theme: "dark",
      iconUrl: "../images/check-mark.png",
      title: "Send transaction",
      titleSize: 18,
      message: "successfully",
      messageSize: 18,
      position: "topCenter",
      maxWidth: 500,
      timeout: 3000,
      pauseOnHover: true,
      drag: true,
      displayMode: 2,
    });
  } else {
    console.log(result.error);
    iziToast.show({
      theme: "dark",
      iconUrl: "../images/error.png",
      title: "Send transaction",
      titleSize: 18,
      message: "unsuccessfully",
      messageSize: 18,
      position: "topCenter",
      maxWidth: 500,
      timeout: 3000,
      pauseOnHover: true,
      drag: true,
      displayMode: 2,
    });
  }
}

TPDirect.setupSDK(
  12348,
  "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF",
  "sandbox"
);

TPDirect.card.setup({
  // Display ccv field
  fields: {
    number: {
      // css selector
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      // DOM object
      element: document.getElementById("card-expiration-date"),
      placeholder: "MM / YY",
    },
    ccv: {
      element: "#card-ccv",
      placeholder: "ccv",
    },
  },
  styles: {
    // Style all elements
    input: {
      color: "gray",
    },
    // Styling ccv field
    "input.ccv": {
      "font-size": "16px",
    },
    // Styling expiration-date field
    "input.expiration-date": {
      "font-size": "16px",
    },
    // Styling card-number field
    "input.card-number": {
      "font-size": "16px",
    },
    // style focus state
    ":focus": {
      // 'color': 'black'
    },
    // style valid state
    ".valid": {
      color: "green",
    },
    // style invalid state
    ".invalid": {
      color: "red",
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange",
      },
    },
  },
  // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
});

TPDirect.card.onUpdate(function (update) {
  // update.canGetPrime === true
  // --> you can call TPDirect.card.getPrime()
  if (update.canGetPrime) {
    // Enable submit Button to get prime.
    // submitButton.removeAttribute('disabled')
  } else {
    // Disable submit Button to get prime.
    // submitButton.setAttribute('disabled', true)
  }

  // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
  if (update.cardType === "visa") {
    // Handle card type visa.
  }

  // number 欄位是錯誤的
  if (update.status.number === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.number === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.expiry === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.expiry === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.ccv === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.ccv === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }
});

// call TPDirect.card.getPrime when user submit form to get tappay prime
function onSubmit(event) {
  event.preventDefault();

  // get status of TapPay Fields
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();

  // check if it's available to getPrime
  if (tappayStatus.canGetPrime === false) {
    alert("can not get prime");
    return;
  }

  // Get prime
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert("get prime error " + result.msg);
      return;
    }
    console.log("prime:", result.card.prime);

    // send prime to your server, to pay with Pay by Prime API .
    // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    const prime = result.card.prime;
    buyEth(prime);
  });
}

const submitButton = document.querySelector(".btn-confirm");
submitButton.addEventListener("click", async (event) => {
  onSubmit(event);
});
