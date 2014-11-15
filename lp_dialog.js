(function($) {
/* -----------------------------------------------
/* Author : George Vasalos
/* MIT license: http://opensource.org/licenses/MIT
/* GitHub : https://github.com/liadlow/LP-dialog
/* Description : A jQuery plugin for dialog windows (with 2 additional functions)
/* How to use? : Check the GitHub README
/* ----------------------------------------------- */

	$.fn.disabler = function(action, options) {
	/*
	 * Disable an area by placing an extra div on top overlapping it
	 * 
	 * @action : (required) enable ar disable the area
	 * @options : (optional) set of options for appearence and behaviour
	*/


		/*
		 * default settings for the disabler:
		 * black color with 0.4 opacity (seems grey)
		 *
		 * width- and heightpercent constants should be of value 100
		 * to block the whole parent element and cannot be changed
		 *
		 * canscroll : if true then the scroll is not disabled from the element
		*/
		var settings = $.extend({
			color:"black",
			opacity:0.4,
			canscroll:false
		}, options),

			widthpercent = 100,
			heightpercent = 100,
			disabler_selector = ".jQlp_disabler";
			
		/*
		 * if multiple elements are provided separated with comma
		 * call this function once for each element recursively
		 * with the same parameters
		*/
		if(this.selector.indexOf(',') > 0) {
			var splitted = this.selector.split(',');
			for(var i=0; i < splitted.length; i++) {
				$(splitted[i]).disabler(action, options);
			}
			return;
		}


		if(action === "disable") {

			// make selected element relative to put absolute child in it
			$(this.selector).css("position", "relative");

			if($(this.selector).children(disabler_selector).length <= 0) { 
			// if element is not in DOM

				// add div as the first child of the parent element
				$("<div class='"+disabler_selector.substring(1)+"'></div>").prependTo(this.selector);

				// style properly to cover parent element
				$(disabler_selector).css({"position" : "absolute", "top" : 0, "left" : 0, "width" : widthpercent+"%", "height" : heightpercent+"%", "background-color" : settings.color, "opacity" : settings.opacity, "z-index" : "1000"});
				
				/*
				 * if the element to be disabled is body then move the grey area
				 * to the hole window
				*/
				if(this[0] === $("body")[0]) { // compare DOM elements

					$(disabler_selector).css("position", "fixed");

					//disable scroll bar if chosen
					if(!settings.canscroll) {
						$("html").css("overflow", "hidden");
					}
				}
				else if(!settings.canscroll) {
					$(this.selector).css("overflow", "hidden");
				}
			}
		}


		if(action === "enable") {
		/*
		 * enable an element that was disabled
		 * by removing the extra div from the DOM
		*/

			if($(disabler_selector).length) {
			// if element is in DOM	

				// remove disabler div from DOM
				$(disabler_selector).remove();

				if(this[0] === $("body")[0]) {
					$("html").css("overflow", "auto");
				}
				else {
					$(this.selector).css("overflow", "auto");
				}
			}
		}

	};

	$.fn.hvcenter = function(relevantTo, extra_top_margin) {
	/*
	 * horizontally and vertically center the
	 * element within its parent
	 * 
	 * @relevantTo : (optional) whether the element will be centered relevant to its parent or the window
	 * @extra_top_margin : (optional) add extra top margin to the centered element
	*/

		relevantTo = relevantTo || "parent";
		extra_top_margin = extra_top_margin || 0;

		// check if element is in DOM
		if(this.offset() == null || this.offset() == undefined) return;

		// calculate top margin relative to parent or window and place element in center
		var top_margin; 
		if(relevantTo === "parent") {
			top_margin = this.parent().height()/2 - this.position().top - this.height()/2 + extra_top_margin;
		}
		else if(relevantTo === "window") {
			top_margin = $(window).height()/2 - this.offset().top - this.height()/2 + extra_top_margin;
		}

		// if position relative use auto margin, else calculate margin from parent's or window's width
		if(this.css("position") === "relative") {
			this.css({"margin-top": top_margin, "margin-right": "auto", "margin-left": "auto"});
		}
		else {
			var side_margin;
			if(relevantTo === "parent") {
				side_margin = this.parent().width()/2 - this.width()/2;
			}
			else if(relevantTo === "window") {
				side_margin = $(window).width()/2 - this.width()/2;
			}
			
			if(side_margin <= 0) return; // do nothing if child element is bigger than the parent
			this.css({"margin-top": top_margin, "margin-right": side_margin, "margin-left": side_margin});
		}
	};

	$.lp_dialog = function(action, message, options) {
	/*
	 * show custom popup windows, center-aligned both horizontally
	 * and vertically, that can be easily modified with a 
	 * variety of choices by the developer using this plugin
	 *
	 * @action : (required) alert, confirm, prompt or custom dialog window
	 * @message : (required) the message to be shown in the dialog. In the custom dialog window it holds the whole html of the window
	 * @options : (optional) set of options for appearence and behaviour
	*/


		/*
		 * default settings for the popup windows:
		 * window_width : the width of the popup window
		 * window_min_height : the minimum height of the popup window
		 * 		window height may change from min due to long message
		 * ybutton : the button that returns true in a confirm popup. It is 
		 * 		also used in the alert popup (set to OK by default)
		 * yfunction : the function to be called when ybutton is clicked.
		 * 		It must be provided
		 * nbutton : the button that returns false in a confirm popup
		 * 		(set to Cancel by default)
		 * nfunction : the function to be called when nbutton is clicked.
		 * 		It must be provided
		 * exit_on_out_click : choose if the popup should disappear if 
		 * 		the user clicks outside of it
		 * exit_button_img_url : the url of the image to be used as the 
		 * 		X button to close the window
		 * bgcolor : background color of the window is set to white by default
		 * fntcolor : text color
		 * fntsize : text size (85% of body text by default)
		 * font : font style (body font style by default)
		 * bgimg : url of the background image for the window. It is set to none by default
		 * bgsize : set the backgroung image size. It is set to cover by default
		 * btnimg : the image used as button background in a confirm popup
		 * nbtndiff : whether or not the nbutton will have different image than the ybutton
		 * nbtnimg : if true then the nbutton image path
		 * btnfntcolor : font color in buttons
		 * rounded : whether or not the window has rounded corners
		 * colored_footer : whether the footer has a color of it is transparent
		 * footer_color : if colored then the color of the footer
		 * custom_style : javascript object used by the custom window to set custom css style.
		 * 		Its structure is the same as the one used by the css jquery function but selectors
		 * 		for the elements in the custom html can be provided. 
		 * 			input example: {custom_style: {general: {color: "red"}, elements: [{selector: "#foo", style: {color: "blue"}}, ...]}
		 * buttons_num : number of buttons in custom dialog window (max = 2)
		 * 		functionality can be added to the button(s) via yfunction (and nfunction if there are 2 buttons)
		 * placeholder : used by prompt and it's the default text displayed in the text input
		 * inputWidth : the width of input element in prompt dialog
		 * inputHeight : the height of the input element in prompt dialog
		*/
		var settings = $.extend({ 
			window_width:450,
			window_min_height:150,
			ybutton:"OK",
			yfunction:function(){},
			nbutton:"Cancel",
			nfunction:function(){},
			exit_on_out_click:false,
			exit_button_img_url:"images/exit_button.ico",
			fntcolor:"black",
			fntsize:"85%",
			font: "inherit",
			bgcolor:"white",
			bgimg:"none",
			bgsize:"cover",
			btnimg:"images/button.png",
			nbtndiff:true,
			nbtnimg:"images/nbutton.png",
			btnfntcolor:"white",
			rounded:true,
			colored_footer:true,
			footer_color:"#949494",
			custom_style:{general:{}, elements: []},
			buttons_num: 1,
			placeholder: "",
			inputWidth: "auto",
			inputHeight: "auto"
		}, options);

		// common styles for all windows
		
		// create all the extra DOM elements needed
		var htmlString = "<div id='lp_dialog_window'><img src='"+settings.exit_button_img_url+"' class='lp_dialog_exit_button' /><span id='lp_dialog_message'>"+message+"</span><footer></footer></div>";
		$(htmlString).prependTo('body');
		$("body").disabler("disable");

		// window general css
		$("#lp_dialog_window").css({
			// default and unmoderatable values
			"z-index": 1500,
			"position": "absolute",
			"overflow": "hidden",
			// moderatable values
			"width": settings.window_width,
			"background-color": settings.bgcolor,
			"background-image": (settings.bgimg === "none" ? "none" : "url('"+settings.bgimg+"')"),
			"background-size": settings.bgsize,
			"border-radius": (settings.rounded ? "15px" : "0"),
			"font-size": settings.fntsize,
			"font-family": settings.font
		});

		// exit button and text style are all predefined with no editable parameters
		$("#lp_dialog_window .lp_dialog_exit_button").css({
			"width": 10,
			"height": 10,
			"position": "absolute",
			"right": 13,
			"top": 5,
			"cursor": "pointer"
		});
		$("#lp_dialog_message").css({
			"width": "90%",
			"margin-right": "5%",
			"margin-left": "5%",
			"margin-top": "30px",
			"position": "absolute",
			"word-wrap": "break-word"
		});

		/*
		 * extra general css because we have to get the text size 
		 * inside the window to adjust its height. If the text is
		 * not big then the window height takes the min value provided
		 * or the default 150px, else it takes the value of the height 
		 * provided plus the text height + 74px (footer and header) + 10px (message bottom margin)
		*/
		
		$("#lp_dialog_window").css("height", ($("#lp_dialog_message").height() > settings.window_min_height-74 ? $("#lp_dialog_message").height()+84 : settings.window_min_height));

		$("#lp_dialog_window footer").css({
			// default and unmoderatable values
			"width": "100%",
			"height": 44,
			"position": "absolute",
			"bottom": 0,
			// moderatable values
			"background-color": (settings.colored_footer ? settings.footer_color : "transparent")
		});

		if(action === "alert") {
		/*
		 * show a dialog alert window similar to the custom alert
		 * dialog of the browser with better style and editable
		 * parameters
		*/

			//only one button needed in alert dialogs
			$("<button id='lp_dialog_ybutton'>"+settings.ybutton+"</button>").appendTo('#lp_dialog_window footer');

			$("#lp_dialog_window button").css("right", "15px");

			$("#lp_dialog_window button").click(close_window);
		}
		else if(action === "confirm") {
		/*
		 * show a dialog confirm window similar to the custom confirm
		 * dialog of the browser with better style and editable
		 * parameters
		*/

			//two buttons needed in confirm dialogs
			$("<button id='lp_dialog_ybutton'>"+settings.ybutton+"</button><button id='lp_dialog_nbutton'>"+settings.nbutton+"</button>").appendTo('#lp_dialog_window footer');

			$("#lp_dialog_ybutton").css("right", "140px");
			$("#lp_dialog_nbutton").css("right", "15px");

			$("#lp_dialog_ybutton").click(function() {
				close_window();
				settings.yfunction();
			});
		}
		else if(action === "prompt") {
		/*
		 * show a dialog prompt window similar to the custom prompt
		 * dialog of the browser with better style and editable
		 * parameters
		*/
			var lp_prompt_return = null;
			
			$("<button id='lp_dialog_ybutton'>"+settings.ybutton+"</button><button id='lp_dialog_nbutton'>"+settings.nbutton+"</button>").appendTo('#lp_dialog_window footer');

			$("#lp_dialog_ybutton").css("right", "140px");
			$("#lp_dialog_nbutton").css("right", "15px");

			// add text input
			$("<input type='text' placeholder='"+settings.placeholder+"'/>").appendTo('#lp_dialog_message');

			// readjust height
			$("#lp_dialog_window").css("height", ($("#lp_dialog_message").height() > settings.window_min_height-74 ? $("#lp_dialog_message").height()+84 : settings.window_min_height));
			$("#lp_dialog_window").hvcenter();
			
			$("#lp_dialog_message input").css({
				// default and unmoderatable values
				"border-radius": 3,
				"border-width": 1,
				"margin-left": 10,
				// moderatable values
				"width": settings.inputWidth,
				"height": settings.inputHeight
			});

			$("#lp_dialog_message input").focus(); // request focus

			$("#lp_dialog_message input").focusin(function() {
				$(this).css("border-color", "auto");
			});

			$("#lp_dialog_message").css("text-align", "center");

			$("#lp_dialog_ybutton").click(function() {
				lp_prompt_return = $("#lp_dialog_message input").val(); // store input value
				close_window();
				settings.yfunction(lp_prompt_return); // use stored value in yfunction
			});
		}
		else if(action === "custom") {
		/* 
		 * show a window with a custom html in it provided by
		 * the message parameter of the lp_dialog function
		*/
			var lp_custom_return = null;
	
			// edit elements only in the dialog window
			var wrapper = "#lp_dialog_message";
			$(wrapper).html(message);
			$(wrapper).css(settings.custom_style.general);

			// add css style provided to each element
			$.each(settings.custom_style.elements, function(index, element) {
				$(wrapper+" "+element.selector).css(element.style);
			});

			// handle images
			var images = $(wrapper).find("img");
			if(images.length > 0) {
				$.each(images, function(index, img) {
					$(img).load(function() {
						if(index == images.length - 1) {
							// if there are images readjust window height after they have been
							// loaded (due to browser's lazy image loading)
							$("#lp_dialog_window").css("height", ($("#lp_dialog_message").height() > settings.window_min_height-74 ? $("#lp_dialog_message").height()+84 : settings.window_min_height));
							$("#lp_dialog_window").hvcenter();		
						}
					});
				});
			}

			// add buttons
			switch(settings.buttons_num) {
				case 1:
					$("<button id='lp_dialog_ybutton'>"+settings.ybutton+"</button>").appendTo('#lp_dialog_window footer');
					$("#lp_dialog_window button").css("right", "15px");
					break;
				case 2:
					$("<button id='lp_dialog_ybutton'>"+settings.ybutton+"</button><button id='lp_dialog_nbutton'>"+settings.nbutton+"</button>").appendTo('#lp_dialog_window footer');
					$("#lp_dialog_ybutton").css("right", "140px");
					$("#lp_dialog_nbutton").css("right", "15px");
					break;
				default:
					break;
			}

			$("#lp_dialog_ybutton").click(function() {
				// every input's value (if any) is stored in an array for later use 
				lp_custom_return = new Array();
				var selects = $(wrapper).find("select"), inputs = $(wrapper).find("input"); //handle select and input tags
				if(selects.length > 0) {
					// for every select tag
					$.each(selects, function(index, selectTag) {
						// and push it as a value to the final object
						lp_custom_return.push({name: $(selectTag).attr('name'), value: $(selectTag).val()});
					});
				}
				if(inputs.length > 0) {
					$.each(inputs, function(index, inputTag) {
						switch($(inputTag).attr("type")) {
							case "checkbox":
								lp_custom_return.push({name: $(inputTag).attr('name'), value: $(inputTag).prop('checked')});
								break;
							case "radio":
								if($(inputTag).prop("checked")) {
									lp_custom_return.push({name: $(inputTag).attr('name'), value: $(inputTag).val()});
								}
								break;
							case "color":
							case "date":
							case "datetime":
							case "datetime-local":
							case "email":
							case "hidden":
							case "month":
							case "number":
							case "password":
							case "range":
							case "tel":
							case "text":
							case "time":
							case "url":
							case "week":
								lp_custom_return.push({name: $(inputTag).attr('name'), value: $(inputTag).val()});
								break;
						}
					});
				}
				close_window();
				settings.yfunction(lp_custom_return); // use stored value in yfunction
			});
		}
		else {
			return;
		}

		// common style for buttons after they have been set
		$("#lp_dialog_window footer button").css({
			// default and unmoderatable values
			"width": 100,
			"height": 30,
			"background-size": "100% 100%",
			"background-repeat": "no-repeat",
			"border-width": 0,
			"cursor": "pointer",
			"position": "absolute",
			"bottom": 7,
			"background-color": (settings.colored_footer ? settings.footer_color : "transparent")
		});

		$("#lp_dialog_nbutton").css({
			// moderatable values
			"background-image": (settings.btnimg === "none" ? "none" : settings.nbtndiff ? "url('"+settings.nbtnimg+"')" : "url('"+settings.btnimg+"')"),
			"color": settings.btnfntcolor
		});

		$("#lp_dialog_ybutton").css({
			// moderatable values
			"background-image": (settings.btnimg === "none" ? "none" : "url('"+settings.btnimg+"')"),
			"color": settings.btnfntcolor
		});

		$("#lp_dialog_window").hvcenter();

		// common listeners for all dialog windows
		if(settings.exit_on_out_click) {
			$(".body_disabler").click(close_window);
		}

		$("#lp_dialog_window .lp_dialog_exit_button").click(close_window);

		// event listeners for the buttons
		$("#lp_dialog_nbutton").click(function() {
			close_window();
			settings.nfunction();
		});



		/**********helper functions**********/

		function close_window() {
			$("div[id^='lp_dialog_']").remove();
			$("body").disabler("enable");
		}

	};

})(jQuery);
