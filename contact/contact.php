<?php
// if( isset($_POST['name']) && isset($_POST['email']) && isset($_POST['tel']) && isset($_POST['message']) ){
if( isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message']) ){
	$name = $_POST['name'];
	$email = $_POST['email'];
	//$tel = $_POST['tel'];    
	$message = nl2br($_POST['message']);
	
	$to = "kulcsarrudolf@gmail.com";	
	$from = $email;
	$subject = 'New message - '.$name;
	// $message = '<b>Name:</b> '.$name.' <br><b>Email:</b> '.$email.'<br><b>Tel:</b> '.$tel.'<br><br> <p>'.$message.'</p>';
	$message = '<b>Name:</b> '.$name.' <br><b>Email:</b> '.$email.'<br><br> <p>'.$message.'</p>';

	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
	$headers .= 'From: "My Website Contact Form" <'.$from.'>' . "\r\n";
	$headers .= "Reply-To: ".$to."\r\n";
	$headers .= "Return-Path: ".$to."\r\n";

	echo $to;
	echo $subject;
	echo $message;
	echo $headers;

	if(mail($to, $subject, $message, $headers)){
		echo '<p class="err">Message sent!</p>';
	} else {
		echo '<p class="err">Error!</p>';
	}
}
?>