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

    // formValidation
    const form = document.querySelector('.form');
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const policyCheckbox = form.querySelector('#policyCheck');
    const actionCheckbox = form.querySelector('#actionCheck');
    const submitButton = form.querySelector('#submitButton');
    const testWrapperLeft = document.querySelector('.test-wrapper__left')

    // Изначально делаем кнопку неактивной
    submitButton.disabled = true;

    // Функция проверки валидности всей формы
    function validateForm() {
        const isNameValid = nameInput.value.trim() !== '';
        const isEmailValid = emailInput.value.trim() !== '' &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
        const areCheckboxesChecked = policyCheckbox.checked && actionCheckbox.checked;

        // Активируем/деактивируем кнопку в зависимости от валидности формы
        submitButton.disabled = !(isNameValid && isEmailValid && areCheckboxesChecked);
    }

    // Добавляем обработчики событий для всех полей формы
    nameInput.addEventListener('input', validateForm);
    emailInput.addEventListener('input', validateForm);
    policyCheckbox.addEventListener('change', validateForm);
    actionCheckbox.addEventListener('change', validateForm);

    // Обработчик отправки формы
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Дополнительная проверка перед отправкой
        validateForm();

        if (submitButton.disabled) return;

        // Блокируем кнопку во время отправки
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        try {
            // Формируем данные для отправки
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                policyAccepted: policyCheckbox.checked,
                actionAccepted: actionCheckbox.checked,
                timestamp: new Date().toISOString()
            };

            // Отправляем данные на сервер
            const response = await fetch('https://example.com/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const result = await response.json();

            testWrapperLeft.classList.add('test-wrapper__left_active')

            // Обработка успешной отправки
            // alert('Форма успешно отправлена!');
            form.reset(); // Очищаем форму после успешной отправки

        } catch (error) {
            // Обработка ошибок
            console.error('Ошибка при отправке формы:', error);
            // alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте ещё раз.');
        } finally {
            // Восстанавливаем кнопку
            submitButton.disabled = false;
            submitButton.textContent = 'Отправить';
            validateForm(); // Повторная проверка формы
        }
    });

    // Валидация email при потере фокуса
    emailInput.addEventListener('blur', function () {
        if (emailInput.value.trim() !== '' &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            emailInput.classList.add('invalid');
        } else {
            emailInput.classList.remove('invalid');
        }
    });

    // Валидация имени при потере фокуса
    nameInput.addEventListener('blur', function () {
        if (nameInput.value.trim() === '') {
            nameInput.classList.add('invalid');
        } else {
            nameInput.classList.remove('invalid');
        }
    });
});
