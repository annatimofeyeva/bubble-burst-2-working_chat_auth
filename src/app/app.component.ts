import { Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MarsPhotosService } from './mars-photos.service';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ MarsPhotosService,AngularFireAuth ]
})
export class AppComponent {

  photos: any[]=null;
  noPhotos: boolean=false;

  private isLoggedIn: Boolean;
  private userName: String;


  user: Observable<firebase.User>;
  items: FirebaseListObservable<any[]>;
  msgVal: string = '';

  constructor(private marsRoverPhotos: MarsPhotosService, public afAuth: AngularFireAuth, public af: AngularFireDatabase) {

    this.items = af.list('/messages', {
          query: {
            limitToLast: 50
          }
        });

        this.user = this.afAuth.authState;
        this.user.subscribe(user =>  {
              console.log(user);
            });

    this.user.subscribe(user => {
          if (user == null) {
            this.isLoggedIn = false;
          } else {
            this.isLoggedIn = true;
            this.userName = user.displayName;
          }
        });

  }

  login() {
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
      this.afAuth.auth.signOut();
  }

  Send(desc: string) {
      this.items.push({ message: desc});
      this.msgVal = '';
  }

  ngOnInit() {
    this.noPhotos = false;
    this.marsRoverPhotos.getImages().subscribe(response => {
      if(response.json().photos.length > 0)
    {
      this.photos = response.json();
    }
    else {
      this.noPhotos = true;
    }
    });

  }


  // photos: any[]=null;
  //   noPhotos: boolean=false;
  //   constructor(private marsRoverPhotos: MarsPhotosService) { }

  //   getRoverImages() {
  //   this.noPhotos = false;
  //   this.marsRoverPhotos.getImages().subscribe(response => {
  //     if(response.json().photos.length > 0)
  //   {
  //     this.photos = response.json();
  //   }
  //   else {
  //     this.noPhotos = true;
  //   }
  //   });
  // }
}
