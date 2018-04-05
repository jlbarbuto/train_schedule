// Initialize Firebase ==============================
var config = {
    apiKey: "AIzaSyA1XQG3ckziaMJYP81fTeUiiK_pgG2uG4A",
    authDomain: "train-schedule-bcb78.firebaseapp.com",
    databaseURL: "https://train-schedule-bcb78.firebaseio.com",
    projectId: "train-schedule-bcb78",
    storageBucket: "train-schedule-bcb78.appspot.com",
    messagingSenderId: "661422909433"
  };
  firebase.initializeApp(config);

// Variables =========================================
var database = firebase.database();

// Functions =========================================


// Main Process ======================================

// Submit click stores user input to the object newTrain, pushes the object to firebase, and clears the inputs
$("#add-train-btn").on("click", function(event){
    event.preventDefault();

    var trainName = $("#name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainFirst = $("#first-train-input").val().trim();
    var trainFrequency = $("#rate-input").val().trim();

    var newTrain = {
        name: trainName,
        destination: trainDestination,
        time: trainFirst,
        frequency: trainFrequency
    };

    database.ref().push(newTrain);

    $("#name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#rate-input").val("");

});

database.ref().on("child_added", function(child, prevChildKey){
    var trainName = child.val().name;
    var trainDestination = child.val().destination;
    var trainFirst = child.val().time;
    var trainFrequency = child.val().frequency;

    //math to get minutes until next train and next train's time
    var hours = trainFirst.substring(0,2);
    var minutes = trainFirst.substring(3,5);
    var seconds = (hours*60*60) + (minutes*60);
  
    var firstUnix = moment().startOf('day').format('X');
    firstUnix = parseInt(firstUnix);
    firstUnix = firstUnix + seconds;
    var currentUnix = moment().unix();
    console.log(firstUnix, currentUnix);

    var diff = currentUnix - firstUnix;
    if (diff<=0){
        var timeLeft = Math.ceil((firstUnix - currentUnix)/60);
        trainMinUntil = timeLeft;
        trainNext = trainFirst;
    } else{
        var remain = diff % (trainFrequency*60);
        remain = Math.ceil(remain/60);
        console.log(remain);

        var trainMinUntil = trainFrequency - remain;
        var trainNext = moment().add(trainMinUntil, 'm').format("HH:mm");
        console.log(trainMinUntil);
        console.log(trainNext);
    };

    


    console.log(trainName, trainDestination, trainFirst, trainFrequency);

    $("#train-table").append(
        `<tr>
            <td>${trainName}</td>
            <td>${trainDestination}</td>
            <td>${trainFirst}</td>
            <td>${trainFrequency}</td>
            <td>${trainNext}</td>
            <td>${trainMinUntil}</td>
        </tr>`);
});