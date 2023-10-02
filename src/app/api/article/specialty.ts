import Image from '../image/image';
class Specialty {
    id: number;
    name: string;
    description: string;
    code: string;
    image: Image;

    checked: boolean;

    constructor(id: number = 0, code: string = "", name: string = "", 
    description: string = "", image: Image = new Image()) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.image = image;

        this.checked = false;
    }
}
export default Specialty;
