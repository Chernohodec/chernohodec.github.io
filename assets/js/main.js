document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.main-slider', {
        // Optional parameters
        loop: true,
        speed: 500,
        autoplay: {
            delay: 4000,
        },

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
    const navLinks = document.querySelectorAll('.header-links__link')
    const toggleNavigation = () => {
        hamburger.classList.toggle('is-active')
        xsNavigation.classList.toggle('header-menu__navigation_active')
    }

    navLinks.forEach(navLink => {
        navLink.addEventListener('click', toggleNavigation)
    })

    hamburger.addEventListener('click', toggleNavigation)

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

    // const userButton = document.querySelector('#user-button')
    const userButtons = document.querySelectorAll('.user-button')
    const signUpModal = document.querySelector('.modal_type_sign-up')
    const signInModal = document.querySelector('.modal_type_sign-in')
    const closeButtons = document.querySelectorAll('.modal__close')
    const overlay = document.querySelector('.overlay')
    const modalForms = document.querySelectorAll('.modal-form')
    const modals = document.querySelectorAll('.modal')
    const signInModalLink = document.querySelector('#to-sign-in-modal')
    const signUpModalLink = document.querySelector('#to-sign-up-modal')

    userButtons.forEach(userButton => {
        if (userButton) {
            userButton.addEventListener('click', (e) => {
                e.preventDefault()
                xsNavigation.classList.remove('header-menu__navigation_active')
                hamburger.classList.remove('is-active')
                overlay.classList.add('overlay_active')
                signInModal.classList.add('modal_active')
            })
        }
    })

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
            e.preventDefault()
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
    const checkTypingButtons = document.querySelectorAll('.choose-type')
    const checkFile = document.querySelector('#checkfile')
    const checkFileWrapper = document.querySelector('.modal-file')
    const chooseModalWrapper = document.querySelector('.modal-choose')
    const modalChoose = document.querySelector('.modal_type_choose')
    const modalTyping = document.querySelector('.modal_type_typing')

    if (checkUploadButton) {
        checkUploadButton.addEventListener('click', (e) => {
            e.preventDefault()
            overlay.classList.add('overlay_active')
            modalChoose.classList.add('modal_active')
        })
    }

    if (chooseUploadButton) {
        chooseUploadButton.addEventListener('click', (e) => {
            e.preventDefault()
            modals.forEach(modal => {
                modal.classList.remove('modal_active')
            })
            modalChoose.classList.add('modal_active')
        })
    }

    if (checkTypingButtons) {
        checkTypingButtons.forEach(checkTypingButton=>{
            checkTypingButton.addEventListener('click', (e) => {
                e.preventDefault()
                overlay.classList.add('overlay_active')
                modals.forEach(modal => {
                    modal.classList.remove('modal_active')
                })
                modalTyping.classList.add('modal_active')
            })
        })
    }

    if(checkFile){
        checkFile.addEventListener('change', (e)=>{
            const file = e.target.files[0];
            if(file){
                checkFileWrapper.classList.add('modal-file_active')
                chooseModalWrapper.classList.add('modal-choose_hidden')
                checkFileWrapper.querySelector('.modal-file__name').textContent = file.name
            }
        })

        checkFileWrapper.querySelector('.modal-file__delete').addEventListener('click', (e)=>{
            e.preventDefault()
            checkFile.value = ''
            checkFileWrapper.querySelector('.modal-file__name').textContent = ''
            checkFileWrapper.classList.remove('modal-file_active')
            chooseModalWrapper.classList.remove('modal-choose_hidden')
        })
    }


});