import { Component } from '@angular/core';
import { Plugins, CameraResultType } from "@capacitor/core";

const { Camera } = Plugins;

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
    console.log(image);
  }
  
}
