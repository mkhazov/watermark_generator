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
    // Значение прозрачности
    $opacity = $_POST['opacity'];

    $mode = $_POST['mode'];

    $margin_x = NULL;
    $margin_y = NULL;
    if ($mode == 'grid') {
        // Значения отступов
        $margin_x = $_POST['margin-x'];
        $margin_y = $_POST['margin-y'];
    }



    $wg = new WatermarkGenerator($image, $watermark, $position_x, $position_y, $opacity, $mode, $margin_x, $margin_y);
    $wg->process_image();
}

else {
    header("HTTP/1.1 302 Moved Temporarily");
    header("Location: /");
    exit;
}
