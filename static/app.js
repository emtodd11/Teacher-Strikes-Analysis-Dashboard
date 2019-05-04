// Populate panel with district enrollment data points
function buildEnrollData(district_id) {

  d3.json("/enrollment/" + district_id).then((data) => {
    var PANEL = d3.select('#sample-metadata');

    PANEL.html("");
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h5").text(`${key}:${value}`);
    })
  })
}


// Generate pie chart with district funding data points
function buildPie(district_id) {

d3.json("/funding/" + district_id).then((data) => {

  let pieData = [
        {
          values: [data["local"][0], data["state"][0], data["federal"][0]],
          labels: ["local", "state", "federal"],
          hovertext: ["local", "state", "federal"],
          hoverinfo: "hovertext",
          type: "pie",
          title: `Total School District Funding: $${data["local"][0]+data["state"][0]+data["federal"][0]}`
        }
  ];

  let pieLayout = {
      margin: {t: 0, l: 0}
    };

    Plotly.react("pie", pieData, pieLayout);
})
}


// Generate bar chart with district test score data points
function buildBar(district_id) {

  //  Fetch the data for the plots
  d3.json("/testscores/" + district_id).then((data) => {
    console.log(data);
   
  // Trace1 for the ELA Data
  var trace1 = {
    x: [data["year"][0], data["year"][2], data["year"][4]],
    y: [data["proficient"][0], data["proficient"][2],  data["proficient"][4]],
    text: [data["entity"][0], data["entity"][2], data["entity"][4]],
    name: "English Language Arts",
    type: "bar",
    marker: {color: 'rgb(26, 118, 255)'},
  };

  // Trace 2 for the Math Data
  var trace2 = {
    x: [data["year"][1], data["year"][3], data["year"][5]],
    y: [data["proficient"][1], data["proficient"][3],  data["proficient"][5]], 
    text: [data["entity"][1], data["entity"][3], data["entity"][5]], 
    name: "Math",
    type: "bar",
    marker: {color: 'rgb(55, 83, 109)'},
  };

  // Combining both traces
  var barData = [trace1, trace2];

      let barLayout = {
        title: 'Percent Proficent or Above on State Performance Test',
        yaxis: {
          title: 'Percent of Students Proficient and Above',
          titlefont: {
            size: 16,
            color: 'rgb(107, 107, 107)'
          }},
        showlegend: true,
        bargap: 0.05,
        barmode: 'group'
        };

  // Render the plot to the div tag with id "bar"
  Plotly.newPlot("bar", barData, barLayout);

})
}

// Set up dropdown menu
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of district IDs to populate the select options
  d3.json("/district_ids").then((data) => {
    data["district_ids"].forEach((districtName) => {
      selector
        .append("option")
        .text(districtName)
        .property("value", districtName);
    })
  });
  // buildPie("jc_nj");
}

function optionChanged(district_id) {
  // Fetch new data each time a new ID is selected
  buildEnrollData(district_id);
  buildPie(district_id);
  buildBar(district_id);
}

// Initialize the dashboard
init();
