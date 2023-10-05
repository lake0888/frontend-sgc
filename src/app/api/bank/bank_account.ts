import Coin from "../util/coin/coin";
import Bank from "./bank";

class BankAccount {
    id: number;
    number: string;
    iban: string;
    coin: Coin;
    bank: Bank;

    checked: boolean;

    constructor(id: number = 0, number: string = '', iban: string = '',
    coin: Coin = new Coin(), bank: Bank = new Bank()) {
        this.id = id;
        this.number = number;
        this.iban = iban;
        this.coin = coin;
        this.bank = bank;

        this.checked = false;
    }
}
export default BankAccount;