var fblogged=0;

function myreg(){
	console.log("fb reg: aq var2");
	facebookConnectPlugin.login(["public_profile", "email"], fbregSuccess, fberror );
		 
}

function forgotten(){

	show_screen("forgotten");
}

function restore_forgotten(){
	var mdata="forgotten=1&email="+document.getElementById("forgot_email").value;
	data_send("https://www.smartgps.ge/letsmove/api.php",mdata, true);
	alert("please check your email for new password");
	show_screen("login");
}
function logout(){
	eraseCookie("uid");
	mylogout();
	var mdata="logout=1";
	data_send("https://www.smartgps.ge/letsmove/api.php",mdata, true);
	//setTimeout("location.reload();",500);
	fbid=0;
	uid=0;
	
	show_screen("login");
}

function new_pass(){
	if(document.getElementById("new_pass").value!=""){
		if (document.getElementById("new_pass").value==document.getElementById("new_pass1").value){
			var mdata="new_pass="+document.getElementById("new_pass").value;
			data_send("https://www.smartgps.ge/letsmove/api.php",mdata, true);
		} else {alert("passwords don't match");}
	}else{alert("password can not be blank");}
	

}

function fbregdatasuccess(response){
	
	console.log(response);
	console.log(response.id + " | " + response.name + " | " + response.email + " | ");
	fbid=response.id;
	email=response.email;
	document.getElementById("fbid").value=response.id;
	document.getElementById("reg_uname").value=response.name;
	document.getElementById("reg_email").value=response.email;
	//document.getElementById("reg_pass1").style.display="none";
	//document.getElementById("reg_pass2").style.display="none";
	//document.getElementById("fbregbut").style.display="none";
	
	var mdata="login=1&reg=1&fbid="+fbid + "&referal="+document.getElementById("referal").value + "&reg_pass2="+document.getElementById("reg_pass2").value + "&reg_uname="+document.getElementById("reg_uname").value  + "&reg_email="+document.getElementById("reg_email").value + "&reg_pass1="+ document.getElementById("reg_pass1").value;
	
	data_send("https://www.smartgps.ge/letsmove/api.php",mdata, false);
		
	
}

function save_profile(){
	

	if (document.getElementById("prof_uname").value!="" && document.getElementById("prof_email").value!=""){

		
		var mdata="mydata=1&save_me=1&prof_uname="+document.getElementById("prof_uname").value  + "&prof_email="+document.getElementById("prof_email").value+ "&prof_tel="+document.getElementById("prof_tel").value;
		
		data_send("https://www.smartgps.ge/letsmove/api.php",mdata, false);
		alert("profile data saved");
		hide_edit();
	}else{alert("email and username can not be blank");}
	

}

function fbregSuccess(userData) {
	if (mdebug==1){console.log(userData);}
	if (userData["status"]=="connected"){
		fblogged=1;
		facebookConnectPlugin.api("/me?fields=id,name,email", ["public_profile", "email"], fbregdatasuccess, fberror);
	}

}

function fbdatasuccess(response){
	console.log(response);
	console.log(response.id + " | " + response.name + " | " + response.email + " | ");
	fbid=response.id;
	email=response.email;
	document.getElementById("email").value=email;

	var mdata="login=1&fblogin=1&email="+email + "&fbid="+ fbid;
	data_send("https://www.smartgps.ge/letsmove/api.php",mdata, false);
        
	
}

function fbLoginSuccess(userData) {
	if (mdebug==1){console.log(userData);}
	if (userData["status"]=="connected"){
		fblogged=1;
		facebookConnectPlugin.api("/me?fields=id,name,email", ["public_profile", "email"], fbdatasuccess, fberror);
	}
	
}
	  
function mylogin(){
	console.log("fb login, aq var");

	facebookConnectPlugin.login(["public_profile", "email"], fbLoginSuccess, fberror );
}

function mylogout()
	{

	if (iamweb==0)
		{
		facebookConnectPlugin.logout(fblogoutsuccess,fberror);
		
	}

	}
		  

function fblogoutsuccess() {
	console.log("fb logged out");
	fblogged=0;
	fbid=0;
	}
function fberror(response){
	console.log("fb error");
	console.log(response);
}




var hideKeyboard = function() 
{  document.activeElement.blur(); 
var inputs = document.querySelectorAll('input');  for(var i=0; i < inputs.length; i++) {   inputs[i].blur();  } };

function send_login_info(){
	var mdata="login=1&logme=1&email="+document.getElementById("email").value + "&pass="+ document.getElementById("pass").value;
	data_send("https://www.smartgps.ge/letsmove/api.php",mdata, false);
        
}

function send_reg_info(){
	//+ "&reg_tel="+document.getElementById("reg_tel").value
	var mdata="login=1&reg=1&fbid="+document.getElementById("fbid").value + "&referal="+document.getElementById("referal").value + "&reg_pass2="+document.getElementById("reg_pass2").value + "&reg_uname="+document.getElementById("reg_uname").value  + "&reg_email="+document.getElementById("reg_email").value + "&reg_pass1="+ document.getElementById("reg_pass1").value;
	
	data_send("https://www.smartgps.ge/letsmove/api.php",mdata, false);
}

function signin()
	{
	//document.getElementById("loginForm").submit();
	if (document.getElementById("email").value=='' || document.getElementById("pass").value=='')
		{	
		alert("Both fields are required!");
		}
	else
		{
		send_login_info();
		}
	}

function checkregform()
	{
	//|| document.getElementById("reg_tel").value=='' 
	if (document.getElementById("reg_uname").value=='' || document.getElementById("reg_email").value=='' ||  document.getElementById("reg_pass1").value==''  )
		{	
	
		alert("All Fields are Required!");
	
	
		

		}
	else
		{
        //document.getElementById("registerForm").submit();
        send_reg_info();

	

		}

	}
function show_terms(){
	var mdata="terms=1";
	data_send("https://www.smartgps.ge/letsmove/api.php",mdata, false );
	show_screen("terms");
}

function check_reg() {
	if (document.getElementById("term_cond").checked==true){
		//|| document.getElementById("reg_tel").value==''
		if (document.getElementById("reg_uname").value=='' || document.getElementById("reg_email").value=='' ||  document.getElementById("reg_pass1").value==''   ) {	
			console.log(document.getElementById("reg_uname").value + " | "+ document.getElementById("reg_email").value + " | "+ document.getElementById("reg_pass1").value   );
			
			alert("All Fields are Required! ");
		} else {
			send_reg_info();
		}
	} else {
		alert("You must accept agreement");
	}

}

function show_login()
	{
	document.getElementById("logindiv").style.display="block";
	document.getElementById("regdiv").style.display="none";
	document.getElementById("login_logo").style.height="200px";
	}
function show_reg()
	{
	document.getElementById("logindiv").style.display="none";
	document.getElementById("regdiv").style.display="block";
	document.getElementById("login_logo").style.height="180px";
	}

function cade(){
	console.log(document.getElementById("reg_uname").value + " | "+ document.getElementById("reg_email").value + " | "+ document.getElementById("reg_pass1").value   );
}

