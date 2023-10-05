class Coin {
    id: number;
    code: string;
    name: string;

    checked: boolean;

    constructor(id: number = 0, code: string = '', name: string = '') {
        this.id = id;
        this.code = code;
        this.name = name;

        this.checked = false;
    }
}
export default Coin;