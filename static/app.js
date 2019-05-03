// Populate panel with district enrollment data points
function BuildEnrollData(district_id) {

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
          type: "pie"
        }
  ];

  let pieLayout = {
      margin: {t: 0, l: 0}
    };

    Plotly.plot("pie", pieData, pieLayout);
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
  BuildEnrollData(district_id);
  buildPie(district_id);
}

// Initialize the dashboard
init();
