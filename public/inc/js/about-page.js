$(document).ready(function() {
	// Initialize slider
	(function() {
		var slides = [
			'inc/img/about-page-slides/1.png',
			'inc/img/about-page-slides/2.png',
			'inc/img/about-page-slides/3.png'
		];

		var slider = Object.create(ContainerSlider);
		slider.init(659, 375, slides);
		slider.render();
		slider.start(10);
	}());
});