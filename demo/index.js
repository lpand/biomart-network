(function (d3, Graph) {

        "use strict"

        var width = 600, height = 500

        var group = d3.select('#graph').append('svg')
                .attr({
                        width: width,
                        height: height })
                .append('g')

        var nodes = [
                { name: 0, value: 0 },
                { name: 1, value: 1 },
                { name: 2, value: 2 },
                { name: 3, value: 3 }
        ]
        var edges = [
                { source: nodes[0], target: nodes[1] },
                { source: nodes[3], target: nodes[2] },
                { source: nodes[3], target: nodes[0] },
                { source: nodes[2], target: nodes[3] }
        ]

        var graphConfig = {
            nodeClassName: 'bubble',
            edgeClassName: 'edge',
            width: width,
            height: height,
            radius: 10,
            color: function(d) { return '#bcbd22' },
            id: function (d, i) { return 'node' + i }
        }

        var forceConfig = {
            size: [width, height],
            linkDistance: function(link) {
                // return link.source.weight + link.target.weight > 8 ? 200 : 100
                if (link.source.weight > 4 ^ link.target.weight > 4)
                    return 150
                if (link.source.weight > 4 && link.target.weight > 4)
                    return 350
                return 100
            },
            charge: -500,
            gravity: 0.06, // default 0.1
        }

        var textConfig = {
                'font-family': 'serif',
                'font-size': '1em',
                'stroke': '#ff0000',
                'text-anchor': 'start',
                'text': function (d, i) {
                    return 'node'+ i },
                'doubleLayer': { 'className': 'shadow' }
        }

        var config = {
                graph: graphConfig,
                force: forceConfig,
                text: textConfig
        }


        Graph.make(group, nodes, edges, config)



})(d3, BiomartVisualization.Network)