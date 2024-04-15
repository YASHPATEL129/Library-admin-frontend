const ejs = require("ejs");
const FormData = require("form-data");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const express = require("express");
const axios = require("axios");
const { name } = require("ejs");
const { hrtime } = require("process");
const port = 4000;
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files (CSS and JS)
app.use(express.static("public"));

// Set the EJS view engine
app.set("view engine", "ejs");

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/login", (req, res) => {
  res.render("logIn");
});

app.post("/login", async (req, res) => {
  try {
    const springBootApiUrl = "http://localhost:8081/v1/signIn";
    const headers = {
      "Content-Type": "application/json",
      "device-type": "WEB",
    };
    const option = {
      method: "post",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
      data: req.body,
    };

    // Forward the login request to Spring Boot
    const response = await axios(option);
    // Return the Spring Boot response to the frontend
    res.json({ data: response.data, status: response.status });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.get("/index", (req, res) => {
  res.render("index");
});

app.get("/dashboard", (req, res) => {
  ejs.renderFile("./views/dashboard.ejs").then((out) => res.send(out));
});

app.get("/superAdmin", (req, res) => {
  ejs.renderFile("./views/superAdmin.ejs").then((out) => res.send(out));
});

app.get("/admin", (req, res) => {
  ejs.renderFile("./views/admin.ejs").then((out) => res.send(out));
});

app.get("/category", (req, res) => {
  ejs.renderFile("./views/category.ejs").then((out) => res.send(out));
});

app.get("/uploadBook", (req, res) => {
  ejs.renderFile("./views/uploadBook.ejs").then((out) => res.send(out));
});

app.get("/bulkUpload", (req, res) => {
  ejs.renderFile("./views/bulkUpload.ejs").then((out) => res.send(out));
});

app.get("/account", (req, res) => {
  ejs.renderFile("./views/account.ejs").then((out) => res.send(out));
});

app.get("/books", (req, res) => {
  ejs.renderFile("./views/books.ejs").then((out) => res.send(out));
});

app.post("/createCategory", async (req, res) => {
  try {
    // Replace with your Spring Boot API endpoint
    const springBootApiUrl = "http://localhost:8081/v1/createCategory";

    const headers = {
      "content-type": "application/json",
      "access-token": req.headers["access-token"],
      "device-token": req.headers["device-token"],
      "device-type": req.headers["device-type"],
    };

    const option = {
      method: "post",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
      data: req.body,
    };
    // Forward the login request to Spring Boot
    const response = await axios(option);

    // Return the Spring Boot response to the frontend
    res.json({ data: response.data, status: response.status });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.get("/getAllCategory", async (req, res) => {
  const springBootApiUrl = "http://localhost:8081/v1/all/category"; // Replace with your Spring Boot API URL
  const headers = {
    "content-type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };
  try {
    const option = {
      method: "get",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
    };

    // Forward the login request to Spring Boot
    const response = await axios(option);
    // Return the Spring Boot response to the frontend
    res.json({ data: response.data.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.delete("/delete/category/:id", async (req, res) => {
  const categoryId = req.params.id;

  const springBootApiUrl =
    "http://localhost:8081/v1/delete/category/" + categoryId;

  const headers = {
    "content-type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };
  try {
    const option = {
      method: "delete",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
    };
    // Forward the login request to Spring Boot
    const response = await axios(option);
    // Return the Spring Boot response to the frontend
    res.json({ data: response.data, status: response.status });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/edit/category/:id", async (req, res) => {
  const categoryId = req.params.id;

  const springBootApiUrl =
    "http://localhost:8081/v1/update/category/" + categoryId;
  const headers = {
    "content-type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };

  try {
    const option = {
      method: "put",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
      data: req.body,
    };

    // Forward the login request to Spring Boot
    const response = await axios(option);
    // Return the Spring Boot response to the frontend
    res.json({ data: response.data, status: response.status });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.get("/admin-list/:isSuperAdmin", async (req, res) => {
  const isSuperAdmin = req.params.isSuperAdmin;
  const springBootApiUrl =
    "http://localhost:8081/v1/admin-list?isSuperAdmin=" + isSuperAdmin; // Replace with your Spring Boot API URL

  const headers = {
    "Content-Type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };
  try {
    const option = {
      method: "get",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
    };
    // console.log(req);
    // Forward the login request to Spring Boot
    const response = await axios(option);
    // Return the Spring Boot response to the frontend
    res.json({ data: response.data.data, status: response.status });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});
app.post("/superAdmin/resetPassword", async (req, res) => {
  try {
    // Replace with your Spring Boot API endpoint
    const springBootApiUrl =
      "http://localhost:8081/v1/super-admin/reset-password";

    const headers = {
      "Content-Type": "application/json",
      "access-token": req.headers["access-token"],
      "device-token": req.headers["device-token"],
      "device-type": req.headers["device-type"],
    };

    const option = {
      method: "post",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
      data: req.body,
    };
    // Forward the login request to Spring Boot
    const response = await axios(option);

    // Return the Spring Boot response to the frontend
    res.json({ data: response.data, status: response.status });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.get("/getBooks", async (req, res) => {
  const springBootApiUrl = "http://localhost:8081/v1/all/books"; // Replace with your Spring Boot API URL
  const headers = {
    "Content-Type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };
  try {
    const option = {
      method: "get",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
    };

    // Forward the login request to Spring Boot
    const response = await axios(option);
    // Return the Spring Boot response to the frontend
    res.json({ data: response.data.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.get("/download/:cover", async (req, res) => {
  // Retrieve the bookId from the URL parameters
  const cover = req.params.cover;
  const springBootApiUrl = `http://localhost:8081/v1/download/${cover}`; // Replace with your Spring Boot API URL

  try {
    const response = await axios.get(springBootApiUrl, {
      responseType: "arraybuffer", // Receive response as ArrayBuffer
    });

    res.set({
      "Content-Type": "image/jpeg", // Adjust content type based on your image type
      "Content-Length": response.data.length,
    });

    // Send the image data as the response
    res.end(Buffer.from(response.data, "binary"));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.get("/pdf/download/:newFilename", async (req, res) => {
  const newFilename = req.params.newFilename;
  const springBootApiUrl = "http://localhost:8081/v1/attachment/" + newFilename; // Replace with your Spring Boot API URL

  const headers = {
    "Content-Type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };
  try {
    const option = {
      method: "get",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
      responseType: "arraybuffer",
    };

    // Forward the login request to Spring Boot
    const response = await axios(option);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Encoding": "utf-8", // Change the encoding here
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.delete("/book/delete/:id", async (req, res) => {
  const bookId = req.params.id;
  const springBootApiUrl = "http://localhost:8081/v1/isDeleted/" + bookId; // Replace with your Spring Boot API URL
  const headers = {
    "content-type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };
  try {
    const option = {
      method: "delete",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
    };

    const response = await axios(option);
    // Return the Spring Boot response to the frontend
    res.json({ data: response.data, status: response.status });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.put("/book/restore/:id", async (req, res) => {
  const bookId = req.params.id;
  const springBootApiUrl = "http://localhost:8081/v1/restore/" + bookId; // Replace with your Spring Boot API URL
  const headers = {
    "content-type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };
  try {
    const option = {
      method: "put",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
    };

    const response = await axios(option);
    // Return the Spring Boot response to the frontend
    res.json({ data: response.data, status: response.status });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.get("/bookDetails/:id", async (req, res) => {
  const bookId = req.params.id; // Retrieve the bookId from the URL parameters
  const springBootApiUrl = `http://localhost:8081/v1/book/${bookId}`; // Replace with your Spring Boot API URL
  const headers = {
    "content-type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };
  try {
    const option = {
      method: "get",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
    };

    // Forward the login request to Spring Boot
    const response = await axios(option);
    // Return the Spring Boot response to the frontend
    res.json({ data: response.data.data, status: response.status });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});
app.get("/myprofileLoad", async (req, res) => {
  const springBootApiUrl = "http://localhost:8081/v1/account-info"; // Replace with your Spring Boot API URL

  const headers = {
    "Content-Type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };
  try {
    const option = {
      method: "get",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
    };

    // Forward the login request to Spring Boot
    const response = await axios(option);
    // Return the Spring Boot response to the frontend
    res.json({ data: response.data.data, status: response.status });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.put("/changeInfo", async (req, res) => {
  const springBootApiUrl = "http://localhost:8081/v1/changeInfo";
  const headers = {
    "Content-Type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };
  try {
    const option = {
      method: "put",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
      data: req.body,
    };

    // Forward the login request to Spring Boot
    const response = await axios(option);
    // Return the Spring Boot response to the frontend
    res.json({ data: response.data.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.put("/changePassword", async (req, res) => {
  const springBootApiUrl = "http://localhost:8081/v1/changePassword";
  const headers = {
    "Content-Type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };
  try {
    const option = {
      method: "put",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
      data: req.body,
    };

    // Forward the login request to Spring Boot
    const response = await axios(option);
    // Return the Spring Boot response to the frontend
    res.json({ data: response.data, status: response.status });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.put("/update/book/:id", async (req, res) => {
  const bookId = req.params.id;
  const springBootApiUrl = "http://localhost:8081/v1/update/books/" + bookId;
  const headers = {
    "Content-Type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };
  try {
    const option = {
      method: "put",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
      data: req.body,
    };

    // Forward the login request to Spring Boot
    const response = await axios(option);
    // Return the Spring Boot response to the frontend
    res.json({ data: response.data, status: response.status });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.put(
  "/update/image/:cover",
  fileUpload({ createParentPath: true }),
  async (req, res) => {
    const coverName = req.params.cover;
    const springBootApiUrl =
      "http://localhost:8081/v1/updates-image/" + coverName;
    console.log(coverName);
    const headers = {
      "content-type": "multipart/form-data",
      "access-token": req.headers["access-token"],
      "device-token": req.headers["device-token"],
      "device-type": req.headers["device-type"],
    };
    try {
      var fileBuffer = req.files.file.data;
      fileBuffer.name = req.files.file.name;
      const fd = new FormData();
      fd.append("file", req.files.file.data);
      const option = {
        method: "put",
        url: springBootApiUrl,
        headers: headers,
        validateStatus: function (status) {
          return status >= 200 && status < 500; // default
        },
        data: fd,
      };
      // Forward the login request to Spring Boot
      const response = await axios(option);

      // Return the Spring Boot response to the frontend
      res.json({ data: response.data, status: response.status });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request.",
      });
    }
  }
);

app.put(
  "/update/pdf/:file",
  fileUpload({ createParentPath: true }),
  async (req, res) => {
    const file = req.params.file;
    const springBootApiUrl = "http://localhost:8081/v1/updates-file/" + file;

    const headers = {
      "content-type": "multipart/form-data",
      "access-token": req.headers["access-token"],
      "device-token": req.headers["device-token"],
      "device-type": req.headers["device-type"],
    };

    try {
      var fileBuffer = req.files.file.data;
      fileBuffer.name = req.files.file.name;
      const fd = new FormData();
      fd.append("File", req.files.file.data);
      const option = {
        method: "put",
        url: springBootApiUrl,
        headers: headers,
        validateStatus: function (status) {
          return status >= 200 && status < 500; // default
        },
        data: fd,
      };
      // Forward the login request to Spring Boot
      const response = await axios(option);

      // Return the Spring Boot response to the frontend
      res.json({ data: response.data, status: response.status });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request.",
      });
    }
  }
);

app.post(
  "/upload/image",
  fileUpload({ createParentPath: true }),
  async (req, res) => {
    const springBootApiUrl = "http://localhost:8081/v1/upload-image";

    const headers = {
      ImageType: "BOOK_COVER",
      "content-type": "multipart/form-data",
      "access-token": req.headers["access-token"],
      "device-token": req.headers["device-token"],
      "device-type": req.headers["device-type"],
    };

    try {
      var fileBuffer = req.files.file.data;
      fileBuffer.name = req.files.file.name;
      const fd = new FormData();
      fd.append("File", req.files.file.data);
      const option = {
        method: "post",
        url: springBootApiUrl,
        headers: headers,
        validateStatus: function (status) {
          return status >= 200 && status < 500; // default
        },
        data: fd,
      };
      // Forward the login request to Spring Boot
      const response = await axios(option);

      // Return the Spring Boot response to the frontend
      res.json({ data: response.data, status: response.status });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request.",
      });
    }
  }
);

app.post(
  "/upload/file",
  fileUpload({ createParentPath: true }),
  async (req, res) => {
    const springBootApiUrl = "http://localhost:8081/v1/upload-file";

    const headers = {
      FileTypes: "BOOK",
      "content-type": "multipart/form-data",
      "access-token": req.headers["access-token"],
      "device-token": req.headers["device-token"],
      "device-type": req.headers["device-type"],
    };

    try {
      var fileBuffer = req.files.file.data;
      fileBuffer.name = req.files.file.name;
      const fd = new FormData();
      fd.append("File", req.files.file.data);
      const option = {
        method: "post",
        url: springBootApiUrl,
        headers: headers,
        validateStatus: function (status) {
          return status >= 200 && status < 500; // default
        },
        data: fd,
      };
      // Forward the login request to Spring Boot
      const response = await axios(option);

      // Return the Spring Boot response to the frontend
      res.json({ data: response.data, status: response.status });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request.",
      });
    }
  }
);

app.post("/create/book", async (req, res) => {
  try {
    // Replace with your Spring Boot API endpoint
    const springBootApiUrl = "http://localhost:8081/v1/createBook";

    const headers = {
      "Content-Type": "application/json",
      "access-token": req.headers["access-token"],
      "device-token": req.headers["device-token"],
      "device-type": req.headers["device-type"],
    };

    const option = {
      method: "post",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
      data: req.body,
    };
    // Forward the login request to Spring Boot
    const response = await axios(option);

    // Return the Spring Boot response to the frontend
    res.json({ data: response.data, status: response.status });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while processing your request.",
    });
  }
});

app.post(
  "/bulk/upload/image",
  fileUpload({ createParentPath: true }),
  async (req, res) => {
    const springBootApiUrl = "http://localhost:8081/v1/multiple/upload-image";

    const headers = {
      ImageType: "BOOK_COVER",
      "content-type": "multipart/form-data",
      "access-token": req.headers["access-token"],
      "device-token": req.headers["device-token"],
      "device-type": req.headers["device-type"],
    };

    try {
      const fd = new FormData();
      for (let key of Object.keys(req.files)) {
        fd.append("Files", req.files[key].data, req.files[key].name);
      }

      const option = {
        method: "post",
        url: springBootApiUrl,
        headers: headers,
        validateStatus: function (status) {
          return status >= 200 && status < 500; // default
        },
        data: fd,
      };
      // Forward the login request to Spring Boot
      const response = await axios(option);

      // Return the Spring Boot response to the frontend
      res.json({ data: response.data, status: response.status });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request.",
      });
    }
  }
);

app.post(
  "/bulk/upload/file",
  fileUpload({ createParentPath: true }),
  async (req, res) => {
    const springBootApiUrl = "http://localhost:8081/v1/multiple/upload-files";

    const headers = {
      FileTypes: "BOOK",
      "content-type": "multipart/form-data",
      "access-token": req.headers["access-token"],
      "device-token": req.headers["device-token"],
      "device-type": req.headers["device-type"],
    };

    try {
      const fd = new FormData();
      for (let key of Object.keys(req.files)) {
        fd.append("Files", req.files[key].data, req.files[key].name);
      }

      const option = {
        method: "post",
        url: springBootApiUrl,
        headers: headers,
        validateStatus: function (status) {
          return status >= 200 && status < 500; // default
        },
        data: fd,
      };
      // Forward the login request to Spring Boot
      const response = await axios(option);

      // Return the Spring Boot response to the frontend
      res.json({ data: response.data, status: response.status });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request.",
      });
    }
  }
);

app.post(
  "/bulk/upload/csv",
  fileUpload({ createParentPath: true }),
  async (req, res) => {
    const springBootApiUrl = "http://localhost:8081/v1/bulk/upload";

    const headers = {
      "content-type": "multipart/form-data",
      "access-token": req.headers["access-token"],
      "device-token": req.headers["device-token"],
      "device-type": req.headers["device-type"],
    };

    try {
      var fileBuffer = req.files.file.data;
      fileBuffer.name = req.files.file.name;
      const fd = new FormData();
      fd.append("File", req.files.file.data);
      const option = {
        method: "post",
        url: springBootApiUrl,
        headers: headers,
        validateStatus: function (status) {
          return status >= 200 && status < 500; // default
        },
        data: fd,
      };
      // Forward the login request to Spring Boot
      const response = await axios(option);

      // Return the Spring Boot response to the frontend
      res.json({ data: response.data, status: response.status });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request.",
      });
    }
  }
);
app.get("/get/modules", async (req, res) => {
  const headers = {
    "content-type": "application/json",
    "access-token": req.headers["access-token"],
    "device-token": req.headers["device-token"],
    "device-type": req.headers["device-type"],
  };
  try {
    let modules = [
      {
        name: "Books",
        path: "books-link",
        isSuperAdmin: false,
        icon: "bi bi-book",
        class: "nav_link active",
      },
      {
        name: "Super Admins",
        path: "super-admin-link",
        isSuperAdmin: true,
        icon: "bx-user",
        class: "nav_link",
      },
      {
        name: "Admins",
        path: "admin-link",
        isSuperAdmin: true,
        icon: "bi bi-people-fill",
        class: "nav_link",
      },
      {
        name: "Category",
        path: "category-link",
        isSuperAdmin: false,
        icon: "bi bi-tags-fill",
        class: "nav_link",
      },
      {
        name: "Book Upload",
        path: "book-upload-link",
        isSuperAdmin: false,
        icon: "bi bi-cloud-arrow-up",
        class: "nav_link",
      },
      {
        name: "Bulk Book Upload",
        path: "bulk-book-link",
        isSuperAdmin: false,
        icon: "bi bi-file-arrow-up-fill",
        class: "nav_link",
      },
      {
        name: "My Account",
        path: "account-link",
        isSuperAdmin: false,
        icon: "bi bi-person-badge-fill",
        class: "nav_link",
      },
    ];

    const springBootApiUrl = "http://localhost:8081/v1/isSuperAdmin";
    const option = {
      method: "GET",
      url: springBootApiUrl,
      headers: headers,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // default
      },
    };
    const response = await axios(option);

    let fModules = [];
    for (module of modules) {
      if (!module.isSuperAdmin || response.data.data.isSuperAdmin) {
        fModules.push({
          name: module.name,
          path: module.path,
          icon: module.icon,
          class: module.class,
        });
      }
    }
    res.status(200).json({ data: fModules });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});
