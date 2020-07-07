(function (blink) {
	'use strict';

	var julioalma = function () {
			blink.theme.styles.basic.apply(this, arguments);
		},
		page = blink.currentPage;

	julioalma.prototype = {

		bodyClassName: 'content_type_clase_julioalma',
		extraPlugins: ['image2'],
		ckEditorStyles: {
			name: 'julioalma',
			styles: [

				{ name: 'Título 1', element: 'h4', attributes: { 'class': 'bck-title1'} },

				{ name: 'Lista ordenada1', element: 'ol', attributes: { 'class': 'bck-ol1' } },
				{ name: 'Lista ordenada2', element: 'ol', attributes: { 'class': 'bck-ol2' } },

				{ name: 'Icono cuadrado', element: 'p', attributes: { 'class': 'square-icon'} },
				{ name: 'Icono triángulo', element: 'p', attributes: { 'class': 'triangle-icon'} },

				{ name: 'Celda 1', element: 'td', attributes: { 'class': 'bck-td1' } },
				{ name: 'Celda 2', element: 'td', attributes: { 'class': 'bck-td2' } },

				{ name: 'Caja 1', type: 'widget', widget: 'blink_box', attributes: { 'class': 'box-1' } }
			]
		},

		init: function () {
			//BK-15873 Utilizamos this.parent declarada al inicio de la clase
			this.parent.init.call(this);
			this.addActivityTitle();
			if(window.esWeb) return;
			this.removeFinalSlide();
			this.formatCarouselindicators();
		},

		removeFinalSlide: function () {
			//BK-15873 Utilizamos this.parent declarada al inicio de la clase
			this.parent.removeFinalSlide.call(this, true);
		},

		addActivityTitle: function () {
			if (!blink.courseInfo || !blink.courseInfo.unit) return;
			$('.libro-left').find('.title').html(function () {
				return $(this).html() + ' > ' + blink.courseInfo.unit;
			});
		},

		formatCarouselindicators: function () {
			var $navbarBottom = $('.navbar-bottom'),
				$carouselIndicators = $('.slider-indicators').find('li');
			$navbarBottom.find('li').tooltip('destroy');

			var dropDown = '' +
					'<div class="dropdown">' +
						'<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">';

			var navigatorIndex = 0;
			for (var index = 0; index < window.secuencia.length; index++) {
				var slide = eval('t'+index+'_slide'),
					slideTitle = slide.title;

				if (slide.isConcatenate) continue;

				dropDown += '<li role="presentation"><a role="menuitem">' + (navigatorIndex+1) + '. ' + stripHTML(slideTitle) + '</a></li>';
				$navbarBottom.find('li').eq(navigatorIndex).html('<span title="'+ stripHTML(slideTitle) +'">'+(navigatorIndex+1)+'</span>');
				navigatorIndex++;

			}

			dropDown += '' +
						'</ul>' +
					'</div>';

			$navbarBottom
				.attr('class', 'publisher-navbar')
				.wrapInner('<div class="navbar-content"></div>')
				.find('ol')
					.before(dropDown)
					.wrap('<div id="top-navigator"/>')
					.end()
				.find('.dropdown').find('li')
					.on('click', function (event) {
						$navbarBottom.find('ol').find('li').eq($(this).index()).trigger('click');
					});

			if (!blink.hasTouch) {
				$navbarBottom
					.find('ol').find('span')
						.tooltip({
							placement: 'bottom',
							container: 'body'
						});
			}
		}

		//BK-15873 Quitamos la funcion getEditorStyles para que la herede de basic
	};

	julioalma.prototype = _.extend({}, new blink.theme.styles.basic(), julioalma.prototype);

	blink.theme.styles['julioalma'] = julioalma;

})( blink );

$(document).ready(function () {
    $('.item').find('.header').find('.title')
		.filter(function () {
			return $(this).find('.empty').length;
		}).hideBlink();

    $('.item').find('.header').find('.title')
		.filter(function () {
			return !$(this).find('.empty').length;
		})
		.each(function () {
			var $header = $(this).find('h3');
			$header.length && $header.html($header.html().replace(' ', ''));
		});

	if (!editar) {
		blink.events.on('showSlide:after', function (index) {
			poolReposition();
		});
	}

});

$(window).load(function() {
	if (!editar) {
		poolReposition();
	}
});
$(window).resize(function() {
	if (!editar) {
		poolReposition();
	}
});

function poolReposition() {
	$('.pool').each(function(i,e) {
		var poolContainer = $(e).width();
		var poolWidth = $(e).find('.rf-searchgamecontainer').width();
		var wordContainerWidth = poolContainer-poolWidth-20;
		if (wordContainerWidth > 150) {
			$(e).find('.rf-wordcontainer').css('width', wordContainerWidth);
		} else {
			$(e).find('.rf-wordcontainer').css('width', poolWidth);
		}
	});
}
