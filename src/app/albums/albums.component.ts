import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'siu-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
