class Image {
    id: number;
    filename: string;
    mimetype: string;
    data: Array<any>;

    constructor(id: number = 0, filename: string = '', mimetype: string = '', 
    data: Array<any> = new Array<any>()) {
        this.id = id;
        this.filename = filename;
        this.mimetype = mimetype;
        this.data = data;
    }
}
export default Image;