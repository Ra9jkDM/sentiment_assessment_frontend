import { ElementRef, Injectable } from "@angular/core";
import { AccountService } from "./account.service";

@Injectable({
    providedIn: 'root',
})
export class ImageService {
    constructor(private account: AccountService) {

    }

    loadImage(img: ElementRef<HTMLImageElement>, file: any) {
        let reader = new FileReader()
    
          reader.onload = (e: any) => {
            img.nativeElement.src = e.target.result;
          };
          reader.readAsDataURL(file);
    }

    async loadImageIfExists(url: string, img: ElementRef<HTMLImageElement>) {
        let req_img = await this.account.get_file(url);

        let blob = await req_img.blob() as Blob
        if (blob.type == 'image/img') {
            this.loadImage(img, blob)
          }
    }
}