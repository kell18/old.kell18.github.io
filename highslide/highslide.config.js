/**
*	Site-specific configuration settings for Highslide JS
*/
hs.graphicsDir = 'highslide/graphics/';
hs.outlineType = 'custom';
hs.dimmingOpacity = 0.5;
hs.captionEval = 'this.a.title';
hs.wrapperClassName = 'highslide-no-border';
hs.outlineType = 'drop-shadow';
hs.showCredits = false;
hs.align = 'center';
hs.dragSensitivity = 1000000;
hs.registerOverlay({
	html: '<div class="closebutton" onclick="return hs.close(this)" title="Close"></div>',
	position: 'top right',
	useOnHtml: true,
	fade: 2 // fading the semi-transparent overlay looks bad in IE
});

