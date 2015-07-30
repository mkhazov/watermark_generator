var submit = (function () {

    function addEventListeners() {
        $('#workform').on('submit', submitForm);
    }

    function submitForm(e) {
        e.preventDefault();

        var resultValidate = sendFormValidate.validate();
        if (resultValidate === false) {
            return false;
        }

        var formData = new FormData(this);

        // расчет и отправка на сервер реальных координат
        var x = $('#position-x').val(),
            y = $('#position-y').val(),
            scaleRatio = formApp.getRatio(),
            realX = ~~(x / scaleRatio),
            realY = ~~(y / scaleRatio),
            // jQuery ajax can't retrieve data as blob,
            // so use native XMLHttpresuest
            xhr = new XMLHttpRequest();

        formData.append('position-x', realX);
        formData.append('position-y', realY);

        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var blob = this.response;
                // we got JSON response from server
                if (blob.type === 'text/html') {
                    var fr = new FileReader();
                    fr.onload = $.proxy(function (e) {
                        var response = JSON.parse(e.target.result);
                        console.log(response);
                    }, this);
                    fr.readAsText(blob);
                } else { // we got an image
                    var filename = generateFilename(xhr);
                    downloadBlob(xhr.response, filename);
                }
            }
        };
        xhr.open('POST', 'generate-img.php');
        xhr.responseType = 'blob';
        xhr.send(formData);
    }

    /**
     * Получение имени файла из заголовка Content-Disposition ответа сервера.
     * @param {XMLHttpRequest} xhr
     * @return {string} filename
     */
    function generateFilename(xhr) {
        var filename = '',
            disposition = xhr.getResponseHeader('Content-Disposition'),
            filenameRegex,
            matches;

        if (disposition && disposition.indexOf('attachment') !== -1) {
            filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            matches = filenameRegex.exec(disposition);
            if (matches !== null && matches[1]) {
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
    function downloadBlob(blob, filename) {

        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var URL = window.URL || window.webkitURL,
                downloadUrl = URL.createObjectURL(blob),
                a;

            if (filename) {
                // use HTML5 a[download] attribute to specify filename
                a = document.createElement('a');
                // safari doesn't support this yet
                if (typeof a.download === 'undefined') {
                    window.location = downloadUrl;
                    $('#image_container').unblock();
                } else {
                    a.href = downloadUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    $('#image_container').unblock();
                }
            } else {
                window.location = downloadUrl;
            }

            setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
        }
    }

    return {
        init: function () {
            addEventListeners();
        }
    };
}());
