import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { CatalogueService } from './catalogue.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@Injectable()
export class AppComponent {
  profil = {
    nom: "TRAORE",
    prenom: "Doumbe",
    age: "10 ans"
  }
  constructor(private catService: CatalogueService) { } //Construit un service catService de type CatalogueService

  mostPublicationsSongs;
  mostAlbums;

  ngOnInit(): void {
    this.getMostPublicationsSongs();
    this.getMostAlbums();
  }

//Definition des methodes pour recuperer des données à travers le service catService de type CatalogueService
  getMostPublicationsSongs() {
    this.mostPublicationsSongs = this.catService.getMostPublicationsSongs();
  }

  getMostAlbums() {
    this.mostAlbums = this.catService.getMostAlbums();
  }
}
