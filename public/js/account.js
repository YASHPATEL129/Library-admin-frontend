function fetchAndPopulateUserDetails() {
  $.ajax({
    url: "/myprofileLoad", // Assuming this is the route in your Node.js application
    type: "GET",
    headers: headers,
    contentType: "application/json; charset=utf-8",
    crossDomain: true,
    dataType: "json",
    success: function (data, status, jqXHR) {
      // Handle the successful response here
      $(".details h4").html(
        data.data.firstName +
          " " +
          data.data.lastName +
          '<i class="fa fa-sheild"></i>'
      );
      $('.section-content[data-field="username"]').text(data.data.userName);
      $('.section-content[data-field="firstname"]').text(data.data.firstName);
      $('.section-content[data-field="lastname"]').text(data.data.lastName);
      $('.section-content[data-field="contact"]').text(data.data.contact);
      $('.section-content[data-field="email"]').text(data.data.email);

      $("#currentPlan").text(data.data.planName);
    },
  });
}

function openEditModal() {
  // AJAX request to fetch accountant data

  $.ajax({
    url: `/myprofileLoad`, // Replace with your Spring Boot API endpoint
    method: "GET",
    dataType: "json",
    headers: headers,
    success: function (data, status, jqXHR) {
      // Populate the modal fields with accountant data
      $("#editFirstName").val(data.data.firstName);
      $("#editLastName").val(data.data.lastName);
      $("#editContact").val(data.data.contact);

      // Open the modal
      $("#editUserModal").modal("show");
    },
    error: function (error) {
      console.error("Error fetching student data:", error);
    },
  });
}

$(document).on("click", ".edit-button", function () {
  openEditModal();
});

$(document).on("click", "#edit-close-button", function () {
  $("#editUserModal").modal("hide");
});

function saveEditedUser() {
  const editedUser = {
    firstName: $("#editFirstName").val(),
    lastName: $("#editLastName").val(),
    contact: $("#editContact").val(),
  };

  if (!editedUser.firstName) {
    alert("Required!!");
    return;
  }
  if (!editedUser.lastName) {
    alert("Required!!");
    return;
  }

  if (!editedUser.contact) {
    alert("Required!!");
    return;
  }

  // AJAX request to update accountant data
  $.ajax({
    url: `/changeInfo`, // Replace with your Spring Boot API endpoint for updating
    method: "PUT",
    dataType: "json",
    contentType: "application/json",
    headers: headers,
    data: JSON.stringify(editedUser),
    success: function (data) {
      // Close the modal after successfully updating
      $("#editUserModal").modal("hide");

      toastr.success("Change successfully");
      fetchAndPopulateUserDetails();
    },
    error: function (error) {
      console.error("Error updating student data:", error);
    },
  });
}
$("#saveEditedUser").click(function () {
  saveEditedUser();
});

$(document).on("click", ".edit-button-password", function () {
  $("#changePasswordModal").modal("show");
});

$(document).ready(function () {
  $("#changePasswordModal").on("hidden.bs.modal", function () {
    // Reset input fields
    $("#currentPassword").val(""); // Clear current password input
    $("#newPassword").val(""); // Clear new password input
  });
});

function saveEditedPassword() {
  const editedPassword = {
    currentPassword: $("#currentPassword").val(),
    newPassword: $("#newPassword").val(),
  };

  if (!editedPassword.currentPassword) {
    alert("Required!!");
    return;
  }

  if (!editedPassword.newPassword) {
    alert("Required!!");
    return;
  }

  // AJAX request to update accountant data
  $.ajax({
    url: `/changePassword`, // Replace with your Spring Boot API endpoint for updating
    method: "PUT",
    dataType: "json",
    contentType: "application/json",
    headers: headers,
    data: JSON.stringify(editedPassword),
    success: function (data, status) {
      console.log(status);

      if (data.data.error === "SAME_PASSWORD") {
        toastr.error(data.data.message);
      }
      if (data.data.error === "INCORRECT_CURRENT_PASSWORD") {
        toastr.error(data.data.message);
      }
      if (data.status == "200") {
        $("#currentPassword").val("");
        $("#newPassword").val("");
        setTimeout(function () {
          $("#changePasswordModal").modal("hide");
        }, 100);
        toastr.success("Password changed successfully");
      }
    },
    error: function (error) {
      console.error("Error updating student data:", error);
    },
  });
}

// When the "Save Changes" button is clicked
$("#savePasswordChanges").click(function () {
  saveEditedPassword();
});
