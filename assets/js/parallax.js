const whale1 = document.getElementsByClassName('whales-wrapper__whale1');
const whale2 = document.getElementsByClassName('whales-wrapper__whale2');
const whale3 = document.getElementsByClassName('whales-wrapper__whale3');
const whale4 = document.getElementsByClassName('whales-wrapper__whale4');
const whale5 = document.getElementsByClassName('whales-wrapper__whale5');
const whale6 = document.getElementsByClassName('whales-wrapper__whale6');
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

new simpleParallax(whale3, {
    delay: 0,
    orientation: 'up',
    scale: 1.5,
    overflow: true,
    transition: 'cubic-bezier(0,0,0,1)'
});

new simpleParallax(whale4, {
    delay: 0,
    orientation: 'up',
    scale: 2,
    overflow: true,
    transition: 'cubic-bezier(0,0,0,1)'
});

new simpleParallax(whale5, {
    delay: 0,
    orientation: 'up',
    scale: 3,
    overflow: true,
    transition: 'cubic-bezier(0,0,0,1)'
});

new simpleParallax(whale6, {
    delay: 0,
    orientation: 'up',
    scale: 3,
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