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
}
export default JUtil;