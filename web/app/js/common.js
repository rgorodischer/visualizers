$(document).ready(function() {
    _configButtonsToggling();
    stroll.bind('#test ul');
//    _bindNavigationEvents();
});

(function _configExtraJSFunctions() {
    String.prototype.startsWith = function(str) {
        return this.indexOf(str) == 0
    };

    String.prototype.contains = function(str) {
        return this.indexOf(str) != -1
    };

    if (typeof console === "undefined"){
        console={};
        console.log = function(){}
    }
})();

function _configButtonsToggling() {
    $('#tsp_button').addClass("active");
    $('#tsp_button, #vrp_button').click(function() {
        $('#tsp_button, #vrp_button').removeClass("active");
        $(this).addClass("active");
    });
}

//function _bindNavigationEvents() {
//	$('.navbar a[href="#visualizers"], .navbar a[href="#examples"], .navbar a[href="#contacts"]').click(function() {
//		$('.navbar a').removeClass('selected');
//		$(this).addClass('selected');
//	});
//}

function _loadJsonFile(fileName, callback) {
	$.getJSON(fileName, function(data) {
        if (callback) {
            callback(data)
        }
    });
}

function _applyTemplate(templateName, data) {
    if (!ich[templateName]) {
        $.ajax({
            async: false,
            cache: false,
            dataType: "text",
            url: 'templates/' + templateName + ".tmpl",
            complete: function(response) {
                ich.addTemplate(templateName, response.responseText);
            }
        });
        console.log('Loaded ' + templateName + ' template')
    }
    return ich[templateName](data);
}