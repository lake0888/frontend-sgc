import CountryState from "../country/contry_state";

class Address {
    id: number;
    addressLine: string;
    city: string;
    county: string;
    zipcode: number;
    countryState: CountryState;

    constructor(id: number = 0, addressLine: string = "", city: string = "", county: string = "", 
        zipcode: number = 0, countryState: CountryState = new CountryState()) {
            this.id = id;
            this.addressLine = addressLine;
            this.city = city;
            this.county  =county;
            this.zipcode = zipcode;
            this.countryState = countryState;
    }
}

export default Address;