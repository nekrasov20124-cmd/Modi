// Массив для хранения опросов
let surveys = [];
let validTokens = []; // Массив действительных токенов (сохраняем для обратной совместимости)
let vipStatus = false; // Статус VIP пользователя
const VIP_TOKEN = "vip2025"; // Токен для активации VIP
let currentTheme = 'light'; // Текущая тема (light или dark)

// Загрузка опросов и токенов из localStorage при запуске
document.addEventListener('DOMContentLoaded', function() {
    loadSurveys();
    loadTokens();
    loadVipStatus();
    loadThemePreference();
    showSurveyList();
    
    // Назначение обработчиков событий
    document.getElementById('homeBtn').addEventListener('click', showSurveyList);
    document.getElementById('createSurveyBtn').addEventListener('click', showCreateSurveyForm);
    document.getElementById('createTestBtn').addEventListener('click', showCreateTestForm);
    document.getElementById('vipBtn').addEventListener('click', showVipForm);
    document.getElementById('addQuestion').addEventListener('click', addQuestion);
    document.getElementById('newSurveyForm').addEventListener('submit', createSurvey);
    document.getElementById('activateVipBtn').addEventListener('click', activateVip);
    document.getElementById('backFromVipBtn').addEventListener('click', showSurveyList);
    document.getElementById('cancelSurveyBtn').addEventListener('click', showSurveyList);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Добавляем обработчики для команд в консоли
    setupConsoleCommands();
    
    // Добавляем обработчик изменения количества вопросов
    const questionCountInput = document.getElementById('questionCount');
    if (questionCountInput) {
        questionCountInput.addEventListener('change', updateQuestionFields);
    }
});

// Настройка команд для консоли
function setupConsoleCommands() {
    // Функция для создания тестового опроса
    window.createTestSurvey = function() {
        const testSurvey = {
            id: Date.now(),
            title: "Тестовый опрос",
            description: "Это тестовый опрос для проверки функциональности системы",
            questions: [
                {
                    text: "Какова ваша степень удовлетворенности нашей системой?",
                    type: "single",
                    answers: ["Очень довольны", "Довольны", "Удовлетворительно", "Не довольны"]
                },
                {
                    text: "Какие функции вам больше всего нравятся? (Выберите все подходящие варианты)",
                    type: "multiple",
                    answers: ["Интерфейс", "Функциональность", "Скорость работы", "Дизайн"]
                },
                {
                    text: "Что бы вы хотели улучшить в нашей системе?",
                    type: "text",
                    answers: []
                },
                {
                    text: "Насколько вероятно, что вы порекомендуете нашу систему другим?",
                    type: "single",
                    answers: ["Очень вероятно", "Вероятно", "Маловероятно", "Совсем невероятно"]
                },
                {
                    text: "Какие дополнительные функции вы бы хотели видеть?",
                    type: "text",
                    answers: []
                },
                {
                    text: "Оцените удобство использования интерфейса",
                    type: "single",
                    answers: ["Отлично", "Хорошо", "Удовлетворительно", "Плохо"]
                },
                {
                    text: "Как часто вы используете нашу систему?",
                    type: "single",
                    answers: ["Ежедневно", "Несколько раз в неделю", "Раз в неделю", "Реже"]
                },
                {
                    text: "Что вас больше всего раздражает в системе?",
                    type: "multiple",
                    answers: ["Сложность", "Медленная работа", "Непонятный интерфейс", "Ошибки", "Ничего"]
                },
                {
                    text: "Какие улучшения вы бы предложили?",
                    type: "text",
                    answers: []
                },
                {
                    text: "Общая оценка системы",
                    type: "single",
                    answers: ["5 - Отлично", "4 - Хорошо", "3 - Удовлетворительно", "2 - Плохо", "1 - Очень плохо"]
                }
            ],
            responses: [],
            isTest: true // Пометка тестового опроса
        };
        
        surveys.push(testSurvey);
        saveSurveys();
        console.log(`Тестовый опрос создан: "${testSurvey.title}"`);
        console.log('Тестовый опрос добавлен в список опросов');
        showSurveyList();
        return testSurvey;
    };
    
    // Функция для активации VIP через консоль
    window.activateVip = function() {
        vipStatus = true;
        saveVipStatus();
        console.log('VIP статус активирован!');
        return true;
    };
}

