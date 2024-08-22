let decodedUserId;

const tokenCallback = (responseStatus, responseData) => {
  console.log("responseStatus:", responseStatus);
  console.log("responseData:", responseData);
  if (responseStatus == 200) {
    decodedUserId = responseData.userId;
  } else if (responseStatus == 401) {
    localStorage.removeItem("token");
  } else {
    alert(responseData.message);
  }
};

fetchMethod(currentUrl + "/api/jwt/verify", tokenCallback, "GET", null, localStorage.getItem("token"));

const callback = (responseStatus, responseData) => {
  console.log("responseStatus:", responseStatus);
  console.log("responseData:", responseData);

  const chatList = document.getElementById("chatList");
  responseData.forEach((message) => {
    const displayItem = document.createElement("div");
    displayItem.className = "col-12 p-2";
    if (message.user_id == decodedUserId) {
      displayItem.innerHTML = `
        <div class="scrollable-element" style="float: right">
          <h5 class="message-title">${message.username}</h5>
          <p class="message-text-profile">${message.message_text}</p>
          <button type="button" id="update-messageId${message.id}" class="btn btn-primary update" data-bs-toggle="modal" data-bs-target="#updateModal${message.id}">
            <img src="./img/edit_icon.png" alt="Update" style="width: 25px; height: 25px;">
          </button>
              <div class="modal fade" id="updateModal${message.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Update Message</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                  <div class="container">
                    <div class="row justify-content-center mt-3">
                      <div class="col-md-8 px-0 text-center">
                        <h3 class="mb-4 text-center">message ID: ${message.id}</h3>
                        <form id="updateMessageForm-${message.id}">
                          <div class="form-group pb-3 text-start">
                            <label for="updated_text">New Text</label>
                            <input type="text" class="form-control" id="updated_text" value="${message.message_text}" required>
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
          <a href="#" class="btn delete" id="delete-${message.id}">
            <img src="./img/delete_icon.png" alt="Delete" style="width: 25px; height: 25px;">
          </a>
        </div>
      `;
      chatList.appendChild(displayItem);
      const deleteButton = displayItem.querySelector(`#delete-${message.id}`);
      deleteButton.addEventListener("click", (event) => {
        event.preventDefault();
        const callbackForDelete = (responseStatus, responseData) => {
          console.log("responseStatus:", responseStatus);
          console.log("responseData:", responseData);
          if (responseStatus == 200) {
            // Reset the input field
            window.location.href = "globalChat.html";
            // Handle successful message creation (if needed)
          } else if (responseStatus == 401) {
            localStorage.removeItem("token");
            window.location.href = "globalChat.html";
          } else {
            alert(responseData.message);
          }
        };
        fetchMethod(
          currentUrl + "/api/message/" + message.id,
          callbackForDelete,
          "DELETE",
          null,
          localStorage.getItem("token")
        );
      });

      const updateButton = displayItem.querySelector(`#updateModal${message.id} .btn-primary`);
      if(updateButton) {
        updateButton.addEventListener("click", (event) => {
          event.preventDefault();
          const form = document.getElementById(`updateMessageForm-${message.id}`);
          const updated_text = form.querySelector("#updated_text").value; //error here fix later 
          const callbackForPut= (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
            if (responseStatus == 200) {
              // Reset the input field
              window.location.href = "globalChat.html";
              // Handle successful message creation (if needed)
            } else if (responseStatus == 401) {
              localStorage.removeItem("token");
              window.location.href = "globalChat.html";
            } else {
              alert(responseData.message);
            }
          };
          const data = {
            message_text: updated_text
          };
          fetchMethod(
            currentUrl + "/api/message/"+message.id,
            callbackForPut,
            "PUT",
            data,
            localStorage.getItem("token")
          );
        });
      }
    } else {
      displayItem.innerHTML = `
        <div class="scrollable-element">
          <h5 class="message-title">${message.username}</h5>
          <p class="message-text">${message.message_text}</p>
        </div>
      `;
      chatList.appendChild(displayItem);
    }
 
  });
};

fetchMethod(currentUrl + "/api/message", callback);
