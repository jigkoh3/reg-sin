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
      width: 10,
      height: 10
    });
    // this.file = this.dataURLtoFile(this.photo.dataUrl, "card.jpg");
    this.compressImage(this.photo.dataUrl, 480, 640).then(compressed => {
      // console.log(compressed);
      this.photo.dataUrl = compressed;
      this.file = this.dataURLtoFile(compressed, "card.jpg");
      this.ocr.uploadFile(this.file).subscribe((res) => {
        this.cardData = res;
      }, (err) => {
        this.cardData = err;
      });
    })
    // this.state = (this.state === 'default' ? 'rotated' : 'default');


    // let blob: Blob = this.dataURItoBlob(this.photo.dataUrl);


    // // create a file
    // this.file = new File([blob], "card.jpg");

    // this.ocr.uploadFile(this.file).subscribe((res) => {
    //   this.cardData = res;
    // }, (err) => {
    //   this.cardData = err;
    // });
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = decodeURI(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  compressImage(src, newX, newY) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = (event) => {
        const loadedImage: any = event.currentTarget;
        console.log(loadedImage.width + ":" + loadedImage.height);
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;

        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL();
        res(data);
      }
      img.onerror = error => rej(error);
    })
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
