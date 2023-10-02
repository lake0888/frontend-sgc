import KindAlert from "./kindalert";

class Alert {
    kindAlert: KindAlert;
    title: string;
    message: string;

    constructor(kindAlert: KindAlert = KindAlert.Primary, title: string = '', message: string = '') {
        this.kindAlert = kindAlert;
        this.title = title;
        this.message = message;
    }

    public onCleanAlert(): void {
        this.kindAlert = KindAlert.Primary,
        this.title = '';
        this.message = '';
    }
}
export default Alert;