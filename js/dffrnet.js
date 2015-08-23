/*global $, CodeMirror, Blob, FileReader */
$(document).ready(function () {
    "use strict";

	// variables, and dom caches
	// ------------------------------------------------------------------------------
	var originalLeft  = 'An example text file.\n\nThis is on the left side, which is  editable.\nYou may type on this side.\n\nYou may load a text file from your computer into either side\nwith the open button. However, you may only save from \nthe left side.\n\n\nUse the switch button the flip sides, if you need to.\n\nEach side may be cleared with the trash button.\n\n\n\nWhen you click save a new window/tab with your text will open. \nEither copy & paste, or you hit cntrl+s (cmd+s) to save the file.\n\n\n\n\n\nThese lines\nare about equal.\nThese lines are \nalmost equal.\nThese \nlines are about equal.\nThese lines ar\ne almost equal.\nThese lines a\nre almost equal.\n\n\n\n\n\nThe comparison is smart enough to match lines even if they\noff in line count!\n\n\n\n\n\n\n\n\nBut it will catch this.\n\n\n\n\nThose little arrows towards the bottom __lock the scrolling.\n\n\nEnjoy.\n\n\n...\n...\n...\n...\n...\n...\n...keep\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...scrolling\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...scrolling\n...\n...\n...\n...\n...\n\n\nscrollin\' around.\n\n\nnot much has chang\'d down here.\n\n\n:)',
		originalRight = 'An example text file.\n\nThis is on the right side, which is NOT editable.\nYou may transfer lines on this side with that little blue arrow.\n\nYou may load a text file from your computer into either side\nwith the open button. However, you may only save from \nthe left side.\n\nThese are lines that are only on the right side.\nRight?\n\nUse the switch button the flip sides, if you need to.\n\nEach side may be cleared with the trash button.\n\n\n\n\n\n\n\nThese lines are almost equal.\nThese lines are almost equal.\nThese lines are almost equal.\nThese lines are almost equal.\n\n\n\n\n\nThe comparison is smart enough to match lines even if they\noff in line count!\n\n\n\n\n\n\n\n\nBut it will catch here.\n\n\n\n\nThose little arrows towards the bottom UNlock the scrolling.\n\n\nEnjoy.\n\n\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...keep\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...\n...scrolling\n...\n...\n...\n...\n...\n...\n...\n...\n...\n\n\nscrollin\' around.\n\n\nnot much has changed down here.\n\n\n\\o/ - yea',
		editor        = $('#comparer')[0],
		switchBtn     = $('#switch'),
		leftSaveBtn   = $('#left-save'),
		rightSaveBtn  = $('#right-save'),
		leftOpenBtn   = $('#left-open'),
		rightOpenBtn  = $('#right-open'),
		leftTrashBtn  = $('#left-trash'),
		rightTrashBtn = $('#right-trash'),
		highlightBtn  = $('#highlight'),
		lineCountBtn  = $('#linecount'),

		leftName      = $('#left-name'),
		rightName     = $('#right-name'),
		modalBtns     = $('.modal-btn'),
		fullView      = $('#fullview'),
		littleWindow  = $('#window'),
		minimap       = $('#minimap'),
		tooltips      = $('[data-toggle="tooltip"]'),

		cmForceH      = [],
		navbar        = $('#navbar'),
		menu          = $('#menu'),
		footer        = $('#footer'),
		logoBg        = $('#logo-bg'),
		editorHeight  = 512,
		editorOffset  = 28,
		highlight     = true,
		linecount     = true,
		edited        = false,
		i             = 0,
		scrollInfo    = {},
		editView      = {},
		topLine       = 0,
		visibleLines  = 0,
		textFile      = null,
		dv;
    
	// function definitions
	// ------------------------------------------------------------------------------
	function resizeEditor() {
		editorHeight = $(window).height() - navbar.height() - footer.height() - menu.height() - editorOffset;
		cmForceH.forEach(function (elm) {
			elm.height(editorHeight);
		});
		fullView.height(editorHeight - 1);
	}
	function replaceHtml(html) {
		return html.replace(/>/g, '&gt;').replace(/</g, '&lt;');
	}

	function changeWindow() {
		if (!littleWindow.hasClass('draggable')) {
			scrollInfo   = dv.editor().getScrollInfo();
			editView     = dv.editor().getViewport();
			topLine      = (minimap.height() / dv.editor().doc.lineCount()) * (scrollInfo.top / scrollInfo.height) * dv.editor().doc.lineCount();
			visibleLines = (minimap.height() / dv.editor().doc.lineCount()) * scrollInfo.clientHeight / dv.editor().defaultTextHeight();
			littleWindow.height(visibleLines).css('top', topLine);
		}
	}

	function createMiniMap(diffs) {
		var diffLines = '',
            color = null;
		diffs.forEach(function (item) {
			color      = (item[0] > 0) ? 'diff' : '';
			diffLines += '<span class="' + color + '">' + replaceHtml(item[1]).replace(/\n/g, '<br>') + '</span>';
		});
		minimap.empty();
		minimap.append('<p>' + diffLines + '</p>');
		changeWindow();
	}

	function makeTextFile(text) {
		var data = new Blob([text], {type: 'text/plain'});
		if (textFile !== null) {
			window.URL.revokeObjectURL(textFile);
		}
		textFile = window.URL.createObjectURL(data);
		return textFile;
	}
    
	// setup
	// ------------------------------------------------------------------------------
	// editor
	dv = CodeMirror.MergeView(editor, {
		value                : originalLeft,
		orig                 : originalRight,
		lineNumbers          : true,
		mode                 : "text/plain",
		highlightDifferences : true,
		theme                : 'mbo',
		styleActiveLine      : true
	});
	dv.right.lockButton.innerHTML = '&#8667;  &#8666;';
	dv.right.lockScroll = false;
	// re-cache
	cmForceH = [
		$('.CodeMirror-merge'),
		$('.CodeMirror-merge .CodeMirror'),
		$('.CodeMirror-merge .CodeMirror-gutters')
	];
	resizeEditor();
	createMiniMap(dv.right.diff);
	tooltips.tooltip();
    logoBg.css('opacity', 0);

	// user interactions
	// ------------------------------------------------------------------------------

	// menu buttons clicked
	leftTrashBtn.click(function () {
		dv.editor().doc.setValue('');
		createMiniMap(dv.right.diff);
	});
	leftOpenBtn.on('fileselect', function (event, filename, text) {
		leftName.val(filename);
		dv.editor().doc.setValue(text);
		createMiniMap(dv.right.diff);
	});
	leftSaveBtn.click(function (e) {
		// split lines
		var text = dv.editor().doc.getValue();
		// build and set file
		$(this).attr('download', leftName.val());
		$(this).attr('target', 'blank');
		$(this).attr('href', makeTextFile(text));
		// toggle state
		edited = false;
		leftName.removeClass('edited');
	});
	highlightBtn.click(function () {
		dv.setShowDifferences(highlight = !highlight);
	});
	switchBtn.click(function () {
		var lname = leftName.val(),
            rname = rightName.val(),
            left  = dv.editor().doc.getValue(),
            right = dv.rightOriginal().doc.getValue();
		// switch names
		leftName.val(rname);
		rightName.val(lname);
		// switch documents
		dv.editor().doc.setValue(right);
		dv.rightOriginal().doc.setValue(left);
		// change window
		createMiniMap(dv.right.diff);

	});
	lineCountBtn.click(function () {
		linecount = !linecount;
		dv.editor().setOption('lineNumbers', linecount);
		dv.rightOriginal().setOption('lineNumbers', linecount);
	});
	rightOpenBtn.on('fileselect', function (event, filename, text) {
		rightName.val(filename);
		dv.rightOriginal().doc.setValue(text);
		createMiniMap(dv.right.diff);
	});
	rightTrashBtn.click(function () {
		dv.rightOriginal().doc.setValue('');
		createMiniMap(dv.right.diff);
	});

	// open modals
	modalBtns.click(function (e) {
		$('#' + e.target.href.split('#')[1] + '-modal').modal();
	});

	// open local file
	$(document).on('change', '.btn-file :file', function (e) {
		var input    = $(this),
			file     = input[0].files[0],
			filename = input.val().replace(/\\/g, '/').replace(/\.*\//, ''),
			textType = /text\.*/,
			text     = '',
            reader   = null;
		if (file.type.match(textType)) {
			reader = new FileReader();
			reader.onload = function (e) {
				text = reader.result;
				input.trigger('fileselect', [filename, text]);
			};
			reader.readAsText(file);
		}
	});

	// ask if the user really wants to leave
	$(window).on('beforeunload', function () {
		if (edited) {
			return 'You have unsaved changes. If you leave now, all changes will be lost';
		}
	});

	// drag little window
	littleWindow.on('mousedown', function (e) {
		$(this).addClass('draggable').parents().on('mousemove', function (e) {
			var movePos      = e.pageY - $('.draggable').outerHeight() / 2,
                miniMapTop   = minimap.offset().top - 1,
                maxHeight    = miniMapTop + minimap.height() - $('.draggable').height(),
                lineOffset   = null;
			if (movePos < miniMapTop) {
				movePos = miniMapTop;
			} else if (movePos > maxHeight) {
				movePos = maxHeight;
			}
			$('.draggable').offset({
				top: movePos
			}).on('mouseup', function () {
				$(this).removeClass('draggable');
			});
			lineOffset = littleWindow.position().top;
			dv.editor().scrollTo(0, scrollInfo.height * lineOffset / (minimap.height() / dv.editor().doc.lineCount()) / dv.editor().doc.lineCount());
		});
		e.preventDefault();
	}).on('mouseup', function () {
		$('.draggable').removeClass('draggable');
	});

	// user scrolls on editor
	dv.editor().on('scroll', function () {
		changeWindow();
	});

	// user typed on editor
	dv.editor().on('change', function () {
		// change minimap
		createMiniMap(dv.right.diff);
		changeWindow();
		// toggle state
		edited = true;
		leftName.addClass('edited');
	});

	// window resize
	$(window).resize(function () {
		resizeEditor();
		changeWindow();
	});

});