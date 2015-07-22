//------------- Validate form Module ------------------------
var validate = function () {
    "use strict";
    var formValid,
        inputs = [],
        showError,
        hideError,
        listenEvent = true;

    function _resetValidate() {
        inputs.each(function () {
            hideError(this);
        });
    }
    function _validateForm(event) {
        var valid = true;
        _resetValidate(); //Сбрасываем текущие тултипы
        //Для каждого инпута в записимости от типа данных
        //выполняем проверку
        inputs.each(function () {
            var input = $(this);
            switch (input.data('validate-type')) {
            case 'text':
                if (input.val() === '') {
                    showError(input, 'EMPTY');
                    valid = false;
                }
                break;
            case 'file':
                if (input.val() === '') {
                    showError(input, 'EMPTY');
                    valid = false;
                }
                break;
            case 'email':
                if (input.val() === '') {
                    showError(input, 'EMPTY');
                    valid = false;
                } else if (!input.val().match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i)) {
                    showError(input, 'WRONG_EMAIL');
                    valid = false;
                }
                break;
            }
        });
        if (event && valid === false) {
            event.preventDefault();
        }
        return valid;
    }
    function _setListeners() {
        formValid.on('submit', function (e) {
            _validateForm(e);
        });
        formValid.on('reset', _resetValidate);
        formValid.on('keypress paste change', '[data-validate-type]', function () {
            hideError(this);
        });
    }
    return {
        init: function (options) {
            formValid = $(options.formSelector);
            inputs = formValid.find('[data-validate-type]');
            showError = options.wrongFunc;
            hideError = options.clearFunc;
            listenEvent = options.listenEvent || true;
            if (listenEvent) {
                _setListeners();
            }
        },
        validate: function () {
            return _validateForm();
        },
        reset: function () {
            _resetValidate();
        }
    };
};
// --------------- Validate Form Module END -----------------
var sendFormValidate = validate();
sendFormValidate.init({
    formSelector: '#workform',
    listenEvent: false,
    wrongFunc: function (input, message) {
        $(input).tooltip();
        if ($(input).attr('type') === 'file') {
            $(input).prev().addClass('invalid');
        } else {
            $(input).addClass('invalid');
        }
    },
    clearFunc: function (input) {
        $(input).tooltip('remove');
        if ($(input).attr('type') === 'file') {
            $(input).prev().removeClass('invalid');
        } else {
            $(input).removeClass('invalid');
        }
    }
});