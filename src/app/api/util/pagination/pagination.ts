class Pagination {
    empty: boolean;
    first!: boolean;
    last!: boolean;
    totalPages!: number;
    numberOfElements!: number;
    totalElements!: number;
    page!: number;
    size!: number;

    from!: number;
    to!: number;

    filter!: string;

    constructor(empty: boolean = false, first: boolean = true, last: boolean = true,
        totalPages: number = 0, numberOfElements: number = 0, totalElememts: number = 0,
        page: number = 0, size: number = 10, from: number = 0, to: number = 0, filter: string = "") {
        this.empty = empty;
        this.first = first;
        this.last = last;
        this.totalPages = totalPages;
        this.numberOfElements = numberOfElements;
        this.totalElements = totalElememts;
        this.page = page;
        this.size = size;
        this.from = from;
        this.to = to;
        this.filter = filter;
    }
}

export default Pagination;