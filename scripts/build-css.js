var sass = require('node-sass'),
    path = require('path'),
    fs = require('fs')

var indir = path.resolve(__dirname + '/../src/scss/'),
    outdir= path.resolve(__dirname + '/../app/browser/')

fs.readdirSync(indir + '/themes/').forEach(file => {

    if (file.includes('.scss') && file !== 'default.scss') {
        let result = sass.renderSync({
            file: indir + '/themes/' + file,
            outputStyle: 'compressed'
        })

        fs.writeFileSync(outdir + '/themes/' + file.split('/').pop().replace('scss', 'css'), result.css)
    }

})

var result = sass.renderSync({
    file: indir + '/index.scss',
    outFile: outdir + '/open-stage-control.css',
    outputStyle: 'compressed',
    sourceMap: true
})

fs.writeFileSync(outdir + '/open-stage-control.css', result.css)
fs.writeFileSync(outdir + '/open-stage-control.css.map', result.map)
