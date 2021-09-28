import clock from "clock"; // needed to have a clock!
import document from "document"; // needed to access the labels used to display values
import { zeroPad, } from "../common/utils"; // import user function zeroPad
import { HeartRateSensor } from "heart-rate"; // import HR reading from sensor
import { battery } from "power"; // import battery level
import userActivity from "user-activity"; //adjusted types (matching the stats that you upload to fitbit.com, as opposed to local types)
import { today } from "user-activity";

// Update the clock every second
clock.granularity = "seconds"; 

// Get a handle on the <text> elements specified in the index.view file
const hourHandle = document.getElementById("hourLabel"); 
const minuteHandle = document.getElementById("minuteLabel");
const dayHandle = document.getElementById("dayLabel");
const dateHandle = document.getElementById("dateLabel");
const monthHandle = document.getElementById("monthLabel");
const batteryHandle = document.getElementById("batteryLabel");
const stepsHandle = document.getElementById("stepsLabel");
const activeMinutesHandle = document.getElementById("activeMinutesLabel")
const heartrateHandle = document.getElementById("heartrateLabel");
const amPmHandle = document.getElementById("amPmLabel");

//create day and month arrays
const dayNames = [`SUN`, `MON`, `TUE`, `WED`, `THU`, `FRI`, `SAT`];
const monthNames = [`JAN`,`FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`,`SEP`,`OCT`,`NOV`,`DEC`]

// The following block reads the heart rate from the watch
const hrm = new HeartRateSensor();

hrm.onreading = function() {
  heartrateHandle.text = `${hrm.heartRate}`; // the measured HR is being sent to the heartrateHandle
}
hrm.start();


// Update the <text> elements every tick with the current time
clock.ontick = (evt) => {
  const now = evt.date; // get the actual instant
  let hours = now.getHours(); // separate the actual hours from the instant "now"
  let mins = now.getMinutes(); // separate the actual minute from the instant "now"
  let date = now.getDate(); // seperate date from "now"
  let day = now.getDay(); // seperate day of the week from the instant "now"
  const dayName = dayNames[day]; // translate day number to day name by referencing dayNames array
  let month = now.getMonth(); // seperate month from the instant "now"
  const monthName = monthNames[month]; // translate month number to month name by referencing monthNames array
  const amPm; // to hold the AM or PM text
  if (hours > 12) {
      amPm = `PM`;
    } else {
      amPm = `AM`;
    }
  hours = hours % 12 || 12; // translates 24hr time to 12hr time
  let minsZeroed = zeroPad(mins); // one digit mins get a zero in front
  let dateZeroed = zeroPad(date); // one digit dates get a leading zero
  
  // assign the datetime data to the text handlers
  hourHandle.text = `${hours}`; 
  minuteHandle.text = `${minsZeroed}`; 
  dateHandle.text = `${dateZeroed}`; 
  dayHandle.text = `${dayName}`;
  monthHandle.text = `${monthName}`;
  amPmHandle.text = `${amPm}`;

  
  // Get battery value and assign it to the text handler
  let batteryValue = battery.chargeLevel; 
  batteryHandle.text = `Batt: ${batteryValue} %`; 
  
  // Get activity values and assign to text handlers
  let stepsValue = (today.adjusted.steps || 0); 
  stepsHandle.text = stepsValue;
  let activeMinutesValue = today.adjusted.activeZoneMinutes.total;
  activeMinutesHandle.text = activeMinutesValue;  
 
  // Get water consumption values
  //GET https://api.fitbit.com/1/user/-/foods/log/water.json //getter for water consumption
  
}
