var formApp = (function(){

	 // menuButton = $('.menu-button'),
	var	formFile = $('.form__file'),
		runner = $('.settings__runner'),
		addEventListeners = function() {
			formFile.on('change', changeFileLabel);	
			runner.slider({min:0, max:100});				
		}
// Изменение лейбла при выборе файла
	var changeFileLabel = function(){
		var	$this = $(this),
			fileValue = $this.val(),
			fileLabel = $(this).parent().find('.form__file-label');
		fileLabel.text(fileValue);		
	};
	return {
		init: function() {
			addEventListeners();
		}
	}
})();
