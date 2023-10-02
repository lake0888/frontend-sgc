import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import Page from 'src/app/api/pagination/page';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  public first: boolean;
  public last: boolean;
  public pageIndex: number;
  public numberOfElements: number;
  public size: number;

  public totalElements: number;
  public totalPages: number;

  public from: number;
  public to: number;

  public paginator: Array<Page>;
  maxPages: number = 7;

  @Output() updatePage = new EventEmitter<number>();

  subscription: Subscription;

  constructor(private shareService: ShareService) {
    this.first = false;
    this.last = false;
    this.pageIndex = 0;
    this.numberOfElements = 0;
    this.size = 0;

    this.from = 0;
    this.to = 0;
    this.totalElements = 0;
    this.totalPages = 0;
    
    this.paginator = new Array();

    this.subscription = this.shareService.getData()
    .subscribe(
      (data) => {
        this.first = data['first'];
        this.last = data['last'];
        this.pageIndex = data['page'];
        this.numberOfElements = data['numberOfElements'];
        this.size = data['size'];
        this.totalElements = data['totalElements'];
        this.totalPages = data['totalPages'];      
        
        this.updateFromTo();

        this.paginator.splice(0);
        this.initPaginator();
    });
  }

  ngOnInit(): void {
  }

  public initPaginator(): void {
    if (this.totalPages <= this.maxPages) {
      for (let i = 0; i < this.totalPages; i++) {
        let page: Page = this.createPage(i, this.totalPages);
        this.paginator.push(page);
      }
    } else {
      if (this.pageIndex < 5) {
        this.addPages(0, 5);
        //ADD DISABLED PAGE
        this.addPages(-1, 0);
        //ADD LAST
        this.addPages(this.totalPages - 1, this.totalPages);
      } else if (this.totalPages - 5 < this.pageIndex && this.pageIndex < this.totalPages) {
        //ADD FIRST
        this.addPages(0, 1);
        //ADD DISABLED PAGE
        this.addPages(-1, 0);
        this.addPages(this.totalPages - 5, this.totalPages);
      } else {
        //ADD FIRST
        this.addPages(0, 1);
        //ADD DISABLED PAGE
        this.addPages(-1, 0);
        //BETWEEN
        this.addPages(this.pageIndex - 1, this.pageIndex + 2);
        //ADD DISABLED PAGE
        this.addPages(-1, 0);
        //ADD LAST
        this.addPages(this.totalPages -1, this.totalPages);
      }
    }
  }

  private createPage(index: number, pages: number): Page {
    let page: Page = new Page();
    page.pageIndex = index;

    if (index - 1 >= 0 && index - 1 < pages)
      page.pagePreview = index - 1;

    if (index + 1 < pages)
      page.pageNext = index + 1;

    page.isActivated = (index == this.pageIndex) ? true : false;

    return page;
  }

  private addPages(from: number, to: number): void {
    while (from < to) {
      let page: Page = this.createPage(from++, this.totalPages);
      this.paginator.push(page);
    }
  }

  onChangePageIndex(page: number): void {
    this.pageIndex = page;
    this.updatePage.emit(this.pageIndex);
  }

  private updateFromTo(): void {
    this.from = (this.pageIndex * this.size) + 1;
    if (this.totalElements < this.numberOfElements) {
      this.to = this.from - 1 + this.totalElements;
    } else {
      this.to = this.from - 1 +  this.numberOfElements;
    }
  }
}
