import Specialty from "./specialty";
import Image from "../image/image";

class Family {
    id: number;
    name: string;
    description: string;
    code: string;
    image: Image;
    specialty: Specialty;

    checked: boolean;

    constructor(id: number = 0, code: string = "", name: string = "", description: string = "", 
    image: Image = new Image(), specialty: Specialty = new Specialty()){
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.image = image;
        this.specialty = specialty;

        this.checked = false;
    }
}

export default Family;
