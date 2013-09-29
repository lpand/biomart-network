BiomartVisualization.Network = {
        // ## Graph
        //
        // *    svg     - `Object` d3 selection of an svg.
        // *    nodes   - `Array`  Of objects.
        // *    edges   - `Array`  Of objects of the form `{ source: a, target: b }`. Where `a` and `b` ara integers.
        //      See [d3.force.links()](https://github.com/mbostock/d3/wiki/Force-Layout#wiki-links).
        // *    config  - `Object` Containes the configuration for the graph.
        //      *       radius: bubble's radius
        //      *       nodeClassName: class for a bubble
        //      *       color: color for a bubble
        //      *       edgeClassName: class for a link
        //
        // All the attributes are d3 style: value or callback(d, i).
        Graph: (function (d3) {

                "use strict"

                function makeLines(svg, edges, config) {
                        // Update
                        var lines = svg.selectAll('line')
                                .data(edges)

                        // Enter
                        var enter = lines.enter()
                                .append('line')
                                .attr('class', config.edgeClassName)

                        // Exit
                        lines.exit()
                                .remove()

                        return enter
                }

                // A group with a circle and a text for each data.
                function makeBubbleGroups(svg, nodes, config) {
                        var groups = svg.selectAll('g')
                                .data(nodes)

                        var groupEnter = groups.enter()
                                .append('g')

                        groupEnter
                                .append('circle')
                                .attr({
                                        r: config.radius,
                                        'class': config.nodeClassName,
                                        fill: config.color,
                                        id: config.id })

                        // Exit
                        // TODO: add transition.
                        groups.exit()
                                .remove()

                        return groupEnter
                }

                function graph (svg, nodes, edges, config) {
                        return {
                                links: makeLines(svg, edges, config),
                                bubbles: makeBubbleGroups(svg, nodes, config)
                        }
                }

                return graph

        })(d3),




        // ## Force
        //
        // *    nodes  - `Array`
        // *    edges  - `Array`
        // *    config - `Object`
        //              *       size
        //              *       gravity
        //              *       linkDistance
        //              *       charge
        //              *       tick
        //
        Force: (function (d3) {

                "use strict"

                function make (nodes, edges, config) {
                        var force = d3.layout.force()
                                .nodes(nodes)
                                .links(edges)
                                .size(config.size)
                                .gravity(config.gravity)
                                .linkDistance(config.linkDistance) // px
                                // .linkStrength(cs.linkStrength)
                                .charge(config.charge)

                        force.on("tick", config.tick)
                        force.start()

                        return force
                }

                return make

        })(d3),


        Text: (function (d3) {

                "use strict"

                // config -
                //      * font-family
                //      * font-size
                //      * stroke
                //      * fill
                //      * text-anchor
                //      * x, y
                //      * text
                //      * id - id of the group
                //      * doubleLayer:
                //              * className
                //
                // elms must contain groups
                function make (svg, data, config) {
                        var attrs = [
                                'font-family', 'font-size', 'stroke', 'fill', 'text-anchor', 'x', 'y'
                        ]

                        var _conf = {}
                        var a

                        for (var i = 0; i < attrs.length; ++i) {
                                a = attrs[i]
                                if (config.hasOwnProperty(a))
                                        _conf[a] = config[a]
                        }

                        var group = svg.append('svg:g')
                        if (config['id'])
                                group.attr('id', config['id'])

                        var text = group.selectAll('g')
                                .data(data)
                                .enter()
                                .append('svg:g')

                        if (config.doubleLayer) {
                                text.append('svg:text')
                                        .attr(_conf)
                                        .attr('class', config.doubleLayer.className)
                                        .text(config.text)
                        }

                        text.append('svg:text')
                                .attr(_conf)
                                .text(config.text)

                        return text
                }

                return make
        })(d3),




        // We can use this function or a custom one to create the graph
        make: (function (d3) {

                "use strict"

                function make (svg, nodes, edges, config) {

                        // Draw the graph chart without positioning the elements, and return
                        // bubbles and links: { bubbles: ..., links: ... }
                        var graphChart = this.Graph(svg, nodes, edges, config.graph)
                        var text

                        if (config.text) {
                                text = this.Text(svg, nodes, config.text)
                        }

                        var r = typeof config.graph.radius === 'number'
                                ? config.graph.radius
                                : d3.max(nodes, config.graph.radius)
                        var w = config.force.size[0]
                        var h = config.force.size[1]

                        // Layout configuration
                        config.force.tick = function() {
                                graphChart.links.attr({
                                        x1: function(d) { return d.source.x },
                                        y1: function(d) { return d.source.y },
                                        x2: function(d) { return d.target.x },
                                        y2: function(d) { return d.target.y } })

                                graphChart.bubbles
                                        .selectAll('circle')
                                        .attr('transform', function (d) {
                                                d.x = Math.max(r, Math.min(w - r, d.x))
                                                d.y = Math.max(r, Math.min(h - r, d.y))
                                                return 'translate(' + d.x + ',' + d.y + ')' })

                                config.text && text.attr('transform', function (d) {
                                        return 'translate('+ d.x +','+ d.y +')' })
                        }

                        function dragstart (d) {
                                d.fixed = true
                        }

                        // Create the layout and place the bubbles and links.
                        var force = this.Force(nodes, edges, config.force)

                        var drag = force.drag().on('dragstart', dragstart)

                        graphChart.bubbles.call(drag)

                        return graphChart
                }

                return make

        })(d3)
}
