import { Component } from '@angular/core';
import { CameraResultType, Plugins } from "@capacitor/core";
import { OcrService } from './ocr.service';

const { Camera } = Plugins;

import '@capacitor-community/camera-preview';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  photo: any;
  cardData: any;

  constructor(private ocr: OcrService) {

  }
  async takePicture() {
    this.photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl
    });
    
    let file = this.dataURLtoFile(this.photo.dataUrl, "card.jpg");
    this.ocr.uploadFile(file).subscribe((res) => {
      this.cardData = res;
    })
  }

  dataURLtoFile(dataurl, filename) {
    console.log(dataurl);
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


}
