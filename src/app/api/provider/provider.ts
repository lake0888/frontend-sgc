import Address from "../util/address/address";
import ContactDetails from "../util/contact_details/contact_details";

class Provider {
    id: number;
    name: string;
    description: string;
    cif: string;
    address: Address;
    contactDetails: ContactDetails;

    checked: boolean;

    constructor(id: number = 0, name: string = '', description: string = '', cif: string = '',
    address: Address = new Address(), contactDetails: ContactDetails = new ContactDetails()) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.cif = cif;
        this.address = address;
        this.contactDetails = contactDetails;

        this.checked = false;
    }
}
export default Provider;