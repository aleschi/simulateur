import { Controller } from "@hotwired/stimulus"
import Highcharts from "highcharts"

export default class extends Controller {
	static targets = [ "canvasElement","canvasElement2" ];

  	connect() {
        
  		const data = JSON.parse(this.data.get("donnees"));
        const data2 = JSON.parse(this.data.get("donnees2"));
        const data3 = JSON.parse(this.data.get("donnees3"));

        const grades = JSON.parse(this.data.get("grades"));

        const sub1 = data2.map((v, i) => v - data[i]);
        const sub2 = data3.map((v, i) => v - data2[i]);
        const sub3 = data3.map((v, i) => v - data[i]);


       
        const debut =this.data.get("debutdispo");
        const fin = this.data.get("findispo");
        var series;
        if (data.length != 0 && data2.length != 0 && data3.length != 0 ){
            series = [{
                name: 'rémunération avant réforme',
                data: data,
                pointStart: 2022,
                pointInterval: 1,
                color: "#000091",
                type: 'spline',  
                
              },{
                name: 'rémunération après réforme avec maintien dans le corps en extinction ',
                data: data2,
                pointStart: 2022,
                pointInterval: 1,
                color: "#169B62",
                type: 'spline',  
               
              },{
                name: "rémunération après réforme avec droit d'option ",
                data: data3,
                pointStart: 2022,
                pointInterval: 1,
                color: "#E18876",
                type: 'spline',  
               
                },];
        } else if (data.length != 0 && data2.length == 0 && data3.length != 0){
            series = [{
                name: 'rémunération avant réforme',
                data: data,
                pointStart: 2022,
                pointInterval: 1,
                color: "#000091",
                type: 'spline',  
                
              },{
                name: "rémunération après réforme avec droit d'option ",
                data: data3,
                pointStart: 2022,
                pointInterval: 1,
                color: "#E18876",
                type: 'spline',  
               
                },];
        } else {
            series = [];
        }
  
  		const options = {
            chart: {
                style:{
                    fontFamily: "Marianne",
                },  
                  
            },
            
            title: {
                text: "Simulations graphiques de la rémunération indiciaire",
                style: {
                fontSize: '15px',
                fontWeight: "900",
                color: '#1E1E1E',
                }
            },
            tooltip: {
                shared: true,
                borderColor: 'transparent',
                borderRadius: 16,
                backgroundColor: '#fff', 
                //headerFormat: '{point.key} - Grade : <br>',
                formatter: function () {
                    var indice = this.x - 2022;
                    var grade = grades[indice];
                    return this.points.reduce(function (s, point) {
                        return s + '<br/>' + point.series.name + ': ' + point.y + '*56.2323€';
                    }, '<b>' + this.x + ' - Grade : '+grade+'</b>');
                },
            },
            xAxis:{
            	tickInterval: 1,
                //type: 'datetime',
                //softMin: Date.UTC(2022),
                plotBands: [{
                    borderColor:'#F0F0F0',
                    borderWidth: 0,
                    color: '#F0F0F0',
                    label: {
                    text: "Disponibilité",
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    style: {
                      color:'#000',
                      fontWeight: 'light',
                      fontStyle: 'italic',
                    },
                    },
                    zIndex: 1,
                    from: debut,
                    to: fin,
                }],
            },
            yAxis: { 
            title: {
                text: "indices",
                
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
            series: series,
    	};

        
        var series2;
        if (data.length != 0 && data2.length != 0 && data3.length != 0 ){
            series2 = [{
                name: 'Ecart Après Réforme - Avant Réforme  ',
                data: sub1,
                pointStart: 2022,
                pointInterval: 1,
                color: "#5770BE",
                type: 'column',  
                
              },{
                name: 'Ecart Après Réforme avec droit option - Avant Réforme',
                data: sub3,
                pointStart: 2022,
                pointInterval: 1,
                color: "#6D1247",
                type: 'column',  
               
              },{
                name: "Ecart Après Réforme avec droit option - Après Réforme",
                data: sub2,
                pointStart: 2022,
                pointInterval: 1,
                color: "#00949C",
                type: 'column',  
               
                },]
        } else if (data.length != 0 && data2.length == 0 && data3.length != 0){
            series2 = [{
                name: 'Ecart Après Réforme avec droit option - Avant Réforme',
                data: sub3,
                pointStart: 2022,
                pointInterval: 1,
                color: "#6D1247",
                type: 'column',  
               
              },]
        }else {
            series2 = [];
        }

        const options2 = {
            chart: {
                style:{
                    fontFamily: "Marianne",
                },  
                  
            },
            
            title: {
                text: "Ecarts indiciaires",
                style: {
                fontSize: '15px',
                fontWeight: "900",
                color: '#1E1E1E',
                }
            },
            tooltip: {
                shared: true,
                borderColor: 'transparent',
                borderRadius: 16,
                backgroundColor: '#fff', 
            },
            xAxis:{
                tickInterval: 1,
                //type: 'datetime',
                //softMin: Date.UTC(2022),
                plotBands: [{
                    borderColor:'#F0F0F0',
                    borderWidth: 2,
                    color: '#F0F0F0',
                    label: {
                    text: "Disponibilité",
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    style: {
                      color:'#000',
                      fontWeight: 'light',
                      fontStyle: 'italic',
                    },
                    },
                    zIndex: 10,
                    from: debut,
                    to: fin,
                }],
            },
            yAxis: { 
            title: {
                text: "Ecart",
                
                }
            },
            plotOptions: {
                column: {
                    pointWidth: 4,
                    
                    marker: {
                        enabled: false
                    },
                },
                
            },
            series: series2,
        };
  		//let contex = this.canvasElementTarget.getContext("2d");
        
    	this.chart = new Highcharts.chart(this.canvasElementTarget, options);

        this.chart2 = new Highcharts.chart(this.canvasElement2Target, options2);
    	


  	}
}
