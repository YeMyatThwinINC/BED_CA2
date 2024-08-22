const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const taskList = document.getElementById("taskList");
    tasks = responseData;
    responseData.forEach((task) => {
      const displayItem = document.createElement("div");
      displayItem.className =
        "col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 p-3";
      displayItem.innerHTML = `
        <div class="card">
          <div class="card-body text-center">
            <h5 class="card-title" style="font-weight: bold;">${task.title}</h5>
            <p class="card-text">
                ID: ${task.task_id} <br>
                Description: ${task.description} <br>
                Points: ${task.points} <br>
            </p>
            <div id="loginOnlyDiv-${task.task_id}">
              <button type="button" id="complete-taskId${task.task_id}" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#confirmModal${task.task_id}">
                Complete
              </button>
              <div class="modal fade" id="confirmModal${task.task_id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                  <div class="container">
                    <div class="row justify-content-center mt-5">
                      <div class="col-md-6 px-0 text-center">
                        <h3 class="mb-4 text-center">Task ID: ${task.task_id}</h3>
                        <h3 class="mb-4 text-center"><strong>${task.title}</strong></h3>
                        <form id="completeTaskForm-${task.task_id}">
                          <div class="form-group pb-3 text-start">
                            <label for="notes">Notes</label>
                            <input type="text" class="form-control" id="notes" required>
                          </div>
                          <div class="form-group pb-3 text-start">
                            <label for="Completion Date">Completion Date</label>
                            <input type="date" class="form-control" id="completion_date" required>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Confirm</button>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      `;
      taskList.appendChild(displayItem);
  
      // Show/hide loginOnlyDiv elements based on token
      const token = localStorage.getItem("token");
      const loginOnlyDiv = document.getElementById(`loginOnlyDiv-${task.task_id}`);
      if (loginOnlyDiv) {
        if (token) {
          loginOnlyDiv.classList.remove("d-none");
        } else {
          loginOnlyDiv.classList.add("d-none");
        }
      }
      const confirmButton = displayItem.querySelector(`#confirmModal${task.task_id} .btn-primary`);
      confirmButton.addEventListener("click", (event) => {
        event.preventDefault();
        const form = document.getElementById(`completeTaskForm-${task.task_id}`);
        const notes = form.querySelector("#notes").value;
        const completionDate = form.querySelector("#completion_date").value;
        const callbackForPost= (responseStatus, responseData) => {
          console.log("responseStatus:", responseStatus);
          console.log("responseData:", responseData);
          if (responseStatus == 201) {
            // Reset the input field
            alert(responseData.message);
            // Handle successful message creation (if needed)
          } else if (responseStatus == 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
          } else {
            alert(responseData.message);
          }
        };
        const data = {
          notes: notes,
          completion_date: completionDate,
          task_id: task.task_id,
        };
        fetchMethod(
          currentUrl + "/api/taskProgress",
          callbackForPost,
          "POST",
          data,
          localStorage.getItem("token")
        );
      });

    });
  };
  
  fetchMethod(currentUrl + "/api/task", callback);