// Загрузка опросов из localStorage
function loadSurveys() {
    const savedSurveys = localStorage.getItem('surveys');
    if (savedSurveys) {
        surveys = JSON.parse(savedSurveys);
    }
}

// Загрузка токенов из localStorage
function loadTokens() {
    const savedTokens = localStorage.getItem('tokens');
    if (savedTokens) {
        validTokens = JSON.parse(savedTokens);
    }
}

// Загрузка VIP статуса из localStorage
function loadVipStatus() {
    const savedVipStatus = localStorage.getItem('vipStatus');
    if (savedVipStatus) {
        vipStatus = JSON.parse(savedVipStatus);
    }
}

// Загрузка настроек темы из localStorage
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon();
    }
}

// Сохранение настроек темы в localStorage
function saveThemePreference() {
    localStorage.setItem('theme', currentTheme);
}

// Переключение темы
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    saveThemePreference();
    updateThemeIcon();
}

// Обновление иконки темы
function updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
}

// Сохранение опросов в localStorage
function saveSurveys() {
    localStorage.setItem('surveys', JSON.stringify(surveys));
}

// Сохранение токенов в localStorage
function saveTokens() {
    localStorage.setItem('tokens', JSON.stringify(validTokens));
}

// Сохранение VIP статуса в localStorage
function saveVipStatus() {
    localStorage.setItem('vipStatus', JSON.stringify(vipStatus));
}

// Генерация уникального ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Отображение формы VIP функций
function showVipForm() {
    hideAllForms();
    document.getElementById('vipForm').style.display = 'block';
    document.getElementById('vipToken').value = '';
}

// Активация VIP статуса
function activateVip() {
    const token = document.getElementById('vipToken').value;
    
    if (token === VIP_TOKEN) {
        vipStatus = true;
        saveVipStatus();
        alert('VIP статус успешно активирован! Теперь вы можете создавать опросы с 10-100 вопросами.');
        showSurveyList();
        console.log('VIP статус активирован через интерфейс');
    } else {
        alert('Неверный VIP токен');
    }
}

