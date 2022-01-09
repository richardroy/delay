import NavEvents from "./model/NavEvents"
import Chart from 'chart.js';

export default class NavEventChart {

  static getDaysInMonth = (year, month) => new Date(year, month, 0).getDate()

  static addMonths = (input, months) => {
    const date = new Date(input)
    date.setDate(1)
    date.setMonth(date.getMonth() + months)
    date.setDate(Math.min(input.getDate(), this.getDaysInMonth(date.getFullYear(), date.getMonth()+1)))
    return date
  }
  

  static async initialiseGraph() {
    const { loaded, navigated } = await NavEvents.load();
    const loadedLineData = [];
    for (const [date, count] of Object.entries(loaded)) {
      const roundedEventDate = new Date(date);
      const increasedDate = this.addMonths(roundedEventDate, 6)

      if(new Date() < increasedDate)
        loadedLineData.push({x: roundedEventDate, y: count});
    }

    const navigatedLineData = [];
    for (const [date, count] of Object.entries(navigated)) {
      const roundedEventDate = new Date(date);
      const increasedDate = this.addMonths(roundedEventDate, 6)

      if(new Date() < increasedDate)
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
                beginAtZero: true,
                precision: 0
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