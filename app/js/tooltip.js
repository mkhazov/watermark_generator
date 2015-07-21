//====================================================
//============== Tooltip plugin for jQuery ===========
//====================================================
/*  
    Плагин для установки тултипа.
    Поддерживает только позиции лево и право.
    Если запустить по дефолту - установит положение
    слева c текстом Tooltip
    Установить тултип:
        $('.selector').tooltip({
            position: 'right',
            text: 'Tooltip text'
        });
    Убрать тултип:
        $('.selector').tooltip('remove');
    
    Так-же параметры можно задавать из дата атрибутов:
        data-tt-position    - положение
        data-tt-text        - текст
*/
$.fn.tooltip = function (userOptions) {
    "use strict";
    //Если не передаём в функцию объект - создаём 
    //пустой, чтобы не вывалиться в ошибку
    if (arguments.length === 0) {
        userOptions = {};
    }
    if (userOptions === 'remove') {
        this.trigger('remove-tooltip');
        return this;
    }
    var object = this,
        tooltip = $('<div style="position: absolute;">\
                    <div class="tooltip"></div>\
                    </div>'),
        options = {
            position: userOptions.position
                    || object.data('tt-position')
                    || 'left',
            text:   userOptions.text
                    || object.data('tt-text')
                    || 'Tooltip'
        };

    //Добавляем тултипу необходимый класс для
    //для позиционирования и текст
    tooltip.children().text(options.text);
    tooltip.children().addClass(options.position);

    //Функция размещает тултип около нужного инпута
    function _setPosition(elem, tooltip, position) {
        var elemWidth = elem.outerWidth(),
            elemHeight = elem.outerHeight(),
            elemTopEdge = elem.offset().top,
            elemBottomEdge = elem.offset().top + elemHeight,
            elemLeftEdge = elem.offset().left,
            elemRightEdge = elem.offset().left + elemWidth,
            tooltipWidth = tooltip.outerWidth(true),
            tooltipHeight = tooltip.outerHeight(true);

        //Расчитываем координаты в зависимости от позиции
        if (position === 'right') {
            tooltip.offset({
                left: elemRightEdge,
                top: elemTopEdge + elemHeight / 2 - tooltipHeight / 2
            });
        } else if (position === 'left') {
            tooltip.offset({
                left: elemLeftEdge - tooltipWidth,
                top: elemTopEdge + elemHeight / 2 - tooltipHeight / 2
            });
        } else {
            throw new Error("Error tooltip position");
        }
    }


    //Добавляем тултип на страницу и позиционируем
    $('body').append(tooltip);
    _setPosition(object, tooltip, options.position);

    //По событию 'remove-tooltip' убираем тултип
    object.on('remove-tooltip', function () {
        tooltip.remove();
    });

    //Мониторим ресайз страницы и перепозиционируем
    $(window).on('resize scroll', function () {
        _setPosition(object, tooltip, options.position);
    });
    return object;
};

//=========== Tooltip plugin for jQuery END ==========
//====================================================