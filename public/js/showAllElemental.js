const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const elementalList = document.getElementById("elementalList");
    responseData.forEach((elemental,index) => {
      const displayItem = document.createElement("div");
      displayItem.className =
        "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
      displayItem.innerHTML = `
      <h5 class="card-title text-center m-0 p-2 spotLight">TOP ${index+1}</h5>
          <div class="card">
              <img src="./img/${elemental.number}.png">
              <div class="card-body element-${elemental.type}">
                  <h5 class="card-title">${elemental.Elemental_name}</h5>
                  <p class="card-text">
                      ID: ${elemental.id} <br>
                      Energy: ${elemental.energy} <br>
                      Type: ${elemental.type} <br>
                      Owner ID: ${elemental.Owner_id} <br>
                  </p>
                  <a href="singleUserInfo.html?user_id=${elemental.Owner_id}" class="btn btn-primary">View Owner</a>
              </div>
          </div>
          `;
      elementalList.appendChild(displayItem);
    });
  };
  
  fetchMethod(currentUrl + "/api/elemental", callback);