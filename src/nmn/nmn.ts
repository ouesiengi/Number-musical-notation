import Elements from "./elements";
import {Layout, Options} from "./layout";
import {Transition} from "./notations"

export default class Nmn {

    private elements: Elements = new Elements()
    private layout: Layout

    constructor(option: Options) {
        this.layout = new Layout(option)
    }

    //data parse
    public parse(data: any): Nmn{
        let staves: Array<any> = data.tracks[0].staves || []
        this.layout.parse(staves)
        return this
    }

    //反复记号 default_spacing = 10
    setAgainNode() {

    }

    //小节分隔符 default_spacing = 1
    setSegmentNode(attrs?: object): Element {
        //console.log(attrs)
        return this.elements.createNode('rect', attrs)
    }

    //附点音符 default_spacing = 10
    setDottedNode() {

    }

    //音符时间长度
    setNotationLength(len: number, option: any): any {
        switch (len) {
            case 8:
                const attr: object = {width: 10, height: 2, x: option.x, y: option.y + 5}
                return this.elements.createNode('rect', attr)

        }
        return false
    }

    //连音符
    setSlur() {

    }

    //数字音符 default_spacing = 10
    setNumberToneNode(tone: any, attrs?: object): Element {
        let node: Element = this.elements.createNode('text', attrs)
        let text: Text = this.elements.createTextNode(String(tone))
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

                    // const x = this.setNotationLength(val.duration, val.option)
                    // if (x) {
                    //     ctx.groups[0].appendChild(x)
                    // }
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