var usercode;
var enviroment;
var upcoming;
var pat;
var recalls;
var recallarray;
var recallcount;

//set the saved enviroment variables 
chrome.storage.sync.get(["usercode", "enviroment", "pat", "upcoming"], function(user) {
    usercode = user.usercode;
    enviroment = user.enviroment;
    pat = user.pat;
    upcoming = user.upcoming;
    console.log(
        "enviroment is " + enviroment + "pat is " + pat + "usercode is" + usercode + "user upcoming" + upcoming
    );
    if (
        (enviroment == "" && pat == "") ||
        (typeof enviroment == "undefined" &&
            typeof pat == "undefined" &&
            typeof usercode == "undefined")
    ) {
        alert(
            "Please go to the 'options' menu on the extenstion and assign user credentials for this extension to use"
        );
    } else {

        //function to retrieved recalls via odata and the saved variables set in options
        async function recallinfo() {
            recallarray = [];


            if (upcoming === 1) {
                const res = await fetch(
                    enviroment +
                    "/Recalls?$expand=Notepad($select=Tags,NotepadId)&$select=Blue,DivisionName,Forename,Green,LeadDescription,NoTime,ObjectId,ObjectType,RecallDate,RecallTime,RecallUser,Red,Surname,Row,Notepad&$filter=RecallUser%20eq%20%27" +
                    (await usercode) +
                    "%27&$orderby=RecallDate%20desc,RecallTime%20desc&$top=50&$count=true", {
                        headers: {
                            Authorization: "Bearer " + pat + ""
                        }
                    }
                );

                data = await res.json();
                recallcount = data["@odata.count"];
                //Set the number of recalls to the badge number
                await chrome.browserAction.setBadgeText({ text: recallcount.toString() });
                await chrome.browserAction.setBadgeBackgroundColor({ color: "orange" });

            } else {
                const res = await fetch(
                    enviroment +
                    "/Recalls?$expand=Notepad($select=Tags,NotepadId)&$select=Blue,DivisionName,Forename,Green,LeadDescription,NoTime,ObjectId,ObjectType,RecallDate,RecallTime,RecallUser,Red,Surname,Row,Notepad&$filter=RecallDate le " +
                    new Date().toISOString().split("T")[0] +
                    "T23:00:00Z%20and%20RecallUser%20eq%20%27" +
                    (await usercode) +
                    "%27&$orderby=RecallDate%20desc,RecallTime%20desc&$top=50&$count=true", {
                        headers: {
                            Authorization: "Bearer " + pat + ""
                        }
                    }
                );
                data = await res.json();
                recallcount = data["@odata.count"];
                //Set the number of recalls to the badge number
                await chrome.browserAction.setBadgeText({ text: recallcount.toString() });
                await chrome.browserAction.setBadgeBackgroundColor({ color: "orange" });

            }

            for (let i = 0; i < data.value.length; i++) {
                recallobject = {};
                recallobject.LeadDescription = data.value[i].LeadDescription;
                recallobject.ObjectType = data.value[i].ObjectType;
                recallobject.ObjectId = data.value[i].ObjectId;
                recallobject.Forename = data.value[i].Forename;
                recallobject.Surname = data.value[i].Surname;
                recallobject.DivisionName = data.value[i].DivisionName;
                recallobject.RecallDate = data.value[i].RecallDate;
                recallobject.Red = data.value[i].Red;
                recallobject.Green = data.value[i].Green;
                recallobject.Blue = data.value[i].Blue;
                recallarray.push(recallobject);
            }
        }

        recallinfo();
        chrome.alarms.create("refresh", { periodInMinutes: 2 });

        chrome.alarms.onAlarm.addListener(alarm => {
            console.log(alarm.name); // refresh
            recallinfo();
        });
    }
});