<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $phone = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
    $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
    $message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);

    $email_content = "Телефон: $phone\n";
    $email_content .= "Імʼя: $name\n";
    $email_content .= "Повідомлення: $message\n";

    $headers = "From: TopBudTrade_website";

    $success = mail('topbudtrade1@gmail.com', 'Нове зверенення клієнта', $email_content, $headers);

    if ($success) {
        echo "Thank you for your message. We will contact you shortly.";
    } else {
        echo "Oops! Something went wrong. Please try again.";
    }
}
