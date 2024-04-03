const whale1 = document.getElementsByClassName('whales-wrapper__whale1');
const whale2 = document.getElementsByClassName('whales-wrapper__whale2');
const rock1 = document.getElementsByClassName('whales-wrapper__rock1');
const rock2 = document.getElementsByClassName('whales-wrapper__rock2');

new simpleParallax(whale1, {
    delay: 0,
    orientation: 'up',
    scale: 1.5,
    overflow: true,
    transition: 'cubic-bezier(0,0,0,1)'
});

new simpleParallax(whale2, {
    delay: 0,
    orientation: 'up',
    scale: 2,
    overflow: true,
    transition: 'cubic-bezier(0,0,0,1)'
});

new simpleParallax(rock1, {
    delay: 0,
    orientation: 'up',
    scale: 5,
    overflow: true,
    // transition: 'cubic-bezier(0,0,0,1)'
});

new simpleParallax(rock2, {
    delay: 0,
    orientation: 'up',
    scale: 8,
    overflow: true,
    // transition: 'cubic-bezier(0,0,0,1)'
});