<?php

if (isset($_GET['lang'])) {
    $lang = $_GET['lang'];

    setcookie('lang', $lang, time() + (3600 * 24 * 30));
}

elseif (isset($_COOKIE['lang'])) {
    $lang = $_COOKIE['lang'];
}

else {
    $lang = 'rus';
}

switch ($lang) {
    case 'eng':
        $lang_file = 'lang-en.php';
        break;

    case 'rus':
    default:
        $lang_file = 'lang-ru.php';
        break;
}


include_once 'languages/'.$lang_file;

?>