// Отображение формы создания теста
function showCreateTestForm() {
    hideAllForms();
    
    // Создаем HTML для формы создания теста с возможностью настройки вопросов
    let html = `
        <div id="createTestForm">
            <div class="form-header">
                <h2>Создать тестовый опрос</h2>
            </div>
            <p>Настройте вопросы для включения в тестовый опрос:</p>
            
            <form id="testForm">
                <div class="form-group">
                    <label for="testTitle">Название теста:</label>
                    <input type="text" id="testTitle" value="Тестовый опрос" required>
                </div>
                
                <div class="form-group">
                    <label for="testDescription">Описание теста:</label>
                    <textarea id="testDescription">Это тестовый опрос для проверки функциональности системы</textarea>
                </div>
                
                <div class="questions-editor">
                    <h3>Вопросы теста:</h3>
                    <div id="questionsList">
    `;
    
    // Добавляем 3 вопроса по умолчанию
    for (let i = 0; i < 3; i++) {
        html += createQuestionEditorHTML(i);
    }
    
    html += `
                    </div>
                    <button type="button" id="addQuestionBtn" class="btn btn-outline">Добавить вопрос</button>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Создать тест</button>
                    <button type="button" class="btn btn-outline" onclick="showSurveyList()">Отмена</button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('app').innerHTML = html;
    
    // Добавляем обработчики событий
    document.getElementById('testForm').addEventListener('submit', createCustomTestSurvey);
    document.getElementById('addQuestionBtn').addEventListener('click', addQuestionToTest);
    
    // Добавляем обработчики для уже существующих вопросов
    for (let i = 0; i < 3; i++) {
        setupQuestionEventListeners(i);
    }
}

// Создание HTML для редактора вопроса
function createQuestionEditorHTML(index) {
    return `
        <div class="question-editor" id="question-${index}">
            <div class="question-header">
                <h4>Вопрос ${index + 1}</h4>
                <button type="button" class="btn btn-danger remove-question" data-index="${index}">Удалить</button>
            </div>
            <div class="form-group">
                <label>Текст вопроса:</label>
                <input type="text" class="question-text" placeholder="Введите текст вопроса" value="Вопрос ${index + 1}">
            </div>
            <div class="form-group">
                <label>Тип вопроса:</label>
                <select class="question-type">
                    <option value="single">Один ответ</option>
                    <option value="multiple">Несколько ответов</option>
                    <option value="text">Текстовый ответ</option>
                </select>
            </div>
            <div class="answers-editor">
                <label>Варианты ответов:</label>
                <div class="answers-list" id="answers-${index}">
                    <div class="answer-item">
                        <input type="text" class="answer-text" placeholder="Введите вариант ответа">
                        <button type="button" class="btn btn-danger remove-answer">Удалить</button>
                    </div>
                </div>
                <button type="button" class="btn btn-outline add-answer" data-index="${index}">Добавить вариант ответа</button>
            </div>
        </div>
    `;
}

// Настройка обработчиков событий для вопроса
function setupQuestionEventListeners(index) {
    // Удаление вопроса
    const removeButtons = document.querySelectorAll('.remove-question');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const questionIndex = parseInt(this.getAttribute('data-index'));
            removeQuestion(questionIndex);
        });
    });
    
    // Добавление варианта ответа
    const addAnswerButtons = document.querySelectorAll('.add-answer');
    addAnswerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const questionIndex = parseInt(this.getAttribute('data-index'));
            addAnswerToQuestion(questionIndex);
        });
    });
    
    // Удаление варианта ответа
    const removeAnswerButtons = document.querySelectorAll('.remove-answer');
    removeAnswerButtons.forEach(button => {
        button.addEventListener('click', function() {
            removeAnswer(this);
        });
    });
}

// Добавление нового вопроса в тест
function addQuestionToTest() {
    const questionsList = document.getElementById('questionsList');
    const questionIndex = questionsList.children.length;
    
    const questionHTML = createQuestionEditorHTML(questionIndex);
    questionsList.insertAdjacentHTML('beforeend', questionHTML);
    
    // Добавляем обработчики событий для нового вопроса
    setupQuestionEventListeners(questionIndex);
}

// Удаление вопроса из теста
function removeQuestion(index) {
    if (document.querySelectorAll('.question-editor').length <= 1) {
        alert('Должен остаться хотя бы один вопрос');
        return;
    }
    
    const questionElement = document.getElementById(`question-${index}`);
    if (questionElement) {
        questionElement.remove();
        // Перенумеровываем оставшиеся вопросы
        renumberQuestions();
    }
}

// Переименование вопросов
function renumberQuestions() {
    const questions = document.querySelectorAll('.question-editor');
    questions.forEach((question, index) => {
        question.querySelector('h4').textContent = `Вопрос ${index + 1}`;
        question.id = `question-${index}`;
        
        // Обновляем атрибуты data-index
        const removeButton = question.querySelector('.remove-question');
        if (removeButton) {
            removeButton.setAttribute('data-index', index);
        }
        
        const addAnswerButton = question.querySelector('.add-answer');
        if (addAnswerButton) {
            addAnswerButton.setAttribute('data-index', index);
        }
        
        const answersList = question.querySelector('.answers-list');
        if (answersList) {
            answersList.id = `answers-${index}`;
        }
    });
}

// Добавление варианта ответа к вопросу
function addAnswerToQuestion(questionIndex) {
    const answersList = document.getElementById(`answers-${questionIndex}`);
    if (answersList) {
        const answerHTML = `
            <div class="answer-item">
                <input type="text" class="answer-text" placeholder="Введите вариант ответа">
                <button type="button" class="btn btn-danger remove-answer">Удалить</button>
            </div>
        `;
        answersList.insertAdjacentHTML('beforeend', answerHTML);
        
        // Добавляем обработчик для кнопки удаления
        const newRemoveButton = answersList.lastElementChild.querySelector('.remove-answer');
        newRemoveButton.addEventListener('click', function() {
            removeAnswer(this);
        });
    }
}

// Удаление варианта ответа
function removeAnswer(button) {
    const answerItem = button.closest('.answer-item');
    if (answerItem) {
        // Проверяем, чтобы остался хотя бы один вариант ответа
        const answersList = answerItem.closest('.answers-list');
        if (answersList && answersList.children.length <= 1) {
            alert('Должен остаться хотя бы один вариант ответа');
            return;
        }
        answerItem.remove();
    }
}

// Создание пользовательского тестового опроса
function createCustomTestSurvey(e) {
    e.preventDefault();
    
    const title = document.getElementById('testTitle').value;
    const description = document.getElementById('testDescription').value;
    const questionElements = document.querySelectorAll('.question-editor');
    
    if (questionElements.length === 0) {
        alert('Добавьте хотя бы один вопрос');
        return;
    }
    
    const questions = [];
    
    questionElements.forEach(questionElement => {
        const questionText = questionElement.querySelector('.question-text').value;
        const questionType = questionElement.querySelector('.question-type').value;
        const answers = [];
        
        // Для текстовых вопросов не собираем варианты ответов
        if (questionType !== 'text') {
            const answerElements = questionElement.querySelectorAll('.answer-text');
            answerElements.forEach(answerElement => {
                const answerText = answerElement.value.trim();
                if (answerText) {
                    answers.push(answerText);
                }
            });
            
            // Проверяем, что есть хотя бы один вариант ответа
            if (answers.length === 0) {
                alert('Добавьте хотя бы один вариант ответа для вопроса: ' + questionText);
                return;
            }
        }
        
        questions.push({
            text: questionText,
            type: questionType,
            answers: answers
        });
    });
    
    const testSurvey = {
        id: Date.now(),
        title: title,
        description: description,
        questions: questions,
        responses: [],
        isTest: true
    };
    
    surveys.push(testSurvey);
    saveSurveys();
    console.log(`Пользовательский тестовый опрос создан: "${testSurvey.title}" с ${questions.length} вопросами`);
    alert('Тестовый опрос успешно создан!');
    showSurveyList();
}

// Создание тестового опроса через интерфейс
function createTestSurveyUI() {
    showCreateTestForm();
}

// Отображение списка опросов
function showSurveyList() {
    hideAllForms();
    document.getElementById('surveyList').style.display = 'block';
    
    const container = document.getElementById('surveysContainer');
    container.innerHTML = '';
    
    if (surveys.length === 0) {
        container.innerHTML = '<p>Пока нет доступных опросов. Создайте первый опрос!</p>';
        return;
    }
    
    surveys.forEach((survey, index) => {
        const surveyCard = document.createElement('div');
        surveyCard.className = 'survey-card';
        
        // Добавляем пометку для тестовых опросов
        const testBadge = survey.isTest ? '<span class="test-badge">ТЕСТ</span>' : '';
        const vipBadge = survey.isVip ? '<span class="test-badge" style="background-color: #4ade80;">VIP</span>' : '';
        
        surveyCard.innerHTML = `
            <h3>${survey.title} ${testBadge} ${vipBadge}</h3>
            <p>${survey.description || 'Без описания'}</p>
            <div class="stats">
                <span>Вопросов: ${survey.questions.length}${survey.maxQuestions ? '/' + survey.maxQuestions : ''}</span>
                <span>Ответов: ${survey.responses.length}</span>
            </div>
            <div class="survey-actions">
                <button class="btn btn-primary" onclick="takeSurvey(${index})">Пройти опрос</button>
                <button class="btn btn-outline" onclick="showResults(${index})">Результаты</button>
                ${survey.isTest ? `<button class="btn btn-danger" onclick="deleteTestSurvey(${index})">Удалить тест</button>` : ''}
            </div>
        `;
        container.appendChild(surveyCard);
    });
}

// Удаление тестового опроса
function deleteTestSurvey(index) {
    if (confirm('Вы уверены, что хотите удалить этот тестовый опрос?')) {
        surveys.splice(index, 1);
        saveSurveys();
        showSurveyList();
        console.log('Тестовый опрос удален');
    }
}

// Скрытие всех форм
function hideAllForms() {
    document.getElementById('surveyList').style.display = 'none';
    document.getElementById('createSurveyForm').style.display = 'none';
    document.getElementById('vipForm').style.display = 'none';
}

// Отображение формы создания опроса
function showCreateSurveyForm() {
    hideAllForms();
    document.getElementById('createSurveyForm').style.display = 'block';
    
    // Обновляем интерфейс в зависимости от VIP статуса
    updateVipInterface();
    
    // Сброс формы
    document.getElementById('newSurveyForm').reset();
    
    // Устанавливаем количество вопросов по умолчанию
    const questionCountInput = document.getElementById('questionCount');
    if (questionCountInput) {
        questionCountInput.value = vipStatus ? 10 : 10;
        questionCountInput.min = 10;
        questionCountInput.max = vipStatus ? 100 : 10;
    }
    
    // Обновляем поля вопросов
    updateQuestionFields();
}

// Обновление интерфейса в зависимости от VIP статуса
function updateVipInterface() {
    const limitText = document.getElementById('limitText');
    const vipInfo = document.getElementById('vipInfo');
    const questionCountInput = document.getElementById('questionCount');
    
    if (vipStatus) {
        limitText.style.display = 'none';
        vipInfo.style.display = 'block';
        if (questionCountInput) {
            questionCountInput.max = 100;
        }
        document.getElementById('vipStatusIndicator').innerHTML = '<span class="test-badge" style="background-color: #4ade80;">VIP</span>';
    } else {
        limitText.style.display = 'block';
        vipInfo.style.display = 'none';
        if (questionCountInput) {
            questionCountInput.max = 10;
            questionCountInput.value = 10;
        }
        document.getElementById('vipStatusIndicator').innerHTML = '';
    }
}

// Обновление полей вопросов в зависимости от выбранного количества
function updateQuestionFields() {
    const questionCount = parseInt(document.getElementById('questionCount').value) || 10;
    const questionsContainer = document.getElementById('questionsContainer');
    
    // Ограничиваем количество вопросов
    const maxQuestions = vipStatus ? 100 : 10;
    const clampedQuestionCount = Math.max(10, Math.min(maxQuestions, questionCount));
    
    if (questionCount !== clampedQuestionCount) {
        document.getElementById('questionCount').value = clampedQuestionCount;
    }
    
    // Очищаем контейнер вопросов
    questionsContainer.innerHTML = `
        <div class="question-header">
            <h3>Вопросы (1/${clampedQuestionCount})</h3>
        </div>
    `;
    
    // Создаем указанное количество вопросов
    for (let i = 0; i < clampedQuestionCount; i++) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <div class="question-header">
                <h4>Вопрос ${i + 1}</h4>
            </div>
            <div class="question-type">
                <input type="text" class="questionText" placeholder="Введите вопрос" required>
                <select class="questionType">
                    <option value="single">Один ответ</option>
                    <option value="multiple">Несколько ответов</option>
                    <option value="text">Текстовый ответ</option>
                </select>
            </div>
            <div class="answers">
                <div class="answerOption">
                    <input type="text" class="answerOption" placeholder="Вариант ответа">
                </div>
                <button type="button" class="btn btn-outline addAnswer">Добавить вариант</button>
            </div>
        `;
        questionsContainer.appendChild(questionDiv);
        
        // Добавляем обработчик события для кнопки добавления варианта
        questionDiv.querySelector('.addAnswer').addEventListener('click', function() {
            addAnswer(this);
        });
    }
    
    // Обновляем счетчик вопросов в заголовке
    const counterElement = document.querySelector('#questionsContainer h3');
    if (counterElement) {
        counterElement.textContent = `Вопросы (1/${clampedQuestionCount})`;
    }
    
    // Отключаем кнопку добавления вопросов, так как теперь их количество фиксировано
    const addButton = document.getElementById('addQuestion');
    if (addButton) {
        addButton.disabled = true;
        addButton.textContent = 'Количество вопросов фиксировано';
        addButton.classList.add('btn-disabled');
    }
}

