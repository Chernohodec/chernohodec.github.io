document.addEventListener('DOMContentLoaded', function () {
    // Элементы формы
    const form = document.querySelector('.form');
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const policyCheckbox = form.querySelector('#policyCheck');
    const actionCheckbox = form.querySelector('#actionCheck');
    const submitButton = form.querySelector('#submitButton');
    const testWrapperLeft = document.querySelector('.test-wrapper__left');

    // Состояние reCAPTCHA
    let isRecaptchaVerified = false;

    // Изначально делаем кнопку неактивной
    submitButton.disabled = true;

    // Callback при успешной проверке reCAPTCHA
    window.onRecaptchaSuccess = function (token) {
        isRecaptchaVerified = true;
        validateForm();
    };

    // Callback при истечении времени reCAPTCHA
    window.onRecaptchaExpired = function () {
        isRecaptchaVerified = false;
        validateForm();
    };

    // Функция проверки валидности всей формы
    function validateForm() {
        const isNameValid = nameInput.value.trim() !== '';
        const isEmailValid = emailInput.value.trim() !== '' &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
        const areCheckboxesChecked = policyCheckbox.checked && actionCheckbox.checked;
        const isFormValid = isNameValid && isEmailValid && areCheckboxesChecked && isRecaptchaVerified;

        submitButton.disabled = !isFormValid;
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
            // Проверяем reCAPTCHA
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                throw new Error('Пожалуйста, подтвердите, что вы не робот');
            }

            // Формируем данные для отправки
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                // policyAccepted: policyCheckbox.checked,
                // actionAccepted: actionCheckbox.checked,
                captcha_token: recaptchaResponse
            };

            // Отправляем данные на сервер
            const response = await fetch('http://188.127.249.133:10025/api/result/', {
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

            // Обработка успешной отправки
            testWrapperLeft.classList.add('test-wrapper__left_active');
            form.reset();
            grecaptcha.reset();
            isRecaptchaVerified = false;

        } catch (error) {
            console.error('Ошибка при отправке формы:', error);

            // Показываем ошибку пользователю
            const errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.textContent = error.message;

            // Удаляем старые ошибки
            const oldErrors = form.querySelectorAll('.form-error');
            oldErrors.forEach(el => el.remove());

            form.appendChild(errorElement);

            // Сбрасываем reCAPTCHA при ошибке
            grecaptcha.reset();
            isRecaptchaVerified = false;

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Отправить';
            validateForm();
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

    // Первоначальная валидация формы
    validateForm();
});