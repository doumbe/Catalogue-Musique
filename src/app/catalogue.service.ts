import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  constructor(private httpClient: HttpClient) { }
/*
  requete = "wasabi.i3s.unice.fr/api/v1/artist_all/id/56d93d84ce06f50c0fed8747"
  getFromServer() {
    return this.httpClient.get<any[]>('https://' + this.requete) // Converti la reponse en type <any>  
  }
*/
  private urlmostPublicationsSongs = "https://wasabi.i3s.unice.fr/api/v1/song_all/7634?project=publicationDateAlbum";
  private urlMostAlbums = "https://wasabi.i3s.unice.fr/api/v1/artist/count/album?limit=5";

  getMostPublicationsSongs(): Promise<any>{
    return this.httpClient.get(this.urlmostPublicationsSongs).toPromise();
  }
  
  getMostAlbums(): Promise<any> {
    return this.httpClient.get(this.urlMostAlbums).toPromise();
  }
}
