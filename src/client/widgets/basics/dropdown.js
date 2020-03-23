var Widget = require('../common/widget'),
    {iconify} = require('../../ui/utils'),
    html = require('nanohtml'),
    raw = require('nanohtml/raw')

class Dropdown extends Widget {

    static description() {

        return 'Native dropdown menu.'

    }


    static defaults() {

        return super.defaults({

            _dropdown:'dropdown',

            align: {type: 'string', value: 'center', choices: ['center', 'left', 'right'], help: 'Set to `left` or `right` to change text alignment (otherwise center)'},
            values: {type: 'array|object', value: {'Value 1':1,'Value 2':2}, help: [
                '`Array` of possible values to switch between : `[1,2,3]`',
                '`Object` of label:value pairs. Numeric labels must be prepended or appended with a white space (or any other non-numeric character) otherwise the order of the values won\'t be kept',
            ]}

        })

    }

    constructor(options) {

        super({...options, html: html`
            <inner>
                <div class="text"></div>
                <div class="icon"></div>
            </inner>
        `})

        if (this.getProp('align') === 'left') this.widget.classList.add('left')
        if (this.getProp('align') === 'right') this.widget.classList.add('right')

        this.select = this.widget.appendChild(html`<select class="no-keybinding"></select>`)
        this.text = DOM.get(this.widget, '.text')[0]

        this.values = []

        this.parseValues()

        this.select.addEventListener('change', ()=>{
            this.setValue(this.values[this.select.selectedIndex], {sync:true, send:true, fromLocal:true})
        })

        this.value = undefined
        this.select.selectedIndex = -1
        this.container.classList.add('noselect')

    }

    parseValues() {

        var i = 0,
            values = this.getProp('values')

        if (!Array.isArray(values) && !(typeof values === 'object' && values !== null)) {
            values = values !== '' ? [values] : []
        }

        this.select.innerHTML = ''

        this.values = []

        for (var k in values) {
            this.values.push(values[k])
            this.select.appendChild(html`
                <option value="${i}">
                    ${raw(iconify(parseFloat(k) != k ? k : values[k]))}
                </option>
            `)
            i++
        }

    }

    setValue(v,options={}) {

        var i = this.values.indexOf(v)

        this.value = this.values[i]

        if (!options.fromLocal) this.select.selectedIndex = i

        this.text.textContent = this.select.options[i].textContent

        if (document.activeElement === this.select) {
            // force menu close
            this.select.blur()
            this.select.focus()
        }

        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }

    onPropChanged(propName, options, oldPropValue) {

        var ret = super.onPropChanged(...arguments)

        switch (propName) {

            case 'values':
                this.parseValues()
                this.setValue(this.value)
                return

        }

        return ret

    }

}

Dropdown.dynamicProps = Dropdown.prototype.constructor.dynamicProps.concat(
    'values'
)


module.exports = Dropdown
