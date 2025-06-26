document.addEventListener('DOMContentLoaded', function () {
    const questions = [
        {
            question: "Сколько действующих веществ используется в препарате Батрайдер®?",
            answers: ["Одно", "Два", "Три"],
            correct: 2
        },
        {
            question: "Нужно ли проводить повторную обработку, если после использования Батрайдера® пошел дождь?",
            answers: ["Не нужно, если дождь пошел через 1 час", "Не нужно, если дождь пошел через 2 часа", "В любом случае нужно",],
            correct: 1
        },
        {
            question: "Против каких вредителей поможет Батрайдер®?",
            answers: ["Против сосущих (тля, цикадка, щитовка и т. д.)", "Против листогрызущих (совка, листовёртка, капустная моль и т. д.)", "Против сосущих и листогрызущих",],
            correct: 2
        },
        {
            question: "От каких вредителей защитит Батрайдер®?",
            answers: ["От тли", "От паутинных клещей", "От муравьев"],
            correct: 0
        },
        {
            question: "Что означает цифра в графе «Срок ожидания» в инструкции?",
            answers: ["Количество дней, которое должно пройти до сбора урожая", "Количество дней, которое культура будет под защитой", "Количество дней, которое должно пройти до следующей обработки", ],
            correct: 0
        },
        {
            question: "Как правильно применять раствор препарата Батрайдер®?",
            answers: ["Поливать под корень", "Опрыскивать по листьям", "Поливать растения из лейки"],
            correct: 1
        },
        {
            question: "Какое из следующих утверждений ложное?",
            answers: ["Вредители – переносчики инфекций", "Чем более концентрированным сделать раствор инсектицида, тем лучше подействует препарат", "Большинство садовых вредителей можно увидеть визуально"],
            correct: 1
        },
        {
            question: "В каких пропорциях нужно разводить Батрайдер®?",
            answers: ["2 мл/3 л воды", "2 мл/10 л воды", "Норма разведения зависит от обрабатываемой культуры"],
            correct: 2
        },
        {
            question: "Какого цвета оригинальный суспензионный концентрат препарата Батрайдер®?",
            answers: ["Красный или розовый", "Белый или прозрачный (без цвета)", "Коричневый"],
            correct: 0
        },
        {
            question: "Сколько длится защитный эффект после обработки растений Батрайдером®?",
            answers: ["Минимум 7 дней", "Минимум 10 дней", "Минимум 14 дней"],
            correct: 2
        }
    ];

    // Переменные для управления тестом
    let currentQuestion = 0;
    let score = 0;
    const questionCounter = document.getElementById('question-counter');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const nextButton = document.getElementById('next-button');
    const resultScreen = document.getElementById('result-screen');
    const formScreen = document.getElementById('form-screen');
    const resultText = document.getElementById('result-text');
    const restartButton = document.getElementById('restart-button');
    const testWrapperRight = document.querySelector('.test-wrapper__right')

    // Запуск теста
    function startTest() {
        currentQuestion = 0;
        score = 0;
        showQuestion();
        document.querySelector('.test-block').style.display = 'block';
        resultScreen.style.display = 'none';
        formScreen.style.display = 'none';
    }

    // Показать текущий вопрос
    function showQuestion() {
        const question = questions[currentQuestion];
        questionCounter.textContent = `Вопрос ${currentQuestion + 1} / ${questions.length}`;
        questionText.textContent = question.question;

        answersContainer.innerHTML = '';

        question.answers.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'test-answer';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'test';
            input.id = `answer-${index}`;
            input.value = index;

            const label = document.createElement('label');
            label.htmlFor = `answer-${index}`;

            const p = document.createElement('p');
            p.className = 'text text_size_normal text_color_black';

            const span = document.createElement('span');
            span.textContent = `${String.fromCharCode(1040 + index)}. `; // 1040 - код буквы 'А' в Unicode

            p.appendChild(span);
            p.appendChild(document.createTextNode(answer));
            label.appendChild(p);
            answerDiv.appendChild(input);
            answerDiv.appendChild(label);

            answersContainer.appendChild(answerDiv);
        });
    }

    // Проверить ответ и перейти к следующему вопросу
    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedAnswer = document.querySelector('input[name="test"]:checked');

        if (!selectedAnswer) {
            alert('Пожалуйста, выберите ответ');
            return;
        }

        // Проверка правильности ответа
        if (parseInt(selectedAnswer.value) === questions[currentQuestion].correct) {
            score++;
        }

        // Переход к следующему вопросу или завершение теста
        currentQuestion++;

        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    });

    // Показать результаты
    function showResults() {
        document.querySelector('.test-block').style.display = 'none';

        if (score < questions.length) {
            resultScreen.style.display = 'block';
            resultText.innerHTML = `Вы ответили правильно на <b>${score} из ${questions.length}</b> вопросов. <br>Вы можете попробовать пройти тест снова, чтобы улучшить результат и принять участие в розыгрыше.`;
        } else {
            formScreen.style.display = 'block';
            testWrapperRight.classList.add('test-wrapper__right_active')
            // resultText.textContent += ' Поздравляем! Вы ответили правильно на все вопросы!';
        }
    }

    // Перезапуск теста
    restartButton.addEventListener('click', (e) => {
        e.preventDefault();
        startTest();
    });

    // Начало теста при загрузке страницы
    window.addEventListener('DOMContentLoaded', startTest);
})