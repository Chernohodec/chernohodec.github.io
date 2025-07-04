document.addEventListener('DOMContentLoaded', function () {


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

    if (document.querySelector('.tabs-swiper')) {
        const prizesSwiper = new Swiper('.tabs-swiper', {
            // Optional parameters
            // spaceBetween: 20,
            autoHeight: true,
            slidesPerView: 1,
            pagination: {
                el: '.tabs-swiper-wrapper__dots',
                type: 'bullets',
            },
        });
    }


    if (document.querySelector('.video-swiper')) {
        const prizesSwiper = new Swiper('.video-swiper', {
            // Optional parameters
            spaceBetween: 20,
            slidesPerView: 4,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    pagination: {
                        el: '.videos-wrapper__dots',
                        type: 'bullets',
                    },
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                }
            },
        });
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

    // // formValidation
    // const form = document.querySelector('.form');
    // const nameInput = form.querySelector('input[type="text"]');
    // const emailInput = form.querySelector('input[type="email"]');
    // const policyCheckbox = form.querySelector('#policyCheck');
    // const actionCheckbox = form.querySelector('#actionCheck');
    // const submitButton = form.querySelector('#submitButton');
    // const testWrapperLeft = document.querySelector('.test-wrapper__left')

    // // Изначально делаем кнопку неактивной
    // submitButton.disabled = true;

    // // Функция проверки валидности всей формы
    // function validateForm() {
    //     const isNameValid = nameInput.value.trim() !== '';
    //     const isEmailValid = emailInput.value.trim() !== '' &&
    //         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
    //     const areCheckboxesChecked = policyCheckbox.checked && actionCheckbox.checked;

    //     // Активируем/деактивируем кнопку в зависимости от валидности формы
    //     submitButton.disabled = !(isNameValid && isEmailValid && areCheckboxesChecked);
    // }

    // // Добавляем обработчики событий для всех полей формы
    // nameInput.addEventListener('input', validateForm);
    // emailInput.addEventListener('input', validateForm);
    // policyCheckbox.addEventListener('change', validateForm);
    // actionCheckbox.addEventListener('change', validateForm);

    // // Обработчик отправки формы
    // form.addEventListener('submit', async function (event) {
    //     event.preventDefault();

    //     // Дополнительная проверка перед отправкой
    //     validateForm();

    //     if (submitButton.disabled) return;

    //     // Блокируем кнопку во время отправки
    //     submitButton.disabled = true;
    //     submitButton.textContent = 'Отправка...';

    //     try {
    //         // 1. Получаем токен reCAPTCHA
    //         // const grecaptcha = window.grecaptcha;
    //         if (!grecaptcha) {
    //             throw new Error('reCAPTCHA не загружена');
    //         }

    //         const token = await grecaptcha.execute('6Lf4NG4rAAAAAL4S1CAJI7bKWvQomyTzjii_-llE', { action: 'submit' });

    //         if (!token) {
    //             throw new Error('Не удалось получить токен reCAPTCHA');
    //         }

    //         // Формируем данные для отправки
    //         const formData = {
    //             name: nameInput.value.trim(),
    //             email: emailInput.value.trim(),
    //             // policyAccepted: policyCheckbox.checked,
    //             // actionAccepted: actionCheckbox.checked,
    //             // timestamp: new Date().toISOString(),
    //             captcha_token: token
    //         };

    //         // Отправляем данные на сервер
    //         const response = await fetch('http://188.127.249.133:10025/api/result/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },

    //             body: JSON.stringify(formData)
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Ошибка HTTP: ${response.status}`);
    //         }

    //         const result = await response.json();

    //         testWrapperLeft.classList.add('test-wrapper__left_active')

    //         // Обработка успешной отправки
    //         // alert('Форма успешно отправлена!');
    //         form.reset(); // Очищаем форму после успешной отправки

    //     } catch (error) {
    //         // Обработка ошибок
    //         console.error('Ошибка при отправке формы:', error);
    //         // alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте ещё раз.');
    //     } finally {
    //         // Восстанавливаем кнопку
    //         submitButton.disabled = false;
    //         submitButton.textContent = 'Отправить';
    //         validateForm(); // Повторная проверка формы
    //     }
    // });

    // // Валидация email при потере фокуса
    // emailInput.addEventListener('blur', function () {
    //     if (emailInput.value.trim() !== '' &&
    //         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    //         emailInput.classList.add('invalid');
    //     } else {
    //         emailInput.classList.remove('invalid');
    //     }
    // });

    // // Валидация имени при потере фокуса
    // nameInput.addEventListener('blur', function () {
    //     if (nameInput.value.trim() === '') {
    //         nameInput.classList.add('invalid');
    //     } else {
    //         nameInput.classList.remove('invalid');
    //     }
    // });


    // modals

    const overlay = document.querySelector('.overlay')
    const instructionModal = document.querySelector('.instruction-modal')
    const optionsModal = document.querySelector('.options-modal')
    const videoModal = document.querySelector('.video-modal')
    const modals = document.querySelectorAll('.modal')
    const instructionButtons = document.querySelectorAll('.instruction-button')
    const videoButtons = document.querySelectorAll('.video-button')
    const closeModalButtons = document.querySelectorAll('.modal__close')
    const closeVideoButton = document.querySelector('.video-modal__close')
    const optionsButtons = document.querySelectorAll('.options-button')
    const iframe = document.querySelector('iframe');

    instructionButtons.forEach(instructionButton => {
        instructionButton.addEventListener('click', function (e) {
            e.preventDefault();
            overlay.classList.add('overlay_active')
            instructionModal.classList.add('modal_active')
        })
    })

    videoButtons.forEach(videoButton => {
        videoButton.addEventListener('click', function (e) {
            e.preventDefault();
            videoSrc = videoButton.getAttribute('data-video')
            overlay.classList.add('overlay_active')
            videoModal.classList.add('modal_active')
            iframe.src = videoSrc
        })
    })

    optionsButtons.forEach(optionButton => {
        optionButton.addEventListener('click', function (e) {
            e.preventDefault();
            overlay.classList.add('overlay_active')
            optionsModal.classList.add('modal_active')
        })
    })

    closeModalButtons.forEach(closeModalButton => {
        closeModalButton.addEventListener('click', function (e) {
            e.preventDefault();
            overlay.classList.remove('overlay_active')
            instructionModal.classList.add('modal_active')
            modals.forEach(modal => modal.classList.remove('modal_active'))
        })
    })

    closeVideoButton.addEventListener('click', function(e){
        console.log(iframe)
        iframe.src = ''
    })

});
