<?php
    ini_set( 'display_errors', 1 );
    error_reporting( E_ALL );
    if($_POST['phone']){
        $from = "pagina@gardenia-bar-cafe.com";
        $to = "contacto@gardenia-bar-cafe.com";
        $subject = "Necesito que me llamen";
        $message = "Llama a ".$_POST['name']." al ".$_POST['phone'];
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
  