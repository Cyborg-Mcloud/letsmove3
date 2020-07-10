var old_tar_lat=0;
var old_tar_lng=0;
var true_compass=0;
var nogps=0;
var auto_sender=0;
var last_gps_time=0;

var MyMap;
var MyMarker;
var MyMarker_Circle;
var Target_marker;

var old_lat=0;
var old_lng=0;
var old_head=0;
var sent_lat=0;
var sent_lng=0;

var new_lat=0;
var new_lng=0;

var spd_lat=0;
var spd_lng=0;
var spd_steps=0;


var MyLat=41.7120788;
var MyLong=44.7491408;
var MyAlt;
var MyHead;
var MySpeed;
var MyAcc;


var cur_compass=0;
var avr_heading=0;
var avr_comp=0;
var avr_speed=0;
var compass_adjust=0;

var gps_delay=100000;
var nogps=0;
var auto_sender=0;
var last_gps_time=0;

var last_five_loc=new Array();
for (i=0;i<5;i++)
	{
	last_five_loc[i]=new Array();
	}
var cur_record=0;
var tot_records=0;

var maxq_compass=0;
var maxh_deviation=100;
var maxc_deviation=100;
var weusecompass=0;

var opts = { timeout: 3000, enableHighAccuracy: true, maximumAge:0, 	interval: 2000,	fastInterval: 1000};
function init_gps() {

	if (mdebug==1){console.log("device ready 2, getting position");}
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError, opts);
	
	watchID = navigator.geolocation.watchPosition(onSuccess, onError, opts);

//	watchId2 = cordova.plugins.locationServices.geolocation.watchPosition(onSuccess,onError,opts);

	if (weusecompass==1){
		if (window.DeviceOrientationAbsoluteEvent) {
			window.addEventListener("DeviceOrientationAbsoluteEvent", handleOrientation, true);
			} 
		else if(window.DeviceOrientationEvent){
			window.addEventListener("deviceorientation", handleOrientation, true);
		}
		MyMarker_compass.setVisible(true);
		if (mdebug==1){console.log("device orientation handle set");}
	} else {MyMarker_compass.setVisible(false);}
	//window.addEventListener("devicemotion", handleMotion, true);

}



	

var acc_set=0;
function handleMotion(event) {
	acc_set=1;
	
	var accx=parseInt(event.accelerationIncludingGravity.x*1000)/1000;
	var accy=parseInt(event.accelerationIncludingGravity.y*1000)/1000;
	var accz=parseInt(event.accelerationIncludingGravity.z*1000)/1000;

}


function handleOrientation(event) {
  var absolute = event.absolute;
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;


	if (typeof event.webkitCompassHeading !== "undefined") {
        alpha = event.webkitCompassHeading; //iOS non-standard
       
    }
	cur_compass=-parseInt(alpha);
	//if (cur_compass<0){cur_compass=360+cur_compass;}

	if (cur_compass<0){cur_compass=360+cur_compass;}

	true_compass=compass_adjust+cur_compass;
	if (true_compass>360){true_compass=true_compass-360;}
	if (true_compass<0){true_compass=true_compass+360;}


	var icon = MyMarker_compass.getIcon();
	icon.rotation =true_compass;
	MyMarker_compass.setIcon(icon);
}

