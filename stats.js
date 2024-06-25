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
  

  const styleCtx = document.getElementById('style-chart').getContext('2d');
  new Chart(styleCtx, {
    type: 'pie',
    data: {
      labels: ['Balkan', 'Jazz'],
      datasets: [{
        data: [styleCounts.Balkan, styleCounts.Jazz],
        backgroundColor: ["rgba(0, 0, 0, 0.0)", "rgba(0, 0, 0, 0.0)"],
        borderColor: "rgba(255, 255, 255, 0.9)",
        offset: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
};

function createCategoryChart(data) {
  const categoryCounts = {
    Practice: 0,
    Modes: 0,
    Technique: 0,
    Composition: 0,    
    RJC: 0,
    EarTraining: 0,
    Rhythm: 0,
  };

  for (const sessionKey in data) {
    const session = data[sessionKey];
    const category = session.category;

    if (categoryCounts[category] !== undefined) {
      categoryCounts[category]++;
    }
  }

  console.log('Practice:', categoryCounts.Practice);
  console.log('Modes:', categoryCounts.Modes);
  console.log('Technique:', categoryCounts.Technique);
  console.log('Composition:', categoryCounts.Composition);
  console.log('RJC:', categoryCounts.RJC);
  console.log('Practice:', categoryCounts.Practice);
  console.log('Modes:', categoryCounts.Modes);
  

  const categoryCtx = document.getElementById('category-chart').getContext('2d');
  new Chart(categoryCtx, {
    type: 'pie',
    data: {
      labels: ['Practice', 'Modes', 'Technique', 'Composition', 'Rehearse Jam & Concert', 'EarTraining', 'Time & Rhythm'],
      datasets: [{
        data: [categoryCounts.Practice, categoryCounts.Modes, categoryCounts.Technique, categoryCounts.Composition, categoryCounts.RJC, categoryCounts.EarTraining, categoryCounts.Rhythm],
        backgroundColor: ["rgba(0, 0, 0, 0.0)", "rgba(0, 0, 0, 0.0)"],
        borderColor: "rgba(255, 255, 255, 0.9)",
        offset: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          anchor: 'center',
          align: 'center',
          formatter: (value, context) => {
            return `${context.chart.data.labels[context.dataIndex]}\n${value}`;
          },
          color: 'white',
          font: {
            size: 10,
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
      createCategoryChart(data);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
}

// const categoryCtx = document.getElementById('category-chart').getContext('2d');
// new Chart(categoryCtx, {
//     type: 'pie',
//     data: {
//         labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6'],
//         datasets: [{
//             label: 'Categories',
//             data: [10, 20, 30, 15, 10, 15],
//             backgroundColor: [
//                 'red', 'orange', 'yellow', 'green', 'blue', 'purple'
//             ]
//         }]
//     }
// });

//         // Style Chart
// const styleCtx = document.getElementById('style-chart').getContext('2d');
// new Chart(styleCtx, {
//     type: 'pie',
//     data: {
//         labels: ['Style 1', 'Style 2'],
//         datasets: [{
//             label: 'Styles',
//             data: [70, 30],
//             backgroundColor: [
//                 'cyan', 'magenta'
//             ]
//         }]
//     }
// });

