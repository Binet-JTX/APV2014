/*****************************************************
The function slideify takes an array and split in into
several arrays (slides). The last slide is reorganized
to have a better presentation.
*******************************************************/

var videos_per_slide = 8;

var slideify = function(array,reorganize) {
    //accumulator is the new array (made of slides) being constructed
    array = array.reduce(function(accumulator, currentVideo, index, array) {
        if (accumulator[accumulator.length - 1].length < videos_per_slide) {
            accumulator[accumulator.length - 1].push(currentVideo);
        } else {
            accumulator.push([currentVideo]);
        }
        return accumulator
    }, [
        []
    ])
    var lastSlide = array[array.length - 1];
    var e = {"empty" : true};
    //If there is only two videos on the last slide for instance, they look better
    //centered rather than on the left of the slide.
    if (videos_per_slide == 8 && reorganize) {
        switch (lastSlide.length) {
            case 1:
                array[array.length - 1] = [lastSlide[0],e, e, e, e, e, e, e];
                break;
            case 2:
                array[array.length - 1] = [e,lastSlide[0], lastSlide[1], e, e, e, e, e];
                break;
            case 3:
                array[array.length - 1] = [lastSlide[0], lastSlide[1], lastSlide[2], e, e, e, e, e];
                break;
            case 4:
                array[array.length - 1] = [lastSlide[0], lastSlide[1], lastSlide[2], lastSlide[3], e, e, e, e];
                break;
            case 5:
                array[array.length - 1] = [lastSlide[0], lastSlide[1], lastSlide[2], lastSlide[3], e, lastSlide[4], e, e];
                break;
            case 6:
                array[array.length - 1] = [lastSlide[0], lastSlide[1], lastSlide[2], lastSlide[3], e, lastSlide[4], lastSlide[5], e];
                break;
            case 7:
                array[array.length - 1] = [lastSlide[0], lastSlide[1], lastSlide[2], lastSlide[3], lastSlide[4], lastSlide[5], lastSlide[6], e];
                break;
        }
    }
    return array;
}
