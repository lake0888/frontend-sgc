import { Component, OnInit } from '@angular/core';
import { trigger, transition, state, animate, style } from '@angular/animations';
import { ShareService } from 'src/app/services/share.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
/*
  animations: [
    trigger('openClose', [
      state('open', style({
        width: '230px'
      })),
      state('closed', style({
        width: '40px'
      })),
      transition('* => *', [
        animate('1s')
      ]),
    ]),
  ],
*/
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']  
})
export class SidebarComponent implements OnInit{
  isOpen = false;
  subscription: Subscription;

  constructor(private shareService: ShareService) {
    this.subscription = this.shareService.getData()
    .subscribe(() => {
      this.toggle();
    })
  }

  ngOnInit(): void { }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
