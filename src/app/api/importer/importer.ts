import Address from "../util/address/address";
import Contact_Details from "../util/contact_details/contact_details";

class Importer {
    id: number;
    name: string;
    description: string;
    nit: string;
    address: Address;
    contactDetails: Contact_Details;

    checked: boolean;

    constructor(id: number = 0, name: string = "", description: string = "", nit: string = "",
    address: Address = new Address(), contactDetails: Contact_Details = new Contact_Details()) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.nit = nit;
        this.address = address;
        this.contactDetails = contactDetails;

        this.checked = false;
    }
}
export default Importer;