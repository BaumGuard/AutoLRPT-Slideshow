
/* Data definitions */

var sat_names = [
  "M2-3",
  "M2-4"
];

var day_times = [
  "daytime",
  "nighttime"
];

const Direction = {
  Next:			'Next',
  Previous:	'Previous',
  Start:		'Start',
  End:			'End',
  Slider:		'Slider',
  Box:			'Box'
};


/* Global variables */

var satellite = 	"";
var time_of_day = "";
var start_date = 	"";
var end_date = 		"";

var images_filtered_quantity;
var images_total_quantity;

var images = [];

var images_filtered = [];
var current_image = 1;
var current_image_path = "";

var url = "";

var ask_before_deleting = true;


/*--------------------------------------------------------------------*/
// General functions

async function initialize_page () {
  try {
    const response = await fetch('satimages.php');

    const data = await response.json();
    images = data.files;
  }
  catch (error) {
    console.log(error);
  }

  // Retrieving the URL parameters
  const url_parameters = new URLSearchParams(window.location.search);
  url = new URL(window.location.href);

  for (const [key, value] of url_parameters) {
    switch (key) {
      case "imageNr":
        if ( /^\d+$/.test(value) )
          current_image = parseInt(value);
        else
          console.log("Invalid URL parameter value for 'imageNr' : " + value + " (Must be an integer)");
        break;

      case "satellite":
        if ( sat_names.includes(value) )
          satellite = value;
        else
          console.log("Invalid URL parameter value for 'satellite' : " + value + " (Available satellites: " + sat_names + ")");
        break;

      case "time_of_day":
        if ( day_times.includes(value) )
          time_of_day = value;
        else
          console.log("Invalid URL parameter value for 'time_of_day' : " + value + " (Valid values: " + day_times + ")");
        break;

      case "start_date":
        if ( /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value) )
          start_date = Date.parse(value);
        else
          console.log("Invalid URL parameter value for 'start_date' : " + value + " (Must have the format YYYY-MM-DD)");
        break;

      case "end_date":
        if ( /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value) )
          end_date = Date.parse(value);
        else
          console.log("Invalid URL parameter value for 'end_date' : " + value + " (Must have the format YYYY-MM-DD)");
        break;

      case "date":
        if ( value == "today" ) {
          start_date = new Date();
          end_date = new Date();
        }
        else if ( value == "yesterday" ) {
          var yesterday = new Date();
          yesterday.setDate(d.getDate() - 1);

          start_date = yesterday;
          end_date = yesterday;
        }
        else {
          console.log("Invalid URL parameter value for 'date' : " + value + " (Valid values [today, yesterday])");
        }
        break;

      default:
        console.log("Unknown URL parameter '" + key + "'");
        break;
    }
  }

  prepare_image_list();
  current_image_path = images_filtered[current_image-1];

  set_html_items();

} // initialize_page


function get_control_inputs () {
  if ( document.getElementById("satellite").value != "all" )
    satellite = document.getElementById("satellite").value;
  else
    satellite = "";

  if ( document.getElementById("daytime").value != "all" )
    time_of_day = document.getElementById("daytime").value;
  else
    time_of_day = "";

  const null_date = new Date(0);

  if ( document.getElementById("start-date").value != null_date )
    start_date = document.getElementById("start-date").value;
  else
    start_date = "";

  if ( document.getElementById("end-date").value != null_date )
    end_date = document.getElementById("end-date").value;
  else
    end_date = "";

} // get_control_inputs


function set_html_items () {
  if (images_filtered_quantity > 0) {
    document.getElementById("current-image").innerHTML = current_image;
    document.getElementById("total").innerHTML = images_filtered_quantity;
    document.getElementById("filename").innerHTML = current_image_path;
    document.slide.src = current_image_path;
    document.getElementById("image-slider").max = images_filtered_quantity;
    document.getElementById("end-image").innerHTML = images_filtered_quantity;
    document.getElementById("image-slider").value = current_image;
    document.getElementById("input-field").value = current_image;

    if (satellite != "")
      document.getElementById("satellite").value = satellite;
    else
      document.getElementById("satellite").value = "all";

    if (time_of_day != "")
      document.getElementById("daytime").value = time_of_day;
    else
      document.getElementById("daytime").value = "all";

    document.getElementById("start-date").value = start_date;
    document.getElementById("end-date").value = end_date;

    url.searchParams.set("imageNr", current_image);

    if (satellite != "")
      url.searchParams.set("satellite", satellite);
    else
      url.searchParams.delete("satellite");

    if (time_of_day != "")
      url.searchParams.set("time_of_day", time_of_day);
    else
      url.searchParams.delete("time_of_day");


    const null_date = new Date(0);

    if ( start_date != null_date && start_date != "" )
      url.searchParams.set("start_date", start_date);
    else
      url.searchParams.delete("start_date");

    if ( end_date != null_date && end_date != "" )
      url.searchParams.set("end_date", end_date);
    else
      url.searchParams.delete("end_date");

    window.history.replaceState(null, null, url);
  }

  else {
    document.slide.src = "images/noimages.png";
    document.getElementById("filename").innerHTML = "";
    document.getElementById("current-image").innerHTML = "0";
    document.getElementById("total").innerHTML = "0";
    document.getElementById("image-slider").max = 0;
    document.getElementById("end-image").innerHTML = 0;
    document.getElementById("image-slider").value = 0;
    document.getElementById("input-field").value = 0;
  }
} // set_html_items


