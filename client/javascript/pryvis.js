/**
 * @author Diego Barros
 */

return;
d3= require("d3");

setTimeout(function () {


const HEX_RADIUS = 65;

const DEFAULT_COLOR = "#DEDEDE";

const FILL_COLOR = "#F8F8F8";
//const STROKE_COLOR = "#BBBBBB";

const STROKE_COLOR = "#595959";

const MIN_STROKE = 8;
const MAX_STROKE = 11;

const NOT_APPLICABLE = "Não Aplicável";
const NOT_APPLICABLE_COLOR = "#AAAAAA";
const NEUTRAL_DIMENSION = "InfExp";

var margin = {top: 20, right: 10, bottom: 20, left: 10};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
var titleHeight = 0;    
        
var svg = d3.select("#container-honeycomb").append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	//.attr("viewBox", "-50 -20 600 400")
	.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom + titleHeight))
	.style("background-color", "#FDFDFD")
    //.attr("width", width + margin.left + margin.right)
    //.attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" +  ((width / 3) + (margin.left - margin.right + HEX_RADIUS)) + "," + ((margin.top + margin.bottom)) + ")");
    
var privacyLevel = ["Muito Baixo", "Baixo", "Médio", "Alto", "Muito Alto"];
 
var controlLevel = ["Sistema - Valor Fixo no Sistema", 
	"Sistema - Valor Fixo no Tipo de Comunicação", 
	"Sistema", "Outro Usuário", 
	"Indivíduo", 
	"Definido em Tempo de Uso"];

//var color = ['#6baed6','#4292c6','#2171b5','#08519c','#08306b'];

var color = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
var fontColor = ['#525252', '#5E5E5E', '#f5f5f5', '#fCfCfC', '#ffffff'];


var strokeDasharray = ["none", "none", "6,1,6,1,6,1,6,1,6", "3, 3", "5,2,2,2,2,2", "1, 1"];

var colorPrivacyLevel = d3.scaleOrdinal()
	.domain(privacyLevel)
	.range(color);

var fontColorPrivacyLevel = d3.scaleOrdinal()
	.domain(privacyLevel)
	.range(fontColor);
		

var strokeControlLevel = d3.scaleOrdinal()
	.domain(controlLevel)
	.range(strokeDasharray);

var gradient = svg.append("defs")
	.append("linearGradient")
	.attr("id", "gradient-privacy-level")
	.attr("x1", "0%").attr("y1", "0%")
	.attr("x2", "100%").attr("y2", "0%")
	.selectAll("stop") 
	.data(color)                  
	.enter().append("stop") 
	.attr("offset", function(d, i) { return i / (color.length - 1); })   
	.attr("stop-color", function(d) { return d; });
    
var position = [{order: 1, col: 4, row: 0}, {order: 2, col: 2, row: 2}, {order: 3, col: 6, row: 2}, 
	{order: 4, col: 0, row: 4}, {order: 5, col: 4, row: 4}, {order: 6, col: 8, row: 4},	
	{order: 7, col: 2, row: 6}, {order: 8, col: 6, row: 6}, {order: 9, col: 4, row: 8}];
	

var x = d3.scaleLinear()
	.domain([0, position.length])
	.range([0, (width / Math.sqrt(3)) - HEX_RADIUS + (margin.left + margin.right)]).nice();
	
var y = d3.scaleLinear()
	.domain([position.length, 0])
	.range([(height /  Math.sqrt(3)) + (margin.top), 0]).nice();	
    
var data;
var modelingProcessData;


d3.csv("/data/mdp.csv", function(error, rawData){
	
	if (error)
		return console.warn(error);
	
	data = rawData;
	
	var controlData = data.filter(function(d) { return d.code != NEUTRAL_DIMENSION; });
	
	// Create a data structure with information resulting from modeling process through PDM
	var nestedPDM = d3.nest()
		.key(function(d){ return d.name; })
		.entries(data);

    //definindo a variavel como global
    controlsPDM = d3.nest()
		.key(function(d){ return d.name; })
		.entries(controlData);
	
	createControls(controlsPDM);
	
	
	// Map all values needed for an evaluation using PDM
	modelingProcessData = nestedPDM.map(function(d, i) { 
		
		return {id: +d.values[0].dimension_id, 
				name: d.key,
				code: d.values[0].code,
				group: d.values[0].group,
				analysis_order: +d.values[0].analysis_order,
				control: controlLevel[0],
				value: "",
				level: -1, 
				minValue: null, 
				maxValue: null }; 
	});	
	
	
	drawControlLegend();
	
	update(modelingProcessData);

	drawLegend();
		
});


