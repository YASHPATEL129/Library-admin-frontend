const accessToken = sessionStorage.getItem("accessToken");
const deviceToken = sessionStorage.getItem("deviceToken");
const deviceType = sessionStorage.getItem("deviceType");

const headers = {
  "access-token": accessToken,
  "device-type": deviceType,
  "device-token": deviceToken,
};
$(document).ready(function () {
  // Function to load dashboard content
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        // show navbar
        nav.classList.toggle("show-navbar");
        // change icon
        toggle.classList.toggle("bx-x");
        // add padding to body
        bodypd.classList.toggle("body-pd");
        // add padding to header
        headerpd.classList.toggle("body-pd");
      });
    }
  };

  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  /*===== LINK ACTIVE =====*/
  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink(current) {
    var ele = $.find(".nav_link.active");
    $(ele).removeClass("active");
    var curEle = $.find(current);
    console.log(curEle);
    $(curEle).addClass("active");
  }

  $.ajax({
    url: "/get/modules", // Route to fetch dashboard content
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "access-token": accessToken,
      "device-type": deviceType,
      "device-token": deviceToken,
    },
    success: function (data) {
      console.log(data);
      const navList = $(".nav_list"); // Select the container element to append the links
      data.data.forEach((data) => {
        var innerHTML = `
        <li class="${data.class}" id="${data.path}">
        <i class="bx ${data.icon} nav_icon"></i>
        <span class="nav_name">${data.name}</span>
        </li>
        `;
        navList.append(innerHTML);
      });
    },
    error: function (err) {
      console.error("Error fetching dashboard content:", err);
    },
  });
  function loadContent(pageUrl) {
    $.ajax({
      url: pageUrl, // Route to fetch dashboard content
      method: "GET",
      success: function (response) {
        $("#main-content").html(response); // Update content
      },
      error: function (err) {
        console.error("Error fetching dashboard content:", err);
      },
    });
  }
  loadContent("/books");

  // Click event handler for dashboard link
  $(document).delegate("#super-admin-link", "click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    colorLink("#super-admin-link");
    loadContent("/superAdmin"); // Load dashboard content
  });
  // Click event handler for dashboard link
  $(document).delegate("#admin-link", "click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    colorLink("#admin-link");
    loadContent("/admin"); // Load dashboard content
  });
  $(document).delegate("#category-link", "click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    colorLink("#category-link");
    loadContent("/category"); // Load dashboard content
  });
  // Click event handler for dashboard link
  $(document).delegate("#book-upload-link", "click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    colorLink("#book-upload-link");
    loadContent("/uploadBook"); // Load dashboard content
  });
  $(document).delegate("#books-link", "click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    colorLink("#books-link");
    loadContent("/books"); // Load dashboard content
  });
  // Click event handler for dashboard link
  $(document).delegate("#bulk-book-link", "click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    colorLink("#bulk-book-link");
    loadContent("/bulkUpload"); // Load dashboard content
  });
  $(document).delegate("#account-link", "click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    colorLink("#account-link");
    loadContent("/account"); // Load dashboard content
  });
  const logoutButton = document.getElementById("logout-button");

  logoutButton.addEventListener("click", () => {
    // Remove the stored email from local storage
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("deviceToken");
    sessionStorage.removeItem("deviceType");

    window.location.href = "/login";
  });
});