function onSuccess(position) {
	if (mdebug==1){console.log("on GPS success");}
	
	
	var cur_delay=Date.now()-last_gps_time;
	
	document.getElementById("time_data").innerHTML=cur_delay;
	if (cur_delay>300){
		// tu validuri data-aa

		if (mdebug==1){console.log("gps_delay: "+cur_delay);}
		if (mdebug==1){console.log(position.coords.latitude + " / " + position.coords.longitude);}

		gps_delay=cur_delay;
		last_gps_time = Date.now();
		nogps=0;
		if (mdebug==1){document.getElementById("nogps").style.display="none";}

		new_lat=position.coords.latitude ;
		new_lng=position.coords.longitude ;
		MyAlt=position.coords.altitude ;
		MyHead=parseInt(position.coords.heading) ;
		MySpeed=position.coords.speed ;
		MyAcc=position.coords.accuracy;


		MySpeed=parseInt((MySpeed*36/10 )*1000)/1000;
		last_five_loc[cur_record]["lat"]=new_lat;
		last_five_loc[cur_record]["lng"]=new_lng;
		last_five_loc[cur_record]["speed"]=MySpeed;
		last_five_loc[cur_record]["heading"]=MyHead;
		last_five_loc[cur_record]["compass"]=cur_compass;
		last_five_loc[cur_record]["true_compass"]=true_compass;
	
		
		var delay_status=0;
		if (gps_delay<5000){
			if (mdebug==1){document.getElementById("gps_delay_info").innerHTML="LIVE";}
			delay_status=1;
		}
		else if (gps_delay<10000){
			if (mdebug==1){document.getElementById("gps_delay_info").innerHTML="LATE";}
			delay_status=2;
		}
		else {
			if (mdebug==1){document.getElementById("gps_delay_info").innerHTML="OLD";}
			delay_status=3;
		}

		last_five_loc[cur_record]["delay"]=delay_status;
		
	
		
		if (MySpeed>speed_limit){
			speed_limit_vis=1;
			document.getElementById("speed_limit_div").style.display="block";
			document.getElementById("speed_limit_text").innerHTML="SLOW DOWN!<Br><br>You are moving faster than 70 km/h speed limit!";
			document.getElementById("speed_limit_value").innerHTML=MySpeed+" km/h<BR><BR>"+( 15 - parseInt((Date.now()-speed_counter_start)/1000) )+" seconds before block";
			if (speed_counter_start==0){
				speed_counter_start=Date.now();
			} else {
				if (Date.now()-speed_counter_start>15000){
					var mdata="myid="+myid+ "&block=1";
					data_send("https://www.smartgps.ge/letsmove/api.php",mdata, true);
				}
			}
			
		} else if (speed_limit_vis==1){
			speed_limit_vis=0;
			document.getElementById("speed_limit_div").style.display="none";
		}
		

		if (mdebug==1){document.getElementById("gpsdata").innerHTML="Speed: "+MySpeed+"<br>Heading: "+MyHead;}

		if (old_lat!=new_lat || old_lng!=new_lng)
			{
			// ---------------  tu dafiqsirda gansxvavebuli koordinatebi
			if (mdebug==1){console.log("lat change to new "+cur_record+ " / "+tot_records);}
		
			var d = new Date();
			var new_coord_time=d.getTime();
			var calc_heading=0;
			if (tot_records>0)
				{
				spd_steps=parseInt((new_coord_time-last_coord_time)/100);
				if (spd_steps>10)
					{
					spd_steps=20;
					}
				if (spd_steps==0){spd_steps=1;	}

				spd_lat=(new_lat-MyLat)/spd_steps;
				spd_lng=(new_lng-MyLong)/spd_steps;
				
				if ( Math.abs(new_lat-MyLat)>0.00003 || Math.abs(new_lng -MyLong)>0.00003)
					{
					var iyr=new_lat-MyLat;
					var ixs=(new_lng-MyLong);
					
					if (iyr==0){iyr+=0.0001;}
					var kutxe=Math.atan(ixs/iyr)*360/6.28;
					if (iyr<0){kutxe+=180;}
					if (kutxe<0){kutxe=360+kutxe;}
					calc_heading=parseInt(kutxe);
					if (mdebug==1){console.log("calc_heading: "+calc_heading);}
					}
				if (mdebug==1){console.log("steps: "+spd_steps); document.getElementById("gps_delay_info").innerHTML+="<Br>calc:"+calc_heading;}
				}
			else
				{
				var myLatLng = {lat:  new_lat, lng: new_lng};
				MyMap.panTo(myLatLng);
				MyMap2.panTo(myLatLng);
				}
			if (tot_records>=5){
				work_averages();
				}
			if (mdebug==1){
			document.getElementById("gps_delay_info").innerHTML+="<Br>trcmps:"+true_compass+ " | "+avr_comp+"|"+compass_adjust;
			document.getElementById("gps_delay_info").innerHTML+="<Br>compass:"+cur_compass;
			document.getElementById("gpsdata").innerHTML+= " | "+avr_heading;}
			old_lat=new_lat;
			old_lng=new_lng;
			move_marker();
			
			last_five_loc[cur_record]["calc_heading"]=calc_heading;
	

			if ( Math.abs(new_lat-sent_lat)>0.00005 || Math.abs(new_lng -sent_lng)>0.00005)
				{
				sent_lng=new_lng;
				sent_lat=new_lat;
				send_data();
				}

			if (MyHead==0 || MyHead==null){
					if (calc_heading>0)	{
						MyMarker_pointer.setVisible(true);

						var icon = MyMarker_pointer.getIcon();
						icon.rotation =calc_heading;
						MyMarker_pointer.setIcon(icon);
					
					} else {
						MyMarker_pointer.setVisible(false);
					}
					
				
				}
			else if (old_head!=MyHead && MyHead!=null){
				MyMarker_pointer.setVisible(true);
				if (mdebug==1){console.log("true heading: "+MyHead);}

				var icon = MyMarker_pointer.getIcon();
				icon.rotation =MyHead;
				MyMarker_pointer.setIcon(icon);
				
				var icon = Myminimap_marker.getIcon();
				icon.rotation =MyHead;
				Myminimap_marker.setIcon(icon);
				
				
				old_head=MyHead;
			}
			last_coord_time= new_coord_time;
		}

	
		cur_record++;
		if (cur_record>4){cur_record=0;}
		if(tot_records<100){tot_records++;}

	}
}