// Добавление варианта ответа
function addAnswer(button) {
    const answersDiv = button.parentElement;
    const answerInputDiv = document.createElement('div');
    answerInputDiv.className = 'answerOption';
    
    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.className = 'answerOption';
    answerInput.placeholder = 'Вариант ответа';
    
    answerInputDiv.appendChild(answerInput);
    answersDiv.insertBefore(answerInputDiv, button);
}

// Создание нового опроса
function createSurvey(e) {
    e.preventDefault();
    
    const title = document.getElementById('surveyTitle').value;
    const description = document.getElementById('surveyDescription').value;
    const questionCount = parseInt(document.getElementById('questionCount').value) || 10;
    
    // Проверяем ограничения на количество вопросов
    const maxQuestions = vipStatus ? 100 : 10;
    if (questionCount < 10 || questionCount > maxQuestions) {
        alert(`Количество вопросов должно быть от 10 до ${maxQuestions}`);
        return;
    }
    
    const questions = [];
    const questionElements = document.querySelectorAll('.question');
    
    // Проверяем, что количество вопросов совпадает
    if (questionElements.length !== questionCount) {
        alert(`Ошибка: ожидалось ${questionCount} вопросов, но найдено ${questionElements.length}`);
        return;
    }
    
    questionElements.forEach(questionEl => {
        const questionText = questionEl.querySelector('.questionText').value;
        const questionType = questionEl.querySelector('.questionType').value;
        const answers = [];
        
        if (questionType !== 'text') {
            const answerInputs = questionEl.querySelectorAll('.answerOption');
            answerInputs.forEach(input => {
                if (input.value.trim() !== '') {
                    answers.push(input.value);
                }
            });
        }
        
        questions.push({
            text: questionText,
            type: questionType,
            answers: answers
        });
    });
    
    const newSurvey = {
        id: Date.now(),
        title: title,
        description: description,
        questions: questions,
        responses: [],
        isVip: vipStatus, // Пометка VIP опроса
        maxQuestions: vipStatus ? questionCount : undefined
    };
    
    surveys.push(newSurvey);
    saveSurveys();
    
    console.log(`/create a survey - New survey created: "${title}" with ${questions.length} questions`);
    
    alert('Опрос успешно создан!');
    showSurveyList();
}

