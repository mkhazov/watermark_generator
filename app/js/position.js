var position = (function () {

    var fileUploaded = false,
        block = {},
        stickBlockMode = false,
        currentPositionClass = 'settings__position-button_current',
        currentPositionSelector = '.' + currentPositionClass;

    function addEventListeners() {
        // после загразки файла в инпут включаем позиционирование водяного знака
        $('#workform').on('images-uploaded', function (event, sourceContainerSelector, watermarkContainerSelector) {
            enablePositioning(sourceContainerSelector, watermarkContainerSelector);
        });
    }

    /**
     * Подключение модуля позиционирования.
     * @param {string} sourceContainerSelector
     * @param {string} watermarkContainerSelector
     */
    function enablePositioning(sourceContainerSelector, watermarkContainerSelector) {
        var watermarkContainer = $(watermarkContainerSelector);

        if (!fileUploaded) {
            // подключаем модуль позиционирования
            block = moveIt();
            block.init(watermarkContainerSelector, sourceContainerSelector);
            block.dragNDropEnable();

            // по клику на кнопку позиционирования переместить водяной знак в требуемую секцию
            $('.settings__position-button').on('click', setPositionArea);

            // по клику на стрелку
            $('.settings__arrow').on('click', handleArrow);

            // по вводу значения в текстовое поле
            $('.settings__text').on('input change', handleTextInput);

            watermarkContainer.on('position-change', function (event, x, y) {
                changePositionValues(x, y);

                if (formApp.getMode() === 'single') {
                    displayPositionValues(x, y);
                }
            });

            fileUploaded = true;
        }

        else {
            // картинки загружены не в первый раз, нужно пересчитать
            block.recalc();
        }
    }

    /**
     * Поместить водяной знак в одну из 9 секций.
     * @param {string} position
     */
    function setPositionArea() {
        if (formApp.getMode() !== 'single') {
            return;
        }

        var $this = $(this),
            position = $this.data('position');

        $this.siblings().removeClass(currentPositionClass);
        $this.addClass(currentPositionClass);

        if (block.stickBlock !== undefined) {
            stickBlockMode = true;
            block.stickBlock(position);
        }
    }

    /**
     * Обработчик клика по стрелкам позиционирования.
     */
    function handleArrow() {
        if (fileUploaded !== true) {
            return;
        }
        var $this = $(this),
            value = 0,
            axis = '';

        if ($this.hasClass('settings__arrow-up')) {
            value = 1;
        } else if ($this.hasClass('settings__arrow-down')) {
            value = -1;
        }

        if ($this.hasClass('settings__axis_x')) {
            axis = 'x';
        } else if ($this.hasClass('settings__axis_y')) {
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
                block.setPosition(position.x, position.y);
            // изменение отступа
            } else if ($this.hasClass('settings__arrow_margin')) {
                var margin = parseInt($('.settings__margin_' + axis).val());
                margin += parseInt(value);
                changeMarginValue(axis, margin);
                formApp.setMargin(axis, margin);
            }

        }
    }

    function handleTextInput() {
        var $this = $(this),
            value = $this.val(),
            axis = '';

        if ($this.hasClass('settings__axis_x')) {
            axis = 'x';
        } else if ($this.hasClass('settings__axis_y')) {
            axis = 'y';
        }

        if (axis.length) {
            if ($this.hasClass('settings__text_position')) {
                // текущие координаты
                var position = block.getPosition();
                // изменяем значение по требуемой оси
                position[axis] = value;
                // устанавливаем новые координаты
                block.setPosition(position.x, position.y);
            } else if ($this.hasClass('settings__text_margin')) {
                var margin = 0;
                margin += parseInt(value);
                changeMarginValue(axis, margin);
                formApp.setMargin(axis, margin);
            }

        }
    }

    /**
     * Установка значений координат в скрытые инпуты.
     */
    function changePositionValues(x, y) {
        $('.settings__position_x').val(x);
        $('.settings__position_y').val(y);
    }

    /**
     * Установка значений координат в отображаемые инпуты.
     */
    function displayPositionValues(x, y) {
        // если позиция изменена не с помощью кнопок .settings__position-button,
        // нужно удалить с одной из них активный класс
        if (!stickBlockMode) {
            $(currentPositionSelector).removeClass(currentPositionClass);
        }
        stickBlockMode = false;

        $('.settings__text_x').val(x);
        $('.settings__text_y').val(y);
    }

    /**
     * Установка значений отступов в инпуты.
     */
    function changeMarginValue(axis, value) {
        $('.settings__text_' + axis).val(value);
        $('.settings__margin_' + axis).val(value);
    }

    return {
        init: function () {
            addEventListeners();
        }
    };

}());
