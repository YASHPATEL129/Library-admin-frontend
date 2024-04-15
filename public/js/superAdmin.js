function fetchSuperAdminList(isSuperAdmin) {
  $.ajax({
    url: "/admin-list/" + isSuperAdmin, // Endpoint to fetch category data
    type: "GET",
    headers: headers,
    dataType: "json",
    success: function (data) {
      // Assuming the data returned is an array of category objects
      if (data.data && data.data.length > 0) {
        $("#superAdminTable").DataTable({
          ajax: {
            url: "/admin-list/" + isSuperAdmin,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: headers,
            dataSrc: "data", // Assuming the array of transactions is nested under 'data' property in the response
          },
          columns: [
            { data: "id", title: "ID", width: "120px" },
            { data: "userName", title: "Username", width: "190px" },
            { data: "firstName", title: "Firstname", width: "190px" },
            { data: "lastName", title: "Lastname", width: "190px" },
            { data: "email", title: "Email", width: "190px" },
            { data: "contact", title: "Contact", width: "190px" },
            { data: "createdBy", title: "Created By", width: "190px" },
          ],
          // ordering: false,
          scrollX: true, // Enable horizontal scrolling
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
function openCreateAdminModal() {
  $("#createAdminModal").modal("show");
}
