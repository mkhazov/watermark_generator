<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    require_once '../vendor/autoload.php';

    // Получаем файлы основной картинки и водяного знака
    $image = $_FILES['source-image'];
    $watermark = $_FILES['watermark-image'];

    // Получаем координаты
    $position_x = $_POST['position-x'];
    $position_y = $_POST['position-y'];
    // Получаем значение прозрачности
    $opacity = $_POST['opacity'];

    $wg = new WatermarkGenerator($image, $watermark, 0, 0, 100); // $position_x, $position_y, $opacity
    $wg->process_image();
}

else {
    header("HTTP/1.1 302 Moved Temporarily");
    header("Location: /");
    exit;
}

class WatermarkGenerator {
    const IMG_FORMAT = 'jpg';
    const JPEG_QUALITY = 80;

    private $image;
    private $watermark;
    private $image_file;
    private $watermark_file;
    private $position = array('x' => 0, 'y' => 0);
    private $opacity = 100;

    /**
     * @param array $image POST-массив файла основного изображения.
     * @param array $watermark POST-массив файла изображения водяного знака.
     * @param int $position_x x-координата положения водяного знака.
     * @param int $position_y y-координата положения водяного знака.
     * @param int $opacity прозрачность водяного знака.
     */
    public function __construct($image, $watermark, $position_x, $position_y, $opacity) {
        $this->image_file = $image;
        $this->watermark_file = $watermark;
        $this->position = array(
            'x' => isset($position_x) ? $position_x : $this->position['x'],
            'y' => isset($position_y) ? $position_y : $this->position['y'],
        );
        $this->opacity = isset($opacity) ? $opacity : $this->opacity;

        $wi = new WideImage\WideImage();
        try {
            $this->image = $wi->load($this->image_file['tmp_name']);
        }
        catch (Exception $e) {
            throw new Exception("tmp_name: " . $this->image_file['tmp_name']);
        }
        $this->watermark = $wi->load($this->watermark_file['tmp_name']);
    }

    /**
     * Все действия с картинками.
     */
    public function process_image() {
        if ($this->check_data()) {
            // генерация изображения
            $result_image = $this->generate_img($this->image, $this->watermark);
            // генерация имени файла, предлагаемого для сохранения
            $result_filename = $this->generate_filename($this->image_file['name']);
            // диалог сохранения файла
            $this->download_img($result_image, $result_filename);
        }
        else {
            header("HTTP/1.1 302 Moved Temporarily");
            header("Location: /");
            exit;
        }
    }

    /**
     * Валидация данных.
     *
     * @return bool
     */
    private function check_data() {
        return
            $this->check_file($this->image_file) &&
            $this->check_file($this->watermark_file) &&
            $this->check_position($this->position, $this->image_file['tmp_name']) &&
            $this->check_opacity($this->opacity);
    }

    /**
     * Генерация изображения.
     *
     * @return string сгенерированное изображение (binary string).
     */
    private function generate_img() {
        $result_image = $this->image
            // наложение водяного знака
            ->merge($this->watermark, $this->position['x'], $this->position['y'], $this->opacity)
            // полученное изображение в виде строки
            ->asString(self::IMG_FORMAT, self::JPEG_QUALITY);

        return $result_image;
    }

    /**
     * Вызов диалога сохранения файла в браузере.
     *
     * @param string $img итоговая картинка (binary string).
     * @param string $filename имя файла для сохранения на клиенте.
     * @param int $filesize размер файла.
     */
    private function download_img($img, $filename) {
        // заставляем браузер показать окно сохранения файла
        header('Content-Description: File Transfer');
        header('Content-Type: image/jpeg');
        header('Content-Disposition: attachment; filename=' . $filename);
        header('Content-Length: ' . strlen($img));
        header('Content-Transfer-Encoding: binary');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        // отправляем картинку пользователю
        echo $img;
        exit;
    }

    /**
     * Генерация имени итогового файла.
     *
     * @param array $filename имя файла загруженного изображения.
     * @return string имя итогового файла.
     */
    private function generate_filename($filename) {
        $path_parts = pathinfo($filename);
        $result_filename = $path_parts['filename'] . '_with-wm.' . $path_parts['extension'];
        return $result_filename;
    }

    /**
     * Валидация загружаемого файла.
     *
     * @param array $file массив-файл, который нужно проверить.
     * @return bool
     */
    private function check_file($file) {
        if (is_array($file) && !empty($file['size']) && !empty($file['name'])) {
            if ($this->check_file_size($file['size']) &&
                $this->check_file_name($file['name']) &&
                $this->check_file_extension($file['name'])) {
                return TRUE;
            }
        }

        return FALSE;
    }

    /**
     * Валидация расширения файла.
     *
     * @param string $filename имя файла.
     * @return bool валидно ли расширение файла.
     */
    private function check_file_extension($filename) {
        $allowed_extensions = array('gif', 'png', 'jpg', 'bmp');
        $path_parts = pathinfo($filename);
        $extension = strtolower($path_parts['extension']);
        if (in_array($extension, $allowed_extensions)) {
            return TRUE;
        }
        else {
            return FALSE;
        }
    }

    /**
     * Проверка размера файла.
     *
     * @param string $filesize размер файла.
     * @return bool валиден ли размер файла.
     */
    private function check_file_size($filesize) {
        // файл не пустой и не больше 2 мб
        return ($filesize = 0 || $filesize > 2097152) ? FALSE : TRUE;
    }

    /**
     * Проверка имени файла.
     *
     * @param string $filename имя файла.
     * @return bool валидно ли имя файла.
     */
    private function check_file_name($filename) {
        return
            // имя может содержать только англ. и рус. буквы, цифры, символы "_(.)- "
            (!preg_match("{^[-0-9a-zA-Zа-яА-Я_\. \(\)]+$}i", $filename)
                // длина не более 255 символов
                || mb_strlen($filename,"UTF-8") > 225)
                ? FALSE : TRUE;
    }

    /**
     * Валидация координат положения водяного знака относительно основного изображения.
     *
     * @param array $position array('x' => $position_x, 'y' => $position_y)
     * @param string $image_filename
     * @return bool
     */
    private function check_position($position, $image_filename) {
        $errors = array();

        $wi = new WideImage\WideImage();
        $image = $wi->load($image_filename);

        $width = $image->getWidth();
        $height = $image->getHeight();

        if ($position['x'] > $width) {
            $errors[] = 'Позиция по оси X выходит за границу изображения.';
        }
        if ($position['y'] > $height) {
            $errors[] = 'Позиция по оси Y выходит за границу изображения.';
        }
        if ($position['x'] < 0) {
            $errors[] = 'Позиция по оси X не может иметь отрицательное значение.';
        }
        if ($position['y'] < 0) {
            $errors[] = 'Позиция по оси Y не может иметь отрицательное значение.';
        }

        if (empty($errors)) {
            return TRUE;
        }
        else {
            return FALSE;
        }
    }

    /**
     * Валидация значения прозрачности.
     *
     * @param int $opacity
     * @return bool
     */
    private function check_opacity($opacity) {
        return (is_int($opacity) && $opacity >= 0 && $opacity <= 100) ? TRUE : FALSE;
    }
}
