var formApp = (function() {

    // menuButton = $('.menu-button'),
    var formFile = $('.settings__form-file'),
        runner = $('.settings__runner'),
        buttonReset = $('.settings__button_reset'),

        globRatio;
        _addEventListeners = function() {
            formFile.on('change', _changeFileLabel);
            formFile.on('change', _viewImg);
            runner.slider({min:0, max:100, range:'min'});
            buttonReset.on('click', _clearForm);
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
        runner.slider("value", 0)
        var opacity = 1;
        $(block).css('opacity', opacity);
        $('.settings__hidden').val(opacity).attr('value', opacity);
    }
    
    // Обнуление позиции
    var _clearPosition = function(){
        var formPosition = $('.settings__text-position'),
            sourceContainerSelector = '.image-container__main-image',
            watermarkContainerSelector = '.image-container__watermark',
            block={};
        block = moveIt();
        block.init(watermarkContainerSelector, sourceContainerSelector);    
        formPosition.val(0);
        block.setPosition(0,0);       
    }

    // Чистка ватермарка
    var _clearWatermark = function(){
        var watermarkContainer = $('.image-container__watermark'),
            formFileWatermark = $('#watermark-image'),
            watermarkFileLabel = formFileWatermark.parent().find('.settings__form-file-label');

        formFileWatermark.val('');
        watermarkFileLabel.text('Вставить файл');  
        watermarkContainer.children('img').remove(); 

        _clearPosition();
        _clearOpacity();
    }

    //Чистка главного изображения
    var _clearSourceImage = function (){
        var sourceContainer = $('.image-container__main-image'),
            formFileSourceImage = $('#source-image'),
            sourceFileLabel = formFileSourceImage.parent().find('.settings__form-file-label');

        formFileSourceImage.val('');
        sourceFileLabel.text('Вставить файл');  
        sourceContainer.children('img').remove();
        globRatio = 1; 

        _clearWatermark();    

    }
    //Полная очистка формы
    var _clearForm = function(e){
        e.preventDefault();
        _clearSourceImage();
        _clearPosition();
        _clearOpacity();
    }

    //Включение слайдера на изменение прозрачности
    var _opacitySliderOn = function (block) {
        runner.slider({
            slide: function(event, ui) {
                var opacity = (100 - ui.value) / 100;
                $(block).css('opacity', opacity);
                $('.settings__hidden').val(opacity).attr('value', opacity);
            }
        })
    }

    // Проверка файла по типу или наличию
    var _checkFormat = function(file) {
        var mymeTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/vnd.wap.wbmp', 'image/pjpeg', 'image/svg+xml', 'image/tiff', 'image/vnd.microsoft.icon'],
            trueFormat = false;

        if (file){       
            if($.inArray(file.type, mymeTypes) !== -1){            
                trueFormat = true;
            }
        }
        if (!trueFormat) {
            alert('Не тот формат! Или не загружено изображение!');
            return false;
        }
        else {
            return true;
        }
    }

    // вычисление коэффициента масшатбирования
    var _getRatio = function(img){
        var workSpaceWidth = 650,
            workSpaceHeight = 534,
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
    }

   //Вставка изображения в рабочее поле
    var _viewImg = function(e) {
        console.log(globRatio);
        var $this = $(this),
            file = $this[0].files[0],
            sourceContainerSelector = '.image-container__main-image',
            watermarkContainerSelector = '.image-container__watermark',
            sourceContainer = $(sourceContainerSelector),
            watermarkContainer = $(watermarkContainerSelector),
            img = document.createElement('img'),
            reader = new FileReader();

        // попробовать опустить        
        if (!_checkFormat(file)) {
            if ($this.attr('name') == 'source-image') {
               _clearSourceImage();
            }
            else if($this.attr('name') == 'watermark-image'){
                _clearWatermark();
            }
            return false;
        }
        
        reader.onload = function(event) {
            var dataUri = event.target.result;
            img.src = dataUri;
            img.setAttribute('draggable', 'false');
            // вставка главного изображения
            if ($this.attr('name') == 'source-image') {
                //Предварительная очистка приложения
                _clearWatermark();
                // вычисление масштаба при загрузке главной картинки
                globRatio = _getRatio(img);
              
               
                // вставка картинки
                sourceContainer.children('img').remove();
                sourceContainer.append(img);
                  //задавание масштаба основной картинки
                $(img).css({'width': (img.width * globRatio) +'px','height': (img.height * globRatio) + 'px'});
            }
            // вставка вотермарка
            else if ($this.attr('name') == 'watermark-image') {
                //предварительная очистка вотермарка
                _clearPosition();
                _clearOpacity();
                              
                watermarkContainer.children('img').remove();
                watermarkContainer.append(img);
                 // задание масштаба вотермарка 
                $(img).css({'width': (img.width * globRatio) +'px','height': (img.height * globRatio) + 'px'});
                // вызвать кастомное событие 'file-uploaded'
              $('#workform').trigger('file-uploaded', [sourceContainerSelector, watermarkContainerSelector]);
            }

            // переделал вызов позиционирования только на загрузку вотермарка^^^^^
        }

        reader.onerror = function() {
            alert('Файл не может быть прочитан!' + event.target.error.code);
        };
        reader.readAsDataURL(file);
    }

    return {
        init: function() {
            _addEventListeners();
            _opacitySliderOn('.image-container__watermark');
        },
        // метод получения последнего коэффициента
        returnRatio: function() {
            return globRatio;
        }
    }
})();
