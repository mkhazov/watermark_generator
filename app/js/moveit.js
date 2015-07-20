/*
    moveIt
    Модуль позиционирования одного блока внутри другого
    По координатам, ключевым позициям и дран'н'дропом

    Для инициализации:

    var block = moveIt();           //Создаём копию модуля
    block.init('.block', '.container');           //Инициализируем
    block.dragNDropEnable();        //Включаем драг'н'дроп
    block.stickBlock('right-top');   //Позиционируем по ключевым точкам
*/

var moveIt = function () {
    'use strict';
    var container       = {},
        block           = {},
        mode            = 'normal';
    //Перерасчитывает абсолютные и относительные координаты блока
    function _calculateBlockPosition() {
        var box         = block.elem.getBoundingClientRect();
        //Координаты на странице
        block.oX        = box.left + window.pageXOffset;
        block.oY        = box.top + window.pageYOffset;
        //Координаты внутри родительского блока
        block.parentY   = block.elem.offsetTop;
        block.parentX   = block.elem.offsetLeft;
    }
    //... и контейнера
    function _calculateContainerPosition() {
        var box = container.elem.getBoundingClientRect();
        container.oX    = box.left + window.pageXOffset;
        container.oY    =  box.top + window.pageYOffset;
    }
    //Коррекция координат в зависимости от режима
    function getNormalX(axisX) {
        var x = axisX;
        if (axisX < 0) {
            x = 0;
        }
        if (axisX > container.width - block.width) {
            x = container.width - block.width;
        }
        return x;
    }
    function getNormalY(axisY) {
        var y = axisY;
        if (axisY < 0) {
            y = 0;
        }
        if (axisY > container.height - block.height) {
            y = container.height - block.height;
        }
        return y;
    }
    function getExtraX(axisX) {
        var x = axisX;
        if (axisX > 0) {
            x = 0;
        }
        if (axisX < container.width - block.width) {
            x = container.width - block.width;
        }
        return x;
    }
    function getExtraY(axisY) {
        var y = axisY;
        if (axisY > 0) {
            y = 0;
        }
        if (axisY < container.height - block.height) {
            y = container.height - block.height;
        }
        return y;
    }
    //Позиционирует блок по заданным координатам
    function _setPosition(axisX, axisY) {
        var x = axisX,
            y = axisY;
        switch (mode) {
        case 'normal':
            //Если выходим за диапазон - применяем макс значения
            x = getNormalX(axisX);
            y = getNormalY(axisY);
            break;
        case 'extra-size':
            //Если блок шире контейнера по одной из координат
            //Не позволяем ему залезть границей во внутрь
            x = (block.width > container.width) ? getExtraX(axisX) : getNormalX(axisX);
            y = (block.height > container.height) ? getExtraY(axisY) : getNormalY(axisY);
            break;
        }
        block.elem.style.left   = x + 'px';
        block.elem.style.top    = y + 'px';

        _calculateBlockPosition();
        $(block.elem).trigger('position-change', [block.parentX, block.parentY]);
    }
    //Устанавливает положение блока по положению курсора
    //С поправкой на место клика
    function _moveBlockByMouse(event, shiftX, shiftY) {
        var x = event.pageX - shiftX - container.oX,
            y = event.pageY - shiftY - container.oY;
        _setPosition(x, y);
    }
    return {
        //Инициализируем: Первым аргументом передаём селектор блока
        //Вторым - блока в котором будем позиционировать
        init: function (userBlock, userContainer) {
            //Если первого селектора нет - выдаём ошибку
            block.elem = document.querySelector(userBlock) || null;
            if (block.elem === null) {
                throw "Error init moveIt module: incorrect argument";
            }
            //Если второго - берём родителя от первого
            container.elem =    document.querySelector(userContainer) ||
                                block.elem.parentNode;

            var blockPosition       = window.getComputedStyle(block.elem).position,
                containerPosition   = window.getComputedStyle(container.elem).position;
            if (blockPosition !== 'absolute') {
                block.elem.style.position = 'absolute';
            }
            if (containerPosition !== 'relative' ||
                    containerPosition !== 'absolute' ||
                    containerPosition !== 'static') {
                container.elem.style.position = 'relative';
            }
            //Вычисляем размеры блоков
            block.width         = block.elem.offsetWidth;
            block.height        = block.elem.offsetHeight;
            container.width     = container.elem.offsetWidth;
            container.height    = container.elem.offsetHeight;

            //Вычисляем координаты блоков
            _calculateBlockPosition();
            _calculateContainerPosition();

            //Если блок больше нашего изображения - включаем другой режим позиционирования
            if (block.width > container.width ||
                    block.height > container.height) {
                mode = 'extra-size';
            }
        },
        setPosition: function (axisX, axisY) {
            return _setPosition(axisX, axisY);
        },
        getPosition: function () {
            return {
                x: block.parentX,
                y: block.parentY
            };
        },
        stickBlock: function (position) {
            var x, y;
            //Вычисляем координаты
            switch (position) {
            case 'right':
                x = container.width - block.width;
                y = container.height * 0.5 - block.height * 0.5;
                break;
            case 'right-top':
                x = container.width - block.width;
                y = 0;
                break;
            case 'right-bottom':
                x = container.width - block.width;
                y = container.height - block.height;
                break;
            case 'left':
                x = 0;
                y = container.height * 0.5 - block.height * 0.5;
                break;
            case 'left-top':
                x = 0;
                y = 0;
                break;
            case 'left-bottom':
                x = 0;
                y = container.height - block.height;
                break;
            case 'center':
                x = container.width * 0.5 - block.width * 0.5;
                y = container.height * 0.5 - block.height * 0.5;
                break;
            case 'center-top':
                x = container.width * 0.5 - block.width * 0.5;
                y = 0;
                break;
            case 'center-bottom':
                x = container.width * 0.5 - block.width * 0.5;
                y = container.height - block.height;
                break;
            default:
                return false;
            }
            //Позиционируем
            _setPosition(x, y);
        },
        //Включаем перетаскивание драг'н'дроп
        dragNDropEnable: function () {
            //Отключаем стандартное браузерное перетаскивание
            block.elem.ondragstart = function () {
                return false;
            };
            block.elem.onmousedown = function (e) {
                //Вычисляем смещение курсора от начала блока
                var shiftX = e.pageX - block.oX,
                    shiftY = e.pageY - block.oY;
                //Перемещаем
                document.onmousemove = function (e) {
                    _moveBlockByMouse(e, shiftX, shiftY);
                };
                //Если отпустили кнопку - останавливаемся
                document.onmouseup = function () {
                    document.onmousemove = null;
                    block.elem.onmouseup = null;
                };
            };
        }
    };
};