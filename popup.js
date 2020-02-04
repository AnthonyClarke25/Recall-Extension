//load variable values defined in the background js page
var bg = chrome.extension.getBackgroundPage();
var recallcount = bg.recallcount;
var recallarray = bg.recallarray;
var todaycount = 0;
var overduecount = 0;
var upcomingcount = 0;
var includeupcoming = bg.upcoming;

window.onload = function loadrecalltable() {
    var todayhtml = "";
    var overduehtml = "";
    var upcominghtml = "";
    //Clear the previous value of the tables in options
    document.getElementById("recall-list-wrapper-today").innerHTML = todayhtml;
    document.getElementById("recall-list-wrapper-overdue").innerHTML = overduehtml;
    document.getElementById("recall-list-wrapper-upcoming").innerHTML = upcominghtml;

    recallarray.forEach(function(recall, i) {
        var startofday = moment().startOf('day');
        var endofday = moment().endOf('day');
        var recalldatepart = moment("" + recall.RecallDate.slice(0, 10) + "");
        console.log("the day starts at" + startofday);

        //based on the array we carry over from background js we then split it to today, upcoming , overdue
        if (recalldatepart >= startofday && recalldatepart <= endofday) {

            document.getElementById("recall-date-today").innerHTML = "Today";
            todayhtml += `
    <a target="_blank" style="border-left: 5px solid rgb(${recall.Red}, ${recall.Green}, ${recall.Blue});" href="https://crm.prospect365.com/view/${recall.ObjectType}/${recall.ObjectId}" class='recall'>
    <img src="images/${recall.ObjectType}.svg" class="recall-icon">
    <div class="item-detail ellipsis-parent">
      <h2 title="${recall.LeadDescription}">${recall.LeadDescription}</h2>
      <div class="detail-extra">
        <span title="${recall.RecallDate.slice(0,10)}" class="recall-date">${recall.RecallDate.slice(0, 10)}</span>
        <span title="${recall.Forename} ${recall.Surname} | ${recall.DivisionName}" class="recall-related-contact">${recall.Forename} ${recall.Surname} | ${recall.DivisionName}</span>
      </div>
    </div>
    </a>`;
            todaycount = todaycount + 1;

        } else if (recalldatepart < startofday) {

            document.getElementById("recall-date-overdue").innerHTML = "Overdue";
            overduehtml += `
    <a target="_blank" style="border-left: 5px solid rgb(${recall.Red}, ${recall.Green}, ${recall.Blue});" href="https://crm.prospect365.com/view/${recall.ObjectType}/${recall.ObjectId}" class='recall'>
    <img src="images/${recall.ObjectType}.svg" class="recall-icon">
    <div class="item-detail ellipsis-parent">
      <h2 title="${recall.LeadDescription}">${recall.LeadDescription}</h2>
      <div class="detail-extra">
        <span title="${recall.RecallDate.slice(0, 10)}" class="recall-date">${recall.RecallDate.slice(0, 10)}</span>
        <span title="${recall.Forename} ${recall.Surname} | ${recall.DivisionName}" class="recall-related-contact">${recall.Forename} ${recall.Surname} | ${recall.DivisionName}</span>
      </div>
    </div>
    </a>`;

            overduecount = overduecount + 1;

        } else if (recalldatepart > endofday) {

            document.getElementById("recall-date-upcoming").innerHTML = "Upcoming";
            upcominghtml += `
    <a target="_blank" style="border-left: 5px solid rgb(${recall.Red}, ${recall.Green}, ${recall.Blue});" href="https://crm.prospect365.com/view/${recall.ObjectType}/${recall.ObjectId}" class='recall'>
    <img src="images/${recall.ObjectType}.svg" class="recall-icon">
    <div class="item-detail ellipsis-parent">
      <h2 title="${recall.LeadDescription}">${recall.LeadDescription}</h2>
      <div class="detail-extra">
        <span title="${recall.RecallDate.slice(0, 10)}" class="recall-date">${recall.RecallDate.slice(0, 10)}</span>
        <span title="${recall.Forename} ${recall.Surname} | ${recall.DivisionName}" class="recall-related-contact">${recall.Forename} ${recall.Surname} | ${recall.DivisionName}</span>
      </div>
    </div>
    </a>`;
            upcomingcount = upcomingcount + 1;
        }

    });

    //based on if we decide to include the upcoming we we will include it in the count that is displayed
    if (includeupcoming === 0) {
        var totlacount = overduecount + todaycount;
    } else {
        var totlacount = overduecount + todaycount + upcomingcount;
    }
    document.getElementById("recall-list-wrapper-today").insertAdjacentHTML("beforeend", todayhtml);
    document.getElementById("recall-list-wrapper-overdue").insertAdjacentHTML("beforeend", overduehtml);
    document.getElementById("recall-list-wrapper-upcoming").insertAdjacentHTML("beforeend", upcominghtml);
    document.getElementById("recall-count").innerHTML = "Total Recalls " + totlacount;

};