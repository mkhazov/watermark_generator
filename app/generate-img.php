<?php

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    require_once '../vendor/autoload.php';

    // Получаем файлы основной картинки и водяного знака
    $image = check_file($_FILES['image']);
    $watermark = check_file($_FILES['watermark']);

    $position_x = $_POST['position_x'];
    $position_y = $_POST['position_y'];

    process_image($image, $watermark, $position_x, $position_y);
}

else {
    header("HTTP/1.1 302 Moved Temporarily");
    header("Location: /");
    exit;
}

/**
 * @param array $image POST-массив файла основного изображения.
 * @param array $watermark POST-массив файла изображения водяного знака.
 * @param int $position_x x-координата положения водяного знака.
 * @param int $position_y y-координата положения водянего знака.
 */
function process_image($image, $watermark, $position_x = 0, $position_y = 0) {
    $image_string = file_get_contents($image['tmp_name']);
    $watermark_string = file_get_contents($watermark['tmp_name']);

    // генерация изображения
    $result_image = generate_img($image_string, $watermark_string, $position_x, $position_y);
    // генерация имени файла, предлагаемого для сохранения
    $result_filename = generate_filename($image);
    // диалог сохранения файла
    download_img($result_image, $result_filename, $image['size']);
}

/**
 * @param array $file POST-массив файла основного изображения.
 * @return string имя конечного файла.
 */
function generate_filename($file) {
    $path_parts = pathinfo($file['name']);
    $result_filename = $path_parts['filename'] . '_with-wm.' . $path_parts['extension'];
    return $result_filename;
}

/**
 * Валидация загружаемого файла.
 * @param array $file массив-файл, который нужно проверить.
 * @return array $file
 */
function check_file($file) {
    if (check_file_size($file['size']) && check_file_name($file['name'])) {
        return $file;
    }
    else {
        header("HTTP/1.1 302 Moved Temporarily");
        header("Location: /");
        exit;
    }
}

/**
* Проверка размера файла.
*
* @param string $filesize размер файла.
* @return bool валиден ли размер файла.
*/
function check_file_size($filesize) {
    // файл не пустой и не больше 2 мб
    return ($filesize = 0 || $filesize > 2097152) ? false : true;
}

/**
* Проверка имени файла.
*
* @param string $filename имя файла.
 * @return bool валидно ли имя файла.
*/
function check_file_name($filename) {
    return
        // имя может содержать только англ. и рус. буквы, цифры, символы "-", "_" и "."
        (!preg_match("{^[-0-9a-zA-Zа-яА-Я_\. ]+$}i", $filename)
        // длина не более 255 символов
        || mb_strlen($filename,"UTF-8") > 225)
        ? false : true;
}

/**
 * Генерация изображения.
 *
 * @param string $image_file основное изображение (binary string).
 * @param string $watermark_file водяной знак (binary string).
 * @param int $position_x требуемая позиция водяного знака по оси X.
 * @param int $position_y требуемая позиция водяного знака по оси Y.
 * @return binary сгенерированное изображение.
 */
function generate_img($image_file, $watermark_file, $position_x = 0, $position_y = 0) {
    $imagine = new Imagine\Imagick\Imagine();

    $image = $imagine->load($image_file);
    $watermark = $imagine->load($watermark_file);
    $image_size = $image->getSize();
    $watermark_size = $watermark->getSize();

    $position = new Imagine\Image\Point($position_x, $position_y);

    $image->paste($watermark, $position);

    $extension = 'jpg';
    $options = array(
        'jpeg_quality' => 75,
    );

    return $image->get($options);
}

function download_img($img, $filename, $filesize = 0) {
    // заставляем браузер показать окно сохранения файла
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename=' . $filename);
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . $filesize);
    // отправляем картинку пользователю
    echo $img;
    exit;
}
