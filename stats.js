const averageTimeMessage = document.getElementById("average-time-message");

function parseDuration(duration) {
  const [hours, minutes] = duration.split(':').map(Number);
  return hours * 60 + minutes;
}

function displayAverageTime(data) {
  const sessionsPerDay = {};

  for (const sessionKey in data) {
    const session = data[sessionKey];
    const date = session.date;
    const duration = parseDuration(session.duration);

    if (!sessionsPerDay[date]) {
      sessionsPerDay[date] = 0;
    }
    sessionsPerDay[date] += duration;
  }

  const totalDays = Object.keys(sessionsPerDay).length;
  const totalDuration = Object.values(sessionsPerDay).reduce((sum, current) => sum + current, 0);
  const averageTimeInMinutes = Math.round(totalDuration / totalDays);

  const hours = Math.floor(averageTimeInMinutes / 60);
  const minutes = averageTimeInMinutes % 60;
  const averageTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  averageTimeMessage.textContent = `Average Time per Day: ${averageTime}`;
}

function createStyleChart(data) {
  const styleCounts = {
    Balkan: 0,
    Jazz: 0
  };

  for (const sessionKey in data) {
    const session = data[sessionKey];
    const style = session.style;

    if (styleCounts[style] !== undefined) {
      styleCounts[style]++;
    }
  }

  const ctx = document.getElementById('style-chart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Balkan', 'Jazz'],
      datasets: [{
        label: 'eqfqwofih',
        data: [styleCounts.Balkan, styleCounts.Jazz],
        backgroundColor: ["rgba(0, 0, 0, 0.0)", "rgba(0, 0, 0, 0.0)"],
        borderColor: "rgba(255, 255, 255, 0.9)",
        offset: 5,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          anchor: 'center',
          align: 'center',
          formatter: (value, context) => {
            return `${context.chart.data.labels[context.dataIndex]}\n${value}`;
          },
          color: 'white',
          font: {
            size: 16,
            weight: 'bold'
          },
          textAlign: 'center',
        },
        tooltip: {
          enabled: false
        },
        legend: {
          display: false
        }
      }
    },
    plugins: [ChartDataLabels]
  });






}

function fetchDataAndVisualize() {
  const dbRef = firebase.database().ref('sessions');

  dbRef.once('value')
    .then((snapshot) => {
      const data = snapshot.val();

      displayAverageTime(data);
      createStyleChart(data);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
}
