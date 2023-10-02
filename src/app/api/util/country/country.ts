class Country {
    id: number;
    name: string;
    nationality: string;
    code: string;
    phoneCode: string;

    checked: boolean;

    constructor(id: number = 0, name: string = "", nationality: string = "", code: string = "", phoneCode: string = "") {
        this.id = id;
        this.name = name;
        this.nationality = nationality;
        this.code = code;
        this.phoneCode = phoneCode;

        this.checked = false;
    }
}

export default Country;