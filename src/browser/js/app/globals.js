window.ARGV = {}
location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (s,k,v)=>{
    ARGV[k]=v
})

window.PACKAGE = require('../../../../app/package.json')
document.title = PACKAGE.productName + ' v' + PACKAGE.version

window.LOADING = null


window.CLIPBOARD = null

window.READ_ONLY = false
window.EDITING = false
window.GRIDWIDTH = 10


window.CANVAS_FRAMERATE = parseFloat(ARGV.framerate || 60)
window.CANVAS_SCALING = parseFloat(ARGV.forceHdpi) || ( ARGV.hdpi ? window.devicePixelRatio : 1 )
window.INITIALZOOM = ARGV.zoom ? ARGV.zoom : 1
window.PXSCALE = INITIALZOOM
document.documentElement.style.setProperty('font-size', PXSCALE + 'px')

window.DOUBLE_TAP_TIME = ARGV.doubletap ? ARGV.doubletap : 375


window.JSON.parseFlex = require('json5').parse

window.DOM = require('./dom')

window.$ = require('jquery/dist/jquery.slim.min.js')

require('../libs/jquery.ui')
require('../libs/jquery.touch')

require('cardinal-spline-js/curve.js')
