function uploadImage() {
  // Get the file input element
  const fileInput = document.getElementById("imageUpload");
  // Check if a file is selected
  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Please select an image to upload.");
    return;
  }

  // Create a FormData object
  const formData = new FormData();
  // Append the selected file to the FormData object
  formData.append("file", fileInput.files[0]);

  // Make an AJAX request to upload the image
  $.ajax({
    url: "/upload/image", // Replace with your server endpoint
    type: "POST",
    data: formData,
    headers: headers,
    contentType: false, // Set contentType to false, FormData will take care of it
    processData: false, // Set processData to false, FormData will take care of it
    success: function (data) {
      if (data.status == "200") {
        $("#imageResponse").text(
          "New Imagename:- " + data.data.data.newImageName
        );
        $("#newImageName")
          .val(data.data.data.newImageName)
          .prop("disabled", true);
        toastr.success(data.data.message);
      } else {
        console.log(data.data.message);
        toastr.error(data.data.message);
      }
    },
    error: function (xhr, status, error) {
      // Handle error response
      console.error("Error uploading image:", error);
      $("#imageResponse").text(
        "Error uploading image. Please try again later."
      );
    },
  });
}

function uploadPDF() {
  // Get the file input element
  const fileInput = document.getElementById("pdfUpload");
  // Check if a file is selected
  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Please select an file to upload.");
    return;
  }

  // Create a FormData object
  const formData = new FormData();
  // Append the selected file to the FormData object
  formData.append("file", fileInput.files[0]);

  // Make an AJAX request to upload the image
  $.ajax({
    url: "/upload/file", // Replace with your server endpoint
    type: "POST",
    data: formData,
    headers: headers,
    contentType: false, // Set contentType to false, FormData will take care of it
    processData: false, // Set processData to false, FormData will take care of it
    success: function (data) {
      if (data.status == "200") {
        $("#pdfResponse").text("New Filename:-  " + data.data.data.newFilename);
        $("#newFilename")
          .val(data.data.data.newFilename)
          .prop("disabled", true);
        toastr.success(data.data.message);
      } else {
        toastr.error("Please try again later");
      }
    },
    error: function (xhr, status, error) {
      // Handle error response
      console.error("Error uploading file:", error);
      $("#pdfResponse").text("Error uploading file. Please try again later.");
    },
  });
}

function createBook() {
  // Create a book object with form data
  // Retrieve values from form fields
  const title = $("#bookTitle").val().trim();
  const description = $("#bookDescription").val().trim();
  const newImageName = $("#newImageName").val().trim();
  const newFilename = $("#newFilename").val().trim();
  const category = $("#category").val().trim();
  const pages = $("#pages").val().trim();
  const isbn = $("#isbn").val().trim();
  const publisher = $("#publisher").val().trim();
  const author = $("#author").val().trim();
  const isPrime = $("input[name='isPrime']:checked").val();

  const isPrimeChecked = $("input[name='isPrime']:checked").length > 0;
  // Validate if required fields are not empty
  if (
    !title ||
    !description ||
    !category ||
    !pages ||
    !isbn ||
    !publisher ||
    !author ||
    !isPrimeChecked
  ) {
    // Display an error message or handle the validation error as needed
    alert("Please fill in all required fields.");
    return;
  }

  // Prepare the book data object
  const bookData = {
    title: title,
    description: description,
    newImageName: newImageName,
    newFilename: newFilename,
    category: category,
    pages: pages,
    isbn: isbn,
    publisher: publisher,
    author: author,
    isPrime: isPrime,
  };

  // AJAX request to create the book
  try {
    $.ajax({
      url: "/create/book", // Replace with your server endpoint
      type: "POST",
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      dataType: "json",
      headers: headers,
      data: JSON.stringify(bookData),
      success: function (data) {
        console.log(data.status);
        console.log(data);
        if (data.status == "200") {
          // Clear all input fields
          $("#bookTitle").val("");
          $("#bookDescription").val("");
          $("#newImageName").val("");
          $("#newFilename").val("");
          $("#category").val("");
          $("#pages").val("");
          $("#isbn").val("");
          $("#publisher").val("");
          $("#author").val("");
          $("input[name='isPrime']").prop("checked", false);
          $("#imageUpload").val("");
          $("#pdfUpload").val("");
          $("#pdfResponse").text("");
          $("#imageResponse").text("");
          toastr.success(data.data.message);
        } else {
          toastr.error("Please try again later");
        }
        // Handle success response if needed
        console.log("Book created successfully.", data);
        // Optionally, redirect to another page or show a success message
      },
    });
  } catch (error) {
    console.error(error);
  }
}
