import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  @Input() title: string;
  @Output() updateFilter = new EventEmitter<string>();
  @Output() updatePageSize = new EventEmitter<number>();
  @Output() updateModal = new EventEmitter<string>();

  constructor() {
    this.title = "";
  }

  onFilterChange(filter: string) {
    this.updateFilter.emit(filter);
  }

  onSelected(size: any): void {
    this.updatePageSize.emit(size);
  }

  onOpenModal(modal: string) {
    this.updateModal.emit(modal);
  }
}