function change_image (direction) {
  switch (direction) {
    case Direction.Next:
      if (current_image < images_filtered_quantity)
        current_image++;
      else
        current_image = 1;
      break;

    case Direction.Previous:
      if (current_image > 1)
        current_image--;
      else
        current_image = images_filtered_quantity;
      break;

    case Direction.Start:
      current_image = 1;
      break;

    case Direction.End:
      current_image = images_filtered_quantity;
      break;

    case Direction.Slider:
      current_image = parseInt( document.getElementById("image-slider").value );
      break;

    case Direction.Box:
      if ( /^\d+$/.test( document.getElementById("input-field").value ) )
        current_image = parseInt( document.getElementById("input-field").value );
      else {
        current_image = 1;
        console.log("Invalid input for image number (Integer expected)");
      }
      break;
  }

  current_image_path = images_filtered[current_image-1];

  set_html_items();
} // change_image


function prepare_image_list () {

  images_filtered = [];

  for (const image of images) {
    if (
      matches_with_satellite(image) &&
      is_in_date_range(image) &&
      matches_with_time_of_day(image)
    )
    {
      images_filtered.push(image);
    }
  }

  images_filtered.sort();
  images_filtered.reverse();

  images_filtered_quantity = images_filtered.length;
} // prepare_image_list


async function delete_image () {
  var confirm = false;

  if (ask_before_deleting)
    confirm = window.confirm("Do you really want to delete "+current_image_path+"?");
  else
    confirm = true;

  if ( confirm ) {
    try {
      const response = await fetch('delete_file.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deleteFile: current_image_path })
      });

      const result = await response.json();

      if (response.ok) {
        alert("File deleted successfully!");

        const deleted_image_index = images.indexOf(current_image_path);

        if (deleted_image_index !== -1)
          images.splice(deleted_image_index, 1);

        prepare_image_list();
        current_image_path = images_filtered[current_image-1];
        set_html_items();
        images_total_quantity--;
      }
      else {
        alert("File deletion failed!");
      }
    }
    catch (error) {
      console.log(error);
    }
  }
} // delete_image

	/*-----------------------------------------------------------*/
	// Auxiliary functions

function convert_timestamp (timestamp) {
  let new_timestamp = "";
  new_timestamp += timestamp.substring(7+0,7+4);
  new_timestamp += '-';
  new_timestamp += timestamp.substring(7+4,7+6);
  new_timestamp += '-';
  new_timestamp += timestamp.substring(7+6,7+8);
  new_timestamp += 'T';
  new_timestamp += timestamp.substring(7+9,7+11);
  new_timestamp += ':';
  new_timestamp += timestamp.substring(7+11,7+13);
  new_timestamp += ':';
  new_timestamp += timestamp.substring(7+13,7+15);

  return new_timestamp;
} // convert_timestamp

function matches_with_satellite (satname) {
  return satname.includes(satellite);
} // matches_with_satellite

function is_in_date_range(timestamp) {
  var new_start_date = new Date(start_date);
  var new_end_date   = new Date(end_date);
  new_end_date.setDate(new_end_date.getDate()+1);
  timestamp = new Date( convert_timestamp(timestamp) );

  if (start_date == "" && end_date == "")
    return true;

  return (timestamp.getTime() >= new_start_date.getTime() && timestamp.getTime() < new_end_date.getTime());
} // is_in_date_range

function matches_with_time_of_day (filename) {
  var ts = new Date( convert_timestamp(filename) );

  var daytime_type;

  if (ts.getHours() > 5 && ts.getHours() <= 16)
    daytime_type = "daytime";
  else
    daytime_type = "nighttime";

  if (time_of_day == "")
    return true;

  return time_of_day.includes(daytime_type);
} // matches_with_time_of_day


/*-------------------------------------------------------------*/
// Frontend functions

function show_selected_value() {
  document.getElementById("input-field").value = document.getElementById("image-slider").value;
} // show_selected_value

function apply_date () {
  document.getElementById("end-date").value = document.getElementById("start-date").value;
} // apply_date

function set_date_to_today () {
  const date_today = new Date();

  var day = ("0" + date_today.getDate()).slice(-2);
  var month = ("0" + (date_today.getMonth() + 1)).slice(-2);
  var today = date_today.getFullYear()+"-"+(month)+"-"+(day);

  start_date = Date.parse( today );
  end_date = Date.parse( today );

  document.getElementById("start-date").value = today;
  document.getElementById("end-date").value = today;
} // set_date_to_today


function reset_filters () {
  document.getElementById("satellite").value = "all";
  document.getElementById("daytime").value = "all";
  document.getElementById("start-date").value = "";
  document.getElementById("end-date").value = "";
} // reset_filters

function set_ask_before_deleting () {
  ask_before_deleting = !ask_before_deleting;
  console.log(ask_before_deleting);
} // set_ask_before_deleting
