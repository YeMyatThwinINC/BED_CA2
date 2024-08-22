const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const userList = document.getElementById("userList");
    responseData.forEach((user) => {
      const displayItem = document.createElement("div");
      displayItem.className =
        "col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 p-3";
      displayItem.innerHTML = `
          <div class="card">
              <div class="card-body">
                  <h5 class="card-title">${user.username}</h5>
                  <p class="card-text">
                      User ID: ${user.id} <br>
                      Username: ${user.username} <br>
                      Email: ${user.email} <br>
                      Active Elemental: ${user.active_elemental} <br>
                      Created On: ${user.created_on} <br>
                      Updated On: ${user.updated_on} <br>
                      Last Login On: ${user.last_login_on} <br>
                  </p>
                  <a href="singleUserInfo.html?user_id=${user.id}" class="btn btn-primary">View Details</a>
              </div>
          </div>
          `;
      userList.appendChild(displayItem);
    });
  };
  
  fetchMethod(currentUrl + "/api/user", callback);