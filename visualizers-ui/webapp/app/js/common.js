
(function _configExtraJSFunctions() {
    String.prototype.startsWith = function(str) {
        return this.indexOf(str) == 0
    };

    String.prototype.contains = function(str) {
        return this.indexOf(str) != -1
    };

    Array.prototype.foldLeft = function(initValue) {
        var that = this;
        return function(procFunc) {
            var accum = initValue;
            for (var i = 0; i < that.length; i++) {
                var tmpRes = procFunc(accum, that[i]);
                if (tmpRes != undefined) accum = tmpRes;
            }
            return accum;
        }
    };

    if (typeof console === "undefined"){
        console={};
        console.log = function(){}
    }
})();

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