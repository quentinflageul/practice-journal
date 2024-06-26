// Chart.js global configuration
Chart.defaults.color = '#d6d6d6';
Chart.defaults.font.family = "'Lato', sans-serif";

function getChartOptions(title, isBarChart = false) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        font: { size: 12, weight: 'bold' },
        padding: { top: 5, bottom: 10 }
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          padding: 5,
          font: { size: 9 }
        }
      }
    }
  };

  if (isBarChart) {
    options.scales = {
      y: {
        beginAtZero: true,
        ticks: {
          callback: formatTime,
          font: { size: 9 }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10,
          font: { size: 8 }
        }
      }
    };
    options.plugins.tooltip = {
      callbacks: {
        label: context => formatTime(context.raw)
      }
    };
  }

  return options;
}

function fetchDataAndVisualize() {
  firebase.database().ref('sessions').once('value')
    .then(snapshot => {
      const data = snapshot.val();
      if (data) {
        const sessions = Object.values(data);
        displayStats(sessions);
        createChart('style-chart', 'Style Distribution', countOccurrences(sessions, 'style'));
        createChart('category-chart', 'Category Distribution', countOccurrences(sessions, 'category'));
        createTimePerDayChart(sessions);
      } else {
        console.log("No data available");
      }
    })
    .catch(error => console.error("Error fetching data: ", error));
}

function displayStats(sessions) {
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((sum, session) => sum + parseDuration(session.duration), 0);
  const averageTime = Math.round(totalDuration / totalSessions);
  const longestSession = Math.max(...sessions.map(session => parseDuration(session.duration)));

  document.getElementById('average-time').textContent = formatTime(averageTime);
  document.getElementById('total-sessions').textContent = totalSessions;
  document.getElementById('longest-session').textContent = formatTime(longestSession);
}

function createChart(chartId, title, data) {
  const ctx = document.getElementById(chartId).getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'],
      }]
    },
    options: getChartOptions(title)
  });
}

function createTimePerDayChart(sessions) {
  const timePerDay = sessions.reduce((acc, session) => {
    acc[session.date] = (acc[session.date] || 0) + parseDuration(session.duration);
    return acc;
  }, {});

  const ctx = document.getElementById('time-per-day-chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(timePerDay),
      datasets: [{
        label: 'Practice Time',
        data: Object.values(timePerDay),
        backgroundColor: '#36A2EB',
        barThickness: 'flex',
        maxBarThickness: 30
      }]
    },
    options: getChartOptions('Practice Time per Day', true)
  });
}

function countOccurrences(data, key) {
  return data.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

function parseDuration(duration) {
  const [hours, minutes] = duration.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', fetchDataAndVisualize);