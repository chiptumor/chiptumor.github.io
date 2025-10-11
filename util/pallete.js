import Color from "https://cdn.skypack.dev/color@5.0.2/index.js";

(() => {
	const color = Color("#E9263D");
	const light = color.adjust([8, 0, 0.8]);

	console.log(color.hex());
	console.log(light.hex());
})();

const colors = {
	greyscale: {
		base: "",
		index: 0,
		light: (color) => color,
		dark: (color) => color
	},
	glacier: {
		base: "#E7E9ED",
		index: 10,
		light: (color) => color,
		dark: (color) => color
	},
	blueberry: {
		base: "#E0EBFF",
		index: 10,
		light: (color) => color,
		dark: (color) => color
	},
	red: {
		base: "#E9263D",
		index: 6,
		light: (color) => [
			color.rotate(2).lighten(2),
			color.rotate(2).lighten(2),
			color.rotate(2).lighten(2),
			color.rotate(2).lighten(2)
		],
		dark: (color) => [
			color.rotate(-5).darken(2),
			color.rotate(-5).darken(2),
			color.rotate(-5).darken(2),
			color.rotate(-5).darken(1),
			color.rotate(-5).darken(1),
			color.rotate(-5).darken(1)
		]
	},
	orange: {
		base: "#FF7800",
		index: 0,
		light: (color) => color,
		dark: (color) => color
	},
	yellow: {
		base: "#FFD215",
		index: 0,
		light: (color) => color,
		dark: (color) => color
	},
	green: {
		base: "#1AE768",
		index: 0,
		light: (color) => color,
		dark: (color) => color
	},
	cyan: {
		base: "#00F2F5",
		index: 0,
		light: (color) => color,
		dark: (color) => color
	},
	blue: {
		base: "#23A2FF",
		index: 0,
		light: (color) => color,
		dark: (color) => color
	},
	purple: {
		base: "#DA44FF",
		index: 0,
		light: (color) => color,
		dark: (color) => color
	},
	magenta: {
		base: "#FF44BD",
		index: 0,
		light: (color) => color,
		dark: (color) => color
	}
};

const pallete = {};

const row = colors.red;

export default pallete;