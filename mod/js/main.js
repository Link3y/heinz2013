var wHeight, wWidth;
var scrTop = 0;
var scrLeft = 0;
var scene = 1;
var sceneLength = 3;
var sceneTerm = 2; //씬 길이
var sStart = new Array();
var sEnd = new Array();
var btm = new Array();
var $tomato = $('#tomato');
var $tomatoAll = $('#tomatowrap, #tomato, #tomatowrap>.shadow');
var $ss1 = $('#s1area');
var $ss2 = $('#s2area');

function getPercent(_start, _end, _current) {
	if (!_current) _current = scrTop;
	if (!_start) _start = 0;
	var _pos = _current - _start;
	var _len = (_end - _start) / 100;
	return ( _pos / _len ) / 100;
};

function getScale(_from, _to, _start, _end, _pos) {
	if (!_pos) _pos = scrTop - _start;
	if (!_start) _start = 0;
	if (!_from || !_to || !_end) return;
	var _level = (_from-_to) /100;
	var _len = (_end - _start) /100;
	var _per = _pos / _len;
	var ret = _from - ( _level * _per );
	if (_from<_to) {
		if (ret>_to) { ret = _to } else if (ret<_from) {ret = _from };
	} else {
		if (ret<_to) { ret = _to } else if (ret>_from) {ret = _from };
	};
	return ret;
};

function setPos() {

	wHeight = $(window).height();
	wWidth = $(window).width();
	scrTop = $(window).scrollTop();
	scrLeft = (wWidth<1100) ? $(window).scrollLeft() : 0;

	//----- 씬 영역 설정 시작
	for (i=0;i<=sceneLength;i++) {
		sStart[i] = (i>1) ? sEnd[i-1] : wHeight * (i-1);
		sEnd[i] = (i>0) ? sStart[i]+(wHeight * sceneTerm) : wHeight;
	};
	//----- 씬 영역 설정 끝

	//----- vertical 정렬 시작
	var _i=0;
	$('.scene').find('.vcenter').each(function() {
		btm[_i] = (wHeight-85-$(this).height())/2;
		$(this).css({'bottom': btm[_i]+'px'});
		_i++;
	});
	//----- vertical 정렬 끝

	$('#slide-fixer').height(wHeight);
	var _left = (wWidth>980) ? (wWidth-980)/2 : 0;
	$('.scene .wrap').height(wHeight-90).css('left', _left+'px');
	$('#container').height(sEnd[sceneLength]+wHeight );

	$('#head_wrap, #slide-fixer').css('left','-'+scrLeft+'px');

	var _unit = wHeight/10*18;
	if (_unit>wWidth) {
		var _height = (wHeight>710) ? wHeight : 625;
		$('.slide .bg').width(_unit).height(_height);
	} else {
		var _width = wWidth;
		$('.slide .bg').width(_width).height(_width/18*10);
	};

	scroll();

};

function scroll() {

	scrTop = $(window).scrollTop();
	scrLeft = $(window).scrollLeft();

	var ii = sStart.length;
	while (ii>-1) {
		if ( scrTop > sEnd[ii] ) {
			scene = false;
			break;
		} else if ( scrTop > sStart[ii] ) {
			scene = ii;
			break;
		};
	ii--;
	};

	if (scene!==false) {
		//$('#slide-fixer').css({'position':'fixed'});
		$('#slide-fixer').attr('class','fixed');
		$('#head_wrap, #slide-fixer').css('left','-'+scrLeft+'px');
	} else {
		$('#slide-fixer').attr('class','absolute');
		scene = sceneLength;
	};

	var $scene = $('#scene'+scene);
	$scene.nextAll('.scene').height(0);
	$scene.prevAll('.scene').height(wHeight);
	var _h = ( (sStart[scene]-scrTop)/sceneTerm ) * -1;
	$scene.height(_h);

	switch (scene) {
		case 0:
			$('.scene').height(0);
			$('#scene0').height(wHeight);
		case 1:
			var btm2a = btm[0];
			var btm2b = -500;
			$('#scene1').find('.gradient').css('opacity', '0');
			$tomatoAll.removeAttr('style');
			break;
		case 2:
			var _percent = getPercent(sStart[2], sEnd[3]);
			var btm2a = btm[0]+( (scrTop-wHeight) * _percent );
			var btm2b = getScale( -500, btm[1], sStart[2], sStart[2]+wHeight );
			var tomatoSize = getScale(188,153, sStart[2], sEnd[2]);
			$tomato.css({'width': tomatoSize+'px', 'left': (188-tomatoSize)/2+'px'});
			$('#scene1').find('.gradient, .shadow').css('opacity', (_percent*2));
			break;
		case 3:
			var btm2a = wHeight;
			var btm2b = btm[0]+( (scrTop-sStart[3]) * getPercent(sStart[3], sEnd[3]) );
			$('#scene1').find('.gradient').css('opacity', '1');
			var _bottom = (scrTop-sStart[3])/10;
			$tomato.css({'width': '153px', 'left':'17px'});
			$('#tomatowrap').height(330-_bottom).find('.shadow').css('opacity','1');
			if (scrTop>sEnd[3]-300 && $scene.find('ul').is('.ready')) $scene.find('ul').removeClass('ready').find('a').show().animate({'left':'0','top':'0'}, 700);
			break;
	};

	$ss1.clearQueue().stop(true,true).animate({'bottom':btm2a+'px','opacity':getPercent(sStart[2]+wHeight, sStart[2]) },300);
	$ss2.clearQueue().stop(true,true).animate({'bottom':btm2b+'px'},300);

};

$(document).ready(function() {

	setPos(); //반드시 이 캡슐의 최상위에 호출되어야 함

	$(window).scroll(function() {
		scroll();
	});

	$(window).resize(function() {
		setPos(); //반드시 이 캡슐의 최상위에 호출되어야 함
	});

	$('#slide_btn li').click(function() {
		var _num = $(this).index()+1;
		$('#slide_btn').find('.active').removeClass('active');
		$('.slide').removeClass('active');
		$(this).addClass('active');
		$('#slide'+_num).addClass('active').css({'z-index':'3','left':wWidth+'px'}).animate({'left':'0'}, 500, function() {
			$('.slide:not(.active)').css({'z-index':'1'});
			$(this).css({'z-index':'2'});
		});
		return false;
	});

	$('.scene a').focus(function() {
		var _scene = $(this).attr('scene');
		if (_scene!==scene) {
			var _scrTop = (_scene<1) ? 0 : sEnd[_scene];
			$('html, body').clearQueue().stop().animate({scrollTop : _scrTop+'px' }, 200);
		};
	});

	$('#scrolldown').click(function() {
		$('html, body').clearQueue().stop().animate({scrollTop : sEnd[sceneLength]+260+'px' }, 900);
		return false;
	});

});
