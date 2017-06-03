/**********************************
Controller for the projection page
***********************************/

//FadeIn to mask the loading of the page elements
$(document).ready(function() {
    $('.slideshow').fadeIn(1000);
});

//We select the relevant section of video data corresponding to the projection
//QueryString is given by queryString.js imported in the <head>
if (QueryString.id) {
    var projId = QueryString.id;
} else {
    window.location = "../main-menu/main-menu.html";
}

var projection = videos[projId];
var projectionDisplay = display.projection[projId]
    /*
    The next passage rearranges the videos to make slides. slideify is
    defined in arrayToSlides.js
    */
projection.videos = slideify(projection.videos, false)

/*
Function to determine the type of menu : single-slide, two-slide of more than two slides.
*/
if (projection.videos.length == 1) {
    var type = "single";
} else if (projection.videos.length == 2) {
    var type = "double";
} else {
    var type = "multiple";
}
/*
PureJS directive to fill the slides and the video html elements
*/
var videosDirective = {
    '.slidemenu': {
        'slide<-videos': {
            //The function below aims to give the right background image
            //for the slide depending on the type of menu and the position
            //of the slide
            '.imgzoneimg@class+': function(a) {
                if (type == "single") {
                    return " isolated_zone";
                } else if (type == "double") {
                    if (a.pos == 0) {
                        return " left_zone";
                    } else {
                        return " right_zone"
                    }
                } else {
                    if (a.pos == 0) {
                        return " left_zone";
                    } else if (a.pos < a.items.length - 1) {
                        return " center_zone";
                    } else {
                        return " right_zone"
                    }
                }
            },
            '.projection-video': {
                'video<-slide': {
                    '.projection-video-poster@src': '#{posterPathPrefix}/#{video.poster}',
                    '.projection-video-title': 'video.title',
                    '.projection-video-link@href+': function(a) {
                        var video = a.slide.pos * videos_per_slide + a.pos;
                        return "?proj=" + projId + "&prevSlide=" + a.slide.pos + "&video=" + video + "&projMode=false";
                    },
                    '.@class+': function(a) {
                        if (a.item.empty == true) {
                            emptyVideos = true;
                            return " empty-video-container";
                        } else
                            return "";
                    }
                }
            },
        }
    }
};
//If emptyVideos remains false after the rendering, there is no empty
//video container and there is no need to call the rendering directive
//for empty videos container (doing this would result in an error)
var emptyVideos = false;
$('body').render(projection, videosDirective); //render the result

/*
PureJSDirective to display graphical elements on the page that don't
depend on the current projection
*/
var displayDirective = {
    '#droite@src': '#{common.pathPrefix}/#{common.droite.main}',
    '#droite_hover@src': '#{common.pathPrefix}/#{common.droite.hover}',
    '#gauche@src': '#{common.pathPrefix}/#{common.gauche.main}',
    '#gauche_hover@src': '#{common.pathPrefix}/#{common.gauche.hover}',
    '#prevMenuImg@src': '#{common.pathPrefix}/#{common.accueil.main}',
    '#prevMenuImg_hover@src': '#{common.pathPrefix}/#{common.accueil.hover}',
    '#proj@src': '#{common.pathPrefix}/#{common.proj.main}',
    '#proj_hover@src': '#{common.pathPrefix}/#{common.proj.hover}',
    '#equipe@src': '#{common.pathPrefix}/#{common.equipe.main}',
    '#equipe_hover@src': '#{common.pathPrefix}/#{common.equipe.hover}',
    '.playbutton@src': '#{common.pathPrefix}/#{common.play}'
};
//Depending on the number of slides, we do not display the same background
if (type == "single") {
    displayDirective['.isolated_zone@src'] = '#{common.pathPrefix}/#{common.zone.isolated}';
} else if (type == "double") {
    displayDirective['.left_zone@src'] = '#{common.pathPrefix}/#{common.zone.left}';
    displayDirective['.right_zone@src'] = '#{common.pathPrefix}/#{common.zone.right}';
} else {
    displayDirective['.center_zone@src'] = '#{common.pathPrefix}/#{common.zone.center}';
    displayDirective['.left_zone@src'] = '#{common.pathPrefix}/#{common.zone.left}';
    displayDirective['.right_zone@src'] = '#{common.pathPrefix}/#{common.zone.right}';
}
//If some video containers are empty, delete the html nodes inside them
if (emptyVideos) {
    displayDirective['.empty-video-container'] = "";
}
$('body').render(display, displayDirective);