// Прохождение опроса
function takeSurvey(index) {
    const survey = surveys[index];
    let html = `
        <div id="surveyPage">
            <div class="survey-intro">
                <h2>${survey.title}</h2>
                <p>${survey.description || ''}</p>
                ${survey.isTest ? '<div class="test-badge">ТЕСТОВЫЙ ОПРОС</div>' : ''}
                ${survey.isVip ? '<div class="test-badge" style="background-color: #4ade80;">VIP ОПРОС</div>' : ''}
            </div>
            <form id="surveyForm">
    `;
    
    survey.questions.forEach((question, qIndex) => {
        html += `
            <div class="question-item">
                <h3>Вопрос ${qIndex + 1}: ${question.text}</h3>
        `;
        
        if (question.type === 'text') {
            html += `
                <div class="options">
                    <textarea class="text-answer" data-question="${qIndex}" placeholder="Введите ваш ответ"></textarea>
                </div>
            `;
        } else {
            html += `<div class="options">`;
            question.answers.forEach((answer, aIndex) => {
                const inputType = question.type === 'single' ? 'radio' : 'checkbox';
                html += `
                    <div class="option">
                        <input type="${inputType}" id="q${qIndex}a${aIndex}" name="q${qIndex}" 
                               value="${answer}" data-question="${qIndex}">
                        <label for="q${qIndex}a${aIndex}">${answer}</label>
                    </div>
                `;
            });
            html += `</div>`;
        }
        
        html += `</div>`;
    });
    
    html += `
                <div class="survey-actions">
                    <button type="button" class="btn btn-primary submit-survey" onclick="submitSurvey(${index})">Отправить ответы</button>
                    <button type="button" class="btn btn-outline" onclick="showSurveyList()">Назад</button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('app').innerHTML = html;
}

// Отправка ответов на опрос
function submitSurvey(index) {
    const survey = surveys[index];
    const responses = {};
    
    // Сбор текстовых ответов
    const textAnswers = document.querySelectorAll('.text-answer');
    textAnswers.forEach(answer => {
        const qIndex = answer.dataset.question;
        responses[qIndex] = answer.value;
    });
    
    // Сбор выборов (одиночных и множественных)
    survey.questions.forEach((question, qIndex) => {
        if (question.type === 'text') return;
        
        const selected = document.querySelectorAll(`input[name="q${qIndex}"]:checked`);
        if (selected.length > 0) {
            if (question.type === 'single') {
                responses[qIndex] = selected[0].value;
            } else {
                responses[qIndex] = Array.from(selected).map(el => el.value);
            }
        }
    });
    
    // Сохранение ответов
    survey.responses.push(responses);
    saveSurveys();
    
    // Показ сообщения об успешной отправке
    alert('Ваши ответы успешно сохранены!');
    console.log(`Survey "${survey.title}" - Response submitted`);
    showSurveyList();
}

// Показ результатов опроса
function showResults(index) {
    const survey = surveys[index];
    let html = `
        <div id="resultsPage">
            <div class="results-header">
                <h2>Результаты опроса: ${survey.title}</h2>
                ${survey.isTest ? '<div class="test-badge">ТЕСТОВЫЙ ОПРОС</div>' : ''}
                ${survey.isVip ? '<div class="test-badge" style="background-color: #4ade80;">VIP ОПРОС</div>' : ''}
                <p>Всего ответов: ${survey.responses.length}</p>
            </div>
    `;
    
    survey.questions.forEach((question, qIndex) => {
        html += `
            <div class="result-item">
                <h3>Вопрос ${qIndex + 1}: ${question.text}</h3>
        `;
        
        if (question.type === 'text') {
            html += `<div class="text-responses">`;
            survey.responses.forEach((response, rIndex) => {
                if (response[qIndex]) {
                    html += `<p><strong>Ответ ${rIndex + 1}:</strong> ${response[qIndex]}</p>`;
                }
            });
            html += `</div>`;
        } else {
            // Подсчет ответов
            const answerCounts = {};
            question.answers.forEach(answer => {
                answerCounts[answer] = 0;
            });
            
            survey.responses.forEach(response => {
                if (response[qIndex]) {
                    if (question.type === 'single') {
                        answerCounts[response[qIndex]] = (answerCounts[response[qIndex]] || 0) + 1;
                    } else {
                        response[qIndex].forEach(answer => {
                            answerCounts[answer] = (answerCounts[answer] || 0) + 1;
                        });
                    }
                }
            });
            
            // Отображение диаграммы
            const totalResponses = survey.responses.length;
            question.answers.forEach(answer => {
                const count = answerCounts[answer] || 0;
                const percentage = totalResponses > 0 ? (count / totalResponses * 100).toFixed(1) : 0;
                
                html += `
                    <div class="bar-chart">
                        <div class="bar-label">${answer}</div>
                        <div class="bar-container">
                            <div class="bar" style="width: ${percentage}%"></div>
                        </div>
                        <div class="bar-text">${percentage}%</div>
                    </div>
                    <div class="response-count">${count} ответов</div>
                `;
            });
        }
        
        html += `</div>`;
    });
    
    html += `
            <div class="survey-actions">
                <button class="btn btn-outline" onclick="showSurveyList()">Назад к списку опросов</button>
            </div>
        </div>
    `;
    
    document.getElementById('app').innerHTML = html;
}