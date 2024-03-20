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
        loop: false,
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

    const hamburger = document.querySelector('.hamburger')
    const xsNavigation = document.querySelector('.header-menu__navigation')

    hamburger.addEventListener('click', ()=>{
        hamburger.classList.toggle('is-active')
        xsNavigation.classList.toggle('header-menu__navigation_active')
        document.querySelector('body')
    })

    // tabs script
    const tabsLinks = document.querySelectorAll('.user-tabs-header__link')
    const tabsItems = document.querySelectorAll('.user-tabs-panels__panel')

    tabsLinks.forEach(link=>{
        link.addEventListener('click', (e)=>{
            e.preventDefault()
            const target = link.getAttribute('data-target')
            const tabItem = document.querySelector(`#${target}`)

            tabsItems.forEach(item=>{
                item.classList.remove('user-tabs-panels__panel_active')
            })
            tabsLinks.forEach(item=>{
                item.classList.remove('user-tabs-header__link_active')
            })

            tabItem.classList.add('user-tabs-panels__panel_active')
            link.classList.add('user-tabs-header__link_active')
        })
    })

});