import Image from "../image/image";

class Manufacturer {
    id: number;
    name: string;
    image: Image;

    checked: boolean;

    constructor(id: number = 0, name: string = '', image: Image = new Image()) {
        this.id = id;
        this.name = name;
        this.image = image;

        this.checked = false;
    }
}
export default Manufacturer;