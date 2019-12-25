import { Component, OnInit, Input } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {
  @Input() mostAlbums: Promise<any>;
  graph;

  constructor() { }

  ngOnInit() {
    this.graph = am4core.create("graphMostAlbum", am4charts.XYChart);
    this.mostAlbums.then(Response => {
      this.graph.data = Response;
      this.dessinerGraph();
    });
  }

  dessinerGraph() {
    //console.log("graph data : " + this.graph.data);
    var categoryAxis = this.graph.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    this.graph.yAxes.push(new am4charts.ValueAxis());
    var series = this.graph.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "sum";
    series.dataFields.categoryX = "name";
    series.name = "Sum";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
  }
}
