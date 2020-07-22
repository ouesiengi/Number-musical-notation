import Elements from "./elements";
import {Layout, Options} from "./layout";

export default class Nmn {

    private elements: Elements = new Elements()
    private layout: Layout

    constructor(option: Options) {
        this.layout = new Layout(option)
    }

    //tones parse
    public parse(tones: any): Nmn{
        this.layout.parse(tones)
        return this
    }

    format(tone: string): string {
        let arr = tone.split("/");
        return arr[arr.length - 1]
    }

    //反复记号 default_spacing = 10
    setAgainNode() {

    }

    //小节分隔符 default_spacing = 1
    setSegmentNode(attrs?: object): Element {
        return this.elements.createNode('rect', attrs)
    }

    //附点音符 default_spacing = 10
    setDottedNode() {

    }

    //连音符
    setSlur() {

    }

    //数字音符 default_spacing = 10
    setNumberToneNode(tones: Array<string>, attrs?: object): Element {
        let tone = this.format(tones[0])
        let node = this.elements.createNode('text', attrs)
        let text = this.elements.createTextNode(tone)
        node.appendChild(text)
        return node
    }

    render(renderer: any): void {

        renderer.resize(this.layout.ctx_width, this.layout.ctx_height)
        const ctx = renderer.getContext()
        ctx.setFont('Arial', '18', '')

        const maps = this.layout.render()

        for(let val of maps) {
            let node: Element;
            switch (val.type) {
                case 'text':
                    node = this.setNumberToneNode(val.tones, val.option);
                    break;
                case 'rect':
                    node = this.setSegmentNode(val.option)
                    break;
                default:
                    console.log('not type')
            }
            // @ts-ignore
            ctx.groups[0].appendChild(node)
        }
    }

}