<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    require_once 'vendor/autoload.php';
    require_once 'classes/WatermarkGenerator.php';

    // Получаем файлы основной картинки и водяного знака
    $image = $_FILES['source-image'];
    $watermark = $_FILES['watermark-image'];

    // Получаем координаты
    $position_x = $_POST['position-x'];
    $position_y = $_POST['position-y'];
    // Получаем значение прозрачности
    $opacity = $_POST['opacity'];

    $wg = new WatermarkGenerator($image, $watermark, $position_x, $position_y, $opacity);
    $wg->process_image();
}

else {
    header("HTTP/1.1 302 Moved Temporarily");
    header("Location: /");
    exit;
}
