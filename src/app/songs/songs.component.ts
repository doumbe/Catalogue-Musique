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
    this.mostPublicationsSongs.then(Response => { // On recupère une promesse grâce au service catService puis on traite les données de la promesse. 
      this.dataJson = Response;
      this.dataJson.forEach(element => { //this.dataJson.forEach(function( element) {
        let val = element["publicationDateAlbum"];//extraire la date au format Str
        if (val) {
          if (val in this.dataXY) {
            this.dataXY[val]++;//compter le nb d'occurences
          } else {
            this.dataXY[val] = 1;//classer les dates dans un dictionnaire
            this.keys.push(parseInt(val));//classer les dates au format Int
          }
        }
      });
      this.completerData();//optionnel
      this.keys = this.keys.sort();//trier les années en ordre croissant
      //document.getElementById("demo1").innerHTML = JSON.stringify(this.keys);
      this.setJsonData();
      this.afficherJsonData();
      this.dessinerGraph();
    },
      (raison) => {
        this.dataJson = raison;
      }
    )
  }

  completerData() {//completer les données manquantes
    this.keys = this.keys.sort();
    let fin = this.keys[this.keys.length - 1];
    for (let k = this.keys[0]+1; k < fin; k++) {
      if (!(k.toString() in this.dataXY)){
        this.keys.push(k);
        this.dataXY[k] = 0;
      }
    }
  }

  setJsonData() {//mettre les données au format JSON pour le graphique
    this.dataGraph["cols"] = [{ "label": "Annees", "type": "number" }, { "label": "Publications", "type": "number" }];
    this.dataGraph["rows"]=[];
    this.keys.forEach(key => {
      this.dataGraph["rows"].push({ "c": [{ "v": key }, { "v": this.dataXY[key] }]});
    });
  }

  dessinerGraph() {
    google.charts.load('current', { 'packages': ['corechart']});
    google.charts.setOnLoadCallback(drawChart);//drawVisualization

    function drawChart() {//drawChart()
      //données JSON
      //var data = new google.visualization.DataTable(JSON.stringify(this.dataGraph));

      //données statiques provisoires
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Années');
      data.addColumn('number', 'Publications');
      var annees = ["1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010"];
      var publications = [10, 0, 0, 0, 9, 0, 11, 27, 11, 14, 13, 19, 26, 0, 15, 14, 17];
      for (let i = 0; i < annees.length; i++){
        data.addRow([annees[i], publications[i]]);
      }

      var options = {
        title: 'Songs per years',
        //curveType: 'function',
      };
      //construire le graphique
      var chart = new google.visualization.LineChart(document.getElementById('graphMostPublications'));
      chart.draw(data, options);
    }
  }

  afficherJsonData() {//option personnelle
    document.getElementById("demoJSON").innerHTML = this.syntaxHighlight(this.dataGraph);
  }

  syntaxHighlight(json) {//coloration syntaxique
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      var color="orange";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
          color="red";
        } else {
          cls = 'string';
          color="green";
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
        color="blue";
      } else if (/null/.test(match)) {
        cls = 'null';
        color="magenta";
      }
      return '<span style="color:'+ color +';" class="' + cls + '">' + match + '</span>';
    });
  }
}
