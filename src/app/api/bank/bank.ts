import Address from "../util/address/address";
import ContactDetails from "../util/contact_details/contact_details";

class Bank {
    id: number;
    code: string;
    name: string;
    swift: string;
    address: Address;
    contactDetails: ContactDetails;

    checked: boolean;

    constructor(id: number = 0, code: string = '', name: string = '', swift: string = '',
    address: Address = new Address(), contactDetails: ContactDetails = new ContactDetails()) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.swift = swift;
        this.address = address;
        this.contactDetails = contactDetails;

        this.checked = false;
    }
}
export default Bank;