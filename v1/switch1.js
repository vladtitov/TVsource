// -----------------------------------------------------------------------------
// Copyright 2016 by Samsung Electronics, Inc.
//
// Department: SRT - Bravo
// -----------------------------------------------------------------------------

/*
 Disclaimer: This code is for demonstrative purposes only and not intended for production environments
 */

var widgetAPI;
var tvKey;
var pluginAPI;

var Main = {

	
};
Main.destroy = function(){
	Main.sefPlugin.Close();
	console.log('Destroy');
}
window.onHide = Main.destroy;
window.onunload  = Main.destroy;

/**
 * Entry Point for app
 */
Main.onLoad = function (opts) {

	var initAPI = function(){
		console.log('init API');
		Main.sefPlugin = $('#sefPlugin')[0];
		Main.sefPlugin.Open('Window', '1.000', 'Window');

		//Main.sefPlugin.Close();
	}

	var current=1;
	initAPI();


	var selected;
var bgImage = true
	var setSelected = function(num){
		if(bgImage) {
			$('#BgImage').fadeOut(function(){
				$('#BgImage').remove();
			});
			bgimage =false;
		}
		$('#SouceControl').children().removeClass('selected');
		 var el = $('#SouceControl').find('[data-cmd='+num+']');
		el.addClass('selected');
		selected = el;

	}

	var switchSorce = function(num){
		current = parseInt(num)
		Main.sefPlugin.Execute('SetSource',current);
		$('#CurrentTV').removeClass('closed');
		$('#watching').text(selected.text());
		$('#currentState').text(opts.loading);
		setTimeout(function(){
			$('#currentState').text(opts.watching);
		},4000);
	}




	$('#SouceControl').on('click','a',function(evt){
		var el = $(evt.currentTarget);
		console.log('click '+ el.data('cmd'));
		var id = el.attr('data-cmd');
		if(isNaN(Number(id))) return;
			setSelected(id)
			switchSorce(id)
	})
////////////////////////////////Menu hide - Open

	var isMenu = true;


	var onMenuOpen = function(){
			selected.addClass('blink');
		setTimeout(function(){
			selected.removeClass('blink');
		},3000);
	}

	var openMenu = function(){
		$('#SmallMenu').removeClass('closed')
		isMenu = true;
		onMenuOpen();
	}
///////////////////////////Hide menu ////////////////////

	var timer=0;
	var delay=opts.hide_menu_delay;
	if(isNaN(delay)) delay=30;

		$(document).on('click',function(){
			//console.log('doc click current '+current);
			if(isMenu==false)openMenu();
			clearTimeout(timer);
			if(current ==0) return;
			timer = setTimeout(function(){
				isMenu = false;
				$('#SmallMenu').addClass('closed');
			},delay*1000);
		})


///////////////////////////////////////////////



};

var initDebug= function(){
	console.log = function(args){
		$.post('/','Log '+args.toString());
	}
	console.error = function(args){
		$.post('/','Error '+args.toString());
	}
	window.onerror = function(args){
		$.post('/','Window Error '+args.toString());
	}
	console.log('Debug on '+(new Date().toDateString())+'  '+window.location.href);
}






$(document).ready(function(){
	var href = window.location.href;
	if(href.toLowerCase().indexOf('debug')!==-1) {
		appsettings.debug=true;
		initDebug();
	}

	Main.onLoad(appsettings);
})


