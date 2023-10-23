class KindArticle {
    id: number;
    name: string;

    checked: boolean;

    constructor(id: number = 0, name: string = '') {
        this.id = id;
        this.name = name;

        this.checked = false;
    }
}
export default KindArticle;