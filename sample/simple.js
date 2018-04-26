$(document).ready(function() {
    $("#submit").click(function() {
        $("#output").text("The button was clicked!");
        $(".post").hide();
        $("#output a").addClass("underlined")
    });
});
