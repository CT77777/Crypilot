const toggle = document.querySelector(".toggle");
const form = document.querySelector("form");

toggle.addEventListener("click", () => {
  const toggleState = toggle.getAttribute("data-state");
  if (toggleState === "register") {
    toggle.textContent = "Haven't registered... redirect to register";
    toggle.setAttribute("data-state", "login");
    form.setAttribute("action", "/user/login");
    form.innerHTML = `
    <div class="form-floating">
        <input type="email" name="email" class="form-control" id="floatingInput" placeholder="name@example.com" required>
        <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating">
        <input type="password" name="password" class="form-control" id="floatingPassword" placeholder="Password" required>
        <label for="floatingPassword">Password</label>
    </div>
    <button class="btn btn-primary w-100 py-2" type="submit">Log In</button>
    `;
  } else {
    toggle.textContent = "Already registered... redirect to log in";
    toggle.setAttribute("data-state", "register");
    form.setAttribute("action", "/user/register");
    form.innerHTML = `
    <div class="form-floating">
        <input type="email" name="email" class="form-control" id="floatingInput" placeholder="name@example.com" required>
        <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating">
        <input type="password" name="password" class="form-control" id="floatingPassword" placeholder="Password" required>
        <label for="floatingPassword">Password</label>
    </div>
    <div class="form-floating">
        <input type="text" name="username" class="form-control" id="floatingUsername" placeholder="User Name" required>
        <label for="floatingUsername">User Name</label>
    </div>
    <button class="btn btn-primary w-100 py-2" type="submit">Register</button>
    `;
  }
});
