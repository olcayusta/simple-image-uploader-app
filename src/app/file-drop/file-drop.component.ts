import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  HostBinding,
  ɵmarkDirty as markDirty,
} from '@angular/core';
import { Event } from '@angular/router';
import { UploadService } from '../upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'siu-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDropComponent implements OnInit {
  dragEnterCount = 0;

  file: File | null = null;

  @HostBinding('class.drop-valid') isValid = false;

  @HostListener('document:dragenter', ['$event'])
  onDragEnter(e: DragEvent) {
    e.preventDefault();
    this.dragEnterCount += 1;
    if (this.dragEnterCount > 1) return;
    if (e.dataTransfer && e.dataTransfer.items.length) this.isValid = true;
  }

  @HostListener('document:dragleave', ['$event'])
  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.dragEnterCount += -1;
    if (this.dragEnterCount === 0) this.reset();
    this.isValid = false;
    console.log(this.dragEnterCount);
  }

  @HostListener('document:dragover', ['$event'])
  onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  @HostListener('document:drop', ['$event'])
  onDrop(e: DragEvent) {
    e.preventDefault();

    if (e.dataTransfer === null) return;
    this.reset();

    this.dragEnterCount = 0;

    this.isValid = false;

    const item = e.dataTransfer?.items[0];
    const file = item?.getAsFile();

    this.onFileDrop(e.dataTransfer.files);
  }

  @HostListener('document:paste', ['$event'])
  onPaste(e: ClipboardEvent) {
    if (e.clipboardData) {
      this.onFileDrop(e.clipboardData.files);
    }
  }

  reset() {
    this.dragEnterCount = 0;
  }

  constructor(private uploadService: UploadService) {}

  ngOnInit(): void {}

  onFileDrop(files: FileList) {
    console.log(files[0]);

    if (files) {
      this.file = files.item(0)
    }

    if (this.file) {
      this.uploadService.upload(this.file).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            const percentDone = Math.round(100 * event.loaded / (event.total ?? 0));
            console.log(percentDone);
            break;
          case HttpEventType.Response:
            console.log('Image Upload Successfully!', event.body);
            /*setTimeout(() => {
              this.progress = 0;
            }, 1500);*/

        }
      })
    }

  }
}
