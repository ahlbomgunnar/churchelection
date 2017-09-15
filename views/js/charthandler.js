
// Socket init
var socket = io();
// Chart Settings
var localChartType = localStorage.getItem('localChartType');
var localLegendPosition = localStorage.getItem('localDataType');
var localDataType = localStorage.getItem('localLegendPosition');
// Local data & canvas context
var localData;
var ctx;

// Check for saved cookies
(function() {
    if(!typeExist(localChartType)) {
        localChartType = 'bar';
        localStorage.setItem('localChartType', localChartType);
    }
    if(!typeExist(localDataType)) {
        localDataType = 'unfiltered';
        localStorage.setItem('localDataType', localDataType);
    }
    if(!typeExists(localLegendPosition)) {
        localLegendPosition = 'bottom';
        localStorage.setItem('legendPosition', localLegendPosition);
    }
})

// Check if undefined, null & string
let typeExists = (x) => {
    if(x === undefined || x === null || typeof x !== 'string') {
        return false;
    } else {
        return true;
    }
}

// Function to switch chart type
let switchChart = (chartType, dataType) => {
    localStorage.setItem('chartType', chartType);
    localStorage.setItem('dataType', dataType);
    chartType = localStorage.getItem('chartType');
    dataType = localStorage.getItem('dataType');
    resetCanvas();
}

// Function to switch chart legend position
let switchLegendPosition = (legendPosition) => {
    localStorage.setItem('legendPosition', legendPosition);
    legendPosition = localStorage.getItem('legendPosition');
    resetCanvas();
}

// Main canvas projector
let resetCanvas = () => {

    // Define canvas container
    let container = $('#chartcontainer');
    // If container has chart, remove it and replace it, else just append new.
    if(container.find($('#displacementchart'))) chart = null;
    // Empty container
    container.html('');
    // Append new canvas
    container.append('<canvas id="displacementchart"><canvas>');
    // Define canvas
    var canvas = document.querySelector('#displacementchart');
    ctx = canvas.getContext('2d');

  
    if(localStorage.getItem('dataType') === 'unfiltered') {
        // Chart prefab
        var chart = newChart(
            localStorage.getItem('chartType'), 
            getUnfilteredDatasets(localData),
            localStorage.getItem('legendPosition'),
            scales = {
                xAxes: [{
                    stacked: true,
                    ticks: {
                        autoSkip: false
                    },
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        );
    }
    else {
        chart = newChart(
            localStorage.getItem('chartType'), 
            getSummedDatasets(localData),
            localStorage.getItem('legendPosition'),
        );
    }
}

let getSummedDatasets = (α) => {

    // Summed votes
    let ω = [];
    for(let x in α) {
        for(let y in α[x].party) {
            ω[y] === undefined ? ω.push(α[x].party[y].votes) : ω[y] += α[x].party[y].votes;
        }
    }
    
    // Parties names
    let β = [];
    for(let y in α[0].party) {
        β.push(α[0].party[y].name);
    }
    
    // Return-object
    let λ = {
        labels: β,
        datasets: [{
            label:'Summed results',
            backgroundColor: [
                'rgba(255,51,51,0.85)', 'rgba(255,153,51,0.85)', 'rgba(255,255,51,0.85)', 
                'rgba(153,255,51,0.85)', 'rgba(51,255,51,0.85)', 'rgba(51,255,153,0.85)', 
                'rgba(51,255,255,0.85)', 'rgba(51,153,255,0.85)', 'rgba(51,51,255,0.85)',
                'rgba(153,51,255,0.85)', 'rgba(255,51,255,0.85)', 'rgba(255,51,153,0.85)',
                'rgba(160,160,160,0.85)', 'rgba(100,100,100,0.85)'
            ],
            data: ω
        }]
    }
    return λ;
}

let getUnfilteredDatasets = (α) => {

    // Dataset array
    let γ = [];
    for(let x in α) {
        let ω = [];
        for(let y in α[x].party) {
            ω.push(α[x].party[y].votes);
        }
        γ.push({
            label: α[x].place,
            backgroundColor: 'rgba(255,' + ((x*62)+25) + ',51,0.85)',
            data: ω
        });
    }
   
    // Party names
    let β = [];
    for(let y in α[0].party) {
        β.push(α[0].party[y].name);
    }
    
    // Return-object
    let λ = {
        labels:β,
        datasets:γ
    }
    return λ;
}


// data.labels && data.labels.datasets[0].data co-exists, refer to let-get-functions
function newChart(chartType, data, legendPosition, scales) {
    return new Chart(ctx, {
        type: chartType,
        data: data,
        options: {
            responsive:true,
            legend: {
                position:legendPosition,
            },
            title: {
                display:true,
                text:'Vote results'
            },
            animation: {
                animationScale:true,
                animationRotate:true,
                easing:'easeInOutCubic'
            },
            maintainAspectRatio:false,
            scales: scales
        }
    });
}


// Socket handlers

// On user connection
socket.on('clientConnection', function(data) {
  localData = data;
  resetCanvas();
  // Prevent other users from triggering function
  socket.removeListener('clientConnection');
})

// When data changes, update chart
socket.on('dataUpdate', function(data) {
  localData = data;
  resetCanvas();
})


