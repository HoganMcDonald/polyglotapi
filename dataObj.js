chartObj = {
  type: 'bar',
  data: {
    labels: langLabelArr,
    datasets: [{
      label: 'Language',
      data: dataArr,
      backgroundColor: colorArr2,
      borderColor: colorArr,
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
};
