import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadService } from './upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { average } from 'color.js'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'sius.app';

  blob: SafeUrl | undefined;

  loading = false;
  loaded = false;

  percentDone = 0;

  blobFiles: SafeUrl[] = [];
  githubLink: string = '//github.com/olcayusta';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private uploadService: UploadService
  ) {}

  async ngAfterViewInit() {
    // @ts-ignore
    this.renderer.listen(this.el.nativeElement, 'paste', async (e) => {
      const objectURL = URL.createObjectURL(e.clipboardData.files[0]);
      this.blob = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      // console.log(this.blob);

      this.loading = true;
    });
    /* document.addEventListener('paste', async (e) => {
      e.preventDefault();
      // @ts-ignore
      if (!e.clipboardData.files.length) {
        return;
      }
      // @ts-ignore
      const file = e.clipboardData.files[0];
      // Read the file's contents, assuming it's a text file.
      // There is no way to write back to it.
      console.log(await file.text());
    });*/
  }

  async ngOnInit() {
    /* document.addEventListener('paste', async (e) => {
      e.preventDefault();
      // @ts-ignore
      if (!e.clipboardData.files.length) {
        return;
      }
      // @ts-ignore
      const file = e.clipboardData.files[0];
      console.log(await file.text());
      this.img = URL.createObjectURL(file.text());
    });*/
  }

  onInputChange(e: Event) {
    const t = e.target as HTMLInputElement;
    const file = t.files && t.files[0];

    // @ts-ignore
    [...t.files].forEach(file => {
      console.log(file);
      const objectURL = URL.createObjectURL(file);
      const image = this.sanitizer.bypassSecurityTrustUrl(objectURL);

      average('http://localhost:4200/assets/a04.jpg').then(color => {
        console.log(color);
      })

      this.blobFiles.push(image);

    })

    if (t.files) {
      this.uploadService.uploadMultiple(t.files).subscribe((event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');

            // @ts-ignore
            const objectURL = URL.createObjectURL(t.files[0]);
            this.blob = this.sanitizer.bypassSecurityTrustUrl(objectURL);

            this.loading = true;
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            const percentDone = Math.round(100 * event.loaded / (event.total ?? 0));
            this.percentDone = percentDone;
            console.log(percentDone);
            break;
          case HttpEventType.Response:
            console.log('Image Upload Successfully!', event.body);
            setTimeout(() => {
              this.percentDone = 0;
              //  this.loading = false;
              this.loaded = true;
            }, 1500)
        }
      })
    }



  }
}
