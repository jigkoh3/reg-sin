import { Component } from '@angular/core';
import { CameraResultType, Plugins } from "@capacitor/core";
import { OcrService } from './ocr.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

const { Camera } = Plugins;

import '@capacitor-community/camera-preview';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(-90deg)' })),
      transition('rotated => default', animate('1500ms ease-out')),
      transition('default => rotated', animate('400ms ease-in'))
    ])
  ]
})
export class AppComponent {
  photo: any;
  cardData: any;
  state: string = 'default';
  file: File;
  constructor(private ocr: OcrService) {

  }
  async takePicture() {
    this.photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      quality: 100,
      width: 100,
      height: 100,
      correctOrientation: true
    });
   
    this.file = this.dataURLtoFile(this.photo.dataUrl, "card.jpg");
    console.log(this.file);
    // this.state = (this.state === 'default' ? 'rotated' : 'default');
    // this.ocr.uploadFile(file).subscribe((res) => {
    //   this.cardData = res;
    // }, (err) => {
    //   this.cardData = err;
    // });
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  rotate() {
    this.state = (this.state === 'default' ? 'rotated' : 'default');
  }


}
