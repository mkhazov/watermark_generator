var formApp = (function() {

    // menuButton = $('.menu-button'),
    var formFile = $('.settings__form-file'),
        runner = $('.settings__runner'),
        _addEventListeners = function() {
            formFile.on('change', _changeFileLabel);
            formFile.on('change', _viewImg);
            runner.slider({min:0, max:100, range:'min'});
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
            if ($.inArray(file.type, mymeTypes)) {
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
        console.log (img.width);
        var workSpaceWidth = 650,
            workSpaceHeight = 534,
            imageWidth = img.width,
            imageHeight = img.height,
            heightRatio = 0,
            widthRatio = 0,
            ratio = 1;
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
        console.log(ratio);
        return ratio;
    }

    var globRatio = 1;
    var _viewImg = function(e) {
        var $this = $(this),
            file = $this[0].files[0],
            sourceContainerSelector = '.image-container__main-image',
            watermarkContainerSelector = '.image-container__watermark',
            sourceContainer = $(sourceContainerSelector),
            watermarkContainer = $(watermarkContainerSelector),
            img = document.createElement('img'),
            reader = new FileReader();

        if (!_checkFormat(file)) {
            if ($this.attr('name') == 'source-image') {
                sourceContainer.find('img').remove();
            }
            else if($this.attr('name') == 'watermark-image'){
                watermarkContainer.find('img').remove();
            }
            return false;
        }
        
        reader.onload = function(event) {
            var dataUri = event.target.result;
            img.src = dataUri;
            if ($this.attr('name') == 'source-image') {
                globRatio = _getRatio(img);
                console.log(globRatio); 
                if (!sourceContainer.children().is('img')) {
                    $(img).css({'max-width': (img.width * globRatio) +'px','max-height': (img.height * globRatio) + 'px'});
                    sourceContainer.append(img);
                }
                else {
                    $(img).css({'max-width': (img.width * globRatio) +'px','max-height': (img.height * globRatio) + 'px'});
                    sourceContainer.find('img').attr('src', dataUri);
                }
               
            }
            else if ($this.attr('name') == 'watermark-image') {
                if (!watermarkContainer.children().is('img')) {
                    watermarkContainer.append(img);
                }
                else {
                    watermarkContainer.find('img').attr('src', dataUri);
                }
            }

            // вызвать кастомное событие 'file-uploaded'
            $('#workform').trigger('file-uploaded', [sourceContainerSelector, watermarkContainerSelector]);
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
        }
    }
})();
