<?php
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$to_email = 'ваш_email@example.com'; 
$subject = 'Новый заказ';

$message = "Ім'я: {$data['name']}\n";
$message .= "Email: {$data['email']}\n";
$message .= "Телефон: {$data['tel']}\n";
$message .= "Регіон: {$data['region']}\n";
$message .= "Місто: {$data['city']}\n";
$message .= "Адреса: {$data['addresses']}\n";
$message .= "Спосіб доставки: {$data['shipping_method']}\n";
$message .= "Спосіб оплати: {$data['payment_method']}\n";
$message .= "Коментар: {$data['comment']}\n";

$message .= "\nПродукти:\n";
foreach ($data['products'] as $product) {
    $message .= "Номер: {$product['nomer']}, Назва: {$product['nazva']}, Ціна: {$product['cina']}, Кількість: {$product['count']}\n";
}

$headers = 'From: webmaster@example.com' . "\r\n" .
    'Reply-To: webmaster@example.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

if (mail($to_email, $subject, $message, $headers)) {
    echo json_encode(['status' => 'Ok']);
} else {
    echo json_encode(['status' => 'Error', 'message' => 'Помилка при надсиланні електронної пошти']);
}
?>