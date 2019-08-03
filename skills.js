var width = 960,
	height = 700;
var skill = [
	{
		'name': 'invisible',
		'radius': 50
	},
	{
		'name': 'Photoshop',
		'radius': 120
	},
	{
		'name': 'Sketch',
		'radius': 115
	},
	{
		'name': 'Illustrator',
		'radius': 105
	},
	{
		'name': 'HTML5',
		'radius': 90
	},
	{
		'name': 'CSS3',
		'radius': 95
	},
	{
		'name': 'Adobe Premiere Pro',
		'radius': 90
	},
	{
		'name': 'After Effects',
		'radius': 70
	},
	{
		'name': 'InDesign',
		'radius': 85
	},
	{
		'name': 'Github',
		'radius': 80
	},
	{
		'name': 'Slack',
		'radius': 82
	},
	{
		'name': 'Trello',
		'radius': 94
	},
	{
		'name': 'jQuery',
		'radius': 75
	},
	{
		'name': 'JavaScript',
		'radius': 65
	},
	{
		'name': 'React',
		'radius': 75
	},
	{
		'name': 'JSP',
		'radius': 50
	},
	{
		'name': 'Java',
		'radius': 50
	},
	{
		'name': 'SQL',
		'radius': 60
	},
	{
		'name': 'Python',
		'radius': 35
	},
	{
		'name': 'R',
		'radius': 30
	},
	{
		'name': 'Spring',
		'radius': 40
	},
];
var nodes = d3.range(skill.length).map(function (i) {
		return {
			radius: skill[i]['radius'],
			name: skill[i]['name']
		};
	}),
	root = nodes[0];
color = d3.scale.linear().domain([20, 100])
	.interpolate(d3.interpolateHcl)
	.range([d3.rgb("#fb5454"), d3.rgb('#f1fb54')]);
root.radius = 0;
root.fixed = true;
var force = d3.layout.force()
	.gravity(0.05)
	.charge(function (d, i) {
		return i ? 0 : -1000;
	})
	.nodes(nodes);
var svg = d3.select(".bubble").append("svg")
	.attr("width", width)
	.attr("height", height);
resize();
d3.select(window).on("resize", resize);
force.start();
groupe = svg.selectAll("circle")
	.data(nodes.slice(1))
	.enter().append("g").attr("class", "node");
groupe.append("circle")
	.attr("r", function (d) {
		return d.radius;
	})
	.style("fill", function (d, i) {
		return color(d.radius);
	});
groupe.append("text")
	.attr("text-anchor", "middle")
	.text(function (d) {
		return d.name
	})
force.on("tick", function (e) {
	var q = d3.geom.quadtree(nodes),
		i = 0,
		n = nodes.length;
	while (++i < n) q.visit(collide(nodes[i]));
	svg.selectAll("circle")
		.attr("cx", function (d) {
			return d.x;
		})
		.attr("cy", function (d) {
			return d.y;
		});
	svg.selectAll("text")
		.attr("x", function (d) {
			return d.x;
		})
		.attr("y", function (d) {
			return d.y;
		});
});
svg.on("mousemove", function () {
	var p1 = d3.mouse(this);
	root.px = p1[0];
	root.py = p1[1];
	force.resume();
});

function collide(node) {
	var r = node.radius + 16,
		nx1 = node.x - r,
		nx2 = node.x + r,
		ny1 = node.y - r,
		ny2 = node.y + r;
	return function (quad, x1, y1, x2, y2) {
		if (quad.point && (quad.point !== node)) {
			var x = node.x - quad.point.x,
				y = node.y - quad.point.y,
				l = Math.sqrt(x * x + y * y),
				r = node.radius + quad.point.radius;
			if (l < r) {
				l = (l - r) / l * .5;
				node.x -= x *= l;
				node.y -= y *= l;
				quad.point.x += x;
				quad.point.y += y;
			}
		}
		return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
	}
}

function resize() {
	width = window.innerWidth / 1, height = window.innerHeight;
	height = 838;
	svg.attr("width", width).attr("height", height);
	force.size([width, height]).resume();
}
