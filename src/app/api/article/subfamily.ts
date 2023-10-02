import Family from "./family";
import Image from "../image/image";

class Subfamily {
    id: number;
    name: string;
    description: string;
    code: string;
    image: Image;
    family: Family;

    checked: boolean;

    constructor(id: number = 0, code: string = "", name: string = "", description: string = "",
    image: Image = new Image, family: Family = new Family()) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.image = image;
        this.family = family;

        this.checked = false;
    }
}

export default Subfamily;
