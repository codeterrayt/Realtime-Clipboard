<?php 

$USERNAME = "root";
$PASSWORD = "";
$DATABASE = "realtime_clipboard_db";
$SERVER = "db";
$TABLE = "realtime_clipboard_table";

$con = mysqli_connect($SERVER, $USERNAME, $PASSWORD, $DATABASE) or die("Error: " . mysqli_error($con));


?>