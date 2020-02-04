var savePat;
var saveEnv;
var includeupcoming = 0;

window.onload = function getenviroment() {
    let envdropdown = document.getElementById("enviroment");
    envdropdown.length = 0;

    let defaultOption = document.createElement("option");
    defaultOption.text = "Please select your enviroment";

    envdropdown.add(defaultOption);
    envdropdown.selectedIndex = 0;

    var enviroments = [{
            name: "Live",
            url: "https://api-batch-v1.prospect365.com"
        },
        {
            name: "QA",
            url: "https://api-batch-v1.prospect365-qa.com"
        },
        {
            name: "Dev",
            url: "https://api-batch-v1.prospect365-qa.com"
        }
    ];
    for (let i = 0; i < enviroments.length; i++) {
        envoption = document.createElement("option");
        envoption.text = enviroments[i].name;
        envoption.value = enviroments[i].url;
        envdropdown.add(envoption);
    }
};

//Decide if we should include upcoming in the extension


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("messageCheckbox").addEventListener("click", upcomingcheck);
});

console.log("default upcming value is" + includeupcoming);

function upcomingcheck() {

    var checkedValue = document.getElementById("messageCheckbox").checked;

    if (checkedValue === true) {
        includeupcoming = 1
    } else {
        includeupcoming = 0
    }


};

//save the selected usercode so chrome storage to be used in background.js file

document.addEventListener("DOMContentLoaded", function() {
    var saveEnvbutton = document.getElementById("saveEnv");
    saveEnvbutton.addEventListener("click", function() {
        saveEnv = document.getElementById("enviroment").value;
        savePat = document.getElementById("pat-token").value;
        getusers();

        console.log(
            "select user has a code of " + saveEnv + " and pat token is " + savePat
        );

        chrome.storage.sync.set({ enviroment: saveEnv, pat: savePat }),
            function() {
                close();
            };
    });

    var clearEnvButton = document.getElementById("clearenv");
    clearEnvButton.addEventListener("click", function() {
        saveEnv = "";
        savePat = "";
        getusers();
        console.log(
            "select user has a code of " + saveEnv + " and pat token is " + savePat
        );
        chrome.storage.sync.set({ enviroment: saveEnv, pat: savePat }),
            function() {
                close();
            };
    });

    var save = document.getElementById("saveUser");
    save.addEventListener("click", function() {
        let selectedUser = document.getElementById("Usercode").value;
        console.log("saved upcoming value is" + includeupcoming);
        console.log("select user has a code of " + selectedUser);
        chrome.storage.sync.set({ usercode: selectedUser, upcoming: includeupcoming }),
            function() {
                close();
            };
        chrome.extension.getBackgroundPage().window.location.reload()
    });

    var reset = document.getElementById("changeUser");
    reset.addEventListener("click", function() {
        chrome.storage.sync.get(["usercode", "enviroment", "pat"], function(user) {

            saveEnv = user.enviroment;
            savePat = user.pat;
        })
        getusers();
    });

    var clearuser = document.getElementById("clearUser");
    clearuser.addEventListener("click", function() {
        let selectedUser = "";
        console.log("select user has a code of " + selectedUser);
        chrome.storage.sync.set({ usercode: selectedUser }),
            function() {
                close();
            };
    });
});


//generate a list of user in the database based on the results returned from the call to odata
async function getusers() {
    if (saveEnv == "" && savePat == "") {
        chrome.extension.getBackgroundPage().alert(
            "There are current no credntials saved for the extension to run.  Please Enter your Pat Token, choose the correct enviroment and hit the 'Save' button."
        );
    } else {
        const res = await fetch(
            saveEnv + "/Users?$select=UserCode,UserName&$filter=Obsolete%20eq%200", {
                headers: {
                    Authorization: "Bearer " + savePat
                }
            }
        );

        let dropdown = document.getElementById("Usercode");
        dropdown.length = 0;

        let defaultOption = document.createElement("option");
        defaultOption.text = "Please select user";

        dropdown.add(defaultOption);
        dropdown.selectedIndex = 0;

        let data = await res.json();
        for (let i = 0; i < data.value.length; i++) {
            option = document.createElement("option");
            option.text = data.value[i].UserName;
            option.value = data.value[i].UserCode;
            dropdown.add(option);
        }
    }
};