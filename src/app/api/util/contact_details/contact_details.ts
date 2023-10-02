import Image from "../../image/image";

class ContactDetails {
    id: number;
    home_phone: string;
    work_phone: string;
    cell_phone: string;
    email: string;
    website: string;
    image: Image;

    constructor(id: number = 0, home_phone: string = "", work_phone: string = "",
    cell_phone: string = "", email: string = "", website: string = "", image: Image = new Image()) {
        this.id = id;
        this.home_phone = home_phone;
        this.work_phone = work_phone;
        this.cell_phone = cell_phone;
        this.email = email;
        this.website = website;
        this.image = image;
    }
}
export default ContactDetails;