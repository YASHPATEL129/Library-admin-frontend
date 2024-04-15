function fetchBooks() {
  $.ajax({
    url: "/getBooks", // Endpoint to fetch category data
    type: "GET",
    dataType: "json",
    headers: headers,
    success: function (data) {
      // Assuming the data returned is an array of category objects
      if (data.data && data.data.length > 0) {
        $("#booksTable").DataTable({
          ajax: {
            url: "/getBooks",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            dataSrc: "data", // Assuming the array of transactions is nested under 'data' property in the response
          },
          columns: [
            { data: "bookId", title: "Book ID", width: "60px" },
            { data: "title", title: "Title", width: "180px" },
            {
              data: "description",
              title: "Description",
              width: "200px",
              render: function (data, type, row) {
                // Check if the data is too long
                if (data.length > 50) {
                  // If it's longer than 50 characters, truncate and add ellipsis
                  return data.substring(0, 50) + "...";
                } else {
                  return data; // Otherwise, return the full data
                }
              },
            },
            { data: "categoryName", title: "Category", width: "120px" },
            { data: "isPrime", title: "Prime", width: "50px" },
            { data: "pages", title: "Pages", width: "50px" },
            { data: "publisher", title: "Publisher", width: "150px" },
            { data: "author", title: "Author", width: "150px" },
            { data: "isbn", title: "ISBN", width: "120px" },
            { data: "createdBy", title: "Created By", width: "120px" },
            { data: "createdDate", title: "Created Date", width: "150px" },
            { data: "modifiedBy", title: "Modified By", width: "120px" },
            { data: "modifiedDate", title: "Modified Date", width: "150px" },
            { data: "isDeleted", title: "Deleted", width: "30px" },
            { data: "deletedDate", title: "Deleted Date", width: "120px" },
            {
              // Custom column for the buttons
              data: null,
              title: "Actions",
              width: "180px",
              render: function (data, type, row) {
                // Add buttons for Reset Password, Edit, and Delete actions
                return `
                <div class="dropdown">
                <button class="btn btn-info btn-sm" onclick="openPdfCoverModal('${
                  data.file
                }', '${data.cover}')">View</button>
                <button class="btn btn-secondary dropdown-toggle btn-sm" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Edit
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <span class="dropdown-item" onclick="editBook('${
                    data.bookId
                  }')">Book Details</span>
                  <span class="dropdown-item" onclick="editImage('${
                    data.cover
                  }')" >Edit Image</span>
                  <span class="dropdown-item" onclick="editPdf('${
                    data.file
                  }')">Edit PDF</span>
                </div>
               
                                      <button class="btn btn-danger btn-sm" onclick="toggleDelete('${
                                        data.bookId
                                      }', ${data.isDeleted})" style="${
                  data.isDeleted
                    ? "background-color: green; border-color: green;"
                    : ""
                }">
                                      ${data.isDeleted ? "Restore" : "Delete"}
                                  </button>
              </div>

                    `;
              },
            },
          ],
          // ordering: false,
          scrollX: true, // Enable horizontal scrolling
          scrollY: "400px", // Enable vertical scrolling with a height of 300 pixels
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

function openPdfCoverModal(newFilename, newCoverName) {
  const baseUrl = "/download/";
  const fullCoverUrl = baseUrl + newCoverName;
  // // Set cover image source
  $("#coverImage").attr("src", fullCoverUrl);

  console.log(fullCoverUrl);

  function fetchAndDisplayPDF(newFilename) {
    $.ajax({
      type: "GET",
      url: "/pdf/download/" + newFilename,
      crossDomain: true,
      headers: headers,
      xhrFields: {
        responseType: "arraybuffer", // Set the response type to 'arraybuffer'
      },
      success: function (data, status, jqXHR) {
        var blob = new Blob([data], { type: "application/pdf" });
        var pdfUrl = URL.createObjectURL(blob);
        console.log(pdfUrl);
        // Set the src of the iframe to the object URL
        $("#pdfIframe").attr("src", pdfUrl + "#toolbar=0");
        $("#filename").text(newFilename);
      },
    });
  }
  fetchAndDisplayPDF(newFilename);
  // Show the modal
  $("#pdfCoverModal").modal("show");
}

function toggleDelete(bookId, isDeleted) {
  if (isDeleted) {
    restoreBook(bookId);
  } else {
    deleteBook(bookId);
  }
}

function deleteBook(bookId) {
  // Confirm deletion with the user
  if (confirm("Are you sure you want to delete this book?")) {
    // Send a request to delete the book with the specified ID
    $.ajax({
      type: "DELETE",
      url: "/book/delete/" + bookId,
      crossDomain: true,
      dataType: "json",
      headers: headers,
      contentType: "application/json",
      success: function (data, status) {
        // If the deletion is successful, reload the page or update the UI as needed
        if (data.data.error === "IS_ALREADY_DELETED") {
          toastr.error(data.data.message);
        }
        if (data.status == "200") {
          toastr.success(data.data.message);
        }
        // For example, you could reload the page to reflect the changes
        $("#booksTable").DataTable().ajax.reload(null, false);
      },
      error: function (xhr, status, error) {
        // If there's an error during deletion, handle it appropriately
        console.error("Error deleting book:", error);
        // You can display an error message to the user or handle the error in another way
        alert(
          "An error occurred while deleting the book. Please try again later."
        );
      },
    });
  }
}

function restoreBook(bookId) {
  if (confirm("Are you sure you want to restore this book?")) {
    // Send a request to restore the book with the specified ID
    $.ajax({
      type: "PUT",
      url: "/book/restore/" + bookId, // Replace this with your actual restore endpoint
      crossDomain: true,
      dataType: "json",
      contentType: "application/json",
      headers: headers,
      success: function (data) {
        if (data.status == "200") {
          toastr.success(data.data.message);
        }
        $("#booksTable").DataTable().ajax.reload(null, false);
      },
      error: function (xhr, status, error) {
        console.error("Error restoring book:", error);
        alert(
          "An error occurred while restoring the book. Please try again later."
        );
      },
    });
  }
}

function editBook(bookId) {
  var cats = [];
  $.ajax({
    url: "/getAllCategory", // Endpoint to fetch category data
    type: "GET",
    dataType: "json",
    headers: headers,
    success: function (data) {
      for (let e of data.data) {
        cats.push({
          id: e.id,
          text: e.categoryName,
        });
      }
    },
    // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
  });
  $.ajax({
    type: "GET",
    url: "/bookDetails/" + bookId, // Replace this with your actual endpoint to fetch book details
    crossDomain: true,
    dataType: "json",
    headers: headers,
    contentType: "application/json",
    success: function (data) {
      // Assuming response contains book details object
      $("#editTitle").val(data.data.title);
      $("#editDescription").val(data.data.description);
      $("#editISBN").val(data.data.isbn);
      $("#editPublisher").val(data.data.publisher);
      $("#editAuthor").val(data.data.author);
      $("#editPages").val(data.data.pages);
      var catId = data.data.category;
      $("#editCategory").select2({
        placeholder: "Select Category",
        data: cats,
      });
      $("#editCategory").val(data.data.category).trigger("change");

      // Show the modal
      $("#editBookModal").modal("show");
      $("#editBookId").val(bookId);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching book details:", error);
      alert(
        "An error occurred while fetching book details. Please try again later."
      );
    },
  });
}

function saveBookChanges() {
  const bookId = $("#editBookId").val();

  const editedBook = {
    title: $("#editTitle").val(),
    description: $("#editDescription").val(),
    isbn: $("#editISBN").val(),
    publisher: $("#editPublisher").val(),
    author: $("#editAuthor").val(),
    pages: $("#editPages").val(),
    category: $("#editCategory").val(), // Assuming Select2 dropdown is used for categories
  };

  $.ajax({
    url: "/update/book/" + bookId,
    type: "PUT",
    dataType: "json",
    headers: headers,
    contentType: "application/json",
    data: JSON.stringify(editedBook),
    success: function (data) {
      $("#booksTable").DataTable().ajax.reload(null, false);
      $("#editBookModal").modal("hide");
      toastr.success(data.data.message);
    },
    error: function (xhr, status, error) {
      console.error("Error updating book:", error);
      // Optionally display an error message to the user
    },
  });
}

function editImage(cover) {
  // Click event handler for the "Edit Image" button

  $("#coverName").text(cover);
  // Show the modal
  $("#editImageModal").modal("show");
}

function saveImageChanges() {
  const coverName = $("#coverName").text(); // Get the cover name from the span tag
  const imageData = new FormData(); // Create a FormData object to send image data
  console.log(headers);
  // Append the image file from the input field to the FormData object
  imageData.append("file", $("#imageUpload")[0].files[0]);
  // Make the AJAX request to update the image
  $.ajax({
    url: "/update/image/" + coverName,
    type: "PUT",
    headers: headers,
    processData: false,
    contentType: false,
    crossDomain: true,
    data: imageData,
    success: function (data) {
      // Handle success response if needed
      console.log("Image updated successfully.", data);
      // Close the modal or perform any other action upon successful image update
      $("#booksTable").DataTable().ajax.reload(null, false);
      $("#editImageModal").modal("hide");
      toastr.success(data.data.message);
    },
    error: function (xhr, status, error) {
      console.error("Error updating image:", error);
      // Optionally display an error message to the user
      alert(
        "An error occurred while updating the image. Please try again later."
      );
    },
  });
}

function editPdf(file) {
  // Click event handler for the "Edit Image" button

  $("#pdf").text(file);
  // Show the modal
  $("#editPdfModal").modal("show");
}

function savePdfChanges() {
  const file = $("#pdf").text(); // Get the cover name from the span tag
  const fileData = new FormData(); // Create a FormData object to send image data
  console.log(headers);
  // Append the image file from the input field to the FormData object
  fileData.append("file", $("#pdfUpload")[0].files[0]);
  // Make the AJAX request to update the image
  $.ajax({
    url: "/update/pdf/" + file,
    type: "PUT",
    headers: headers,
    processData: false,
    contentType: false,
    crossDomain: true,
    data: fileData,
    success: function (data) {
      // Handle success response if needed
      console.log("Pdf updated successfully.", data);
      // Close the modal or perform any other action upon successful image update
      $("#booksTable").DataTable().ajax.reload(null, false);
      $("#editPdfModal").modal("hide");
      toastr.success(data.data.message);
    },
    error: function (xhr, status, error) {
      console.error("Error updating image:", error);
      // Optionally display an error message to the user
      alert(
        "An error occurred while updating the image. Please try again later."
      );
    },
  });
}
