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
        /*
        if(!$(this).parent().hasClass('is-expanded')) {
          treeviewMenu.find("[data-toggle='treeview']").parent().removeClass('is-expanded');
        }
        $(this).parent().toggleClass('is-expanded');
        */
      });
    });
  }
}
