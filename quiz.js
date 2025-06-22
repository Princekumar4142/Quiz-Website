document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const categorySelection = document.getElementById('category-selection');
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const startButtons = document.querySelectorAll('.start-btn');
    const questionText = document.getElementById('question-text');
    const answerOptions = document.getElementById('answer-options');
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const currentScoreSpan = document.getElementById('current-score');
    const finalScoreSpan = document.getElementById('final-score');
    const maxScoreSpan = document.getElementById('max-score');
    const resultMessage = document.getElementById('result-message');
    const quizCategory = document.getElementById('quiz-category');
    const certCategory = document.getElementById('cert-category');
    const certDate = document.getElementById('cert-date');
    const certScore = document.getElementById('cert-score');
    const timeSpan = document.getElementById('time');
    
    // Quiz state variables
    let currentCategory = '';
    let currentDifficulty = '';
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null;
    let timerInterval;
    let secondsElapsed = 0;
    
    // Quiz questions database (all questions are here, no need for a separate question.js)
    const quizDatabase = {
        science: {
            name: "Science & Technology",
            questions: [
                {
                    question: "What is the speed of light in a vacuum?",
                    options: [
                        "299,792,458 m/s",
                        "300,000,000 m/s",
                        "299,792,458 km/s",
                        "186,000 miles/s"
                    ],
                    answer: 0,
                    explanation: "The speed of light in a vacuum is exactly 299,792,458 meters per second (m/s). This is a fundamental constant of nature."
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: [
                        "Venus",
                        "Mars",
                        "Jupiter",
                        "Saturn"
                    ],
                    answer: 1,
                    explanation: "Mars is often called the Red Planet because iron minerals in the Martian soil oxidize, or rust, causing the soil and atmosphere to look red."
                },
                {
                    question: "What does 'HTTP' stand for?",
                    options: [
                        "HyperText Transfer Protocol",
                        "High-Tech Text Procedure",
                        "Hyperlink Text Transfer Process",
                        "Home Tool Transfer Protocol"
                    ],
                    answer: 0,
                    explanation: "HTTP stands for HyperText Transfer Protocol, the foundation of data communication for the World Wide Web."
                },
                {
                    question: "Which of these is NOT a programming language?",
                    options: [
                        "Python",
                        "Java",
                        "HTML",
                        "C++"
                    ],
                    answer: 2,
                    explanation: "HTML (HyperText Markup Language) is a markup language used to structure content on the web, but it's not a programming language."
                },
                {
                    question: "What is the main component of the Sun?",
                    options: [
                        "Liquid lava",
                        "Hydrogen and helium",
                        "Molten iron",
                        "Oxygen and nitrogen"
                    ],
                    answer: 1,
                    explanation: "The Sun is primarily composed of hydrogen (about 74%) and helium (about 24%), with small amounts of heavier elements."
                }
            ]
        },
        history: {
            name: "World History",
            questions: [
                {
                    question: "In which year did World War II end?",
                    options: [
                        "1944",
                        "1945",
                        "1946",
                        "1947"
                    ],
                    answer: 1,
                    explanation: "World War II ended in 1945 with the surrender of Germany in May and Japan in August."
                },
                {
                    question: "Who was the first president of the United States?",
                    options: [
                        "Thomas Jefferson",
                        "John Adams",
                        "George Washington",
                        "Abraham Lincoln"
                    ],
                    answer: 2,
                    explanation: "George Washington was unanimously elected as the first president of the United States and served from 1789 to 1797."
                },
                {
                    question: "Which ancient civilization built the pyramids?",
                    options: [
                        "Greeks",
                        "Romans",
                        "Egyptians",
                        "Mayans"
                    ],
                    answer: 2,
                    explanation: "The ancient Egyptians built the pyramids as tombs for their pharaohs, with the Great Pyramid of Giza being the most famous."
                },
                {
                    question: "When was the Declaration of Independence signed?",
                    options: [
                        "1774",
                        "1776",
                        "1781",
                        "1789"
                    ],
                    answer: 1,
                    explanation: "The Declaration of Independence was adopted by the Continental Congress on July 4, 1776, announcing the separation of the 13 colonies from Great Britain."
                },
                {
                    question: "Which empire was ruled by Genghis Khan?",
                    options: [
                        "Ottoman Empire",
                        "Roman Empire",
                        "Mongol Empire",
                        "British Empire"
                    ],
                    answer: 2,
                    explanation: "Genghis Khan founded and ruled the Mongol Empire, which became the largest contiguous empire in history after his death."
                }
            ]
        },
        sports: {
            name: "Sports & Athletics",
            questions: [
                {
                    question: "Which country has won the most FIFA World Cup titles?",
                    options: [
                        "Germany",
                        "Brazil",
                        "Italy",
                        "Argentina"
                    ],
                    answer: 1,
                    explanation: "Brazil has won the FIFA World Cup a record 5 times (1958, 1962, 1970, 1994, 2002)."
                },
                {
                    question: "In basketball, how many points is a three-point shot worth?",
                    options: [
                        "1",
                        "2",
                        "3",
                        "4"
                    ],
                    answer: 2,
                    explanation: "A three-point shot in basketball is worth 3 points, awarded for shots made from beyond the three-point line."
                },
                {
                    question: "Which athlete has won the most Olympic gold medals?",
                    options: [
                        "Usain Bolt",
                        "Michael Phelps",
                        "Carl Lewis",
                        "Larisa Latynina"
                    ],
                    answer: 1,
                    explanation: "Michael Phelps has won 23 Olympic gold medals, the most by any athlete in history."
                },
                {
                    question: "What is the diameter of a basketball hoop in inches?",
                    options: [
                        "16",
                        "18",
                        "20",
                        "24"
                    ],
                    answer: 1,
                    explanation: "A basketball hoop has an inner diameter of 18 inches (45.72 cm)."
                },
                {
                    question: "Which country hosted the 2016 Summer Olympics?",
                    options: [
                        "China",
                        "Brazil",
                        "Russia",
                        "United Kingdom"
                    ],
                    answer: 1,
                    explanation: "The 2016 Summer Olympics were held in Rio de Janeiro, Brazil, making it the first South American city to host the Games."
                }
            ]
        },
        entertainment: {
            name: "Entertainment & Pop Culture",
            questions: [
                {
                    question: "Which actor played the role of Tony Stark/Iron Man in the Marvel Cinematic Universe?",
                    options: [
                        "Chris Evans",
                        "Robert Downey Jr.",
                        "Chris Hemsworth",
                        "Mark Ruffalo"
                    ],
                    answer: 1,
                    explanation: "Robert Downey Jr. portrayed Tony Stark/Iron Man in the Marvel Cinematic Universe from 2008 to 2019."
                },
                {
                    question: "Which singer is known as the 'Queen of Pop'?",
                    options: [
                        "Beyoncé",
                        "Madonna",
                        "Lady Gaga",
                        "Taylor Swift"
                    ],
                    answer: 1,
                    explanation: "Madonna is often referred to as the 'Queen of Pop' due to her influence, record sales, and longevity in the music industry."
                },
                {
                    question: "Which TV show features the fictional continents of Westeros and Essos?",
                    options: [
                        "The Witcher",
                        "Game of Thrones",
                        "The Lord of the Rings",
                        "Vikings"
                    ],
                    answer: 1,
                    explanation: "Game of Thrones is set in the fictional continents of Westeros and Essos, based on George R.R. Martin's 'A Song of Ice and Fire' novels."
                },
                {
                    question: "Which movie won the Academy Award for Best Picture in 2020?",
                    options: [
                        "Joker",
                        "Parasite",
                        "1917",
                        "Once Upon a Time in Hollywood"
                    ],
                    answer: 1,
                    explanation: "Parasite made history in 2020 by becoming the first non-English language film to win the Academy Award for Best Picture."
                },
                {
                    question: "Which artist released the album 'Thriller' in 1982?",
                    options: [
                        "Prince",
                        "Michael Jackson",
                        "Madonna",
                        "Whitney Houston"
                    ],
                    answer: 1,
                    explanation: "Michael Jackson's 'Thriller' is the best-selling album of all time, with estimated sales of over 66 million copies worldwide."
                }
            ]
        },
        geography: {
            name: "Geography & Nature",
            questions: [
                {
                    question: "Which is the largest ocean on Earth?",
                    options: [
                        "Atlantic Ocean",
                        "Indian Ocean",
                        "Arctic Ocean",
                        "Pacific Ocean"
                    ],
                    answer: 3,
                    explanation: "The Pacific Ocean is the largest and deepest ocean, covering about 63 million square miles and containing more than half of the free water on Earth."
                },
                {
                    question: "What is the capital of Canada?",
                    options: [
                        "Toronto",
                        "Vancouver",
                        "Ottawa",
                        "Montreal"
                    ],
                    answer: 2,
                    explanation: "Ottawa is the capital city of Canada, while Toronto is the largest city and financial center."
                },
                {
                    question: "Which desert is the largest in the world?",
                    options: [
                        "Sahara",
                        "Arabian",
                        "Gobi",
                        "Kalahari"
                    ],
                    answer: 0,
                    explanation: "The Sahara Desert in Africa is the largest hot desert in the world, covering approximately 3.6 million square miles."
                },
                {
                    question: "Which river is the longest in the world?",
                    options: [
                        "Amazon",
                        "Nile",
                        "Yangtze",
                        "Mississippi"
                    ],
                    answer: 1,
                    explanation: "The Nile River is traditionally considered the longest river in the world at about 4,132 miles (6,650 km), though some studies suggest the Amazon might be slightly longer."
                },
                {
                    question: "Which country has the most time zones?",
                    options: [
                        "United States",
                        "Russia",
                        "China",
                        "France"
                    ],
                    answer: 3,
                    explanation: "France has the most time zones with 12 (including its overseas territories), followed by Russia with 11."
                }
            ]
        },
        art: {
            name: "Art & Literature",
            questions: [
                {
                    question: "Who painted the Mona Lisa?",
                    options: [
                        "Vincent van Gogh",
                        "Pablo Picasso",
                        "Leonardo da Vinci",
                        "Michelangelo"
                    ],
                    answer: 2,
                    explanation: "Leonardo da Vinci painted the Mona Lisa (La Gioconda) between 1503 and 1506. It's now housed in the Louvre Museum in Paris."
                },
                {
                    question: "Which of these is a play by William Shakespeare?",
                    options: [
                        "War and Peace",
                        "The Odyssey",
                        "Macbeth",
                        "The Divine Comedy"
                    ],
                    answer: 2,
                    explanation: "Macbeth is one of Shakespeare's most famous tragedies, written around 1606."
                },
                {
                    question: "Which art movement is Vincent van Gogh associated with?",
                    options: [
                        "Impressionism",
                        "Post-Impressionism",
                        "Cubism",
                        "Surrealism"
                    ],
                    answer: 1,
                    explanation: "Van Gogh is considered a Post-Impressionist painter, though his work was influential to many subsequent movements."
                },
                {
                    question: "Who wrote 'To Kill a Mockingbird'?",
                    options: [
                        "J.D. Salinger",
                        "Harper Lee",
                        "Mark Twain",
                        "Ernest Hemingway"
                    ],
                    answer: 1,
                    explanation: "Harper Lee wrote 'To Kill a Mockingbird', published in 1960, which became an instant classic of modern American literature."
                },
                {
                    question: "Which of these is NOT a literary genre?",
                    options: [
                        "Sonnet",
                        "Novella",
                        "Fresco",
                        "Haiku"
                    ],
                    answer: 2,
                    explanation: "A fresco is a technique of mural painting executed upon freshly laid lime plaster, not a literary genre."
                }
            ]
        }
    };
    
    // Start quiz when a category button is clicked
    startButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentCategory = this.getAttribute('data-category');
            currentDifficulty = this.getAttribute('data-difficulty');
            startQuiz();
        });
    });
    
    // Start the quiz
    function startQuiz() {
        // Reset quiz state
        currentQuestionIndex = 0;
        score = 0;
        secondsElapsed = 0;
        selectedOption = null;
        
        // Get questions based on category and difficulty
        const allQuestions = [...quizDatabase[currentCategory].questions];
        
        switch(currentDifficulty) {
            case 'quick':
                // Get 2 random questions (as per original data-difficulty, although you might want to adjust)
                questions = getRandomQuestions(allQuestions, 2);
                break;
            case 'medium':
                // Get 3 random questions
                questions = getRandomQuestions(allQuestions, 3);
                break;
            case 'full':
                // Use all questions
                questions = allQuestions;
                break;
            default:
                // Default to 3 random questions if difficulty is not explicitly set
                questions = getRandomQuestions(allQuestions, 3); 
        }
        
        // Update UI visibility
        categorySelection.style.display = 'none';
        quizContainer.style.display = 'block';
        resultsContainer.style.display = 'none'; // Ensure results are hidden if coming from results
        
        // Set quiz details
        quizCategory.textContent = quizDatabase[currentCategory].name;
        totalQuestionsSpan.textContent = questions.length;
        currentScoreSpan.textContent = score;
        
        // Start timer
        startTimer();
        
        // Load the first question
        loadQuestion();
    }
    
    // Get random questions from the array
    function getRandomQuestions(questionArray, count) {
        const shuffled = [...questionArray].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    // Load the current question
    function loadQuestion() {
        // Reset selected option
        selectedOption = null;
        
        const question = questions[currentQuestionIndex];
        
        // Update question counter
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        
        // Set question text
        questionText.textContent = question.question;
        
        // Clear previous options
        answerOptions.innerHTML = '';
        
        // Create new options
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.dataset.index = index; // Store the index to easily get selected answer
            
            optionElement.addEventListener('click', function() {
                selectOption(this);
            });
            
            answerOptions.appendChild(optionElement);
        });
        
        // Reset buttons states
        submitBtn.disabled = true;
        submitBtn.style.display = 'block'; // Ensure submit button is visible for new question
        nextBtn.style.display = 'none';    // Hide next button until submitted
    }
    
    // Select an answer option
    function selectOption(optionElement) {
        // Deselect all options first
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
            opt.classList.remove('correct'); // Clear any previous correctness highlights
            opt.classList.remove('incorrect');
        });
        
        // Select the clicked option
        optionElement.classList.add('selected');
        selectedOption = parseInt(optionElement.dataset.index); // Get the index of the selected option
        submitBtn.disabled = false; // Enable submit button
    }
    
    // Submit answer
    submitBtn.addEventListener('click', function() {
        if (selectedOption === null) return; // Do nothing if no option is selected
        
        const question = questions[currentQuestionIndex];
        const options = document.querySelectorAll('.option');
        
        // Disable all options to prevent further clicks
        options.forEach(opt => {
            opt.style.pointerEvents = 'none';
        });
        
        // Mark correct and incorrect answers with styling
        options.forEach((opt, index) => {
            if (index === question.answer) {
                opt.classList.add('correct'); // Highlight the correct answer
            } else if (index === selectedOption && index !== question.answer) {
                opt.classList.add('incorrect'); // Highlight the user's incorrect answer
            }
        });
        
        // Update score if the selected answer is correct
        if (selectedOption === question.answer) {
            score++;
            currentScoreSpan.textContent = score;
        }
        
        // You could uncomment this to show the explanation after submission
        // console.log(question.explanation); 
        
        // Hide submit button and show next button
        submitBtn.style.display = 'none';
        nextBtn.style.display = 'block';
    });
    
    // Move to next question or show results
    nextBtn.addEventListener('click', function() {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            loadQuestion(); // Load next question
        } else {
            showResults(); // End of quiz, show results
        }
    });
    
    // Show quiz results
    function showResults() {
        // Stop the quiz timer
        stopTimer();
        
        // Hide quiz container, show results container
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        
        // Display final score
        finalScoreSpan.textContent = score;
        maxScoreSpan.textContent = questions.length;
        
        // Calculate percentage for certificate
        const percentage = Math.round((score / questions.length) * 100);
        certScore.textContent = percentage + "%";
        
        // Set result message based on performance
        if (percentage >= 80) {
            resultMessage.textContent = "Excellent work! You're a true expert in this field.";
        } else if (percentage >= 60) {
            resultMessage.textContent = "Good job! You have solid knowledge in this area.";
        } else if (percentage >= 40) {
            resultMessage.textContent = "Not bad! Keep learning to improve your knowledge.";
        } else {
            resultMessage.textContent = "Keep practicing! Everyone starts somewhere.";
        }
        
        // Set certificate details
        certCategory.textContent = quizDatabase[currentCategory].name;
        certDate.textContent = getCurrentDate();
    }
    
    // Back to categories button click handler
    backBtn.addEventListener('click', function() {
        categorySelection.style.display = 'block';
        resultsContainer.style.display = 'none';
    });
    
    // Timer functions
    function startTimer() {
        // Clear any existing timer to prevent multiple timers running
        clearInterval(timerInterval); 
        secondsElapsed = 0; // Reset timer for new quiz
        updateTimerDisplay(); // Display initial 00:00
        timerInterval = setInterval(function() {
            secondsElapsed++;
            updateTimerDisplay();
        }, 1000);
    }
    
    function stopTimer() {
        clearInterval(timerInterval);
    }
    
    function updateTimerDisplay() {
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed % 60;
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timeSpan.textContent = formattedTime;
    }
    
    // Helper function to get current date for certificate
    function getCurrentDate() {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return now.toLocaleDateString('en-US', options);
    }
});