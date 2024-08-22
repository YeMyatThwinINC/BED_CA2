document.addEventListener("DOMContentLoaded", function () {
    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
      if (responseStatus == 201) {
        // Check if login was successful
        window.location.href = "index.html";
      } else {
        warningCard.classList.remove("d-none");
        warningText.innerText = responseData.message;
      }
    };
  
    const createTaskForm = document.getElementById("createTaskForm");
  
    const warningCard = document.getElementById("warningCard");
    const warningText = document.getElementById("warningText");
  
    createTaskForm.addEventListener("submit", function (event) {
      console.log("createTaskForm.addEventListener");
      event.preventDefault();
  
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const points = document.getElementById("points").value;
  
      const data = {
        title: title,
        description: description,
        points: points
      };
      // Perform login request
      fetchMethod(currentUrl + "/api/task", callback, "POST", data);
  
      // Reset the form fields
      createTaskForm.reset();
    });
  });