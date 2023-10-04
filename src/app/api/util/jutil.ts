class JUtil {
    public static findElement(elementList: Array<any>, element: any): number {
        var i = 0;
        while (i < elementList.length) {
            var current: any = elementList[i];
            if (current.id == element.id)
                return i;
            i++;
        }
        return -1;
    }

    public static getListChecked(elementList: Array<any>): Array<number> {
        var subList: Array<number> = new Array<number>();
        for (let element of elementList) {
            if (element.checked)
                subList.push(element.id);
        }
        return subList;
    }
}
export default JUtil;