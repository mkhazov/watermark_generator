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
                           <a href="/rus" class="langs_nav-link" id="ru-lang">РУС</a>
                       </li>
                       <li class="langs_nav-item">
                           <a href="/eng" class="langs_nav-link" id="en-lang">ENG</a>
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
                <div class="image-container" id="image_container">
                    <div class="image-container__workspace">
                        <div class="image-container__main-image">
                            <!-- <img src="http://dummyimage.com/600x400/000/0011ff.png" alt="Main Image"> -->
                            <!-- <img src="http://dummyimage.com/1000x800/000/0011ff.png" alt="Main Image"> -->
                            <div class="image-container__watermark">
                                <!-- <img src="http://dummyimage.com/100x50/fff/0011ff.png" alt="Watermark"> -->
                            </div>
                        </div>
                        <div id="throbber" style="display:none;">
                             <img src="/img/busy.gif" />
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
                                <input type="file" name="source-image" id="source-image" class="settings__form-file">
                            </div>
                            <div class="settings__form-item">
                                <label for="watermark-image" class="settings__form-label"><?php echo $lang['WATERMARK_LABEL']; ?></label>
                                <label for="watermark-image" class="settings__form-file-label"><?php echo $lang['INPUT_PLACEHOLDER']; ?></label>
                                <input type="file" name="watermark-image" id="watermark-image" class="settings__form-file">
                            </div>                                
                        </section>
                        <section class="settings__position">
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
                            </div>
                            <div class="settings__form-items">                        
                                <div class="settings__form-item">
                                    <label for="position-x" class="settings__form-label-position">x</label>
                                    <input type="text" name="position-x" id="position-x" class="settings__text-position settings__text-position_x" value="0">
                                    <div class="settings__position_arrows">
                                        <div class="settings__position_arrow settings__arrow-up settings__arrow_x"></div>
                                        <div class="settings__position_arrow settings__arrow-down settings__arrow_x"></div>
                                    </div>
                                </div>
                                <div class="settings__form-item">
                                    <label for="position-y" class="settings__form-label-position">y</label>
                                    <input type="text" name="position-y" id="position-y"  class="settings__text-position settings__text-position_y" value="0">
                                    <div class="settings__position_arrows">
                                        <div class="settings__position_arrow settings__arrow-up settings__arrow_y"></div>
                                        <div class="settings__position_arrow settings__arrow-down settings__arrow_y"></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section class="settings__opacity">
                            <div class="settings__section-title"><?php echo $lang['TRSPRNC_TITLE']; ?></div>
                            <!-- Сюда встанет бегунок -->
                            <div class="settings__runner"></div>
                        </section>
                        <section class="settings__download">
                            <input type="hidden" class="settings__hidden" name="opacity" id="opacity" value="1">
                            <button class="settings__button settings__button_reset"><?php echo $lang['RESET']; ?></button>
                            <button type="submit" class="settings__button settings__button_download" id="download"><?php echo $lang['DOWNLOAD']; ?></button>
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
    <script src="http://malsup.github.io/jquery.blockUI.js"></script>
    <!-- endbower -->
    <!-- endbuild -->

    <!-- build:js js/main.min.js -->
    <script src="js/app.js"></script>
    <script src="js/main.js"></script>
    <script src="js/moveit.js"></script>
    <script src="js/position.js"></script>
    <script src="js/submit.js"></script>
    <script src="js/socials.js"></script>
    <script src="js/throbber.js"></script>
    <!-- endbuild -->
</body>
</html>