function update(dataset) {

	var honeycomb = svg.append("g")
		.attr("class", "honeycomb")
		.attr("transform", "translate(" +  0 + "," + (titleHeight) + ")");

	var dimension = honeycomb.selectAll(".hexagon")
			.data(dataset).enter()
		.append("g")
			.attr("id", function(d){ return d.code + "-" + d.id; })
			.attr("class", "hexagon");

		dimension.append("path")
			.attr("class", "control-hexagon")
			.attr("d", function(d) { return createHexagon(HEX_RADIUS); })
			.attr("transform", function(d, i) { return "translate(" + x(getPositionCol(d.analysis_order)) + "," + y(getPositionRow(d.analysis_order)) + ")"; })
			.style("fill", "none")
			.style("stroke-width", MIN_STROKE + "px")
			.style("stroke", DEFAULT_COLOR);		

		dimension.append("path")
			.attr("class", "value-hexagon")
			.attr("d", function(d) { return createHexagon(HEX_RADIUS); })
			.attr("transform", function(d, i) { return "translate(" + x(getPositionCol(d.analysis_order)) + "," + y(getPositionRow(d.analysis_order)) + ")"; })
			.style("fill", DEFAULT_COLOR)
			.style("stroke-width", "2px")
			.style("stroke", "#FCFCFC");

		dimension.append("text")
			.attr("class", "dimension-name")
			.attr("x", function(d, i) { return x(getPositionCol(d.analysis_order)) + (HEX_RADIUS / 2); })
			.attr("y", function(d, i) { return y(getPositionRow(d.analysis_order)) + (HEX_RADIUS / 3); })
			//.attr("dx", HEX_RADIUS / 2)
			//.attr("dy", ".12em")
			.style("text-anchor", "middle")
			.style("fill", "#595959")
			.text(function(d) { return d.name; })
				.call(wrap, (HEX_RADIUS + 7));

}

function getPositionCol(order) { return position[order].col; }
function getPositionRow(order) { return position[order].row; } 


/*
 * Create a new hexagon polygon 
 * Return a set of points
 */
function createHexagon(radius) {
	
	var center = {x: 0, y: 0};
	var polygonVertices = [];
	
	var hexWidth = Math.sqrt(3) * radius,
		hexHeight = 2 * (radius);
			
	for (var i=0; i < 6; i++)
	  polygonVertices.push(hexCorner(center, radius, i));	
	
	return "m" + polygonVertices.map(function(p){ return [p[0] , p[1]].join(','); }).join('l') + "z";

}

/*
 * Compute each hexagon vertex
 */
function hexCorner(center, radius, i) {
	var angleDeg = 60 * i;
	var angleRad = Math.PI / 180 * angleDeg;
	return [center.x + radius * Math.cos(angleRad), center.y + radius * Math.sin(angleRad)];
}	

function wrap(text, width) {

  text.each(function() {
  	
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        xTspan = +text.attr("x"),
        yTspan = +text.attr("y"),
        dy = parseFloat(0),
        tspan = text.text(null)
        	.append("tspan")
        		.attr("x", xTspan)
        		.attr("y", yTspan)
        		.attr("dy", dy + "em");

    while (word = words.pop()) {

      line.push(word);
      tspan.text(line.join(" "));
      
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
        			.attr("x", xTspan)
        			.attr("y", yTspan)
        			.attr("dy", ++lineNumber * lineHeight + dy + "em")
        		.text(word);
      }
    }
  
  });
}

