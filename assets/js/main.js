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
    questionsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            link.nextElementSibling.classList.toggle('questions-list__answer_active')
        })
    })

    const hamburger = document.querySelector('.hamburger')
    const xsNavigation = document.querySelector('.header-menu__navigation')

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('is-active')
        xsNavigation.classList.toggle('header-menu__navigation_active')
        document.querySelector('body')
    })

    // tabs script
    const tabsLinks = document.querySelectorAll('.user-tabs-header__link')
    const tabsItems = document.querySelectorAll('.user-tabs-panels__panel')

    tabsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            const target = link.getAttribute('data-target')
            const tabItem = document.querySelector(`#${target}`)

            tabsItems.forEach(item => {
                item.classList.remove('user-tabs-panels__panel_active')
            })
            tabsLinks.forEach(item => {
                item.classList.remove('user-tabs-header__link_active')
            })

            tabItem.classList.add('user-tabs-panels__panel_active')
            link.classList.add('user-tabs-header__link_active')
        })
    })

    // modals

    const userButton = document.querySelector('#user-button')
    const signUpModal = document.querySelector('.modal_type_sign-up')
    const signInModal = document.querySelector('.modal_type_sign-in')
    const closeButtons = document.querySelectorAll('.modal__close')
    const overlay = document.querySelector('.overlay')
    const modalForms = document.querySelectorAll('.modal-form')
    const modals = document.querySelectorAll('.modal')
    const signInModalLink = document.querySelector('#to-sign-in-modal')
    const signUpModalLink = document.querySelector('#to-sign-up-modal')

    if (userButton) {
        userButton.addEventListener('click', (e) => {
            e.preventDefault()
            overlay.classList.add('overlay_active')
            signInModal.classList.add('modal_active')
        })
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            overlay.classList.remove('overlay_active')
            modals.forEach(modal => {
                modal.classList.remove('modal_active')
            })
        })
    }

    if (modals) {
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                e.stopPropagation()
            })
        })
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('modal_active')
            overlay.classList.remove('overlay_active')
        })
    })

    modalForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault()
        })
    })

    if (signInModalLink) {
        signInModalLink.addEventListener('click', (e) => {
            e.preventDefault()
            signUpModal.classList.remove('modal_active')
            signInModal.classList.add('modal_active')
        })
    }

    if (signUpModalLink) {
        signUpModalLink.addEventListener('click', (e) => {
            e.preventDefault()
            signInModal.classList.remove('modal_active')
            signUpModal.classList.add('modal_active')
        })
    }

    const checkUploadButton = document.querySelector('#check-upload')
    const chooseUploadButton = document.querySelector('#choose-upload')
    const checkTypingButton = document.querySelector('#choose-type')
    const modalChoose = document.querySelector('.modal_type_choose')
    const modalTyping = document.querySelector('.modal_type_typing')

    if (checkUploadButton) {
        checkUploadButton.addEventListener('click', (e) => {
            e.preventDefault()
            overlay.classList.add('overlay_active')
            modalChoose.classList.add('modal_active')
        })
    }

    if(chooseUploadButton){
        chooseUploadButton.addEventListener('click', (e) => {
            e.preventDefault()
            modals.forEach(modal => {
                modal.classList.remove('modal_active')
            })
            modalChoose.classList.add('modal_active')
        })
    }

    if (checkTypingButton) {
        checkTypingButton.addEventListener('click', (e) => {
            e.preventDefault()
            overlay.classList.add('overlay_active')
            modals.forEach(modal => {
                modal.classList.remove('modal_active')
            })
            modalTyping.classList.add('modal_active')
        })
    }


});