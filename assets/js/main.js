document.addEventListener('DOMContentLoaded', function () {

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const hamburger = document.querySelector('.hamburger')
    const xsNavigation = document.querySelector('.menu-wrapper')
    const anchors = document.querySelectorAll('.main-menu__link')
    // const navLinks = document.querySelectorAll('.header-links__link')
    const toggleNavigation = () => {
        hamburger.classList.toggle('is-active');
        xsNavigation.classList.toggle('menu-wrapper_active');
        document.querySelector('body').classList.toggle('body-ovh');
    }

    hamburger.addEventListener('click', toggleNavigation)
    anchors.forEach(anchor => {
        anchor.addEventListener('click', () => {
            if (hamburger.classList.contains('is-active')) {
                toggleNavigation()
            }
        })
    })

    const instructionsTabs = document.querySelectorAll('.instructions__tabs .tabs__tab')
    if (instructionsTabs) {
        instructionsTabs.forEach(instructionsTab => {
            instructionsTab.addEventListener('click', (e) => {
                e.preventDefault()
                instructionsTabs.forEach(instructionsTab => instructionsTab.classList.remove('tabs__tab-active'))
                instructionsTab.classList.add('tabs__tab-active')
                const target = instructionsTab.getAttribute('data-target')
                const panels = document.querySelectorAll('.instructions__panel')
                const targetPanel = document.getElementById(target)
                panels.forEach(panel => {
                    panel.classList.remove('instructions__panel_active')
                })
                targetPanel.classList.add('instructions__panel_active')
            })
        })
    }

    if (document.querySelector('.types-items-swiper') && window.innerWidth < 1200) {
        const prizesSwiper = new Swiper('.types-items-swiper', {
            // Optional parameters
            spaceBetween: 20,
            slidesPerView: 1,
            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    navigation: {
                        nextEl: '.types-section__arrow-next',
                        prevEl: '.types-section__arrow-prev',
                    },
                },
                1200: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    settings: "unslick"
                }
            }

        });
    }

    const productTubsButtons = ['Капли', 'Ошейник', 'Спрей', 'Шампунь']

    if (document.querySelector('.products-swiper')) {
        const prizesSwiper = new Swiper('.products-swiper', {
            // Optional parameters
            spaceBetween: 20,
            slidesPerView: 1,
            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    autoHeight: true,
                },
                1200: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    // settings: "unslick"
                }
            },
            navigation: {
                nextEl: '.products-section__arrow-next',
                prevEl: '.products-section__arrow-prev',
            },
            pagination: {
                el: '.products-section__tabs',
                clickable: true,
                renderBullet: function (index, className) {
                    return `<span class="tabs__tab swiper-pagination-bullet">${productTubsButtons[index]}</span>`;
                },
            },


        });
    }

    const instructionsSwipers = document.querySelectorAll('.instructions-swiper')
    if (instructionsSwipers) {
        instructionsSwipers.forEach(instructionsSwiper => {
            const instructionSwiperItem = new Swiper(instructionsSwiper, {
                // Optional parameters
                spaceBetween: 20,
                slidesPerView: 1,
                breakpoints: {
                    // when window width is >= 320px
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 90,
                        settings: "unslick"
                    }
                }

            });
        })

    }


    const faqItems = document.querySelectorAll('.faq-item__top');

    if (faqItems) {
        faqItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault(); // Предотвращаем переход по ссылке

                const parentItem = this.closest('.faq-item');
                // const content = parentItem.querySelector('.faq-item__content');

                parentItem.classList.toggle('faq-item_active');
            });
        });
    }

    new SimpleBar(document.getElementById('faq-scroll'), { autoHide: false, scrollbarMaxSize: 100, opacity: 1 });

    const phoneInput = document.getElementById('phone');
    const form = document.querySelector('#mainForm')
    const nameInput = document.getElementById('name')
    const formButton = document.querySelector('.form-button')
    const acceptance = document.querySelector('#acceptance')


    const maskOptions = {
        mask: '+{7}(000)000-00-00'
    };
    const mask = IMask(phoneInput, maskOptions);

    const checkFormValid = () => {
        if (nameInput.value.length > 0 && phoneInput.value.length > 0 && acceptance.checked === true) {
            formButton.disabled = false
        } else {
            formButton.disabled = true
        }
    }

    form.addEventListener('submit', (e) => {
        // e.preventDefault()
    })

    nameInput.addEventListener('change', checkFormValid)
    phoneInput.addEventListener('change', checkFormValid)
    acceptance.addEventListener('change', checkFormValid)


    // svg animation
    const paths = document.querySelectorAll('#shops-steps g g');
    const totalPaths = paths.length;
    const duration = 0.5; // Длительность анимации одного элемента (сек)
    const delayBetween = 0.5; // Задержка между элементами (сек)
    const totalCycleTime = (duration + delayBetween) * totalPaths;

    function animatePaths() {
        // Сначала сбрасываем все элементы в начальное состояние
        paths.forEach(path => {
            path.style.opacity = '0';
            path.style.animation = 'none';
        });

        // Затем запускаем анимацию снова
        setTimeout(() => {
            paths.forEach((path, index) => {
                const reverseIndex = totalPaths - 1 - index;
                path.style.animation = `fadeIn ${duration}s ${reverseIndex * delayBetween}s forwards`;
            });

            // Запланировать следующий цикл
            setTimeout(animatePaths, totalCycleTime * 1000 - 10000);
        }, 10); // Небольшая задержка для сброса
    }

    // Начальный запуск
    animatePaths();

    const formStatus = getQueryParam('form');
    if(formStatus === 'sent'){
        const formBlock = document.querySelector('.form-section__content')
        console.log(formBlock)
        formBlock.classList.add('send')
    }
});