var last_adj_time=0;
function work_averages(){
	if (mdebug==1){console.log("working on averages");}
	var che_x=0;
	var che_y=0;
	var cco_x=0;
	var cco_y=0;

	var heading_count=0;
	var compass_count=0;
	var maxq=0;

	var heading_deviation=0;
	var compass_deviation=0;

	var last_heading=0;
	var last_compass=0;

	var last_che_x=0;
	var last_che_y=0;

	var last_cco_x=0;
	var last_cco_y=0;

	for (i=0;i<5;i++){
		if ( last_five_loc[i]["heading"]>0){
			// zusti lokacia
			che_x+=Math.sin(last_five_loc[i]["heading"]*6.28/360);
			che_y+=Math.cos(last_five_loc[i]["heading"]*6.28/360);
			
			if (last_heading>0){
				divx=Math.abs(last_che_x-che_x);
				divy=Math.abs(last_che_y-che_y);
				if ((divx+divy)>heading_deviation){
					heading_deviation=divx+divy;
				}
			}

			last_che_x=Math.sin(last_five_loc[i]["heading"]*6.28/360);
			last_che_y=Math.cos(last_five_loc[i]["heading"]*6.28/360);
			last_heading=last_five_loc[i]["heading"];

			heading_count++;
			maxq+=2;
		} else if (last_five_loc[i]["calc_heading"]!=0){
			// arazustia
			che_x+=Math.sin(last_five_loc[i]["calc_heading"]*6.28/360);
			che_y+=Math.cos(last_five_loc[i]["calc_heading"]*6.28/360);
			if (last_heading>0){
				divx=Math.abs(last_che_x-che_x);
				divy=Math.abs(last_che_y-che_y);
				if ((divx+divy)>heading_deviation){
					heading_deviation=divx+divy;
				}
			}
			last_che_x=Math.sin(last_five_loc[i]["calc_heading"]*6.28/360);
			last_che_y=Math.cos(last_five_loc[i]["calc_heading"]*6.28/360);
			last_heading=last_five_loc[i]["calc_heading"];
			heading_count++;
			maxq++;
		}
	
		cco_x+=Math.sin(last_five_loc[i]["compass"]*6.28/360);
		cco_y+=Math.cos(last_five_loc[i]["compass"]*6.28/360);

		if (last_compass>0){
			divx=Math.abs(last_cco_x-cco_x);
			divy=Math.abs(last_cco_y-cco_y);
			if ((divx+divy)>compass_deviation){
				compass_deviation=divx+divy;
			}
		}
		last_cco_x=Math.sin(last_five_loc[i]["compass"]*6.28/360);
		last_cco_y=Math.cos(last_five_loc[i]["compass"]*6.28/360);
		last_compass=last_five_loc[i]["compass"];
	}
	cco_x=cco_x/5;
	cco_y=cco_y/5;
	if (cco_y==0){cco_y+=0.0001;}
	avr_comp=Math.atan(cco_x/cco_y)*360/6.28;
	if (cco_y<0){avr_comp+=180;}
	if (avr_comp<0){avr_comp=360+avr_comp;}
	avr_comp=parseInt(avr_comp);
	if (mdebug==1){console.log("Avr_comp: "+avr_comp);}

	if (heading_count>0){

		if (maxc_deviation>=compass_deviation && compass_deviation>0){
			maxq++;
			maxc_deviation=compass_deviation;
			if (mdebug==1){console.log("better comp deviation: "+maxc_deviation);}
		}
		che_x=che_x/heading_count;
		che_y=che_y/heading_count;

		if (che_y==0){che_y+=0.0001;}
		avr_heading=Math.atan(che_x/che_y)*360/6.28;
		if (che_y<0){avr_heading+=180;}
		if (avr_heading<0){avr_heading=360+avr_heading;}
		avr_heading=parseInt(avr_heading);
		if (mdebug==1){console.log("avr_heading: "+avr_heading);}

		if (maxh_deviation>=heading_deviation && heading_deviation>0){
			maxq++;
			maxh_deviation=heading_deviation;
			if (mdebug==1){console.log("better heading deviation: "+maxh_deviation);}
		}

		if (maxq>=maxq_compass || (Date.now()-last_adj_time)> 60 * 1000  ){
			last_adj_time=Date.now();
			compass_adjust=avr_heading-avr_comp;
			maxq_compass=maxq;
			if (mdebug==1){console.log("comp_adjust: "+compass_adjust);
				console.log("quality: "+maxq_compass);}
			if (compass_adjust<0){compass_adjust+=360;}
			setCookie("compass_adjust", compass_adjust, 365);
		}

		
	}
	

}
function move_marker()
	{

	MyLat=MyLat+spd_lat;
	MyLong=MyLong+spd_lng;

	
	if (spd_steps>0)
		{
		var myLatLng = {lat:  MyLat, lng: MyLong};
		MyMarker.setPosition(myLatLng);
		MyMarker_pointer.setPosition(myLatLng);
		Myminimap_marker.setPosition(myLatLng);
		if (weusecompass==1){
			MyMarker_compass.setPosition(myLatLng);
		}
		MyMap2.panTo(myLatLng);
	
		spd_steps--;
		setTimeout("move_marker();",50);
		}
	else
		{
		MyLat=new_lat;
		MyLong=new_lng;

		var myLatLng = {lat:  MyLat, lng: MyLong};
		MyMarker.setPosition(myLatLng);
		MyMarker_pointer.setPosition(myLatLng);
		Myminimap_marker.setPosition(myLatLng);
		MyMarker_compass.setPosition(myLatLng);
		MyMap2.panTo(myLatLng);
		if (mdebug==1){console.log("move marker");}
		spd_steps--;

		}
	}


