
 var last = {time : new Date(),   
    x    : -100,          
    y    : -100};         
var period = 100; 
var space  = 2;   
         

var t_circle=new Array();
var minimap_circle=new Array();
var types_open=0;
var curgametype=2;
var speed_limit_vis=0;
var speed_counter_start=0;


function leader_close()
	{
	document.getElementById("leaderboard").style.display="none";
	lboard_vis=0;	
	}

function small_grats_close()
	{
	document.getElementById("small_grats_div").style.display="none";
	mapset(2);
	}

function grats_close()
	{
	document.getElementById("grats_div").style.display="none";
	document.getElementById("leaderboard").style.display="block";
	lboard_vis=1;
	show_leaders();
	}

function show_game_menu()
	{
	document.getElementById("game_menu").style.display="block";
	}

function change_game_mode(newmode)
	{
	curgametype=newmode;
	players=[];
	targets=[];
	draw_targets();
	send_data();
	players=[];
	targets=[];
	document.getElementById("pinfo").innerHTML="";
	document.getElementById("zeda_bar").src='images/zeda_bar_'+newmode+".png";

	document.getElementById("game_menu").style.display="none";
	if (iamweb==0){
		window.plugins.insomnia.keepAwake();
	}
	setTimeout("mapset(2);",300);
	}


function back_to_home()	{
	
	players=[];
	targets=[];
	draw_targets();
	Target_marker.setVisible(false);
	t_circle[0].setOptions({strokeOpacity:0});
	document.getElementById("game_menu").style.display="block";
	if (iamweb==0){
		window.plugins.insomnia.allowSleepAgain();
	}
}
function open_types(seltype)
	{
	if (types_open==0)
		{
		document.getElementById("ptichka").style.display="none";
		document.getElementById("types_div").style.right="-10px";
		document.getElementById("type_time_attack").style.left="25px";
		document.getElementById("type_campaign").style.left="85px";		
		types_open=1;
		}
	else if (types_open==1)
		{
		document.getElementById("types_div").style.right="-70px";
		document.getElementById("ptichka").style.display="inline";
		if (seltype==1)
			{
			document.getElementById("type_time_attack").style.left="25px";
			document.getElementById("type_campaign").style.left="85px";
			}
		else if(seltype==2)
			{
			document.getElementById("type_campaign").style.left="25px";
			document.getElementById("type_time_attack").style.left="85px";
			}
		curgametype=seltype;
		send_data();
		types_open=0;
		
		}
	
	}

	
function hide_data(){
	document.getElementById("acc_data").style.display="none";
}

function show_data(){
	document.getElementById("acc_data").style.display="block";
}



function show_screen(scrname) {
	if (scrname!=cur_screen) {
		document.getElementById("login_screen").style.display="none";
		document.getElementById("loading_screen").style.display="none";
		document.getElementById("profile_screen").style.display="none";
		document.getElementById("home_screen").style.display="none";
		document.getElementById("leaderboard_screen").style.display="none";
		document.getElementById("support_screen").style.display="none";
		document.getElementById("blocked_screen").style.display="none";
		document.getElementById("terms_screen").style.display="none";
		document.getElementById("weekly_screen").style.display="none";
        document.getElementById("referals_screen").style.display="none";
		document.getElementById("forgotten_screen").style.display="none";
		document.getElementById("prof_password").style.display="none";
		if (scrname=="login") {
			document.getElementById("login_screen").style.display="block";
			document.getElementById("login_logo").style.display="inline-block";
		} else if (scrname=="home") {
			document.getElementById("home_screen").style.display="block";
		} else if (scrname=="profile") {
			document.getElementById("profile_screen").style.display="block";
			request_mydata();
		} else if (scrname=="leaderboard") {
			document.getElementById("leaderboard_screen").style.display="block";
		} else if (scrname=="support") {
			document.getElementById("support_screen").style.display="block";
		} else if (scrname=="blocked") {
			document.getElementById("blocked_screen").style.display="block";
		} else if (scrname=="terms") {
			document.getElementById("terms_screen").style.display="block";
		} else if (scrname=="weekly") {
			document.getElementById("weekly_screen").style.display="block";
		} else if (scrname=="referals") {
			document.getElementById("referals_screen").style.display="block";
		} else if (scrname=="forgotten") {
			document.getElementById("forgotten_screen").style.display="block";
		}
		cur_screen=scrname;
	}

}

function open_referals(){
	show_screen("referals");
	var mdata="referals=1";
	data_send("https://www.smartgps.ge/letsmove/api.php",mdata, false);
}

function show_change_pass(){
	document.getElementById("prof_password").style.display="block";
	document.getElementById("login_logo").style.display="inline-block";
	document.getElementById("prof_edit").style.display="none";
	document.getElementById("prof_logo").style.display="none";
	document.getElementById("langli").style.display="none";
	document.getElementById("prof_main").style.display="none";
	document.getElementById("footer").style.background="#2b2c4d";

}

function show_edit(){
	document.getElementById("login_logo").style.display="inline-block";
	document.getElementById("prof_edit").style.display="block";
	document.getElementById("prof_logo").style.display="none";
	document.getElementById("langli").style.display="none";
	document.getElementById("prof_main").style.display="none";
	document.getElementById("footer").style.background="#2b2c4d";
	document.getElementById("prof_password").style.display="none";

	var link = document.getElementById("pop_left_prof");
	link.setAttribute("onclick", "Javascript: hide_edit();");
}
function hide_edit()	{
	document.getElementById("login_logo").style.display="none";
	document.getElementById("prof_edit").style.display="none";
	document.getElementById("langli").style.display="inline-block";
	document.getElementById("prof_logo").style.display="inline-block";
	document.getElementById("prof_main").style.display="inline-block";
	document.getElementById("footer").style.background="#3e406a";
	document.getElementById("prof_password").style.display="none";
	var link = document.getElementById("pop_left_prof");
	link.setAttribute("onclick", "Javascript: show_screen('home');");
}

function show_leaderboard(){
	var mdata="leaderboard=1";
	data_send("https://www.smartgps.ge/letsmove/api.php",mdata, true);
        
	show_screen("leaderboard");
}


function copy_referal(){
	var copyText = document.getElementById("prof_referal");
	copyText.select();
	copyText.setSelectionRange(0, 99999); /*For mobile devices*/
	document.execCommand("copy");
}
var win;

function open_subscribe(){
	win=window.open( "https://smartgps.ge/letsmove/pay.php?myid="+myid, '_blank', 'location=yes, clearcache=yes');
}

function show_weekly(){

	show_screen("weekly");
	var mdata="weekly=1";
	data_send("https://www.smartgps.ge/letsmove/api.php",mdata, false);
}

 