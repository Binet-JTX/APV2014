/********************************
Controller for the menu page
*********************************/

/*
Retrives the parameters in the url and sets appropriated variables
*/
if (QueryString.id) {
    var menuId = QueryString.id;
} else {
    window.location = "../main-menu/main-menu.html";
}
var menu = display.menu[menuId];

/*
The next passage rearranges the sections of the menu to make slides. slideify is
defined in arrayToSlides.js
*/
menu.sections = slideify(menu.sections,true)

/*
Function to determine the type of menu : single-slide, two-slide of more than two slides.
*/
if (menu.sections.length == 1) {
    var type = "single";
} else if (menu.sections.length == 2) {
    var type = "double";
} else {
    var type = "multiple";
}


/*
PureJS directive to render graphical elements that depend on the
current menu being displayed
*/
var menuDisplayDirective = {
    '#titre@src': '#{pathPrefix}/#{title}',
    '.bkgd@style+': function(a) {
        return "background-image: url(" + this.pathPrefix + this.background + ");"
    },
    '#prevMenu@href': function(a) {
        var prevMenu = a.context.prev;
        if (prevMenu == "main") {
            return "../main-menu/main-menu.html";
        } else {
            return "../menu/menu.html?id=" + prevMenu;
        }
    },
    '#creditsLink@href+' : function(a) {return "&prev="+menuId},
    '.slidemenu': {
        'slide<-sections': {
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
            '.menu-section': {
                'section<-slide': {
                    '.menu-section-poster@src': '#{pathPrefix}/#{section.poster}',
                    '.menu-section-title': 'section.title',
                    '.menu-section-link@href': function(a) {
                        if (this.type == "projection") {
                            return "../projection/projection.html?id=" + this.id;
                        } else if (this.type == "menu") {
                            return "../menu/menu.html?id=" + this.id;
                        } else {
                            return "../main-menu/main-menu.html";
                        }
                    },
                    '.@class+' : function(a) {
                        if (a.item.empty == true) {
                            emptySections = true;
                            return " empty-section-container";
                        }
                        else
                            return "";
                    }
                }
            }
        }
    }
}
//If emptySections remains false after the rendering, there is no empty
//section container and there is no need to call the rendering directive
//for empty sections container (doing this would result in an error)
var emptySections = false;
$('body').render(menu, menuDisplayDirective); //render the result

/*
PureJS directive to display graphical elements on the page that don't
depend on the current projection
*/
var displayDirective = {
    '#droite@src': '#{common.pathPrefix}/#{common.droite.main}',
    '#droite_hover@src': '#{common.pathPrefix}/#{common.droite.hover}',
    '#gauche@src': '#{common.pathPrefix}/#{common.gauche.main}',
    '#gauche_hover@src': '#{common.pathPrefix}/#{common.gauche.hover}',
    '#prevMenuImg@src': '#{common.pathPrefix}/#{common.accueil.main}',
    '#prevMenuImg_hover@src': '#{common.pathPrefix}/#{common.accueil.hover}',
    '#equipe@src': '#{common.pathPrefix}/#{common.equipe.main}',
    '#equipe_hover@src': '#{common.pathPrefix}/#{common.equipe.hover}',
    '.menu-section-play@src': '#{common.pathPrefix}/#{common.play}'
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
if (emptySections) {
    displayDirective['.empty-section-container'] = "";
}
$('body').render(display, displayDirective);

//Navigation functions
var goToIntro = function() {
    window.location.href = "../intro/intro.html";
}

//FadeIn to mask the loading of the page elements
$(document).ready(function() {
    $('.slideshow').fadeIn(1000);
});

if (type=="single") {
    /*
    If there is only one slide, the clycle plugin must not bed activated;
    instead we have to delete the html components of the plugin.
    */
    var singleSlideDirective = {
        '#next' : '',
        '#prev' : '',
        '.slidemenu@style' : "position: absolute; top: 0px; left: 0px; display: block; z-index: 3;"
    };
    $('body').render(display,singleSlideDirective);
} else {
    /*
    Slideshow controller : uses the slideshow plugin to animate the slides
    */
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
            startingSlide: 0
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
        $('#introduction')['show'](appearTime);
        for (i = 0; i <= 5; i++) {
            var nom = "#goto" + i;
            $(nom)['show'](appearTime);
        }
    }
}
