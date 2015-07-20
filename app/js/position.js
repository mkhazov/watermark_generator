var position = (function () {

    var fileUploaded = false,
        block = {};

    function _addEventListeners () {
        // после загразки файла в инпут включаем позиционирование водяного знака
        $('#workform').on('file-uploaded', function (event, sourceContainerSelector, watermarkContainerSelector) {
            _enablePositioning(sourceContainerSelector, watermarkContainerSelector);
        });
    }

    /**
     * Подключение модуля позиционирования.
     * @param {string} sourceContainerSelector
     * @param {string} watermarkContainerSelector
     */
    function _enablePositioning(sourceContainerSelector, watermarkContainerSelector) {
        fileUploaded = true;
        var watermarkContainer = $(watermarkContainerSelector);

        // подключаем модуль позиционирования
        block = moveIt();
        block.init(watermarkContainerSelector, sourceContainerSelector);
        block.dragNDropEnable();

        // по клику на кнопку позиционирования переместить водяной знак в требуемую секцию
        $('.settings__position-button').on('click', _setPositionArea);

        // по клику на стрелку
        $('.settings__arrow').on('click', _handleArrow);

        // по вводу значения в текстовое поле
        $('.settings__text').on('input change', _handleTextInput);

        watermarkContainer.on('position-change', function(event, x, y) {
            _changePositionValues(x, y);
        });
    }

    /**
     * Поместить водяной знак в одну из 9 секций.
     * @param {string} position
     */
    function _setPositionArea() {
        var $this = $(this);

        var currentClass = 'settings__position-button_current';
        $this.siblings().removeClass(currentClass);
        $this.addClass(currentClass);

        var position = $this.data('position');
        if (block.stickBlock !== undefined) {
            block.stickBlock(position);
        }
    }

    /**
     * Обработчик клика по стрелкам позиционирования.
     */
    function _handleArrow() {
        if (fileUploaded !== true) {
            return;
        }

        var $this = $(this),
            value = 0,
            axis = '';

        if ($this.hasClass('settings__arrow-up')) {
            value = 1;
        }
        else if ($this.hasClass('settings__arrow-down')) {
            value = -1;
        }

        if ($this.hasClass('settings__axis_x')) {
            axis = 'x';
        }
        else if ($this.hasClass('settings__axis_y')) {
            axis = 'y';
        }

        if (value !== 0 && axis.length) {

            // изменение координат
            if ($this.hasClass('settings__arrow_position')) {
                // текущие координаты
                var position = block.getPosition();
                // изменяем значение по требуемой оси
                position[axis] += value;
                // устанавливаем новые координаты
                block.setPosition(position['x'], position['y']);
            }

            // изменение отступа
            else if ($this.hasClass('settings__arrow_margin')) {
                var margin = parseInt($('.settings__margin_' + axis).val());
                margin += parseInt(value);
                _changeMarginValue(axis, margin);
                formApp.setMargin(axis, margin);
            }

        }
    }

    function _handleTextInput() {
        var $this = $(this),
            value = $this.val(),
            axis = '';

        if ($this.hasClass('settings__axis_x')) {
            axis = 'x';
        }
        else if ($this.hasClass('settings__axis_y')) {
            axis = 'y';
        }

        if (axis.length) {

            if ($this.hasClass('settings__text_position')) {
                // текущие координаты
                var position = block.getPosition();
                // изменяем значение по требуемой оси
                position[axis] = value;
                // устанавливаем новые координаты
                block.setPosition(position['x'], position['y']);
            }

            else if ($this.hasClass('settings__text_margin')) {
                // smth like setMargin(axis, value);
            }

        }
    }

    /**
     * Установка значений координат в инпуты.
     */
    function _changePositionValues(x, y) {
        $('.settings__text_x').val(x);
        $('.settings__text_y').val(y);
        $('.settings__position_x').val(x);
        $('.settings__position_y').val(y);
    }

    /**
     * Установка значений отступов в инпуты.
     */
    function _changeMarginValue(axis, value) {
        $('.settings__text_' + axis).val(value);
        $('.settings__margin_' + axis).val(value);
    }

    return {
        init: function () {
            _addEventListeners();
        }
    }

})();
