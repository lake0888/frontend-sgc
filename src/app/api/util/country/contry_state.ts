import Country from "./country";

class CountryState {
    id: number;
    name: string;
    country: Country;

    checked: boolean;

    constructor(id: number = 0, name: string = "", country: Country = new Country()) {
        this.id = id;
        this.name = name;
        this.country = country;

        this.checked = false;
    }
}

export default CountryState;