var formApp = (function() {

    // menuButton = $('.menu-button'),
    var formFile = $('.settings__form-file'),
        runner = $('.settings__runner'),
        buttonReset = $('.settings__button_reset'),
        tileLinkTile = $('.settings__tile-link_tile'),
        tileLinkBite = $('.settings__tile-link_bite'),
        sourceContainerSelector = '.image-container__main-image',
        watermarkContainerSelector = '.image-container__watermark',
        sourceContainer = $('.image-container__main-image'),
        watermarkContainer = $('.image-container__watermark'),
        watermarkInput = $('#watermark-image'),
        sourceImgSelector = '.source-img',
        watermarkImgSelector = '.watermark-img',
        tileLink = $('.settings__tile-link'),
        tileLinkSelected = 'settings__tile-link_selected',
        globRatio = 1,
        imagesUploaded = false,
        inputMode = $('.settings__mode'),
        mode = 'single';
        

    var _addEventListeners = function() {
            formFile.on('change', _changeFileLabel);
            formFile.on('change', _viewImg);
            runner.slider({min:0, max:100, range:'min'});
            buttonReset.on('click', _clearForm);
            tileLinkTile.on('click', _doTile);
            tileLinkBite.on('click', _doBite);
        };

    // Изменение лейбла при выборе файла
    var _changeFileLabel = function() {
        var $this = $(this),
            fileValue = $this.val(),
            fileLabel = $(this).parent().find('.settings__form-file-label');
            if(fileValue){
                fileLabel.text(fileValue);
            }
            else{
                fileLabel.text('Вставить файл');
            }
    };

    // Обнуление прозрачности
    var _clearOpacity = function(){
        var block = $('.image-container__watermark');
        runner.slider("value", 0);
        var opacity = 1;
        $(block).css('opacity', opacity);
        $('#opacity').val(opacity);
    };
    
    // Обнуление позиции и отступов
    var _clearPosition = function(){
        var formPosition = $('.settings__text-position');
        var block = moveIt();
        block.init(watermarkContainerSelector, sourceContainerSelector);    
        formPosition.val(0);
        block.setPosition(0,0);       
    };

    // Чистка вотермарка
    var _clearWatermark = function(){         
        var watermarkInputLabel = watermarkInput.parent().find('.settings__form-file-label');
        watermarkInput.val('');
        watermarkInputLabel.text('Вставить файл');
        $(watermarkImgSelector).remove();

        _clearPosition();
        _clearOpacity();
    };

    // Чистка главного изображения
    var _clearSourceImage = function (){ 
        var sourceInput = $('#source-image'),
            sourceInputLabel = sourceInput.parent().find('.settings__form-file-label');

        sourceInput.val('');
        sourceInputLabel.text('Вставить файл');
        $(sourceImgSelector).remove();
        globRatio = 1;
        _disableInputs();

        _clearWatermark();
    };


    var _clearSetMarginView = function(){
        _setMarginView('x',0);
        _setMarginView('y',0);
    }

    // Сброс кнопок замощения
    var _clearTile = function(){
        var watermarkImageFirst = $(watermarkImgSelector).first(),
            watermarkImageWidth = watermarkImageFirst.width(),
            watermarkImageHeight = watermarkImageFirst.height(),
            formMargin = $('.settings__text');
            settingsMarginX = $('.settings__margin_x');
            settingsMarginY = $('.settings__margin_y');
            watermarkContainer.html('');
            watermarkContainer.append(watermarkImageFirst);
            watermarkContainer.css({'width': watermarkImageWidth, 'height': watermarkImageHeight})
            watermarkImageFirst.css({'margin': 0});
            formMargin.val(0);
            settingsMarginX.val(0);
            settingsMarginY.val(0);
        tileLink.removeClass(tileLinkSelected);
        tileLinkBite.addClass(tileLinkSelected);
        _clearSetMarginView();
    };



    // Чистка режима
    var _clearMode = function() {
        watermarkContainer.off('margin-change');
        mode = 'single';
        inputMode.val(mode);
        $('.settings__text')
            .addClass('settings__text_position')
            .removeClass('settings__text_margin');
        $('.settings__arrow')
            .addClass('settings__arrow_position')
            .removeClass('settings__arrow_margin');        
    }

    // Полная очистка формы
    var _clearForm = function(e){
        e.preventDefault();
        //_clearSourceImage();
        _clearPosition();
        _clearOpacity();
        //_clearTile();
    };


    /**
     * Выключение инпутов.
     */
    function _disableInputs() {
        $('.input_disabled').prop('disabled', true);
    }

    /**
     * Включение инпутов.
     */
 
    function _enableInputs() {
        $('.input_disabled').prop('disabled', false);
    }
    // Включение слайдера на изменение прозрачности
    var _opacitySliderOn = function (block) {
        runner.slider({
            slide: function(event, ui) {
                var opacity = (100 - ui.value) / 100;
                $(block).css('opacity', opacity);
                $('.settings__hidden').val(opacity).attr('value', opacity);
            }
        })
    };

    // Проверка файла по типу или наличию
    var _checkFormat = function(file) {
        var mymeTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/vnd.wap.wbmp', 'image/pjpeg', 'image/svg+xml', 'image/tiff', 'image/vnd.microsoft.icon'],
            trueFormat = false;

        if (!file){
            return false
        }
        else {       
            if($.inArray(file.type, mymeTypes) !== -1){            
                return true
            }
            else {
                alert('Не тот формат!');
                return false
            }
        }
    };

    // вычисление коэффициента масшатбирования
    var _getRatio = function(img){
        var workSpace = $('.image-container__workspace'),
            workSpaceWidth = workSpace.width(),
            workSpaceHeight = workSpace.height(),
            imageWidth = img.width,
            imageHeight = img.height,
            heightRatio = 0,
            widthRatio = 0,
            ratio = 1;

        // расчет коэффициента    
        if (imageWidth > workSpaceWidth || imageHeight > workSpaceHeight) {
            widthRatio = workSpaceWidth / imageWidth;
            heightRatio = workSpaceHeight / imageHeight;
            if (widthRatio < heightRatio) {
                ratio = widthRatio;
            }
            else{
                ratio = heightRatio;
            }
        }   
        // console.log(ratio);
        return ratio;
    };

    
    var _changeMode = function() {
        // режим работы (одиночный вотермарк или сетка)
        if (inputMode.val() == 'single') {
            mode = 'grid';
        }
        else {
            mode = 'single';
        }
        inputMode.val(mode);

        // текстовые поля
        $('.settings__text')
            .toggleClass('settings__text_position')
            .toggleClass('settings__text_margin');
        // стрелки
        $('.settings__arrow')
            .toggleClass('settings__arrow_position')
            .toggleClass('settings__arrow_margin');
    };
    // Замощение
    var _doTile = function(e){
        e.preventDefault();
        if ($(this).hasClass(tileLinkSelected) || !imagesUploaded) {
            return false;
        }

        tileLink.removeClass(tileLinkSelected);
        _clearPosition();
        _changeMode();

        var sourceContainerWidth = sourceContainer.width(),
            sourceContainerHeight = sourceContainer.height(),
            watermarkImage = $(watermarkImgSelector),
            watermarkImageWidth = watermarkImage.width(),
            watermarkImageHeight = watermarkImage.height(),
            watermarkHtml = watermarkContainer.html(),
            widthRatio = Math.ceil(sourceContainerWidth / watermarkImageWidth)*2,
            heightRatio = Math.ceil(sourceContainerHeight / watermarkImageHeight)*2;

        watermarkContainer.css({'width': widthRatio*watermarkImageWidth, 'height': heightRatio*watermarkImageHeight})
        for (var i = 0; i <= widthRatio*heightRatio; i++) {
            watermarkContainer.append(watermarkHtml);
        }
        $(this).addClass(tileLinkSelected);   
    };



    // Размощение
    var _doBite = function(e){
        e.preventDefault();               
        if ($(this).hasClass(tileLinkSelected) || !imagesUploaded) {
            return false;
        }

        tileLink.removeClass(tileLinkSelected);
        _clearPosition();
        _clearTile();
        watermarkContainer.off('margin-change');
       /// watermarkContainer.on('position-change');   Видимо, чтобы подключить изменение позиционирования нужно по новой инициировать модуль позиционирования
        _changeMode();
        
    }
    
    /**
     * Смена модификаторов инпутов при переключении режима на замощение и обратно.
     */
    

    // Вставка изображения в рабочее поле
    var _viewImg = function(e) {
        var $this = $(this),
            file = $this[0].files[0],
            img = document.createElement('img'),
            $img = $(img),
            reader = new FileReader();

        // попробовать опустить        
        if (!_checkFormat(file)) {
            if ($this.attr('name') == 'source-image') {
               _clearSourceImage();
               _clearTile();
            }
            else if($this.attr('name') == 'watermark-image'){
                _clearWatermark();
                _clearTile();
            }
            return false;
        }
        
        reader.onload = function(event) {
            img.src = event.target.result;
            img.setAttribute('draggable', 'false');
            // вставка главного изображения
            if ($this.attr('name') == 'source-image') {
                // Предварительная очистка приложения
                _clearWatermark();
                $(sourceImgSelector).remove();

                // вычисление масштаба при загрузке главной картинки
                globRatio = _getRatio(img);

                // вставка картинки
                $img.addClass('source-img');
                sourceContainer.append(img);

                _clearMode();
                _clearTile();

                // задание масштаба основной картинки
                $img.css({'width': (img.width * globRatio) +'px','height': (img.height * globRatio) + 'px'});
                
                // включение инпута для загрузки вотермарка
                watermarkInput.prop('disabled', false);
            }
            // вставка вотермарка
            else if ($this.attr('name') == 'watermark-image') {
                //предварительная очистка вотермарка
                _clearMode();
                _clearPosition();
                _clearOpacity();
                
                $(watermarkImgSelector).remove();

                $img.addClass('watermark-img');
                watermarkContainer.append(img);

               
                _clearTile();

                // задание масштаба вотермарка
                $img.css({'width': (img.width * globRatio) +'px','height': (img.height * globRatio) + 'px'});
                
                imagesUploaded = true;
                // вызвать кастомное событие 'images-uploaded'
                $('#workform').trigger('images-uploaded', [sourceContainerSelector, watermarkContainerSelector]);

                // включаем инпуты
                _enableInputs();
            }
        };

        reader.onerror = function() {
            alert('Файл не может быть прочитан!' + event.target.error.code);
        };
        reader.readAsDataURL(file);
    };

    /**
     * Установка отступов между картинками в сетке вотермарка.
     * @param {string} axis ось (x или y)
     * @param {int} value значение отступа
     */
    var _setMarginView = function (axis,value) {
        var marginSchemeSelector = '.settings__margin-scheme';
            marginSchemeHorizontal = $('<div class="settings__margin-scheme_horizontal">'),
            marginSchemeVertical = $('<div class="settings__margin-scheme_vertical">'),
            marginSchemeHorizontalSelector = $('.settings__margin-scheme_horizontal'),
            marginSchemeVerticalSelector = $('.settings__margin-scheme_vertical'),
            positionButtons = $('.settings__position-buttons');

        marginSchemeHorizontal.addClass('settings__margin-scheme');
        marginSchemeVertical.addClass('settings__margin-scheme');            
        if (positionButtons.children(marginSchemeSelector).length===0){
            
            positionButtons.append(marginSchemeHorizontal);
            positionButtons.append(marginSchemeVertical);
        }
        
        switch (axis) {
            case 'y':
                marginSchemeHorizontalSelector.css({'height':value});
            break;
            case 'x':
                marginSchemeVerticalSelector.css({'width':value});
            break;
        }
}

    var _setMargin = function (axis, value) {
        value *= globRatio;
        var sourceContainerWidth = sourceContainer.width(),
            sourceContainerHeight = sourceContainer.height(),
            watermarkImage = $(watermarkImgSelector),
            watermarkImageWidth = watermarkImage.width(),
            watermarkImageHeight = watermarkImage.height(),
            widthRatio = Math.ceil(sourceContainerWidth / watermarkImageWidth)*2,
            heightRatio = Math.ceil(sourceContainerHeight / watermarkImageHeight)*2;

        watermarkContainer.css({'width': widthRatio*watermarkImageWidth, 'height': heightRatio*watermarkImageHeight})
        
            _setMarginView(axis, value);
            switch (axis) {
                case 'x':
                    watermarkImage.css({'margin-left': value, 'margin-right':value});
                    watermarkContainer.css({'width': widthRatio*(watermarkImageWidth + 2*value)});
                    break;
                case 'y':
                    watermarkImage.css({'margin-top': value, 'margin-bottom':value});
                    watermarkContainer.css({'height': heightRatio*(watermarkImageHeight + 2*value)});
                    break;

            }
    }

    return {
        init: function() {
            _addEventListeners();
            _opacitySliderOn(watermarkContainerSelector);
            tileLinkBite.addClass(tileLinkSelected);
        },
        // метод получения последнего коэффициента
        getRatio: function() {
            return globRatio;
        },
        // установка отступов между картинками в сетке вотермарка
        setMargin: function(axis, value) {
            _setMargin(axis, value);
        },
        // текущий режим работы
        getMode: function() {
            return mode;
        }
    }
})();
