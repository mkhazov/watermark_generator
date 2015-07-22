<?php
include_once 'change-lang.php';
?>
<!doctype html>
<html lang='<?php echo $lang['PAGE_LANG']; ?>'>
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title><?php echo $lang['PAGE_TITLE']; ?></title>
    <meta name="description" content="Генератор водяных знаков.">
    <meta name="keywords" content="Генератор водяных знаков">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- build:css css/vendor.min.css -->
    <!-- bower:css -->
    <link rel="stylesheet" href="bower/jquery-ui/themes/base/slider.css" />
    <link rel="stylesheet" href="bower/normalize.css/normalize.css" />
    <!-- endbower -->
    <!-- endbuild -->

    <!-- build:css css/style.min.css -->
    <link rel="stylesheet" href="css/style.css" />
    <!-- endbuild -->
</head>

<body>
    <!--[if lt IE 10]>
        <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    <div class="wrapper">

        <nav class="navigation">
               <div class="langs">
                   <ul class="langs_nav">
                       <li class="langs_nav-item">
                           <a href="index.php?lang=ru" class="langs_nav-link" id="ru-lang">РУС</a>
                       </li>
                       <li class="langs_nav-item">
                           <a href="index.php?lang=en" class="langs_nav-link" id="en-lang">ENG</a>
                       </li>
                   </ul>
               </div>
               <div class="socials">
                       <div class="socials_like">
                           <a href="#" class="socials_like-link"><div class="socials_like-icon sprite sprite-like"></div></a>
                       </div>
                       <ul class="socials_inner">
                               <li class="socials_inner-item">
                                     <a href="https://www.facebook.com/sharer/sharer.php?u=http://watermark.mkhazov.ru/&t=Watermark Generator"
   onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');return false;"
   target="_blank" class="socials_inner-link socials-fb"><div class="socials_inner-icon sprite sprite-fb"></div></a>
                              </li>
                              <li class="socials_inner-item">
                                     <a href="https://twitter.com/share?url=http://watermark.mkhazov.ru/&text=Watermark Generator"
   onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');return false;"
   target="_blank" class="socials_inner-link socials-tw"><div class="socials_inner-icon sprite sprite-tw"></div></a>
                              </li>
                              <li class="socials_inner-item">
                                     <a href="http://vk.com/share.php?url=http://watermark.mkhazov.ru/" 
                          onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');return false;" 
                          target="_blank" class="socials_inner-link socials-vk"><div class="socials_inner-icon sprite sprite-vk"></div></a>
                              </li>  
                       </ul>
               </div>
        </nav>

        <div class="page">
            <main class="main">
                <h1 class="main__title"><?php echo $lang['HEADER']; ?></h1>
                <div class="image-container">
                    <div class="image-container__workspace">
                        <div class="image-container__main-image">
               
                            <div class="image-container__watermark">
                         
                            </div>
                        </div>
                    </div> 
                </div>
            </main>
            <aside class="sidebar sidebar_right">
                <div class="settings">
                    <div class="settings__title"><?php echo $lang['SETTINGS_TITLE']; ?></div>
                    <form class="settings__form" name="workform" id="workform" action="">
                        <section class="settings__upload">
                            <div class="settings__form-item">
                                <label for="source-image" class="settings__form-label"><?php echo $lang['IMAGE_LABEL']; ?></label>
                                <label for="source-image" class="settings__form-file-label"><?php echo $lang['INPUT_PLACEHOLDER']; ?></label>
                                <input type="file" name="source-image" id="source-image" class="settings__form-file" data-validate-type="file" data-tt-text="Пожалуйста загрузите изображение">
                            </div>
                            <div class="settings__form-item">
                                <label for="watermark-image" class="settings__form-label"><?php echo $lang['WATERMARK_LABEL']; ?></label>
                                <label for="watermark-image" class="settings__form-file-label"><?php echo $lang['INPUT_PLACEHOLDER']; ?></label>
                                <input type="file" name="watermark-image" id="watermark-image" class="settings__form-file input_disabled" disabled data-validate-type="file" data-tt-text="Пожалуйста загрузите изображение">
                            </div>                                
                        </section>                        
                        <section class="settings__position">
                            <section class="settings__tile">
                                <ul class="settins__tile-items">
                                    <li class="settings__tile-item"><a href="" class="settings__tile-link settings__tile-link_tile">Замостить</a></li>
                                    <li class="settings__tile-item"><a href="" class="settings__tile-link settings__tile-link_bite">Размостить</a></li>
                                </ul>
                                <input type="hidden" name="mode" class="settings__mode" value="single">
                            </section>
                            <div class="settings__section-title"><?php echo $lang['PLACE_TITLE']; ?></div>
                            <div class="settings__position-buttons">
                                <a class="settings__position-button settings__position-button_top-left" data-position="left-top"></a>
                                <a class="settings__position-button settings__position-button_top-center" data-position="center-top"></a>
                                <a class="settings__position-button settings__position-button_top-right" data-position="right-top"></a>
                                <a class="settings__position-button settings__position-button_middle-left" data-position="left"></a>
                                <a class="settings__position-button settings__position-button_middle-center" data-position="center"></a>
                                <a class="settings__position-button settings__position-button_middle-right" data-position="right"></a>
                                <a class="settings__position-button settings__position-button_bottom-left" data-position="left-bottom"></a>
                                <a class="settings__position-button settings__position-button_bottom-center" data-position="center-bottom"></a>
                                <a class="settings__position-button settings__position-button_bottom-right" data-position="right-bottom"></a>
                             <!--    <div class="settings__margin-scheme settings__margin-scheme_horizontal"></div>
                                <div class="settings__margin-scheme settings__margin-scheme_vertical"></div>   -->                          
                            </div>
                            <div class="settings__form-items">
                                <div class="settings__form-item">
                                    <label for="settings-x" class="settings__form-label-text">x</label>
                                    <input type="text" id="settings-x" class="settings__input settings__text settings__text_position settings__text_x settings__axis_x input_disabled" value="0" disabled>
                                    <input type="hidden" name="position-x" id="position-x" class="settings__input settings__position_x" value="0">
                                    <input type="hidden" name="margin-x" id="margin-x" class="settings__input settings__margin_x" value="0">
                                    <div class="settings__arrows">
                                        <div class="settings__arrow settings__arrow_position settings__arrow-up settings__axis_x"></div>
                                        <div class="settings__arrow settings__arrow_position settings__arrow-down settings__axis_x"></div>
                                    </div>
                                </div>
                                <div class="settings__form-item">
                                    <label for="settings-y" class="settings__form-label-text">y</label>
                                    <input type="text" id="settings-y" class="settings__input settings__text settings__text_position settings__text_y settings__axis_y input_disabled" value="0" disabled>
                                    <input type="hidden" name="position-y" id="position-y" class="settings__input settings__position_y" value="0">
                                    <input type="hidden" name="margin-y" id="margin-y" class="settings__input settings__margin_y" value="0">
                                    <div class="settings__arrows">
                                        <div class="settings__arrow settings__arrow_position settings__arrow-up settings__axis_y"></div>
                                        <div class="settings__arrow settings__arrow_position settings__arrow-down settings__axis_y"></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section class="settings__opacity">
                            <div class="settings__section-title"><?php echo $lang['TRSPRNC_TITLE']; ?></div>
                            <!-- Сюда встанет бегунок -->
                            <div class="settings__runner"></div>
                            <input type="hidden" class="settings__hidden" name="opacity" id="opacity" value="1">
                        </section>
                        <section class="settings__download">
                            <button class="settings__button settings__button_reset"><?php echo $lang['RESET']; ?></button>
                            <button type="submit" class="settings__button settings__button_download"><?php echo $lang['DOWNLOAD']; ?></button>
                        </section>
                    </form>
                </div>
            </aside>
        </div>
        <footer class="footer">
            <div class="footer__copy">Это наш сайт, пожалуйста не воруйте его</div>
        </footer>
    </div>
    <!-- build:js js/vendor.js -->
    <!-- bower:js -->
    <script src="bower/jquery/dist/jquery.js"></script>
    <script src="bower/jquery-ui/jquery-ui.js"></script>
    <!-- endbower -->
    <!-- endbuild -->

    <!-- build:js js/main.min.js -->
    <script src="js/app.js"></script>
    <script src="js/main.js"></script>
    <script src="js/tooltip.js"></script>
    <script src="js/validate.js"></script>
    <script src="js/moveit.js"></script>
    <script src="js/position.js"></script>
    <script src="js/submit.js"></script>
    <script src="js/socials.js"></script>
    <!-- endbuild -->
</body>
</html>
