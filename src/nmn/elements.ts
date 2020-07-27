export default class Elements {

    public setAttributes(el: Element, attrs?: object): Element {
        if(attrs) {
            for (let [k, v] of Object.entries(attrs)) {
                el.setAttribute(k, v)
            }
        }
        return el
    }

    public createNode(node: string, attrs?: object): Element {
        let n:SVGElement = document.createElementNS('http://www.w3.org/2000/svg', node)
        return this.setAttributes(n, attrs)
    }

    public createTextNode(text: string): Text {
        return document.createTextNode(text)
    }

}