let lastLoadedSession = null;
const sessionsPerPage = 15;

function fetchSessions() {
    const loadingPlaceholder = document.getElementById('loading-placeholder');
    const showMoreButton = document.getElementById('show-more');
    
    loadingPlaceholder.style.display = 'block';
    showMoreButton.style.display = 'none';

    let query = firebase.database().ref('sessions').orderByKey().limitToLast(sessionsPerPage);
    
    if (lastLoadedSession) {
        query = query.endBefore(lastLoadedSession);
    }

    query.once('value')
        .then(snapshot => {
            const sessions = [];
            snapshot.forEach(childSnapshot => {
                sessions.unshift({id: childSnapshot.key, ...childSnapshot.val()});
            });
            
            if (sessions.length > 0) {
                lastLoadedSession = sessions[sessions.length - 1].id;
                displaySessions(sessions);
                showMoreButton.style.display = 'block';
            } else {
                showMoreButton.style.display = 'none';
            }
            loadingPlaceholder.style.display = 'none';
        })
        .catch(error => {
            console.error("Error fetching sessions: ", error);
            loadingPlaceholder.style.display = 'none';
        });
}

function displaySessions(sessions) {
    const container = document.getElementById('sessions-container');
    sessions.forEach(session => {
        const sessionElement = document.createElement('div');
        sessionElement.className = 'session';
        sessionElement.innerHTML = `
            <div class="session-header">
                <div class="session-header-left">
                    <span>${formatDate(session.date)}</span>
                    <span>${session.duration}</span>
                </div>
                <span>${session.category}</span>
            </div>
            <div class="session-details">
                <p>Style: ${session.style}</p>
                <p>Rating: ${getStarRating(session.rating)}</p>
                <p>Note: ${session.note || 'No note'}</p>
            </div>
        `;
        sessionElement.addEventListener('click', () => {
            sessionElement.querySelector('.session-details').classList.toggle('expanded');
        });
        container.appendChild(sessionElement);
    });
}

function formatDate(dateString) {
    const [day, month] = dateString.split('/');
    return `${day}/${month}`;
}

function getStarRating(rating) {
    const fullStar = '<i class="fa-solid fa-star"></i>';
    const emptyStar = '<i class="fa-regular fa-star"></i>';
    return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchSessions();
    
    document.getElementById('show-more').addEventListener('click', fetchSessions);
});