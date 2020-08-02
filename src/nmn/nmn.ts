import Elements from "./elements";
import {Layout, Options} from "./layout";


export default class Nmn {

    private elements: Elements = new Elements()
    private layout: Layout

    constructor(option: Options) {
        this.layout = new Layout(option)
    }

    //data parse
    public parse(data: any): Nmn {
        let staves: Array<any> = data.tracks[0].staves || []
        this.layout.parse(staves)
        return this
    }

    //小节分隔符 default_spacing = 1
    setSegmentNode(attrs?: object): Element {
        return this.elements.createNode('rect', attrs)
    }

    //数字音符 default_spacing = 10
    setNumberToneNode(tone: any, attrs?: object): Element {
        let node: Element = this.elements.createNode('text', attrs)
        let text: Text = this.elements.createTextNode(String(tone))
        node.appendChild(text)
        return node
    }

    render(renderer: any): void {

        renderer.resize(this.layout.ctxWidth, this.layout.ctxHeight)
        const ctx = renderer.getContext()

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