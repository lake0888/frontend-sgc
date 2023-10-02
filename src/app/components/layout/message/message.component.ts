import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import KindAlert from 'src/app/api/util/kindalert';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent implements OnInit{
  @Input() title: string;
  @Input() message: string;
  @Input() kindAlert: KindAlert;

  @Output() cleanAlert: EventEmitter<void>;

  constructor() {
    this.title = "";
    this.message = "";
    this.kindAlert = KindAlert.Primary;

    this.cleanAlert = new EventEmitter<void>();
  }

  ngOnInit(): void {
      
  }

  public onCleanAlert(): void {
    this.cleanAlert.emit();
  }
}
