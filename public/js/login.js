document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // Make an API call to your Node.js backend, which will proxy the request to the Spring Boot API
      $.ajax({
        type: "POST",
        url: "/login",
        data: JSON.stringify({ email, password }), // now data come in this function
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
          console.log(data);
          if (data.status == 200) {
            const deviceType = "WEB";
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("deviceToken", data.data.data.deviceToken);
            sessionStorage.setItem("accessToken", data.data.data.accessToken);
            sessionStorage.setItem("deviceType", deviceType);
            sessionStorage.setItem("isSuperAdmin", data.data.data.isSuperAdmin);
            window.location.href = "/index";
          }
          if (data.data.error == "INCORRECT_ACCOUNT_OR_PASSWORD") {
            toastr.error(data.data.message);
          }
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
});
