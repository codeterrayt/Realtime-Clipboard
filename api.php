<?php

require './db.php';
session_start();

function generateUserId()
{
    $id = uniqid();
    return $id;
}

function setUserId($user_unique_id)
{
    if (!userId_exists()) {
        $_SESSION['user_unique_id'] = $user_unique_id;
    }
    return $_SESSION['user_unique_id'];
}


function getUserId()
{
    if (userId_exists()) {
        return $_SESSION['user_unique_id'];
    } else {
        return setUserId(generateUserId());
    }
}


function userId_exists()
{
    if (isset($_SESSION['user_unique_id'])) {
        return true;
    } else {
        return false;
    }
}

// echo getUserId();

function generateURL()
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';

    for ($i = 0; $i < 10; $i++) {
        $index = rand(0, strlen($characters) - 1);
        $randomString .= $characters[$index];
    }
    return $randomString;
}

if (isset($_GET['action'])) {
    $action = $_GET['action'];

    if ($action == 'create_clipboard' && isset($_GET['note_title']) && isset($_GET['data'])) {
        $data = nl2br($_GET['data']);
        $note_title = nl2br($_GET['note_title']);
        $url = generateURL();
        if(userId_exists()){
            $u_id = getUserId();
        }else{
            $u_id = setUserId(generateUserId());
        }
        
        $sql = "INSERT INTO $TABLE(`unique_url`,`data`,`u_id`,`note_title`) 
                VALUES('$url', '$data', '$u_id','$note_title')";
        $result = mysqli_query($con, $sql) or die("Error: " . mysqli_error($con));

        if ($result) {
            echo json_encode([
                'status' => 'success',
                'url' => $url,
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
            ]);
        }

    } else if ($action == "get_clipboard" && isset($_GET['url'])) {
        $url = $_GET['url'];
        $sql = "SELECT * FROM $TABLE WHERE `unique_url` = '$url'";
        $result = mysqli_query($con, $sql);

        if ($result) {
            if(mysqli_num_rows($result) > 0){
                $row = mysqli_fetch_assoc($result);
                $creator = False;
                if($row['u_id'] == getUserId()){
                    $creator = True;
                }

                echo json_encode([
                    'status' => 'success',
                    'data' => $row['data'],
                    "note_title"=> $row['note_title'],
                    "creator" => $creator
                ]);
            }else{
                echo json_encode([
                    'status' => 'error',
                ]);
            }
        }else {
            echo json_encode([
                'status' => 'error',
            ]);
        }

    } else if ($action == "update_clipboard" && isset($_GET['url']) && isset($_GET['data'])) {
        $url = $_GET['url'];
        $data = nl2br($_GET['data']);
        $u_id = getUserId();
        $sql = "SELECT * FROM $TABLE WHERE `unique_url` = '$url' and `u_id` = '$u_id'";
        $result = mysqli_query($con, $sql) or dir(mysqli_error($con));

        if($result){
            if(mysqli_num_rows($result) > 0){
                // $data = str_replace("'", "\'", $data);
                $sql = "UPDATE $TABLE SET `data` = '$data' WHERE `unique_url` = '$url' and `u_id` = '$u_id'";
                $result = mysqli_query($con, $sql);
                if($result){
                    echo json_encode([
                        'status' => 'success',
                    ]);
                }else{
                    echo json_encode([
                        'status' => 'error',
                    ]);
                }
            }else{
                echo json_encode([
                    'status' => 'error',
                ]);
            }
        }

    }
    else if ($action == "update_title" && isset($_GET['url']) && isset($_GET['title'])) {
        $url = $_GET['url'];
        $title = nl2br($_GET['title']);
        $u_id = getUserId();
        $sql = "SELECT * FROM $TABLE WHERE `unique_url` = '$url' and `u_id` = '$u_id'";
        $result = mysqli_query($con, $sql) or dir(mysqli_error($con));

        if($result){
            if(mysqli_num_rows($result) > 0){
                $sql = "UPDATE $TABLE SET `note_title` = '$title' WHERE `unique_url` = '$url' and `u_id` = '$u_id'";
                $result = mysqli_query($con, $sql);
                if($result){
                    echo json_encode([
                        'status' => 'success',
                    ]);
                }else{
                    echo json_encode([
                        'status' => 'error',
                    ]);
                }
            }else{
                echo json_encode([
                    'status' => 'error',
                ]);
            }
        }

    }
    
    else if($action == "fetch_clipboards"){
        if(userId_exists()){
            $u_id = getUserId();
            $sql = "SELECT * FROM $TABLE WHERE `u_id` = '$u_id'";
            $result = mysqli_query($con, $sql) or die(mysqli_error($con));
            if($result){
                $clipboards = [];
                while($row = mysqli_fetch_assoc($result)){
                    $clipboards[] = $row;
                }
                echo json_encode([
                    'status' => 'success',
                    'clipboards' => $clipboards
                ]);
            }else{
                echo json_encode([
                    'status' => 'error',
                ]);
            }
        }
    }else if($action == "delete_clipboard" && isset($_GET['d_id'])){
        if(userId_exists()){
            $u_id = getUserId();
            $d_id = intval($_GET['d_id']);
            $sql = "DELETE FROM $TABLE WHERE `d_id` = $d_id and `u_id` = '$u_id'";
            $result = mysqli_query($con, $sql) or die(mysqli_error($con));
            if($result){
                echo json_encode([
                    'status' => 'success',
                ]);
            }else{
                echo json_encode([
                    'status' => 'error',
                ]);
            }
        }
    }else if($action == "delete_all_clipboards"){
        if(userId_exists()){
            $u_id = getUserId();
            $sql = "DELETE FROM $TABLE WHERE `u_id` = '$u_id'";
            $result = mysqli_query($con, $sql) or die(mysqli_error($con));
            if($result){
                echo json_encode([
                    'status' => 'success',
                ]);
            }else{
                echo json_encode([
                    'status' => 'error',
                ]);
            }
        }
    }else if($action == "get_user_id"){
        if(userId_exists()){
            echo json_encode([
                'status' => 'success',
                'user_id' => getUserId()
            ]);
        }
    }else if($action == "logout"){
        session_destroy();
        echo setUserId(generateUserId());
    }else if($action == "login" && isset($_GET['user_id'])){
        if(strlen($_GET['user_id']) > 0){
            setUserId($_GET['user_id']);
        }else{
            setUserId(generateUserId());
        }
        echo json_encode([
            'status' => 'success',
        ]);
    }else if($action == "login_as_guest"){
        setUserId(generateUserId());
        echo json_encode([
            'status' => 'success',
            'user_id' => getUserId()
        ]);
    }
    else {
        echo json_encode([
            'status' => 'error',
            'message' => 'No action specified'
        ]);
    }
}
