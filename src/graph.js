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
                function makeBubbles(svg, nodes, config) {
                        var update = svg.selectAll('circle')
                                .data(nodes)

                        update.exit()
                                .remove()

                        var bubbles = update.enter()
                                .append('circle')
                                .attr({
                                        r: config.radius,
                                        'class': config.nodeClassName,
                                        fill: config.color,
                                        id: config.id })

                        return bubbles
                }

                function graph (svg, nodes, edges, config) {
                        var group = svg.append('svg:g')

                        if ('groupId' in config)
                                group.attr('id', config.groupId)

                        return {
                                links: makeLines(group, edges, config),
                                bubbles: makeBubbles(group, nodes, config)
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
                        if ('groupId' in config)
                                group.attr('id', config.groupId)

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
                        graphChart.bubbles.on('mouseover', function () {
                                d3.select(this)
                                        .transition()
                                        .attr('r', r * 2) })
                                .on('mouseout', function () {
                                        d3.select(this)
                                                .transition()
                                                .attr('r', config.graph.radius)
                                })

                        var text

                        if (config.text) {
                                text = this.Text(svg, nodes, config.text)
                        }

                        var r = typeof config.graph.radius === 'number'
                                ? config.graph.radius
                                : d3.max(nodes, config.graph.radius)

                        // Layout configuration
                        config.force.tick = function() {
                                var forceSize = force.size()

                                graphChart.links.attr({
                                        x1: function(d) { return d.source.x },
                                        y1: function(d) { return d.source.y },
                                        x2: function(d) { return d.target.x },
                                        y2: function(d) { return d.target.y } })

                                graphChart.bubbles
                                        .attr('transform', function (d) {
                                                d.x = Math.max(r, Math.min(forceSize[0] - r, d.x))
                                                d.y = Math.max(r, Math.min(forceSize[1] - r, d.y))
                                                return 'translate(' + d.x + ',' + d.y + ')' })

                                config.text && text.attr('transform', function (d) {
                                        return 'translate('+ (d.x + 10) +','+ d.y +')' })
                        }

                        function dragstart (d) {
                                d.fixed = true
                        }

                        // Create the layout and place the bubbles and links.
                        var force = this.Force(nodes, edges, config.force)

                        var drag = force.drag().on('dragstart', dragstart)

                        graphChart.bubbles.call(drag)

                        return {
                                graph: graphChart,
                                force: force,
                                text: text
                        }
                }

                return make

        })(d3)
}

d3.BiomartVisualization = BiomartVisualization;
