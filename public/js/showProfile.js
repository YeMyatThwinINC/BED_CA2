
let decodedUserId;
let elemunchiesCount;

const tokenCallback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
    if (responseStatus == 200) {
      decodedUserId = responseData.userId;
      console.log(decodedUserId);
      fetchUserInfo();
      fetchElementalUser();
      fetchProgress();
    } else if (responseStatus == 401) {
      localStorage.removeItem("token");
      window.location.href='login.html'; 
    } else {
      alert(responseData.message);
    }
  };
  
  const fetchUserInfo = () => {
    const callbackForUserInfo = (responseStatus, user) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", user);
  
      const userInfo = document.getElementById("userInfo");
      const pointInfo = document.getElementById("pointInfo");
  
  
      if (responseStatus == 404) {
        userInfo.innerHTML = `${user.message}`;
        return;
      }else if(responseStatus == 200){
        elemunchiesCount = user.Elemunchies;
        fetchForActiveElemental(user); 
      }
  
      userInfo.innerHTML = `
        <div class="card">
            <div class="card-body">
                <p class="card-text">
                  User ID: ${user.id}<br>
                  Username: ${user.username}<br>
                  Email: ${user.email}<br>
                  Active Elemental: ${user.active_elemental}<br>
                  Elemunchies: ${user.Elemunchies}<br>
                  Created on: ${user.created_on}<br>
                  Updated on: ${user.updated_on}<br>
                  Last Login on: ${user.last_login_on}<br>
                </p>
                <a href="index.html" class="btn btn-danger" id="delete-${user.id}">Delete</a>
            </div>
        </div>
      `;
      pointInfo.innerHTML= `
      <div class="card mt-3">
          <div class="card-body text-center p-2">
          <h5 class="card-title">Contributed Task Points</h5>
              <p class="card-text spotLight btn-custom-size">
              ${user.total_points !== undefined ? user.total_points : 0}
              </p>
          </div>
      </div>
      <div class="card mt-3">
            <div class="card-body text-center p-2 ">
            <h5 class="card-title ">Elemunchies
            <img class="logo" src="../img/icon_cookie.png" alt="logo" ></h5>
                <p class="card-text spotLight btn-custom-size">
                  ${user.Elemunchies}
                </p>
            </div>
        </div>

        <h5 class="card-title text-center mt-3">SHOP</h5>
        <div class="card mt-3">
            <div class="card-body text-center p-2 ">
            <h5 class="card-title text-center mt-3">Summon Elemental</h5>
                <a href="#" class="btn btn-primary" id="purchase"><p class="card-text btn-custom-size">
                200<img class="logo" src="../img/icon_cookie.png" alt="logo" >
              </p></a>
            </div>
        </div>
      `
      const purchaseButton = document.getElementById(`purchase`);
      purchaseButton.addEventListener("click", (event) => {
        event.preventDefault();

        if (elemunchiesCount < 200) {
            alert("Insufficient elemunchies. Please do more Tasks.");
            return;
          }
        const callbackForPurchase = (responseStatus, responseData) => {
          console.log("responseStatus:", responseStatus);
          console.log("responseData:", responseData);
          if (responseStatus == 201) {
            // Reset the input field
            window.location.href = "profile.html";
          } else if (responseStatus == 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
          } else {
            alert(responseData);
          }
        };
        fetchMethod(
          currentUrl + "/api/user/purchase",
          callbackForPurchase,
          "POST",
          null,
          localStorage.getItem("token")
        );
      });
      const deleteButton = document.getElementById(`delete-${user.id}`);
      deleteButton.addEventListener("click", (event) => {
        event.preventDefault();
        const callbackForDelete = (responseStatus, responseData) => {
          console.log("responseStatus:", responseStatus);
          console.log("responseData:", responseData);
          if (responseStatus == 204) {
            // Reset the input field
            localStorage.removeItem("token");
            window.location.href = "index.html";
            // Handle successful message creation (if needed)
          } else if (responseStatus == 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
          } else {
            alert(responseData);
          }
        };
        fetchMethod(
          currentUrl + "/api/user/" + user.id,
          callbackForDelete,
          "DELETE",
          null,
          localStorage.getItem("token")
        );
      });
    };
  
    if (decodedUserId) {
      fetchMethod(
        currentUrl + `/api/User/${decodedUserId}`,
        callbackForUserInfo
      );
    }
  };
  const fetchElementalUser = () => {  
    const callbackForElementalUser = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
    
    const elementalList = document.getElementById("elementalList");
    responseData.forEach((elemental) => {
      const displayItem = document.createElement("div");
      displayItem.className =
      "col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12";
      displayItem.innerHTML = `
      <div class="card">
          <img src="./img/${elemental.dex_num}.png">
          <div class="card-body element-${elemental.type}">
              <h5 class="card-title">${elemental.Elemental_name}</h5>
              <p class="card-text">
                  ID: ${elemental.id} <br>
                  Energy: ${elemental.energy} <br>
                  Type: ${elemental.type} <br>
                  Owner ID: ${elemental.Owner_id} <br>
                  Owner Name: ${elemental.Owner_name} <br>
              </p>
              <a href="#" class="btn btn-primary" id="equip-${elemental.id}">Equip</a>
          </div>
      </div>
      `;
  elementalList.appendChild(displayItem);
  const equipButton = document.getElementById(`equip-${elemental.id}`);
  equipButton.addEventListener("click", (event) => {
    event.preventDefault();
    const callbackForEquip = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
      if (responseStatus == 200) {
        window.location.href = "profile.html";
        // Handle successful message creation (if needed)
      } else if (responseStatus == 401) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
      } else {
        alert(responseData);
      }
    };
    fetchMethod(
      currentUrl + `/api/user/${elemental.Owner_id}/summon/${elemental.id}`,
      callbackForEquip,
      "PUT",
      null,
      localStorage.getItem("token")
    );
  });
    });
  }; 
  if (decodedUserId) {
    fetchMethod(
      currentUrl + `/api/elemental/user/${decodedUserId}`,
      callbackForElementalUser
    );
  }
  }; 
  const fetchForActiveElemental = (user) => {
    const callbackForActiveElemental = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        const activeObj = responseData;
        const activeElemental = document.getElementById("activeElemental");
    
        if (responseStatus == 404) {
            activeElemental.innerHTML = `${user.message}`;
          return;
        }
    
        activeElemental.innerHTML = `
          <div class="card element-${activeObj.type}">
          <img src="./img/${activeObj.dex_num}.png">
              <div class="card-body text-center">
              <h5 class="card-title">${activeObj.Elemental_name}</h5>
                  <p class="card-text">
                    Energy : ${activeObj.energy}<br>
              </div>
          </div>
          <button type="button" class="btn btn-primary feedd" data-bs-toggle="modal" data-bs-target="#feed"><p class="card-text btn-custom-size">
                Amount<img class="logo" src="../img/icon_cookie.png" alt="logo" >
            </button>

            <div class="modal fade" id="feed" tabindex="-1" aria-labelledby="feedModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="feedModalLabel">Feed Elemunchies</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <div class="container">
                    <div class="row justify-content-center mt-3">
                      <div class="col-md-8 px-0 text-center">
                        <form id="elemunchiesAmount">
                          <div class="form-group pb-3 text-start">
                            <label for="feedAmount">Amount</label>
                            <input type="number" class="form-control" id="feedAmount" required>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Feed</button>
                    </div>
                    </div>
                </div>
                </div>
        `;
        const feedButton = activeElemental.querySelector(`#feed .btn-primary`);
        feedButton.addEventListener("click", (event) => {
          event.preventDefault();
          const form = document.getElementById(`elemunchiesAmount`);
          const feedAmount = form.querySelector("#feedAmount").value;
          if(elemunchiesCount <= 0 || feedAmount>elemunchiesCount){
            alert("Please do more Tasks to Gain elemunchies.");
            return;
          }
          const callbackForPost= (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
            if (responseStatus == 200) {
              // Reset the input field
              alert("You have Feed "+ feedAmount);
              window.location.href = "profile.html";
              // Handle successful message creation (if needed)
            } else if (responseStatus == 401) {
              localStorage.removeItem("token");
              window.location.href = "login.html";
            } else {
              alert(responseData.message);
            }
          };
          const data = {
            Elemunchies: feedAmount,
            Elem_id: user.active_elemental,
          };
          fetchMethod(
            currentUrl + "/api/elemental/feed",
            callbackForPost,
            "POST",
            data,
            localStorage.getItem("token")
          );
        });


      };
    
      if (user.active_elemental) {
        fetchMethod(
          currentUrl + `/api/elemental/${user.active_elemental}`,
          callbackForActiveElemental
        );
      }
  };
  const fetchProgress = () => {
    const callbackForProgress = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
  
      const progressList = document.getElementById("progressList");
      responseData.forEach((progress) => {
        const displayItem = document.createElement("tr");
        displayItem.innerHTML = `
          <td scope="row">${progress.progress_id}</td>
          <td>${progress.task_id}</td>
          <td>${progress.title}</td>
          <td>${progress.points}</td>
          <td>${progress.completion_date}</td>
        `;
        progressList.appendChild(displayItem);
      });
    };
  
    fetchMethod(currentUrl + "/api/taskProgress/user/" + decodedUserId, callbackForProgress);
  };
  fetchMethod(
    currentUrl + "/api/jwt/verify",
    tokenCallback,
    "GET",
    null,
    localStorage.getItem("token")
  );

