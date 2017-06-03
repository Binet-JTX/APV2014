/****************************
Controller for the intro page
*****************************/

//Simple function called after the intro video to redirect to main menu
var goToMenu = function() {;
    window.location.href = "../main-menu/main-menu.html";
}

//pure.js directive to fill in the intro video source
var videosDirective = {
    '#intro-video-src@src': '#{intro.pathPrefix}/#{intro.src}'
};
var displayDirective = {
    '#skip-intro-image@src' : '#{intro.pathPrefix}/#{intro.skipIntro}'
}

$p('body').render(display, displayDirective);
$p('body').render(videos, videosDirective); //render the result
