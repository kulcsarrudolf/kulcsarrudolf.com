function _(id){ return document.getElementById(id); }
function submitForm(){

	--alert("ez meghívódik");

	_("send").disabled = true;
	_("status").innerHTML = 'please wait ...';
	var formdata = new FormData();
	formdata.append( "name", _("name").value );
	formdata.append( "email", _("email").value );
    // formdata.append( "tel", _("tel").value );
    formdata.append( "message", _("message").value );
	var ajax = new XMLHttpRequest();
	ajax.open( "POST", "contact/contact.php" );
	ajax.onreadystatechange = function() {
		if(ajax.readyState == 4 && ajax.status == 200) {
			if(ajax.responseText == "success"){
				_("contact_form").innerHTML = '<h2>Thanks '+_("n").value+', your message has been sent.</h2>';
			} else {
				_("status").innerHTML = ajax.responseText;
				_("send").disabled = false;
			}
		}
	}
	ajax.send( formdata );
}