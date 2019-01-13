var config = {
    apiKey: "AIzaSyCf2xrIEyFs5-UFPNDaWpgFRq2-v7mA2W8",
    authDomain: "train-579c7.firebaseapp.com",
    databaseURL: "https://train-579c7.firebaseio.com",
    projectId: "train-579c7",
    storageBucket: "train-579c7.appspot.com",
    messagingSenderId: "1006998576800"
};

firebase.initializeApp(config);
var database = firebase.database();


// Global Var
var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var timeAway = "";

// jQuery global variables
var TTrain = $("#train-name");
var TTrainDestination = $("#train-destination");
var TTrainTime = $("#train-time").mask("00:00");
var TTimeFrequency = $("#time-frequency").mask("00");

database.ref("/trains").on("child_added", function(snapshot) {

    //  local variables for firebase
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    // difference in time from current and the first train
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    // remainder of time
    trainRemainder = trainDiff % frequency;
    minutesTillArrival = frequency - trainRemainder;

    // find next train & convert to standard time format
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    // append table of trains
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();
    $("#table-data").on("click", "tr span", function() {
        console.log(this);
        var trainRef = database.ref("/trains/");
        console.log(trainRef);
    });
});

var storeInputs = function(event) {
    event.preventDefault();

    // store input values
    trainName = TTrain.val().trim();
    trainDestination = TTrainDestination.val().trim();
    trainTime = moment(TTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = TTimeFrequency.val().trim();

    // add to firebase
    database.ref("/trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        timeAway: timeAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    
    alert("Train added!");

    TTrain.val("");
    TTrainDestination.val("");
    TTrainTime.val("");
    TTimeFrequency.val("");
};

// Calls storeInputs when submit button clicked
$("#btn-add").on("click", function(event) {
    // empty alert
    if (TTrain.val().length === 0 || TTrainDestination.val().length === 0 || TTrainTime.val().length === 0 || TTimeFrequency === 0) {
        alert("Please fill out all details");
    } else {
        storeInputs(event);
    }
});


