import { Component } from '@angular/core';
import { CameraResultType, Plugins } from "@capacitor/core";
import { OcrService } from './ocr.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

const { Camera } = Plugins;

import '@capacitor-community/camera-preview';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  dataUrl: any = "./assets/frontThaiCard.jpg";
  cardData: any;
  state: string = 'default';
  stateBack: string = 'default';
  file: File;
  cardForm: FormGroup;
  photoBack: any;
  backDataUrl: any = "./assets/backThaiCard.jpg";
  fileBack: File;
  constructor(private formBuilder: FormBuilder, private ocrService: OcrService) {

  }
  async takeFrontCard() {
    this.photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl
    });
    // this.file = this.dataURLtoFile(this.photo.dataUrl, "card.jpg");
    this.compressImage(this.photo.dataUrl, 480, 640).then(compressed => {
      // console.log(compressed);
      this.dataUrl = compressed;
      this.file = this.dataURLtoFile(compressed, "card.jpg");
      if (this.state == 'default') {
        this.state = (this.state === 'default' ? 'rotated' : 'default');
      }


      // this.cardData = {
      //   id_number: '3180200336928',
      //   th_init: 'นาย',
      //   th_fname: 'ธีรศักดิ์',
      //   th_lname: 'ทับฤทธิ์',
      //   th_dob: '2 ส.ค. 2520',
      //   th_expire: '2 ส.ค. 2565',
      //   th_issue: '23 ส.ค. 2536',
      //   // en_init: this.cardData.en_init,
      //   // en_fname: this.cardData.en_fname,
      //   // en_lname: this.cardData.en_lname,
      //   // en_dob: this.cardData.en_dob,
      //   // en_expire: this.cardData.en_expire,
      //   // en_issue: this.cardData.en_issue,
      //   address: '85/9 หมู่ที่ 5 ต.อู่ตะเภา อ.มโนรมย์ จ.ชัยนาท',
      //   religion: 'ศาสนา พุทธ',
      // };
      // this.cardForm = this.createCardForm();

      this.ocrService.frontCardOCR(this.file).subscribe((res) => {
        this.cardData = res;
        this.cardForm = this.createCardForm();
      }, (err) => {
        console.log(err)
      })

    })

  }

  async takeBackCard() {
    this.photoBack = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl
    });

    this.compressImage(this.photoBack.dataUrl, 480, 640).then(compressed => {
      // console.log(compressed);
      this.backDataUrl = compressed;
      this.fileBack = this.dataURLtoFile(compressed, "cardBack.jpg");
      if (this.stateBack == 'default') {
        this.stateBack = (this.stateBack === 'default' ? 'rotated' : 'default');
      }

      // this.ocrService.backCardOCR(this.fileBack).subscribe((res) => {
      //   console.log(res);
      // }, (err) => {
      //   console.log(err)
      // })

    })

  }
  createCardForm() {
    return this.formBuilder.group({
      id_number: this.cardData.id_number,
      th_init: this.cardData.th_init,
      th_fname: this.cardData.th_fname,
      th_lname: this.cardData.th_lname,
      th_dob: this.cardData.th_dob,
      th_expire: this.cardData.th_expire,
      th_issue: this.cardData.th_issue,
      // en_init: this.cardData.en_init,
      // en_fname: this.cardData.en_fname,
      // en_lname: this.cardData.en_lname,
      // en_dob: this.cardData.en_dob,
      // en_expire: this.cardData.en_expire,
      // en_issue: this.cardData.en_issue,
      address: this.cardData.address,
      religion: this.cardData.religion,
    });
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

  onFileSelected(e) {
    console.log(e);
  }


}
