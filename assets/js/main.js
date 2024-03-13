document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.main-slider', {
        // Optional parameters
        loop: true,

        // Navigation arrows
        navigation: {
            nextEl: '.main-slider__next',
            prevEl: '.main-slider__prev',
        },

    });

    const gamesSlider = new Swiper('.games-slider', {
        // Optional parameters
        loop: true,
        slidesPerView: 4,
        // Navigation arrows
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 15
            }
        }

    });

    const questionsLinks = document.querySelectorAll('.questions-list__question')
    questionsLinks.forEach(link=>{
        link.addEventListener('click', (e)=>{
            e.preventDefault()
            link.nextElementSibling.classList.toggle('questions-list__answer_active')
        })
    })

});