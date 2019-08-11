import NavEvents from "./NavEvents"

export default class NavEventChart {

  static initialiseGraph() {

    let { loadedEvents, navigatedEvents } = NavEvents.filterEventList();
    const loadedLineData = [];
    const loadedEventKeys = Object.keys(loadedEvents);
    for(const index in loadedEventKeys){
      const roundedEventDate = new Date(loadedEvents[loadedEventKeys[index]].date).setHours(0,0,0,0);
      loadedLineData.push({x: roundedEventDate, y: loadedEvents[loadedEventKeys[index]].count});
    }

    const navigatedLineData = [];
    const navigatedEventKeys = Object.keys(navigatedEvents);
    for(const index in navigatedEventKeys){
      const roundedEventDate = new Date(navigatedEvents[navigatedEventKeys[index]].date).setHours(0,0,0,0);    
      navigatedLineData.push({x: roundedEventDate, y: navigatedEvents[navigatedEventKeys[index]].count});
    }

    console.log(navigatedLineData)
    console.log(loadedLineData)

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