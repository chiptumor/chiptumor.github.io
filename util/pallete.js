import color from "https://unpkg.com/color@5.0.2/index.js";

const colors = {
	greyscale: {
		base: "",
		index: 0,
		light: (color) => color,
		dark: (color) => color
	},
	tinted: {
		base: "",
		index: 0,
		light: (color) => color,
		dark: (color) => color
	},
	red: {
		base: "#E9263D",
		index: 6,
		dark: (color) => [
			color.rotate(-5).darken(0.2),
			color.rotate(-5).darken(0.2),
			color.rotate(-5).darken(0.2),
			color.rotate(-5).darken(0.1),
			color.rotate(-5).darken(0.1),
			color.rotate(-5).darken(0.1)
		],
		light: (color) => [
			color.rotate(2).lighten(0.8),
			color.rotate(2).lighten(0.8),
			color.rotate(2).lighten(0.8),
			color.rotate(2).lighten(0.8)
		]
	},
}