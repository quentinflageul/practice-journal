// Chart.js global configuration
Chart.defaults.color = '#d6d6d6';
Chart.defaults.font.family = "'Lato', sans-serif";
Chart.defaults.font.size = 16;

Chart.register(ChartDataLabels);

function getChartOptions(isBarChart = false) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        color: '#d6d6d6',
        font: {
          weight: 'bold',
          size: 18
        },
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return isBarChart ? '' : `${label}\n${value}`;
        },
        align: 'center',
        anchor: 'center'
      },
      tooltip: {
        enabled: isBarChart
      }
    },
    hover: {
      mode: isBarChart ? 'index' : null
    }
  };

  if (isBarChart) {
    options.scales = {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value,
          font: { size: 16 }
        },
        title: {
          display: true,
          text: 'Hours',
          font: { size: 20, weight: 'bold' }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10,
          font: { size: 14 }
        }
      }
    };
    options.plugins.tooltip = {
      callbacks: {
        label: context => formatTime(context.raw * 60)
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
        createStyleChart(sessions);
        createTimePerDayChart(sessions);
      } else {
        console.log("No data available");
      }
    })
    .catch(error => console.error("Error fetching data: ", error));
}

function displayStats(sessions) {
  const totalSessions = sessions.length;
  const longestSession = Math.max(...sessions.map(session => parseDuration(session.duration)));

  // Correctly calculate average time per day
  const dailyTotals = sessions.reduce((acc, session) => {
    const date = session.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += parseDuration(session.duration);
    return acc;
  }, {});

  const totalDays = Object.keys(dailyTotals).length;
  const totalMinutes = Object.values(dailyTotals).reduce((sum, minutes) => sum + minutes, 0);
  const averageTimePerDay = Math.round(totalMinutes / totalDays);

  document.getElementById('average-time').textContent = formatTime(averageTimePerDay);
  document.getElementById('total-sessions').textContent = totalSessions;
  document.getElementById('longest-session').textContent = formatTime(longestSession);
}

function createStyleChart(sessions) {
  const styleData = countOccurrences(sessions, 'style');
  const ctx = document.getElementById('style-chart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(styleData),
      datasets: [{
        data: Object.values(styleData),
        backgroundColor: 'transparent',
        borderColor: '#d6d6d6',
        borderWidth: 2
      }]
    },
    options: {
      ...getChartOptions(),
      plugins: {
        ...getChartOptions().plugins,
        datalabels: {
          ...getChartOptions().plugins.datalabels,
          font: {
            weight: 'bold',
            size: 20
          },
          formatter: (value, context) => {
            const label = context.chart.data.labels[context.dataIndex];
            return [`${label}`, `${value}`];
          },
          align: 'center',
          anchor: 'center',
          textAlign: 'center'
        }
      },
      layout: {
        padding: 15
      },
      offset: (context) => context.dataIndex === 1 ? 15 : 0
    }
  });
}

function createTimePerDayChart(sessions) {
  const timePerDay = sessions.reduce((acc, session) => {
    acc[session.date] = (acc[session.date] || 0) + parseDuration(session.duration) / 60;
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
        backgroundColor: '#d6d6d6',
        barThickness: 'flex',
        maxBarThickness: 30
      }]
    },
    options: getChartOptions(true)
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

document.addEventListener('DOMContentLoaded', fetchDataAndVisualize);