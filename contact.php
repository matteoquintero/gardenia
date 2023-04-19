<?php
    ini_set( 'display_errors', 1 );
    error_reporting( E_ALL );
    if($_POST['email']){
        $from = $_POST['email'];
        $to = "contacto@gardenia-bar-cafe.com";
        $subject = $_POST['subject'];
        $message = $_POST['name'].": ".$_POST['message'];
        $headers = "From:" . $from;
        $send_mail = mail($to,$subject,$message, $headers);
        if($send_mail){
            echo "success";
        }else{
            echo "error";
        }
    }else{
        echo "error";
    }
?>
  