import Provider from "../provider/provider";
import Coin from "../util/coin/coin";
import KindArticle from "./kind_article";
import Manufacturer from "./manufacturer";
import Subfamily from "./subfamily";
import Image from "../image/image";

class Article {
    id: number;
    code_mf: string;
    code_sa: string;
    name: string;
    description: string;
    weight: number;
    volume: number;
    subfamily: Subfamily;
    manufacturer: Manufacturer;
    kindArticle: KindArticle;
    provider: Provider;
    initialCost: number;
    discount: number;
    margin: number;
    coin: Coin;
    image: Image;

    constructor(id: number = 0, code_mf: string = '', code_sa: string = '', name: string = '',
    description: string = '', weight: number = 0, volume: number = 0, subfamily: Subfamily = new Subfamily(),
    manufacturer: Manufacturer = new Manufacturer(), kindArticle: KindArticle = new KindArticle(),
    provider: Provider = new Provider(), initialCost: number = 0, discount: number = 0, margin: number = 0,
    coin: Coin = new Coin(), image: Image = new Image()) {
        this.id = id
        this.code_mf = code_mf;
        this.code_sa = code_sa;
        this.name = name;
        this.description = description;
        this.weight = weight;
        this.volume = volume;
        this.subfamily = subfamily;
        this.manufacturer = manufacturer;
        this.kindArticle = kindArticle;
        this.provider = provider;
        this.initialCost = initialCost;
        this.discount = discount;
        this.margin = margin;
        this.coin = coin;
        this.image = image;
    }
}
export default Article;