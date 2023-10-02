import Address from "../util/address/address";
import ContactDetails from "../util/contact_details/contact_details";
import KindCarrier from "./kindcarrier";

class Carrier {
    id: number;
    name: string;
    description: string;
    cif: string;
    kindCarrier: KindCarrier;
    address: Address;
    contactDetails: ContactDetails;

    checked: boolean;

    constructor(id: number = 0, name: string = '', description: string = '', cif: string = '', 
    kindCarrier: KindCarrier = KindCarrier.Multimodal, address: Address = new Address(),
    contactDetails: ContactDetails = new ContactDetails()) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.cif = cif;
        this.kindCarrier = kindCarrier;
        this.address = address;
        this.contactDetails = contactDetails;

        this.checked = false;
    }
}
export default Carrier;