function send_data()
	{
	data_send('https://www.smartgps.ge/letsmove/api.php', "update_lat=1&lat="+MyLat+"&lng="+MyLong+"&cur_game_mode="+curgametype);	

	//console.log("update lat: "+url);
	
	if (auto_sender==0)
		{
		auto_sender=1;
		setTimeout("data_sender_loop();",30000);
		}
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError, opts);
	}

function data_sender_loop()
	{
		auto_sender=1;
	send_data();

	setTimeout("data_sender_loop();",30000);
	}



function onError(error)
	{
	if (mdebug==1){console.log("error getting location ");
	console.log(error);}
	nogps++;
	if (nogps>0)
		{
		document.getElementById("nogps").style.display="block";
		document.getElementById("nogps").innerHTML="GPS";
		}
	var error_str="ვერ ხერხდება ლოკაციის მიღება";
	
	switch(error.code) {
	   case error.PERMISSION_DENIED:
		   error_str+="<BR>გთხოვთ დაუშვათ ლოკაცია";
		   break;
	   case error.POSITION_UNAVAILABLE:
		   error_str+= "<BR>ლოკაცია მიუწვდომელია";
		   break;
	   case error.TIMEOUT:
		   error_str+= "<BR>ლოკაციის მოთხოვნას ვადა გაუვიდა";
		   navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout: 3000, enableHighAccuracy: true,  maximumAge:0});
		   break;
	   case error.UNKNOWN_ERROR:
		   error_str+="<BR>უცნობი ლოკაციის მოთხოვნის პრობლემა";
		   break;
		   }
		   if (iamweb==0){ advanced_start();}
		  
	if (mdebug==1){document.getElementById("nogps").innerHTML=error_str;
   document.getElementById("infodiv").innerHTML=error_str;
   console.log("ლოკაციის ერორი: "+error_str);}
    

	}

function force_req_gps(){
	navigator.geolocation.getCurrentPosition(onSuccess, onError, opts);
	setTimeout("force_req_gps();",3000);
}

