const rocket = document.getElementsByClassName('rocket-wrapper__rocket');
const rock1 = document.getElementsByClassName('rocket-wrapper__rock1');
const rock2 = document.getElementsByClassName('rocket-wrapper__rock2');

new simpleParallax(rocket, {
    delay: 0,
    orientation: 'up',
    scale: 1.6,
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
    scale: 15,
    overflow: true,
    // transition: 'cubic-bezier(0,0,0,1)'
});