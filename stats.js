// Chart.js global configuration
Chart.defaults.color = '#d6d6d6';
Chart.defaults.font.family = "'Lato', sans-serif";

function getChartOptions(title) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 14,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 15
        }
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 10
          }
        }
      }
    }
  };
}

function fetchDataAndVisualize() {
  const dbRef = firebase.database().ref('sessions');

  dbRef.once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        displayStats(data);
        createStyleChart(data);
        createCategoryChart(data);
        createTimePerDayChart(data);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
}

function displayStats(data) {
  const sessions = Object.values(data);
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((sum, session) => sum + parseDuration(session.duration), 0);
  const averageTime = Math.round(totalDuration / totalSessions);
  const longestSession = Math.max(...sessions.map(session => parseDuration(session.duration)));

  document.getElementById('average-time').textContent = formatTime(averageTime);
  document.getElementById('total-sessions').textContent = totalSessions;
  document.getElementById('longest-session').textContent = formatTime(longestSession);
}

function createStyleChart(data) {
  const styleCounts = countOccurrences(data, 'style');
  const ctx = document.getElementById('style-chart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(styleCounts),
      datasets: [{
        data: Object.values(styleCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]
    },
    options: getChartOptions('Style Distribution')
  });
}

function createCategoryChart(data) {
  const categoryCounts = countOccurrences(data, 'category');
  const ctx = document.getElementById('category-chart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryCounts),
      datasets: [{
        data: Object.values(categoryCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'],
      }]
    },
    options: getChartOptions('Category Distribution')
  });
}

function createTimePerDayChart(data) {
  const timePerDay = {};
  Object.values(data).forEach(session => {
    const date = session.date;
    const duration = parseDuration(session.duration);
    if (timePerDay[date]) {
      timePerDay[date] += duration;
    } else {
      timePerDay[date] = duration;
    }
  });

  const ctx = document.getElementById('time-per-day-chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(timePerDay),
      datasets: [{
        label: 'Practice Time',
        data: Object.values(timePerDay),
        backgroundColor: '#36A2EB',
      }]
    },
    options: {
      ...getChartOptions('Practice Time per Day'),
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatTime(value);
            },
            font: {
              size: 10
            }
          }
        },
        x: {
          ticks: {
            font: {
              size: 10
            }
          }
        }
      },
      plugins: {
        ...getChartOptions('Practice Time per Day').plugins,
        tooltip: {
          callbacks: {
            label: function(context) {
              return formatTime(context.raw);
            }
          }
        }
      }
    }
  });
}

function countOccurrences(data, key) {
  return Object.values(data).reduce((acc, session) => {
    const value = session[key];
    acc[value] = (acc[value] || 0) + 1;
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