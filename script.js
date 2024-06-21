document.addEventListener('DOMContentLoaded', function() {
    const timer = document.getElementById('timer');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset');
    const submitButton = document.getElementById('submit');
    const hiddenMenu = document.querySelector('.hidden-menu');
    const timerContainer = document.querySelector('.timer-container');
    const categorySelect = document.getElementById('category');
    const commentTextarea = document.getElementById('comment');
    const stars = document.querySelectorAll('#rating .fa-star');
    const hourSelect = document.getElementById('hours');
    const minuteSelect = document.getElementById('minutes');
    const logoutButton = document.getElementById('logout');
    const messageDiv = document.getElementById('message-div');

    let intervalId = null;
    let startTime = null;
    let elapsedTime = 0;
    let rating = 0;
    let selectedStyle = 'Jazz';
    let isSubmitEnabled = false;
    let messageTimeout;

    const styleContainer = document.querySelector(".style-container");
    const jazz = document.getElementById("jazz");
    const balkan = document.getElementById("balkan");

    styleContainer.addEventListener("click", () => {
        if (jazz.classList.contains("visible")) {
            jazz.classList.remove("visible");
            jazz.classList.add("not-visible");
            balkan.classList.remove("not-visible");
            balkan.classList.add("visible");
            selectedStyle = 'Balkan'
            console.log(selectedStyle);
        } else {
            balkan.classList.remove("visible");
            balkan.classList.add("not-visible");
            jazz.classList.remove("not-visible");
            jazz.classList.add("visible");
            selectedStyle = 'Jazz';
            console.log(selectedStyle);
        }
    });

    // styleContainer.addEventListener('mouseover', () => {
    //     if (jazz.classList.contains("visible")) {
    //         
    //     }
    // });
    // styleContainer.addEventListener('mouseout', () => {
    //     
    // });

    const firebaseConfig = {
        apiKey: "AIzaSyCCoxzcsGEdO3PWSJpXmHxmTxQvEv9pXxo",
        authDomain: "practicejournal-7642a.firebaseapp.com",
        databaseURL: "https://practicejournal-7642a-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "practicejournal-7642a",
        storageBucket: "practicejournal-7642a.appspot.com",
        messagingSenderId: "569532974732",
        appId: "1:569532974732:web:e6eb52f981161e731bdda9"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const database = firebase.database();

    // Check auth state on page load
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in, display form
            document.getElementById('login-div').style.display = 'none';
            document.getElementById('form').style.display = 'flex';
        } else {
            // No user is signed in, display login button
            document.getElementById('login-div').style.display = 'block';
            document.getElementById('form-div').style.display = 'none';
        }
    });

    // Google login
    document.getElementById('google-login').addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then(result => {
            document.getElementById('login-div').style.display = 'none';
            document.getElementById('form-div').style.display = 'flex';
        }).catch(error => {
            console.log(error);
        });
    });

    // Logout
    logoutButton.addEventListener('click', () => {
        auth.signOut().then(() => {
            document.getElementById('login-div').style.display = 'block';
            document.getElementById('form').style.display = 'none';
        }).catch(error => {
            console.log(error);
        });
    });


    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    }

    function updateTimerDisplay() {
        const currentTime = Date.now();
        const timeDiff = currentTime - startTime;
        const totalElapsedTime = elapsedTime + timeDiff;
        timer.textContent = formatTime(totalElapsedTime);
    }

    function startTimer() {
        startTime = Date.now();
        intervalId = setInterval(updateTimerDisplay, 1000);
    }

    function stopTimer() {
        clearInterval(intervalId);
        const currentTime = Date.now();
        const timeDiff = currentTime - startTime;
        elapsedTime += timeDiff;
        intervalId = null;
    }

    function resetTimer() {
        stopTimer();
        elapsedTime = 0;
        timer.textContent = '00:00:00';
        startButton.textContent = 'Start';
        hourSelect.value = '00';
        minuteSelect.value = '00';
        updateSubmitButtonState();
    }

    startButton.addEventListener('click', () => {
        if (intervalId) {
            stopTimer();
            startButton.textContent = 'Resume';
        } else {
            startTimer();
            startButton.textContent = 'Pause';
        }
        updateSubmitButtonState();
    });

    resetButton.addEventListener('click', resetTimer);

    timer.addEventListener('click', () => {
        hiddenMenu.classList.toggle('show');
        timerContainer.classList.toggle('disabled');
        updateSubmitButtonState();
    });

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            rating = index + 1;
            updateStars(rating);
            updateSubmitButtonState();
        });
        star.addEventListener('mouseover', () => {
            updateStars(index + 1);
        });
        star.addEventListener('mouseout', () => {
            updateStars(rating);
        });
    });

    function updateStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('fa-regular');
                star.classList.add('fa-solid');
            } else {
                star.classList.remove('fa-solid');
                star.classList.add('fa-regular');
            }
        });
    }

    hourSelect.addEventListener('change', function() {
        if (intervalId) {
          stopTimer();
          startButton.textContent = 'Resume';
        }
        updateSubmitButtonState();
      });
      
    minuteSelect.addEventListener('change', function() {
        if (intervalId) {
          stopTimer();
          startButton.textContent = 'Resume';
        }
        updateSubmitButtonState();
    });

    function getCurrentDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    }

    function updateSubmitButtonState() {
        const isTimerRunning = intervalId !== null;
        isSubmitEnabled = checkSubmitConditions() && !isTimerRunning;

        if (isSubmitEnabled) {
            submitButton.classList.remove('disabled');
        } else {
            submitButton.classList.add('disabled');
        }
    }

    function checkSubmitConditions() {
        const hasSelectedTime = (parseInt(hourSelect.value) > 0 || parseInt(minuteSelect.value) > 0);
        const hasDisplayTime = elapsedTime > 60000;
        const hasRating = rating > 0;
        return (hasSelectedTime || hasDisplayTime) && hasRating;
    }

    function showMessage(message, type) {
        messageDiv.innerText = message;
        messageDiv.className = type;
        messageDiv.style.display = 'block';

                // Clear previous timeout if exists
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }

        // Set timeout to hide message after 5 seconds
        messageTimeout = setTimeout(() => {
            hideMessage();
        }, 5000); // 5000 milliseconds = 5 seconds
    }

    function hideMessage() {
        messageDiv.style.display = 'none';
        messageDiv.innerText = ''; // Clear message text
        messageDiv.className = ''; // Clear any classes
    }

    submitButton.addEventListener('click', function() {
        if (!isSubmitEnabled) {
            return;
        }

        const hasSelectedTime = (parseInt(hourSelect.value) > 0 || parseInt(minuteSelect.value) > 0);
        const duration = hasSelectedTime 
          ? `${hourSelect.value}:${minuteSelect.value}`
          : formatTime(elapsedTime).slice(0, -3); 

        const currentDate = getCurrentDate();
        const note = commentTextarea.value.trim();

        const data = {
            category: categorySelect.value,
            date: currentDate,
            duration: duration,
            note: note || "",
            rating: rating,
            style: "Jazz"
        };

        console.log("Submitting data:", data);

        try {
            database.ref('sessions').push(data).then(() => {
                showMessage('Data submitted successfully', 'success');
            }).catch(error => {
                showMessage('Error submitting data: ' + error.message, 'error');
            });
        } catch (error) {
            showMessage('Caught error: ' + error.message, 'error');
        };

        resetTimer();
        rating = 0;
        updateStars(rating);
    });
});
