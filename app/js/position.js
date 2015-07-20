var position = (function () {

    var fileUploaded = false,
        block = {};

    function _addEventListeners () {
        // после загразки файла в инпут включаем позиционирование водяного знака
        $('#workform').on('file-uploaded', function (event, sourceContainerSelector, watermarkContainerSelector) {
            _enablePositioning(sourceContainerSelector, watermarkContainerSelector);
        });

        // по клику на кнопку позиционирования переместить водяной знак в требуемую секцию
        $('.settings__position-button').on('click', _setPositionArea);

        // по клику на стрелку позиционирования
        $('.settings__arrow_position').on('click', _handlePositionArrow);
        // по вводу значения в текстовое поле
        // @todo
        $('.settings__text_position').on('input', function() {});
    };

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

        watermarkContainer.on('position-changed', function(event, x, y) {
            _changePositionValues(x, y);
        });
    }

    /**
     * Поместить водяной знак в одну из 9 секций.
     * @param {string} position
     */
    function _setPositionArea() {
        var position = $(this).data('position');
        if (block.stickBlock !== undefined) {
            block.stickBlock(position);
        }
    }

    /**
     * Обработчик клика по стрелкам позиционирования.
     */
    function _handlePositionArrow() {
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

        if ($this.hasClass('settings__arrow_x')) {
            axis = 'x';
        }
        else if ($this.hasClass('settings__arrow_y')) {
            axis = 'y';
        }

        if (value !== 0 && axis.length) {
            // текущие координаты
            var position = block.getPosition();
            // изменяем значение по требуемой оси
            position[axis] += value;
            // устанавливаем новые координаты
            block.setPosition(position['x'], position['y']);
        }
    }

    /**
     * Установка значений координат в инпуты.
     */
    function _changePositionValues(x, y) {
        $('.settings__position_x').val(x);
        $('.settings__position_y').val(y);
    }

    return {
        init: function () {
            _addEventListeners();
        }
    }

})();
