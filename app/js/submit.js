var submit = (function($) {

    function _addEventListeners() {
        $('#workform').on('submit', _submitForm);
    }

    function _submitForm(e) {
        e.preventDefault();
        var formData = new FormData($(this)[0]);

        // расчет и отправка на сервер реальных координат
        var x = $('#position-x').val();
        var y = $('#position-y').val();
        var scaleRatio = formApp.getRatio();
        var realX = ~~(x / scaleRatio);
        var realY = ~~(y / scaleRatio);
        formData.append('position-x', realX);
        formData.append('position-y', realY);

        // jQuery ajax can't retrieve data as blob,
        // so use native XMLHttpresuest
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var blob = this.response;

                // we got JSON response from server
                if (blob.type == 'text/html') {
                    var fr = new FileReader();
                    fr.onload = $.proxy(function(e) {
                        var response = JSON.parse(e.target.result);
                        console.log(response);
                    }, this);
                    fr.readAsText(blob);
                }
                // we got an image
                else {
                    var filename = _generateFilename(xhr);
                    _downloadBlob(xhr.response, filename);
                }
            }
        }
        xhr.open('POST', 'generate-img.php');
        xhr.responseType = 'blob';
        xhr.send(formData);
    }

    /**
     * Получение имени файла из заголовка Content-Disposition ответа сервера.
     * @param {XMLHttpRequest} xhr
     * @return {string} filename
     */
    function _generateFilename(xhr) {
        var filename = "";
        var disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }
        return filename;
    }

    /**
     * Вызов диалога сохранения файла.
     * @param {blob} blob
     * @param {string} filename
     */
    function _downloadBlob(blob, filename) {
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var URL = window.URL || window.webkitURL;
            var downloadUrl = URL.createObjectURL(blob);

            if (filename) {
                // use HTML5 a[download] attribute to specify filename
                var a = document.createElement("a");
                // safari doesn't support this yet
                if (typeof a.download === 'undefined') {
                    window.location = downloadUrl;
                } else {
                    a.href = downloadUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                }
            } else {
                window.location = downloadUrl;
            }

            setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
        }
    }

    return {
        init: function() {
            _addEventListeners();
        }
    }
})(jQuery);
