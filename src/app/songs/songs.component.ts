import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  @Input() mostPublicationsSongs: Promise<any>;
  graph;
  dataJson;
  dataXY = {};
  dataGraph = {};
  keys = [];

  constructor() { }

  ngOnInit() {
    this.getDataSong();
  }

  //Traitement des données
  getDataSong() {
    //let keys = [];
    this.mostPublicationsSongs.then(Response => { // On recupère une promesse grâce au service catService puis on traite les données de la promesse. 
      this.dataJson = Response;
      this.dataJson.forEach(element => { //this.dataJson.forEach(function( element) {
        let val = element["publicationDateAlbum"];
        if (val) {
          if (val in this.dataXY) {
            this.dataXY[val]++;
          } else {
            this.dataXY[val] = 1;
            this.keys.push(parseInt(val));
          }
        }
      });
      this.keys = this.keys.sort();
      let fin = this.keys[this.keys.length - 1];
      for (let k = this.keys[0]+1; k < fin; k++) {
        if (!(k.toString() in this.dataXY)){
          this.keys.push(k);
          this.dataXY[k] = 0;
        }
      }
      this.keys = this.keys.sort();
      document.getElementById("demo1").innerHTML = JSON.stringify(this.keys);
      this.dataGraph["cols"] = [{ "label": "Annees", "type": "number" }, { "label": "Publications", "type": "number" }];
      this.dataGraph["rows"]=[];
      this.keys.forEach(key => {
        this.dataGraph["rows"].push({ "c": [{ "v": key }, { "v": this.dataXY[key] }]});
      });
      document.getElementById("demoJSON").innerHTML = JSON.stringify(this.dataGraph);
      this.dessinerGraph();
    },
      (raison) => {
        this.dataJson = raison;
      }
    )
  }

  dessinerGraph() {
    google.charts.load('current', { 'packages': ['corechart']});
    google.charts.setOnLoadCallback(drawChart);//drawVisualization

    function drawChart() {//drawChart()
      //var data = new google.visualization.DataTable(JSON.stringify(this.dataGraph));
      
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Années');
      data.addColumn('number', 'Publications');
      var annees = ["1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010"];
      var publications = [10, 0, 0, 0, 9, 0, 11, 27, 11, 14, 13, 19, 26, 0, 15, 14, 17];
      for (let i = 0; i < annees.length; i++){
        data.addRow([annees[i], publications[i]]);
      }

      var options = {
        title: 'Most Publications Songs',
        //curveType: 'function',
      };

      var chart = new google.visualization.LineChart(document.getElementById('graphMostPublications'));
      chart.draw(data, options);
      
    }
    /*
    google.charts.setOnLoadCallback(drawVisualization);

    function drawVisualization() {
      var wrapper = new google.visualization.ChartWrapper({
        chartType: 'ColumnChart',
        dataTable: this.dataGraph,
        //[['', 'Germany', 'USA', 'Brazil', 'Canada', 'France', 'RU'],
        //['', 700, 300, 400, 500, 600, 800]],
        options: { 'title': 'Countries' },
        containerId: 'graphMostPublications'
      });
      wrapper.draw();
    }
    */
  }
}
