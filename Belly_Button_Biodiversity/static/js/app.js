function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    var metadata_url = `/metadata/${sample}`;
    d3.json(metadata_url).then(function(sample) {

      // Use `d3.json` to fetch the metadata for a sample
        // Use d3 to select the panel with id of `#sample-metadata`
      var metadata = d3.select(`#sample-metadata`);

      // Use `.html("") to clear any existing metadata
      metadata.html("");

      // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(sample).forEach(function ([key, value]) {
        var row = metadata.append("p");
        row.text(`${key}: ${value}`);
      });
    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
   var data_url = `/samples/${sample}`;
    // @TODO: Build a Bubble Chart using the sample data
    // var metadata = d3.select(`#sample-metadata`);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(data_url).then(function(data) {
      var pie_values = data.sample_values.slice(0,10);
      var pie_labels = data.otu_ids.slice(0,10);
      var pie_hover = data.otu_labels.slice(0,10); 

      var trace1 = [{
        values: pie_values,
        labels: pie_labels,
        hovertext: pie_hover,
        type: "pie"
      }];
    
      Plotly.newPlot('pie', trace1);
    });


    d3.json(data_url).then(function(data) {
      var x_axis = data.otu_ids;
      var y_axis = data.sample_values;
      var marker_size = data.sample_values;
      var marker_color = data.otu_ids;
      var text_labels = data.otu_labels;

      var trace2 = {
        x: x_axis,
        y: y_axis,
        text: text_labels,
        mode: 'markers',
        marker: {
          color: marker_color,
          size: marker_size
        } 
      };
    
      var data = [trace2];

      var layout = {
        title: "Belly Button Bacteria Diversity",
        xaxis: { title: "OTU ID"}
      };
  
      Plotly.newPlot('bubble', data, layout);
    });
  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
