var _widgets_base = require('../common/_widgets_base'),
    widgetManager = require('../../managers/widgets'),
    {math} = require('../utils'),
    Input = require('../inputs/input')


module.exports = class Formula extends _widgets_base {

    static defaults() {

        return {
            type:'formula',
            id:'auto',
            linkId:'',

            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            label:'auto',
            color:'auto',
            css:'',

            _math: 'math',

            formula: '',
            condition: '',
            unit: '',

            _osc:'osc',

            precision:2,
            address:'auto',
            split:[],
            preArgs:[],
            target:[]
        }

    }

    constructor(options) {

        var html = `
            <div class="formula">
            </div>
        `
        super({...options, html: html})


        this.formulaString = String(this.getProp('formula'))
        this.conditionString = String(this.getProp('condition'))

        this.split = typeof this.getProp('split') == 'object' && this.getProp('split').length ? this.getProp('split') : false

        this.input = new Input({
            props:{
                ...Input.defaults(),
                editable:false,
                precision:this.getProp('precision'),
                unit: this.getProp('unit')
            },
            parent:this, parentNode:this.widget
        })

        this.widget.appendChild(this.input.widget)

        this.linkedWidgets = []

        if (this.formulaString.length) {

            if (this.formulaString.match(/\$\{([^\}]*)\}/g) != null) this.linkedWidgets = this.linkedWidgets.concat(this.formulaString.match(/\$\{([^\}]*)\}/g).map((a)=>{return a.substr(2, a.length - 3)}))

        }

        if (this.conditionString.length) {

            if (this.conditionString.match(/\$\{([^\}]*)\}/g) != null) this.linkedWidgets = this.linkedWidgets.concat(this.conditionString.match(/\$\{([^\}]*)\}/g).map((a)=>{return a.substr(2, a.length - 3)}))

        }


        this.formula = math.compile(this.formulaString.replace(/\$\{([^\}]*)\}/g, '_$1'))

        this.condition = math.compile(this.conditionString.replace(/\$\{([^\}]*)\}/g, '_$1'))

        this.conditionState = true


        widgetManager.on(`change.${this.hash}`,this.syncHandle.bind(this))

        if (this.formulaString.length) this.updateValue({options:{}})

    }

    syncHandle(e) {

        if (this.linkedWidgets.indexOf(e.id)==-1 || !widgetManager.getWidgetById(e.id).length) return
        this.updateValue(e)

    }

    updateValue(e){

        var variables = {},
            id, n = 0

        for (let id of this.linkedWidgets) {
            if (id !== undefined) {
                variables['_'+id] = 0
                let widgets = widgetManager.getWidgetById(id)
                for (let w of widgets) {
                    if (w.getValue) {
                        variables['_'+id] = w.getValue()
                        n++
                        break
                    }
                }

            }
        }

        if (this.conditionString.length) {

            try {

                var s = this.condition.eval(variables).valueOf()

                if (Array.isArray(s) && s.length == 1) s = s[0]

                this.conditionState = s.data !== undefined ? s.data : s

            } catch(err) {

                throw new Error('Error parsing formula "' + this.condition + '" (' + err + ')')

            }

        }

        try {

            var v = this.formula.eval(variables).valueOf()

            if (Array.isArray(v) && v.length == 1) v = v[0]

            this.value = v.data ? v.data : v

            this.showValue()

            if (e.options.sync && this.conditionState) this.changed(e.options)
            if (e.options.send && this.conditionState) this.sendValue()

        } catch(err) {

            throw new Error('Error parsing formula "' + this.formula + '" (' + err + ')')

        }

    }

    showValue() {

        this.input.setValue(this.value)

        if (this.getProp('condition').length && !this.conditionState) {
            this.input.stringValue = '* ' + this.input.stringValue
            this.input.batchDraw()
        }

    }

    onRemove() {
        this.input.onRemove()
        super.onRemove()
    }
}
