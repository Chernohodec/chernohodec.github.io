<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получаем данные из формы
    $name = strip_tags(trim($_POST["name"]));
    $phone = strip_tags(trim($_POST["phone"]));
    // $acceptance = isset($_POST["acceptance"]) ? "Да" : "Нет";

    // Проверяем обязательные поля
    if (empty($name) || empty($phone)) {
        http_response_code(400);
        echo "Пожалуйста, заполните все обязательные поля.";
        exit;
    }

    // Email получателя (замените на свой)
    $to = "leva.shirokov@yandex.ru";

    // Тема письма
    $subject = "Новая заявка с сайта АВЗ";

    // Тело письма
    $message = "
    <html>
    <head>
        <title>Новая заявка</title>
    </head>
    <body>
        <h2>Данные заявки:</h2>
        <p><strong>Имя:</strong> $name</p>
        <p><strong>Телефон:</strong> $phone</p>
    </body>
    </html>
    ";

    // Заголовки письма
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    $headers .= "From: сайт <no-reply@вашсайт.com>\r\n";
    $headers .= "Reply-To: $name <no-reply@вашсайт.com>\r\n";

    // Отправка письма
    if (mail($to, $subject, $message, $headers)) {
        // Перенаправление после успешной отправки
        header("Location: index.html?form=sent#form-section");
        exit;
    } else {
        http_response_code(500);
        echo "Ошибка при отправке формы. Пожалуйста, попробуйте позже.";
    }
} else {
    // Если запрос не POST
    http_response_code(403);
    echo "Доступ запрещен";
}
