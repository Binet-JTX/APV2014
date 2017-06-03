/********************************
Controller for the credits page
*********************************/

if (QueryString.type == "menu") {
    var prevLink="../menu/menu.html"
} else if (QueryString.type == "projection") {
    var prevLink="../projection/projection.html"
}
if (QueryString.prev) {
    var prevMenu = QueryString.prev;
} else {
    var prevLink = "../main-menu/main-menu.html";
    var prevMenu = null;
}
console.log(prevMenu,prevLink,QueryString.type);

//pure.js directive to fill in the image sources and other
var displayDirective = {
    '#zone-isolated@src': '#{common.pathPrefix}/#{common.zone.isolated}',
    '#background@style': function(a) {
        return "background-image: url(" + this.credits.pathPrefix + this.credits.background + ");"
    },
    '#titre@src': '#{menu.main.pathPrefix}/#{menu.main.title}',
    '#back-to-intro@src': '#{menu.main.pathPrefix}/#{menu.main.backToIntro.main}',
    '#back-to-intro-hover@src': '#{menu.main.pathPrefix}/#{menu.main.backToIntro.hover}',
    //'#apr@src' : '#{credits.pathPrefix}/#{credits.apr}',
    '#prevMenuImg@src': '#{common.pathPrefix}/#{common.accueil.main}',
    '#prevMenuImg_hover@src': '#{common.pathPrefix}/#{common.accueil.hover}',
    '#prevMenu@href': function(a) {
        if (prevMenu == null) {
            return prevLink;
        } else {
            return prevLink+ "?id=" + prevMenu;
        }
    },
};

$('body').render(display, displayDirective); //render the result


//Navigation functions
var goToIntro = function() {
    window.location.href = "../intro/intro.html";
}

//FadeIn to mask the loading of the page elements
$(document).ready(function() {
    $('.slideshow').fadeIn(1000);
});
