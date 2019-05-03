function BuildEnrollData(district_id) {

  d3.json("/enrollment/" + district_id).then((data) => {
    var PANEL = d3.select('#sample-metadata');

    PANEL.html("");
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h5").text(`${key}:${value}`);
    })
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/district_ids").then((data) => {
    data["district_ids"].forEach((districtName) => {
      selector
        .append("option")
        .text(districtName)
        .property("value", districtName);
    });
  });
}

function optionChanged(district_id) {
  // Fetch new data each time a new sample is selected
  BuildEnrollData(district_id);
  // buildMetadata(newSample);
}

// Initialize the dashboard
init();
