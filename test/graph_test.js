
var G = BiomartVisualization.Network

var width = 600
var height = 500

var graphConfig = {
        nodeClassName: 'gene',
        edgeClassName: 'graph-chart-edge',
        radius: 20,
        color: '#bcbd22',
        id: function (d) { return d.name }
}

var textConfig = {
        'font-family': 'serif',
        'font-size': '1em',
        'stroke': '#ff0000',
        'text-anchor': 'start',
        'text': function (d, i) {
                return d.name },
        'id': 'text-group'
}

function setupAndTeardown () {
        beforeEach(function () {
                this.group = d3.select('body')
                        .append('svg')
                        .attr({
                                id: 'graph',
                                width: width,
                                height: height })
                        .append('g')
                        .attr({id: 'graph-group'})

                this.nodes = [0,1,2,3,4].map(function (i) { return { name: "node"+ i, value: i }})
                this.edges = [
                        { source: this.nodes[0], target: this.nodes[1] },
                        { source: this.nodes[3], target: this.nodes[2] },
                        { source: this.nodes[3], target: this.nodes[0] },
                        { source: this.nodes[2], target: this.nodes[3] }
                ]
        })

        afterEach(function () {
                this.group = null
        })
}


describe ('BiomartVisualization.Graph.Graph', function () {
        "use strict"

        setupAndTeardown()

        beforeEach(function () {
                G.Graph(this.group, this.nodes, this.edges, graphConfig)
        })

        afterEach(function () {
                d3.select('#graph').remove()
        })

        it('creates the proper number of lines', function () {
                var lines = d3.selectAll('line')
                expect(lines.size()).toEqual(this.edges.length)
        })

        it('creates lines with the proper attributes applied', function () {
                var lines = d3.selectAll('line')
                lines.each(function () {
                        expect(this.getAttribute('class')).toEqual(graphConfig.edgeClassName)
                })
        })

        it ('creates the proper number of groups wrapping bubbles', function () {
                var groups = d3.select('#graph-group').selectAll('g')
                var circles = groups.selectAll('circle')
                expect(groups.size()).toEqual(this.nodes.length)
                expect(circles.size(), this.nodes.length)
                circles.each(function () {
                        expect(this.getAttribute('class')).toEqual(graphConfig.nodeClassName)
                })
        })

        it ('creates the proper number of bubbles with the right attributes', function () {
                var circles = d3.select('#graph-group').selectAll('g').selectAll('circle')
                expect(circles.size()).toEqual(this.nodes.length)
                circles.each(function (d, i) {
                        expect(this.getAttribute('fill')).toEqual(graphConfig.color)
                        expect(+this.getAttribute('r')).toEqual(graphConfig.radius)
                        expect(this.id).toEqual(graphConfig.id(d))
                })
        })
})


describe ('BiomartVisualization.Graph.Text', function () {

        "use strict"

        setupAndTeardown()

        var textGroup = null
        var text = null

        beforeEach(function () {
                text = G.Text(this.group, this.nodes, textConfig)
                textGroup = d3.select('#'+textConfig['id'])
        })

        afterEach(function () {
                text = null
                textGroup.remove()
        })

        it ('appends a new group with the given id', function () {
                expect(textGroup.empty()).toBe(false)
        })

        it ('appends as many groups as the data entries', function () {
                expect(text.size()).toBe(this.nodes.length)
        })

        it ('creates subgroups with one text child if doubleLayer is not defined', function () {
                text.each(function (d, i) {
                        expect(this.childNodes.length).toBe(1)
                })
        })

        it ('text has the proper attributes', function () {
                text.selectAll('text').each(function (d, i) {
                        expect(this.textContent).toEqual(textConfig.text(d, i))
                        expect(this.getAttribute('font-family')).toEqual(textConfig['font-family'])
                })
        })

        it ('creates subgroups with two text children if doubleLayer is defined', function () {
                textConfig.doubleLayer = { className: 'ssss' }
                text = G.Text(this.group, this.nodes, textConfig)
                text.each(function (d, i) {
                        expect(this.childNodes.length).toBe(2)
                        expect(this.childNodes[0].getAttribute('class')).toBe(textConfig.doubleLayer.className)
                })
        })


})
