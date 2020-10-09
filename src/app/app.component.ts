import { Component } from '@angular/core';
import { CameraResultType, Plugins } from "@capacitor/core";
import { CameraPreviewOptions } from "@capacitor-community/camera-preview"

const { CameraPreview, Camera } = Plugins;

import '@capacitor-community/camera-preview';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  async takePicture() {
    console.log("xcxc");
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri
    });
    
  }

  async openCamera(){
    console.log(window.screen.width);
    console.log(window.screen.height);
    const cameraPreviewOption: CameraPreviewOptions = {
      position: "rear",
      parent: "cameraPreview",
      className: "camerapreview",
      
    }

    CameraPreview.start(cameraPreviewOption);
  }

}
