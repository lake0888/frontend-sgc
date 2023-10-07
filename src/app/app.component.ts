import { Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Commercial Managmenet Sysrem for ALCON-3 S.L';

  constructor() {

    $(document).ready(function(){
      "use strict";

      var treeviewMenu = $('.app-menu');

      // Toggle Sidebar
      $('[data-toggle="sidebar"]').click(function(event: any) {
        event.preventDefault();
        $('.app').toggleClass('sidenav-toggled');
      });

      // Activate sidebar treeview toggle
      $("[data-toggle='treeview']").click(function(event: any) {
        event.preventDefault();
      });

      const listItems = document.querySelectorAll("[data-toggle='treeview']");
      listItems.forEach((element) => {
        element.parentElement?.classList.remove('is-expanded');
        element.addEventListener('click', function($event){
          element.parentElement?.classList.toggle('is-expanded');
        })
      });

      
    });
  }
}
