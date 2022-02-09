import { Controller } from "@hotwired/stimulus"
import Highcharts from "highcharts";

export default class extends Controller {
	static targets = [ "canvasElement" ];

  	connect() {
  		const data = JSON.parse(this.data.get("donnees"));
  		const options = {
        chart: {
            style:{
                fontFamily: "Marianne",
            },  
            type: 'spline',    
        },
        title: {
            text: "Simulations graphiques de la rémunération",
            style: {
            fontSize: '15px',
            fontWeight: "900",
            color: '#1E1E1E',
            }
        },
        xAxis:{
        	tickInterval: 1,
        },
        yAxis: { 
        title: {
            text: "Rémunération €",
            
            }
        },
        plotOptions: {
        	spline: {
	            lineWidth: 4,
	            states: {
	                hover: {
	                    lineWidth: 5
	                }
	            },
	            marker: {
	                enabled: false
	            },
        	},
        },
        series: [{
		    name: 'rémunération sans réforme',
		    data: data,
		    pointStart: 2022,
		    pointInterval: 1,
		    
		},{
		    name: 'rémunération avec réforme',
		    data: data,
		    pointStart: 2022,
		    pointInterval: 1,
		   
		}],
    	};
  		//let contex = this.canvasElementTarget.getContext("2d");
    	this.chart = new Highcharts.chart(this.canvasElementTarget, options);
    	//this.chart.data = JSON.parse(this.data.get("donnees"));
    	//this.chart.update();
  	}
}
