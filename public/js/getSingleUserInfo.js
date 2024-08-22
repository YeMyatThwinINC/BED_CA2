document.addEventListener("DOMContentLoaded", function () {
    url = new URL(document.URL);
    const urlParams = url.searchParams;
    const userId = urlParams.get("user_id");
  
    const callbackForUserInfo = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
  
      const userInfo = document.getElementById("userInfo");
  
      if (responseStatus == 404) {
        playerInfo.innerHTML = `${responseData.message}`;
        return;
      }
  
      userInfo.innerHTML = `
          <div class="card">
              <div class="card-body">
                  <p class="card-text">
                    User ID: ${responseData.id} <br>
                    Username: ${responseData.username} <br>
                    Email: ${responseData.email} <br>
                    Active Elemental: ${responseData.active_elemental} <br>
                    Created On: ${responseData.created_on} <br>
                    Updated On: ${responseData.updated_on} <br>
                    Last Login On: ${responseData.last_login_on} <br>
                  </p>
              </div>
          </div>
      `;
    };
  
    const callbackForElementalUser = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);
      
      const elementalList = document.getElementById("elementalList");
      responseData.forEach((elemental) => {
        const displayItem = document.createElement("div");
        displayItem.className =
        "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
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
            </div>
        </div>
        `;
    elementalList.appendChild(displayItem);
      });
    };
    
    fetchMethod(currentUrl + `/api/user/${userId}`, callbackForUserInfo);
    fetchMethod(currentUrl + `/api/elemental/user/${userId}`, callbackForElementalUser);
  });