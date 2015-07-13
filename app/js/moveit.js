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
        block           = {};
    //Перерасчитывает абсолютные и относительные координаты блока
    function _calculateBlockPosition() {
        var box         = block.elem.getBoundingClientRect();
        block.oX        = box.left + window.pageXOffset;
        block.oY        = box.top + window.pageYOffset;
        block.parentY   = block.elem.offsetTop;
        block.parentX   = block.elem.offsetLeft;
    }
    //... и контейнера
    function _calculateContainerPosition() {
        var box = container.elem.getBoundingClientRect();
        container.oX    = box.left + window.pageXOffset;
        container.oY    =  box.top + window.pageYOffset;
    }
    //Проверяет координаты на корректность
    //Если вышли за пределы родительского - возвращает false
    function _checkCoord(axisX, axisY) {
        if (axisX < 0 ||
                axisY < 0 ||
                axisX + block.width > container.width ||
                axisY + block.height > container.height) {
            return false;
        }
        return true;
    }
    //Позиционирует блок по заданным координатам
    function _setPosition(axisX, axisY) {
        //Но сначала проверяем координаты
        if (!_checkCoord(axisX, axisY)) {
            return false;
        }
        block.elem.style.left   = axisX + 'px';
        block.elem.style.top    = axisY + 'px';
        _calculateBlockPosition();
    }
    //Устанавливает положение блока по положению курсора
    //С поправкой на место клика
    function _moveBlockByMouse(event, shiftX, shiftY) {
        var x = event.pageX - shiftX - container.oX,
            y = event.pageY - shiftY - container.oY;
        _setPosition(x, y);
        $(block.elem).trigger("position-changed", [x, y]);
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