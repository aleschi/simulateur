import { Controller } from "@hotwired/stimulus"
import Highcharts from "highcharts"
import exporting from "exporting"
import data from "data"
import accessibility from "accessibility"
import nodata from "nodata"
exporting(Highcharts)
data(Highcharts)
accessibility(Highcharts)
nodata(Highcharts)

export default class extends Controller {
	static get targets() {
  return [ "canvasElement","canvasElement2" ];
}

  	connect() {
        
  		const data = JSON.parse(this.data.get("donnees"));
        const data2 = JSON.parse(this.data.get("donnees2"));
        const data3 = JSON.parse(this.data.get("donnees3"));

        const grades = JSON.parse(this.data.get("grades"));
        const grades2 = JSON.parse(this.data.get("grades2"));
        const efs = JSON.parse(this.data.get("efs"));

        const sub1 = data2.map((v, i) => v - data[i]);
        const sub2 = data3.map((v, i) => v - data2[i]);
        const sub3 = data3.map((v, i) => v - data[i]);


       
        const debut =this.data.get("debutdispo");
        const fin = this.data.get("findispo");
        var series = [];
        if (data.length != 0){
            series.push({
                name: 'Indice avant réforme',
                data: data,
                pointStart: 2023,
                pointInterval: 1,
                color: 'var(--background-action-high-blue-cumulus)',
                type: 'spline',  
                lineWidth: 5,
                dashStyle: 'ShortDot',
            })
        }
        if (data2.length != 0){
            series.push({
                name: 'Indice après réforme avec maintien dans le corps en extinction ',
                data: data2,
                pointStart: 2023,
                pointInterval: 1,
                color: "var(--background-action-high-green-bourgeon)",
                type: 'spline',  
                lineWidth: 4,
            })
        }
        if (data3.length != 0){
            series.push({
                name: "Indice après réforme avec droit d'option ",
                data: data3,
                pointStart: 2023,
                pointInterval: 1,
                color: "var(--background-action-high-purple-glycine)",
                type: 'spline',  
                lineWidth: 4,
            })
        }
        
  
  		const options = {
            chart: {
                spacing: 0,

                style:{
                    fontFamily: "Marianne",
                },  
                  
            },
            lang: {
                downloadCSV:"Télécharger en format CSV",
                downloadJPEG:"Télécharger l'image en JPEG",
                downloadPDF:"Télécharger en format PDF",
                downloadPNG:"Télécharger l'image en PNG",
                downloadSVG:"Télécharger l'image en SVG",
                downloadXLS:"Télécharger en format XLS",
                printChart:"Imprimer le graphique",
                viewFullscreen: "Voir en plein écran",
                viewData: "Voir la table des données",
                noData: "Les courbes s'afficheront lorsque vous aurez <br>renseigné et validé les informations du formulaire."
            },
            title: {
                text: "Suivi indiciaire au 1er Janvier de chaque année ",
                style: {
                fontSize: '15px',
                fontWeight: "900",
                color: 'var(--text-title-grey)'
                }
            },
            subtitle:{
                text: "Les valeurs des graphes sont données à titre indicatif",
                style: {color: 'var(--text-title-grey)', fontSize: '13px',}, 
            },
            tooltip: {
                shared: true,
                borderColor: 'transparent',
                borderRadius: 16,
                backgroundColor: "rgba(245, 245, 245, 0.75)", 
                //headerFormat: '{point.key} - Grade : <br>',
                formatter: function () {
                    var indice = this.x - 2023;
                    var grade = grades[indice];
                    var grade2 = grades2[indice];
                    var ef = efs[indice];
                    return this.points.reduce(function (s, point) {
                        return s + '<br/>' + '<span style="color:' + point.series.color + ';">' + point.series.name + '</span> : ' + point.y ;
                    }, '<b> 1er Janvier ' + this.x + '<br>Grade : '+grade+' / Grade reclassé : '+ grade2 +'<br>Emploi fonctionnel : '+ef +'</b>');
                },
            },
            xAxis:{
            	tickInterval: 1,
                labels: {
                    style: {color: 'var(--text-title-grey)'},
                },
                //type: 'datetime',
                //softMin: Date.UTC(2023),
                plotBands: [{
                    borderColor:'#F0F0F0',
                    borderWidth: 0,
                    color: '#F0F0F0',
                    label: {
                    text: "Disponibilité",
                    textAlign: 'center',
                    verticalAlign: 'top',
                    style: {
                      color:'var(--text-title-grey)',
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
                labels: {
                    style: {color: 'var(--text-title-grey)'},
                },
                title: {
                text: "Indice",
                style: {color: 'var(--text-title-grey)'}, 
                }
            },
            legend: {
                symbolWidth: 40,
                itemStyle: {"color": 'var(--text-title-grey)', "cursor": "pointer", "fontSize": "12px", "fontWeight": "bold", "textOverflow": "ellipsis"},
                itemHoverStyle: {"color": 'var(--text-title-grey)'},
            },
            plotOptions: {
            	spline: {
    	            //lineWidth: 4,
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

        
        var series2 = [];
        if (data.length != 0 && data2.length != 0){
            series2.push({
                name: 'Écart Après Réforme sans opter - Avant Réforme  ',
                data: sub1,
                pointStart: 2023,
                pointInterval: 1,
                color: "var(--background-action-high-green-bourgeon)",
                type: 'column', 
            })
        }
        /*if (data2.length != 0 && data3.length != 0){
            series2.push({
               name: "Écart Après Réforme avec droit option - Après Réforme",
                data: sub2,
                pointStart: 2023,
                pointInterval: 1,
                color: "#00949C",
                type: 'column',  
            })
        }*/
        if (data3.length != 0 && data.length != 0){
            series2.push({
                name: 'Écart Après Réforme avec droit option - Avant Réforme',
                data: sub3,
                pointStart: 2023,
                pointInterval: 1,
                color: "var(--background-action-high-purple-glycine)",
                type: 'column',  
            })
        }
        

        const options2 = {
            chart: {
                spacing: 0,
                style:{
                    fontFamily: "Marianne",
                },  
                  
            },
            lang: {
                downloadCSV:"Télécharger en format CSV",
                downloadJPEG:"Télécharger l'image en JPEG",
                downloadPDF:"Télécharger en format PDF",
                downloadPNG:"Télécharger l'image en PNG",
                downloadSVG:"Télécharger l'image en SVG",
                downloadXLS:"Télécharger en format XLS",
                printChart:"Imprimer le graphique",
                viewFullscreen: "Voir en plein écran",
                viewData: "Voir la table des données",
                noData: "Les courbes s'afficheront lorsque vous aurez <br>renseigné et validé les informations du formulaire.",
            },
            title: {
                text: "Écarts indiciaires au 1er Janvier de chaque année",
                style: {
                fontSize: '15px',
                fontWeight: "900",
                color: 'var(--text-title-grey)',
                }
            },
            subtitle:{
                text: "Les valeurs des graphes sont données à titre indicatif",
                style: {color: 'var(--text-title-grey)', fontSize: '13px',}, 
            },
            tooltip: {
                shared: true,
                borderColor: 'transparent',
                borderRadius: 16,
                backgroundColor: 'rgba(245, 245, 245, 0.75)', 
                formatter: function () {
                    var indice = this.x - 2023;
                    var grade = grades[indice];
                    var grade2 = grades2[indice];
                    var ef = efs[indice];
                    return this.points.reduce(function (s, point) {
                        return s + '<br/>' + '<span style="color:' + point.series.color + ';">' + point.series.name + '</span> : ' + point.y ;
                    }, '<b> 1er Janvier ' + this.x + '<br>Grade : '+grade+' / Grade reclassé : '+ grade2 +'<br>Emploi fonctionnel : '+ef +'</b>');
                },
            },
            xAxis:{
                tickInterval: 1,
                //type: 'datetime',
                //softMin: Date.UTC(2023),
                labels: {
                    style: {color:'var(--text-title-grey)'},
                },
                plotBands: [{
                    borderColor:'#F0F0F0',
                    borderWidth: 0,
                    color: '#F0F0F0',
                    label: {
                    text: "Disponibilité",
                    textAlign: 'center',
                    verticalAlign: 'top',
                    style: {
                      color:'var(--text-title-grey)',
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
                labels: {
                    style: {color: 'var(--text-title-grey)'},
                },
                title: {
                text: "Écart",
                style: {color: 'var(--text-title-grey)'}, 
                }
            },
            legend: {
                symbolWidth: 40,
                itemStyle: {"color": 'var(--text-title-grey)', "cursor": "pointer", "fontSize": "12px", "fontWeight": "bold", "textOverflow": "ellipsis"},
                itemHoverStyle: {"color": 'var(--text-title-grey)'},
            },
            plotOptions: {
                column: {
                    pointWidth: 2,
                    
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
    	
        this.chart.reflow();
        this.chart2.reflow();

  	}
}
