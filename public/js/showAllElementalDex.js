const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const elementalDexList = document.getElementById("elementalDexList");
    responseData.forEach((elemental) => {
      const displayItem = document.createElement("div");
      displayItem.className =
        "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
      displayItem.innerHTML = `
          <div class="card">
              <img src="./img/${elemental.number}.png">
              <div class="card-body element-${elemental.type}">
                  <h5 class="card-title">${elemental.name}</h5>
                  <p class="card-text">
                      Number: ${elemental.number} <br>
                      Type: ${elemental.type} <br>
                  </p>
              </div>
          </div>
          `;
      elementalDexList.appendChild(displayItem);
    });
  };
  
  fetchMethod(currentUrl + "/api/Dex", callback);