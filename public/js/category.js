// Function to fetch category data and populate DataTable
function fetchAndPopulateCategories() {
  $.ajax({
    url: "/getAllCategory", // Endpoint to fetch category data
    type: "GET",
    headers: headers,
    dataType: "json",
    success: function (data) {
      // Assuming the data returned is an array of category objects
      if (data.data && data.data.length > 0) {
        $("#categoryTable").DataTable({
          ajax: {
            url: "/getAllCategory",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            dataSrc: "data", // Assuming the array of transactions is nested under 'data' property in the response
          },
          columns: [
            { data: "id", title: "Category ID", width: "120px" },
            { data: "categoryName", title: "Category Name", width: "190px" },
            { data: "createdBy", title: "Created By", width: "190px" },
            { data: "modifiedBy", title: "Modified By", width: "190px" },
            {
              title: "Delete",
              render: function (data, type, row) {
                return (
                  '<button onclick="deleteCategory(' +
                  row.id +
                  ')" class="btn btn-danger btn-sm">Delete</button>'
                );
              },
              width: "80px",
            },
            {
              title: "Edit",
              render: function (data, type, row) {
                return (
                  "<button onclick=\"openEditCategoryModal('" +
                  row.id +
                  "', '" +
                  row.categoryName +
                  '\')" class="btn btn-primary btn-sm">Edit</button>'
                );
              },
              width: "80px",
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

function createCategory() {
  const categoryName = $("#categoryName").val();
  if (!categoryName.trim()) {
    toastr.error("Please enter a category name.");
    return;
  }
  try {
    // Make an API call to your Node.js backend, which will proxy the request to the Spring Boot API
    $.ajax({
      type: "POST",
      url: "/createCategory",
      data: JSON.stringify({ categoryName }), // now data come in this function
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      headers: headers,
      dataType: "json",
      success: function (data, status, jqXHR) {
        if (data.status == "200") {
          toastr.success(data.data.message);
          $("#categoryTable").DataTable().ajax.reload(null, false);
          $("#categoryName").val("");
        }
        if (data.data.error === "CATEGORY_IS_ALREADY_EXIST") {
          toastr.error(data.data.message);
        }
      },
    });
  } catch (error) {
    console.error(error);
  }
}

function deleteCategory(categoryId) {
  if (!confirm("Are you sure you want to delete this category?")) {
    return; // Cancel deletion if user cancels the confirmation
  }

  $.ajax({
    type: "DELETE",
    url: "/delete/Category/" + categoryId, // Assuming your delete endpoint accepts DELETE requests and the category ID is passed as a path parameter
    contentType: "application/json",
    dataType: "json",
    headers: headers,
    success: function (data, status) {
      console.log(data.status);
      if (data.data.error === "CATEGORY_ID_ASSOCIATED_WITH_BOOK") {
        toastr.error(data.data.message);
      }
      if (data.status == 200) {
        // If deletion is successful, reload the DataTable to reflect the updated data
        $("#categoryTable").DataTable().ajax.reload(null, false);
        toastr.success(data.data.message); // Show success message
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error:", textStatus, errorThrown);
      toastr.error("An error occurred while deleting the category."); // Show generic error message
    },
  });
}
// Function to open the edit category modal
function openEditCategoryModal(categoryId, categoryName) {
  // Set the category name in the modal input field
  $("#editCategoryId").val(categoryId);
  $("#editCategoryName").val(categoryName);

  // Open the modal
  $(document).on("click", "#edit-close-button", function () {
    $("#editCategoryModal").modal("hide");
  });

  $("#editCategoryModal").modal("show");
}

function saveEditedCategory() {
  const categoryId = $("#editCategoryId").val(); // Get category ID from hidden input field

  const editedCategory = {
    categoryName: $("#editCategoryName").val(),
  };

  if (!editedCategory.categoryName) {
    alert("Required!!");
    return;
  }
  // AJAX call to update category
  $.ajax({
    url: "/edit/category/" + categoryId,
    type: "PUT",
    dataType: "json",
    headers: headers,
    contentType: "application/json",
    data: JSON.stringify(editedCategory),
    success: function (data) {
      $("#editCategoryModal").modal("hide");
      $("#categoryTable").DataTable().ajax.reload(null, false);
    },
    error: function (xhr, status, error) {
      console.error("Error updating category:", error);
      // Optionally display an error message to the user
    },
  });
}
