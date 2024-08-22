const token = localStorage.getItem("token");
let decodedUserId;

const verifyCallBack = (verifyStatus, verifyData) => {
    console.log("verifyStatus", verifyStatus);
    if (verifyStatus == 200) {
      decodedUserId = verifyData.userId;
      localStorage.setItem("user_id", decodedUserId);
      showAll(decodedUserId);
    } else {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }
};


function showAll(decodedUserId) {
  
  const callbackForUserInfo = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
    
    const userInfo = document.getElementById("userInfo");
    
    if (responseStatus == 404) {
      userInfo.innerHTML = `${responseData.message}`;
      return;
    }
    
    userInfo.innerHTML = `
    <div class="row">
    <div class="card col-9">
    <div class="card-body">
    <p class="card-text">
    User ID: ${responseData.user_id} <br>
    Username: ${responseData.username} <br>
    Email: ${responseData.email} <br>
    </p>
    </div>
    </div>
    <div class="card col-3 d-flex align-items-center justify-content-center">
    <h5 class="card-title ">
    Points: ${responseData.points}
    </h5>
    </div>
    </div>
    `;
  };
  
  fetchMethod(currentUrl + `/api/users/${decodedUserId}`, callbackForUserInfo, "GET", null, token);
  
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
    
    const playerList = document.getElementById("heroList");
    playerList.innerHTML = '';
    responseData.forEach((user, i) => {
      const displayItem = document.createElement("div");
      displayItem.className = "col-xl-4 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
      displayItem.innerHTML = `
      <div class="card">
      <div class="card-body">
      <h5 class="card-title">Id: ${i + 1}</h5>
      <h5 class="card-title">${user.codename}</h5>
      <p class="card-text">
      power: ${user.power} <br>
      points_to_unlock: ${user.points_to_unlock} <br>
      weakness: ${user.weakness} <br>
      </p>
      <a href="singleUserInfo.html?user_id=${user.id}" class="btn btn-primary">View Details</a>
      </div>
      </div>
      `;
      playerList.appendChild(displayItem);
    });
  };
  
  fetchMethod( currentUrl + `/api/users/${decodedUserId}/hero`, callback, "GET", null, token);
};
fetchMethod(currentUrl + '/api/verify', verifyCallBack, "GET", null, token);