$(function() {

    $.ajax({
        url: "/api/city",
        dataType: "json",
        success: rander
    });

    function rander(data) {
        var citytitle = "";
        var citycont = "";
        $.each(data, function(i, v) {
            citycont += "<h2>" + i + "</h2><ul>";
            $.each(v.match(/[\u4e00-\u9fa5]+/g), function(i, v) {
                citycont += '<li>' + v + '</li>'
            });
            citycont += '</ul>';
            citytitle += "<span>" + i + "</span>";
        })
        $('.city-bar').append(citytitle);
        $('.city-cont').append(citycont);
    }

});