/*
PureJS directive to display graphical elements related to the current projection
*/
var projectionDisplayDirective = {
    '.bkgd@style+': function(a) {
        return "background-image: url(" + this.pathPrefix + this.background + ");"
    },
    '#titre@src': '#{pathPrefix}/#{titre}',
    '#prevMenu@href': function(a) {
        var prevMenu = a.context.prev;
        if (prevMenu == "main") {
            return "../main-menu/main-menu.html";
        } else {
            return "../menu/menu.html?id=" + prevMenu;
        }
    },
    '#creditsLink@href+': function(a) {
        return "&prev=" + projId
    }
}
$('body').render(projectionDisplay, projectionDisplayDirective);

/*
Function that redirects to the video player with the correct settings to player
the whole projection
*/
var playProj = function() {
	var prevMenu = projectionDisplay.prev;
    window.location = "../video/video.html?proj=" + projId + "&prevMenu=" + prevMenu + "&prevSlide=0&projMode=true";
}

if (type == "single") {
    /*
    If there is only one slide, the clycle plugin must not bed activated;
    instead we have to delete the html components of the plugin.
    */
    var singleSlideDirective = {
        '#next': '',
        '#prev': '',
        '.slidemenu@style': "position: absolute; top: 0px; left: 0px; display: block; z-index: 3;"
    };
    $('body').render(display, singleSlideDirective);
} else {
    /*
    Slideshow controller : uses the slideshow plugin to animate the slides
    */
    if (QueryString.slide != undefined) {
        var startSlide = QueryString.slide;
    } else {
        var startSlide = 0;
    }

    $(document).ready(function() {
        $('.slideshowmenu').cycle({

            slideResize: false,
            containerResize: false,
            after: onAfter,
            before: onBefore,
            next: '#next',
            prev: '#prev',
            fx: 'scrollHorz',
            speed: 200,
            timeout: 0,
            startingSlide: startSlide
        });
    });

    function onBefore(curr, next, opts) {
        $('#prev')['hide']();
        $('#next')['hide']();
    }
    var appearTime = 250;

    function onAfter(curr, next, opts) {
        currentMenu = opts.currSlide;
        $('#prev')[currentMenu == 0 ? 'hide' : 'show'](appearTime);
        $('#next')[currentMenu == opts.slideCount - 1 ? 'hide' : 'show'](appearTime);
    }
}

/***************************
 *For the bonus projection **
 ****************************/

$(document).ready(function() {
    if (projId == "baux") {

        var audioFile = "../../js/utils/etc/A_N_OUVRIR_QUE_PAR_LE_RESPO_ARCHIVES_2022_TRES_IMPORTANT_NE_PAS_SUPPRIMER_TRANSMETTRE_DE_GENERATIONS_EN_GENERATIONS_SVP.mp3";

        var audioTag = '<audio autoplay="true" loop="true">\
        <source src="' + audioFile + '" type="audio/mpeg" />\
    </audio>';

        $('#music').html(audioTag);
    }
    if (projId == "bails") {

        var audioFile = "../../js/utils/bin/Hi_Im_Jacques_Biot.mp3";

        var audioTag = '<audio autoplay="true" loop="true">\
        <source src="' + audioFile + '" type="audio/mpeg" />\
    </audio>';

        $('#music').html(audioTag);
    }
	
	
    if (projId == "cestjennant") {

        var audioFile = "../../js/utils/lib/Tatiana_best_of.mp3";

        var audioTag = '<audio autoplay="true" loop="true">\
        <source src="' + audioFile + '" type="audio/mpeg" />\
    </audio>';
		var luck=(Math.random());
		if(luck < 0.04) {
			$('#music').html(audioTag);
		}
	}
});
