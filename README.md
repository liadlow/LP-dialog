LP-dialog
=========

A jQuery plugin for dialog windows.

LP-dialog provides 3 functions:
- dialog, which is the main one and creates a dialog window
- disabler, which disables a defined area
- hvcenter, which centers an element horizontally and vertically either relevant to its parent or the window

How to use
----------

In order to use LP-dialog you just have to download the source code and include it in your html code 
AFTER the jquery script tag
```html
<script type='text/javascript' src='path/to/lp_dialog.js'></script>
```
Make sure that you also have the images folder in the same directory for the plugin to work properly

Examples
--------

hvcenter:
```
<head>
  <!--add jquery and LP-dialog script-->
  <script>$(document).ready(function(){$("table").hvcenter("window")});</script>
</head>
<body>
  <table>
    <tr><td>Username:</td><td><input type="text" name="username"/></td></tr>
	  <tr><td>Password:</td><td><input type="password" name="pwd"/></td></tr>
	  <tr><td><input type="submit" name="login" value="Login"/></td></tr>
  </table>
</body>
```

disabler:
```javascript
$("body").disabler("disable", {canscroll: false});
```

dialog:
- alert:

        $.lp_dialog("alert", "I am an example of LP-dialog :)");

- confirm:

        $.lp_dialog("confirm", "Will you use LP-dialog?", {yfunction: function(){var happy = true}, nfunction: function(){var happy = false}});

- prompt:

        $.lp_dialog("prompt", "Enter your favorite movie", {placeholder: "Lord of the Rings", yfunction: function(answer){var favmovie = answer;}});

- custom:

        $.lp_dialog("custom", "Add your homepage:<input type='url' name='homepage'><select multiple><option value='volvo'>Volvo</option><option value='saab'>Saab</option><option value='mercedes'>Mercedes</option><option value='audi'>Audi</option></select><br><input type='checkbox' name='vehicle' value='Bike'> I have a bike<br><input type='checkbox' name='vehicle' value='Car'> I have a car<br><input type='radio' name='sex' value='male'>Male<br><input type='radio' name='sex' value='female'>Female", {yfunction: function(returnval){}});
        
