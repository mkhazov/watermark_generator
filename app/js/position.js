var position = (function () {

    var block = {};

    function _addEventListeners () {
        // после загразки файла в инпут включаем позиционирование водяного знака
        $('#workform').on('file-uploaded', function (event, sourceContainerSelector, watermarkContainerSelector) {
            _enablePositioning(sourceContainerSelector, watermarkContainerSelector);
        });

        // по клику на кнопку позиционирования переместить водяной знак в требуемую секцию
        $('.settings__position-button').on('click', function () {
            var position = $(this).data('position');
            _setPositionArea(position);
        });
    };

    /**
     * Подключение модуля позиционирования.
     * @param {string} sourceContainerSelector
     * @param {string} watermarkContainerSelector
     */
    function _enablePositioning(sourceContainerSelector, watermarkContainerSelector) {
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
    function _setPositionArea(position) {
        if (block.stickBlock !== undefined) {
            block.stickBlock(position);
        }
    }

    /**
     * Установка значений координат в инпуты.
     */
    function _changePositionValues(x, y) {
        $('#position-x').val(x);
        $('#position-y').val(y);
    }

    return {
        init: function () {
            _addEventListeners();
        }
    }

})();
