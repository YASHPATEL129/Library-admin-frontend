function fetchAdminList(isSuperAdmin) {
  console.log(headers);
  $.ajax({
    url: "/admin-list/" + isSuperAdmin, // Endpoint to fetch category data
    type: "GET",
    headers: headers,
    dataType: "json",
    success: function (data) {
      // Assuming the data returned is an array of category objects
      if (data.data && data.data.length > 0) {
        $("#adminTable").DataTable({
          ajax: {
            url: "/admin-list/" + isSuperAdmin,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            dataSrc: "data", // Assuming the array of transactions is nested under 'data' property in the response
          },
          columns: [
            { data: "id", title: "ID", width: "60px" },
            { data: "userName", title: "Username", width: "150px" },
            { data: "firstName", title: "Firstname", width: "120px" },
            { data: "lastName", title: "Lastname", width: "120px" },
            { data: "email", title: "Email", width: "150px" },
            { data: "contact", title: "Contact", width: "90px" },
            { data: "createdBy", title: "Created By", width: "120px" },
            {
              // Custom column for the button
              data: null,
              title: "Actions",
              width: "100px",
              render: function (data, type, row) {
                // Add a button for password reset
                return (
                  '<button class="btn btn-primary btn-sm" onclick="resetPassword(\'' +
                  data.email +
                  "')\">Reset Password</button>"
                );
              },
              width: "200px",
            },
          ],
          // ordering: false,
          // scrollX: true, // Enable horizontal scrolling
          scrollY: "300px", // Enable vertical scrolling with a height of 300 pixels
          scrollCollapse: true, // Enable collapsing the table when vertical scroll is active
          searching: false,
          error: function (jqXHR, status, error) {
            console.error("Error:", error);
          },
        });
      }
    },
    error: function (jqXHR, status, error) {
      console.error("Error:", error);
    },
  });
}

// Function to open the edit category modal
function resetPassword(email) {
  // Set the category name in the modal input field
  $("#editAdminEmail").val(email);

  // Open the modal
  $(document).on("click", "#edit-close-button", function () {
    $("#editAdminPasswordModal").modal("hide");
    $("#editPassword").val("");
  });

  $("#editAdminPasswordModal").modal("show");
}

function saveEditedAdminPassword() {
  const email = $("#editAdminEmail").val(); // Get category ID from hidden input field

  const editedPassword = {
    newPassword: $("#editPassword").val(),
    email: $("#editAdminEmail").val(),
  };

  if (!editedPassword.newPassword) {
    alert("Required!!");
    return;
  }
  // AJAX call to update category
  $.ajax({
    url: "/superAdmin/resetPassword",
    type: "post",
    dataType: "json",
    headers: headers,
    contentType: "application/json",
    data: JSON.stringify(editedPassword),
    success: function (data) {
      if (data.status == 200) {
        // If deletion is successful, reload the DataTable to reflect the updated data
        $("#editAdminPasswordModal").modal("hide");
        $("#editPassword").val("");
        $("#editAdminEmail").val("");
        toastr.success(data.data.message); // Show success message
      }
    },
    error: function (xhr, status, error) {
      console.error("Error updating category:", error);
      // Optionally display an error message to the user
    },
  });
}
