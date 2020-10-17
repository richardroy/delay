import NavEvents from "./model/NavEvents"
import Chart from 'chart.js';

export default class NavEventChart {

  static async initialiseGraph() {
    const { loadedEvents, navigatedEvents } = await NavEvents.filterEventList();
    const loadedLineData = [];
    for (const [date, count] of Object.entries(loadedEvents)) {
      const roundedEventDate = new Date(date);
      loadedLineData.push({x: roundedEventDate, y: count});
    }

    const navigatedLineData = [];
    for (const [date, count] of Object.entries(navigatedEvents)) {
      const roundedEventDate = new Date(date);
      navigatedLineData.push({x: roundedEventDate, y: count});
    }

    var ctx = document.getElementById("eventChart");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
              data: navigatedLineData,
              label: '# Navigated',
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)'
              ],
              pointBackgroundColor: 'rgba(255,99,132,1)',            
              borderWidth: 1
            },{
              data: loadedLineData,
              label: '# Loaded',
              backgroundColor: [
                  'rgba(99, 132, 255, 0.2)'
              ],
              borderColor: [
                'rgba(99, 132, 255, 1)'
              ],
              pointBackgroundColor: 'rgba(99, 132, 255, 1)',
              borderWidth: 1            
          }]
        },
        options: {
          hover: {
            mode: 'single'
          },
          legend: {
            display: true
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }],
            xAxes: [{
              type: 'time',
              time: {
                unit: 'day',
                tooltipFormat: 'll'
              }
            }]
          },
          responsive: false
        }
    });
  }

}