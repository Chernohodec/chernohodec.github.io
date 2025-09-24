document.addEventListener('DOMContentLoaded', function () {

    if (document.querySelector('.prizes-swiper')) {
        const prizesSwiper = new Swiper('.prizes-swiper', {
            // Optional parameters
            spaceBetween: 20,
            slidesPerView: 4,
            // slidesPerView: 4,
            navigation: {
                nextEl: ".slider-wrapper__next",
                prevEl: ".slider-wrapper__prev",
            },
            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: "auto",
                },
                990: {
                    spaceBetween: 20,
                    slidesPerView: 4,
                }
            }
        });
    }

    const faqItems = document.querySelectorAll('.faq-item__header')
    faqItems.forEach(faqItem => {
        faqItem.addEventListener('click', () => {
            faqItem.classList.toggle('faq-item__header_active')
        })
    })

    // navigation
    const hamburger = document.querySelector('.hamburger')
    const xsNavigation = document.querySelector('.main-menu')
    if (hamburger && xsNavigation) {

        const toggleNavigation = function () {
            hamburger.classList.toggle('is-active');
            xsNavigation.classList.toggle('main-menu_active');
            document.querySelector('body').classList.toggle('body-ovh');
        }

        hamburger.addEventListener('click', toggleNavigation)
    }
    function updatePrizeDates() {
        const prizesContainer = document.querySelector('.prizes-swiper');
        if (!prizesContainer) return;

        const spans = prizesContainer.querySelectorAll('span[data-time]');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        spans.forEach(span => {
            const dateString = span.getAttribute('data-time');
            const targetDate = new Date(dateString);
            targetDate.setHours(0, 0, 0, 0);

            const diffTime = targetDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let message = '';

            if (diffDays === 0) {
                message = 'Откроем сегодня';
            } else if (diffDays === 1) {
                message = 'Откроем завтра';
            } else if (diffDays === 2) {
                message = 'Откроем послезавтра';
            } else if (diffDays > 2) {
                message = `Откроем через ${diffDays} дня`;
            } else {
                message = 'Уже открыто';
            }

            span.textContent = message;
        });
    }

    updatePrizeDates();

});
