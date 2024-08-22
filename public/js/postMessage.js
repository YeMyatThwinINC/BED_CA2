document.addEventListener("DOMContentLoaded", function () {
    const sendMessageButton = document.querySelector(".btn-custom-size");
    const createMessageText = document.getElementById("createMessageText");
  
    const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
      if (responseStatus == 201) {
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
  
    const sendMessage = () => {
      const message_text = createMessageText.value;
  
      const data = {
        message_text: message_text,
      };
      // Perform message creation request
      fetchMethod(currentUrl + "/api/message", callback, "POST", data, localStorage.getItem("token"));
    };
  
    sendMessageButton.addEventListener("click", function (event) {
      console.log("sendMessageButton.addEventListener");
  
      event.preventDefault(); // Prevent the form from submitting (if it's within a form)
  
      sendMessage();
    });
  
    createMessageText.addEventListener("keydown", function (event) {
      // Check if the Enter key is pressed (keyCode 13)
      if (event.keyCode === 13) {
        // Prevent form submission (if any)
        event.preventDefault();
  
        sendMessage();
      }
    });
  });