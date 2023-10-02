import Url from "./url";

class BreadCrumb {
    title: string;
    description: string;
    urls: Array<Url>;

    constructor(title: string = '', description: string = '', urls: Array<Url> = new Array()) {
        this.title = title;
        this.description = description;
        this.urls = urls;
    }
}
export default BreadCrumb;