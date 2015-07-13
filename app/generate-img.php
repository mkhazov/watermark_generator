<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    require_once 'vendor/autoload.php';

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

class WatermarkGenerator {
    const IMG_FORMAT = 'jpg';
    const JPEG_QUALITY = 80;

    private $image;
    private $watermark;
    private $image_file;
    private $watermark_file;
    private $position = array('x' => 0, 'y' => 0);
    private $opacity = 100;
    private $errors = array();

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
    }

    /**
     * Все действия с картинками.
     */
    public function process_image() {
        if ($this->check_data()) {
            // объекты картинок
            $wi = new WideImage\WideImage();
            $this->image = $wi->load($this->image_file['tmp_name']);
            $this->watermark = $wi->load($this->watermark_file['tmp_name']);

            // генерация изображения
            $result_image = $this->generate_img($this->image, $this->watermark);
            // генерация имени файла, предлагаемого для сохранения
            $result_filename = $this->generate_filename($this->image_file['name']);
            // диалог сохранения файла
            $this->download_img($result_image, $result_filename);
        }
        else {
            $output = array(
                'errors' => $this->errors,
            );
            echo json_encode($output);
            exit;
        }
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
     * Добавление сообщения об ошибке.
     *
     * @param string $error Текст сообщения об ошибке.
     */
    private function set_error($error) {
        array_push($this->errors, $error);
    }

    /**
     * Валидация данных.
     *
     * @return bool
     */
    private function check_data() {
        $passed = TRUE;

        if (!$this->check_file($this->image_file)) {
            $this->set_error('Не загружено основное изображение');
            $passed = FALSE;
        }
        if (!$this->check_file($this->watermark_file)) {
            $this->set_error('Не загружен водяной знак');
            $passed = FALSE;
        }

        return
            $passed &&
            $this->check_position($this->position, $this->image_file['tmp_name']) &&
            $this->check_opacity($this->opacity);
    }

    /**
     * Валидация загружаемого файла.
     *
     * @param array $file массив-файл, который нужно проверить.
     * @return bool
     */
    private function check_file($file) {
        if (is_array($file) && !empty($file['size']) && !empty($file['name']) && !empty($file['tmp_name'])) {
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
            $this->set_error('Недопустимое расширение файла');
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
        // файл пустой
        if ($filesize == 0) {
            $this->set_error('Пустой файл');
            return FALSE;
        }
        // файл больше 2 мб
        elseif ($filesize > 2097152) {
            $this->set_error('Слишком большой файл');
            return FALSE;
        }
        else {
            return TRUE;
        }
    }

    /**
     * Проверка имени файла.
     *
     * @param string $filename имя файла.
     * @return bool валидно ли имя файла.
     */
    private function check_file_name($filename) {
        $passed = TRUE;

        // длина не более 255 символов
        if (mb_strlen($filename,"UTF-8") > 255) {
            $this->set_error('Слишком длинное имя файла');
            $passed = FALSE;
        }
        // имя может содержать только англ. и рус. буквы, цифры, символы "_(.)- "
        elseif (!preg_match("{^[-0-9a-zA-Zа-яА-Я_\. \(\)]+$}i", $filename)) {
            $this->set_error('Недопустимое имя файла');
            $passed = FALSE;
        }

        return $passed;
    }

    /**
     * Валидация координат положения водяного знака относительно основного изображения.
     *
     * @param array $position array('x' => $position_x, 'y' => $position_y)
     * @param string $image_filename
     * @return bool
     */
    private function check_position($position, $image_filename) {
        $passed = TRUE;

        $wi = new WideImage\WideImage();
        $image = $wi->load($image_filename);

        $width = $image->getWidth();
        $height = $image->getHeight();

        if ($position['x'] > $width) {
            $this->set_error('Позиция по оси X выходит за границу изображения');
            $passed = FALSE;
        }
        if ($position['y'] > $height) {
            $this->set_error('Позиция по оси Y выходит за границу изображения');
            $passed = FALSE;
        }
        if ($position['x'] < 0) {
            $this->set_error('Позиция по оси X не может иметь отрицательное значение');
            $passed = FALSE;
        }
        if ($position['y'] < 0) {
            $this->set_error('Позиция по оси Y не может иметь отрицательное значение');
            $passed = FALSE;
        }

        return $passed;
    }

    /**
     * Валидация значения прозрачности.
     *
     * @param int $opacity
     * @return bool
     */
    private function check_opacity($opacity) {
        if (!is_numeric($opacity)) {
            $this->set_error('Значение прозрачности должно быть числом');
            return FALSE;
        }
        elseif ($opacity < 0) {
            $this->set_error('Значение прозрачности не может быть меньше 0');
            return FALSE;
        }
        elseif ($opacity > 100) {
            $this->set_error('Значение прозрачности не может быть больше 100');
            return FALSE;
        }

        elseif ($opacity < 1) {
            $this->opacity = $opacity * 100;
        }

        return TRUE;
    }
}