function createControls(dataset) {
	/*
	var container = d3.select("#container-controls")
		.selectAll("div")
		.data(dataset).enter()
		.append("div")
			.attr("id", function(d) { return d.values[0].code + "-" + "controls"; })
			.attr("class", "pdm-controls");
	*/		
	
	
	var index = -1;
	
	for (var i=0; i < dataset.length; i++) {
	  if(dataset[i].key == NEUTRAL_DIMENSION)
	  	index = i;
	};
	
	
	dataset.slice(1, index);
					
	var tr = d3.select("#container-controls")
		.select("tbody")
		.selectAll("tr")
			.data(dataset).enter()
		.append("tr")
			.attr("id", function(d) { return  d.values[0].code + "-" + "controls"; })
			.attr("class", "pdm-controls");

	tr.append("td")
		.text(function(d) { return d.key; });

	tr.append("td")
		.append("select")
			.attr("class", "form-control control-level-control")
			.on("change", updateControlPrivacy);
			
	d3.select("#container-controls")
		.selectAll(".control-level-control")
		.selectAll("option")
			.data(controlLevel).enter()
		.append("option")
			.attr("value", function(d) { return d; })
			.text(function(d) { return d; });
			
			
			
	d3.selectAll(".control-level-control")
		.insert("option", ":first-child")
			.attr("class", "dimension-value")
			.attr("value", -1)
			.attr("selected", true)
			.text("Selecione o controle . . . ");		
	
	
	/*		
	d3.selectAll(".control-level-control")
		.append("option")
			.attr("class", "dimension-value")
			.attr("value", NOT_APPLICABLE)
			.text(NOT_APPLICABLE);
	*/		
			
			
	tr.append("td")
		.append("select")
			.attr("require", true)
			.attr("class", " form-control control-value-control")
			.on("change", updatePrivacyLevel)
			.each(fillDimensionValue);
			
			
				
	d3.selectAll(".control-value-control")
		.insert("option", ":first-child")
			.attr("class", "dimension-value")
			.attr("value", -1)
			.attr("selected", true)
			.text("Selecione o valor . . . ");
			
			
	d3.selectAll(".control-value-control")
		.append("option")
			.attr("class", "dimension-value")
			.attr("value", NOT_APPLICABLE)
			.text(NOT_APPLICABLE);

}

function fillDimensionValue(dimension) {

	var dimensionValues = d3.select(this)
		.selectAll(".dimension-value")
		.data(dimension.values);
			
	dimensionValues.enter()
		.append("option")
		.attr("class", "dimension-value")
		.attr("value", function(d) { return d.privacy_level; })
		.text(function(d) { return d.value; });

}
updateControlPrivacy = function updateControlPrivacy(d) {
    
	var t = d3.transition()
      	.duration(780);

    console.log(this);

	var selectedValue = this.value;
	var dimension = "#" + d.values[0].code + "-" + d.values[0].dimension_id;
	
	
	if (selectedValue != -1) {

		modelingProcessData.forEach(function(e) {	
		
			if(e.name == d.key)
				e.control = selectedValue;		
		});
	
		
		d3.select(dimension).select(".control-hexagon")
				.style("stroke-width", function(d) { return (d.control == controlLevel[1]) ? MAX_STROKE + "px" : MIN_STROKE + "px"; } )
			.transition(t)
				.style("stroke-dasharray", function(d) {return strokeControlLevel(d.control); })
				.style("stroke", function(d) { return (d.control == NOT_APPLICABLE) ? NOT_APPLICABLE_COLOR : STROKE_COLOR; } );
				
	} else {
		
		d3.select(dimension)
			.select(".control-hexagon")
				.style("stroke-width", MIN_STROKE + "px")
			.transition(t)
				.style("stroke-dasharray",  "none")
				.style("stroke", DEFAULT_COLOR);
	}

	console.timeEnd("updateControlPrivacy");
	
			
}

updatePrivacyLevel = function updatePrivacyLevel(d) {

	var t = d3.transition()
      	.duration(780);

	var selectedValue = this.value;
	var dimension = "#" + d.values[0].code + "-" + d.values[0].dimension_id;

	if (selectedValue != -1) {

		modelingProcessData.forEach(function(e) {

			if(e.name == d.key)
				e.level = selectedValue;
		});



		d3.select(dimension).select(".value-hexagon")
			.style("fill", function(d) { return (d.level == NOT_APPLICABLE) ? NOT_APPLICABLE_COLOR : colorPrivacyLevel(d.level); });

		d3.select(dimension).select(".dimension-name").selectAll("tspan")
			.style("fill", function(d) { return fontColorPrivacyLevel(d.level); });


		if (selectedValue == NOT_APPLICABLE) {
			d3.select(dimension).select(".control-hexagon").transition(t)
				.style("stroke", NOT_APPLICABLE_COLOR)
				.style("stroke-dasharray", function(d) {return  strokeControlLevel(selectedValue); })
				.style("stroke-width", MIN_STROKE);

			d3.select(dimension).select(".dimension-name").selectAll("tspan")
			.style("fill", function(d) { return "#fcfcfc"; });
		}




	} else {


		var selectedDimension = d3.select(dimension);

		selectedDimension.select(".value-hexagon").transition(t)
			.style("fill", function(d) { return DEFAULT_COLOR; });

		selectedDimension.select(".dimension-name").selectAll("tspan")
			.style("fill", STROKE_COLOR);

		selectedDimension.select(".control-hexagon")
			.style("stroke",DEFAULT_COLOR)
			.style("stroke-width", MIN_STROKE);

	}
}

