<?php

class WatermarkGenerator {
    const IMG_FORMAT = 'jpg';
    const JPEG_QUALITY = 80;

    private $image;
    private $watermark;
    private $image_file;
    private $watermark_file;
    private $mode = 'single';
    private $position = array('x' => 0, 'y' => 0);
    private $margin = array('x' => 0, 'y' => 0);
    private $opacity = 100;
    private $errors = array();

    /**
     * @param array $image POST-массив файла основного изображения.
     * @param array $watermark POST-массив файла изображения водяного знака.
     * @param int $position_x x-координата положения водяного знака.
     * @param int $position_y y-координата положения водяного знака.
     * @param int $opacity прозрачность водяного знака.
     * @param string $mode режим (single - одиночный вотермарк, grid - сетка)
     * @param int $margin_x величина отступа между картинками вотермарка по горизонтали.
     * @param int $margin_y величина отступа между картинками вотермарка по вертикали.
     */
    public function __construct($image, $watermark, $position_x, $position_y, $opacity, $mode = 'single', $margin_x = 0, $margin_y = 0) {
        $this->image_file = $image;
        $this->watermark_file = $watermark;
        $this->position = array(
            'x' => isset($position_x) ? $position_x : $this->position['x'],
            'y' => isset($position_y) ? $position_y : $this->position['y'],
        );

        if ($mode == 'grid') {
            $this->mode = $mode;
            $this->margin['x'] = $margin_x;
            $this->margin['y'] = $margin_y;
        }

        $this->opacity = isset($opacity) ? $opacity : $this->opacity;
    }

    /**
     * Все действия с картинками.
     */
    public function process_image() {
        // проверка данных
        if ($this->check_data()) {
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
        $result_image = $this->image;

        if ($this->mode == 'single') {
            $result_image = $result_image
              ->merge($this->watermark, $this->position['x'], $this->position['y'], $this->opacity);
        }

        // вотермарк-сетка
        elseif ($this->mode == 'grid') {
            $step_x = $this->watermark->getWidth() + $this->margin['x'];
            $step_y = $this->watermark->getHeight() + $this->margin['y'];

            $count_x = ceil($this->image->getWidth() / $step_x);
            // в случае смещения вотермарка влево нужно добавить один ряд справа
            if ($this->position['x'] < 0) {
                $count_x++;
            }
            // в случае смещения вверх нужно добавить линию снизу
            $count_y = ceil($this->image->getHeight() / $step_y);
            if ($this->position['y'] < 0) {
                $count_y++;
            }

            $x = $this->position['x'];
            for ($xi = 0; $xi < $count_x; $xi++) {
                $y = $this->position['y'];
                for ($yi = 0; $yi < $count_y; $yi++) {
                    $result_image = $result_image->merge($this->watermark, $x, $y, $this->opacity);
                    $y += $step_y;
                }
                $x += $step_x;
            }
        }

        return $result_image->asString(self::IMG_FORMAT, self::JPEG_QUALITY);
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
            $this->check_position() &&
            $this->check_opacity();
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
                //$this->check_file_name($file['name']) &&
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
        if (mb_strlen($filename, "UTF-8") > 255) {
            $this->set_error('Слишком длинное имя файла');
            $passed = FALSE;
        }
        // имя может содержать только англ. и рус. буквы, цифры, символы "_(.)- "
        elseif (!preg_match("{^[-0-9a-zA-Zа-яА-Я_\. \(\)]+$}uis", $filename)) {
            $this->set_error('Недопустимое имя файла');
            $passed = FALSE;
        }

        return $passed;
    }

    /**
     * Валидация координат положения водяного знака относительно основного изображения.
     *
     * @return bool
     */
    private function check_position() {
        if (!is_array($this->position) || !is_numeric($this->position['x']) || !is_numeric($this->position['y'])) {
            $this->set_error('Некорректные координаты');
            return FALSE;
        }

        $this->position['x'] = (int) $this->position['x'];
        $this->position['y'] = (int) $this->position['y'];

        $passed = TRUE;

        // объекты картинок
        $wi = new WideImage\WideImage();
        $this->image = $wi->load($this->image_file['tmp_name']);
        $this->watermark = $wi->load($this->watermark_file['tmp_name']);

        $image_width = $this->image->getWidth();
        $image_height = $this->image->getHeight();
        $watermark_width = $this->watermark->getWidth();
        $watermark_height = $this->watermark->getHeight();

        if ($this->position['x'] > $image_width) {
            $this->set_error('Позиция по оси X выходит за границу изображения');
            $passed = FALSE;
        }
        if ($this->position['y'] > $image_height) {
            $this->set_error('Позиция по оси Y выходит за границу изображения');
            $passed = FALSE;
        }
        if ($this->mode == 'single') {
            if ($this->position['x'] < 0) {
                $this->set_error('Позиция по оси X не может иметь отрицательное значение');
                $passed = FALSE;
            }
            if ($this->position['y'] < 0) {
                $this->set_error('Позиция по оси Y не может иметь отрицательное значение');
                $passed = FALSE;
            }
        }
        elseif ($this->mode == 'grid') {
            $this->position['x'] = $this->position['x'] % $watermark_width;
            $this->position['y'] = $this->position['y'] % $watermark_height;
        }

        return $passed;
    }

    /**
     * Валидация значения прозрачности.
     *
     * @return bool
     */
    private function check_opacity() {
        if (!is_numeric($this->opacity)) {
            $this->set_error('Значение прозрачности должно быть числом');
            return FALSE;
        }
        elseif ($this->opacity < 0) {
            $this->set_error('Значение прозрачности не может быть меньше 0');
            return FALSE;
        }
        elseif ($this->opacity > 100) {
            $this->set_error('Значение прозрачности не может быть больше 100');
            return FALSE;
        }

        elseif ($this->opacity <= 1) {
            $this->opacity *= 100;
        }

        return TRUE;
    }
}