function resetHexagon(dimension) {
	
	d3.select(dimension)
		.select(".control-hexagon")
			.style("stroke-width", MIN_STROKE + "px")
		.transition(t)
			.style("stroke-dasharray",  "none")
			.style("stroke", DEFAULT_COLOR);
							
	d3.select(dimension)
		.select(".value-hexagon").transition(t)
			.style("fill", function(d) { return DEFAULT_COLOR; })
			.select(".dimension-name");
	
}

function drawControlLegend() {

	var legendWidth = 200,
		legendHeight = height;
		
	var legendSpacing = 52;
	
	var radius = HEX_RADIUS * 0.35;
	
	var legend = svg.append("g")
		.attr("class", "control-legend")
		.attr("transform", "translate(" +  (-(legendWidth + (margin.left - margin.right) +  HEX_RADIUS * 2)) + "," + (titleHeight + margin.top + margin.bottom + (HEX_RADIUS / 4)) + ")");
		
			
	var controlLevelLegend = controlLevel;
	controlLevelLegend.push("Não Aplicável");
	
	
	legend.append("text")
		.attr("x", -(HEX_RADIUS / 3) + 4)
		.attr("y", -legendSpacing / 2)
		.style("fill", "#525252")
		.style("font-weight", 300)
		.text("LEGENDA");	
		
		
	legend.selectAll(".legend-item")
		.data(controlLevelLegend)
			.enter().append("g")
		.attr("class", "legend-item")	
		.append("path")
			.attr("class", "value-hexagon")
			.attr("d", function(d) { return createHexagon(radius); })
			.attr("transform", function(d, i) { return "translate(" + (0) + "," + (i * legendSpacing) + ")"; })
			.style("fill", function(d) { return (d == NOT_APPLICABLE) ? NOT_APPLICABLE_COLOR : "none"; })
			.style("stroke", function(d) { return (d == NOT_APPLICABLE) ? NOT_APPLICABLE_COLOR : STROKE_COLOR; })
			.style("stroke-width", function(d) { return (d == controlLevel[1] || d == NOT_APPLICABLE) ? "4px" : "2px"; })
			.style("stroke-dasharray", function(d) {return strokeControlLevel(d); });
			
	legend.selectAll(".legend-item").filter(":last-child")
		.append("path")
			.attr("d", function(d) { return createHexagon(radius); })
			.attr("transform", function(d, i) { return "translate(" + (0) + "," + ((controlLevelLegend.length - 1) * legendSpacing) + ")"; })
			.style("fill", "none")
			.style("stroke", "#FFFFFF")
			.style("stroke-width", "1px");
			
	legend.selectAll(".legend-item")
		.append("text")
			.attr("x", radius + 20)
			.attr("y", function(d, i) { return (i * legendSpacing) + radius; })
			.style("font-size", ".9em")
			.style("text-anchor", "begin")
			.style("fill", "#676767")
			.style("font-weight",  300)
			.text(function(d) { return d; });
}

function drawLegend() {
	
	
	var legendWidth = width * 0.55,
		legendHeight = 12;
		
	
		
	var x = (width / 3) + (margin.left - margin.right);
	var y = (height / 4) + (margin.top - margin.bottom);
	
	
	var legendScale = d3.scaleLinear()
		.domain([0, privacyLevel.length - 1])
		.range([0, legendWidth]);
		
		
	
	var legend = svg.append("g")
		.attr("class", "legend")
		.attr("transform", "translate(" +  x + "," + (height + margin.top + margin.bottom + titleHeight) + ")");
		
	//Draw the Rectangle
	legend.append("rect")
		.attr("class", "legend-rect") 
		.attr("x", -x)
		.attr("y", -y)
		.attr("rx", legendHeight / 2)
		.attr("width", legendWidth)
		.attr("height", legendHeight)
		.style("fill", "url(#gradient-privacy-level)");
		
	//Append title
	legend.append("text")
		.attr("class", "legend-title")
		.attr("x", -x)
		.attr("dx", ".32em")
		.attr("y", -y)
		.attr("dy", "-0.4em")
		.style("fill", "#888888")
 		.text("Nível de Privacidade");
 		
 	
 		
 	legend.selectAll(".privacy-scale-label")
 		.data(privacyLevel).enter()
 		.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + (-x) + "," + (legendHeight) + ")")
 		.append("text")
 			.attr("x", function(d, i){ return legendScale(i); })
			.attr("y", -y + legendHeight)
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.style("fill", "#676767")
			.style("font-weight",  300)
			.text(function(d, i) { return d; });	

	
}

	console.log(updateControlPrivacy);
	console.log(updatePrivacyLevel);

}, 1000);