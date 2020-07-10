var just_latlng = {lat: 0, lng:0};
var MyMarker;
var MyMap;
var MyMap2;
var geocoder;
var infowindow;
var firststart=1;

var micon;
var SelLat=0;
var SelLng=0;
var logo_icon;

 
function mapset(cursel)
	{
	var bounds;
	if (cursel==1)
		{
		var myLatLng = {lat:  MyLat, lng: MyLong};
		MyMap.panTo(myLatLng);
		MyMap.setZoom(17);
		}
	else if (cursel==2)
		{
		var myLatLng = {lat:  MyLat, lng: MyLong};
		bounds = new google.maps.LatLngBounds();
		bounds.extend(myLatLng);
		if (targets.length>0)
			{
			var myLatLng =  {lat: parseFloat(targets[0]["lat"]), lng: parseFloat(targets[0]["lng"])};
			bounds.extend(myLatLng);
			MyMap.fitBounds(bounds);
			}
		
		}
	else if (cursel==3)
		{
		if (targets.length>0)
			{
			var myLatLng = {lat:  parseFloat(targets[0]["lat"]), lng: parseFloat(targets[0]["lng"])};
			MyMap.panTo(myLatLng);
			}
		MyMap.setZoom(15);
		}
	}


 function throttle_events(event) {
          var now = new Date();
          var distance = Math.sqrt(Math.pow(event.clientX - last.x, 2) + Math.pow(event.clientY - last.y, 2));
          var time = now.getTime() - last.time.getTime();
          if (distance * time < space * period) {    //event arrived too soon or mouse moved too little or both
              console.log("event stopped");
              if (event.stopPropagation) { // W3C/addEventListener()
                  event.stopPropagation();
              } else { // Older IE.
                  event.cancelBubble = true;
              };
          } else {
              console.log("event allowed: " + now.getTime());
              last.time = now;
              last.x    = event.clientX;
              last.y    = event.clientY;
          };
      };

function initMap()
	{
	if (MyLat<30)
		{
		MyLat=41.718287;
		MyLong=44.778728;
		}
	var myLatLng = {lat: MyLat, lng: MyLong};

	MyMap = new google.maps.Map(document.getElementById('mymap'), {
		zoom: 17,
		center: myLatLng,
		//mapTypeId: 'satellite',
		disableDefaultUI: true,
			gestureHandling: 'greedy',
//			{"stylers": [ { "visibility": "simplified" },   { "saturation": -100 }  ] },
		zIndex:70,
			styles:[

           
			 {elementType: 'labels.text.stroke', stylers: [{visibility: 'off'}]},

			{featureType: 'administrative', stylers: [{visibility: 'off'}]},
            {featureType: 'poi',stylers: [{visibility: 'off'}]},
			{featureType: 'poi.business', stylers: [{visibility: 'off'}]},
			{featureType: 'transit', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
            {featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{color: '#d59563',visibility: 'off'}]}
			],
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		});

//document.getElementById('mymap').addEventListener("mousemove", throttle_events, true);
//document.getElementById('mymap').addEventListener("touchmove", throttle_events, true);

	MyMap2 = new google.maps.Map(document.getElementById('mymap2'), {
		draggableCursor: 'default',
		zoom: 14,
		center: myLatLng,
		mapTypeId: 'satellite',
		disableDefaultUI: true,
		zIndex:101,
		panControl: false,
		draggable: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		backgroundColor: 'none',
			styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{visibility: 'off'}]},
            {elementType: 'labels.text.fill', stylers: [{visibility: 'off'}]},
			{featureType: 'poi.business', stylers: [{visibility: 'off'}]},
			{featureType: 'transit', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
            {featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{color: '#d59563',visibility: 'off'}]},
            {featureType: 'poi', elementType: 'labels.text.fill', stylers: [{color: '#d59563',visibility: 'off'}]},
            {featureType: 'poi.park', elementType: 'geometry', stylers: [{color: '#263c3f',visibility: 'off'}]},
            {featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{color: '#6b9a76',visibility: 'off'}]},
            {featureType: 'road', elementType: 'geometry', stylers: [{color: '#38414e'}]},
            {featureType: 'road', elementType: 'geometry.stroke', stylers: [{color: '#212a37'}]},
            {featureType: 'road', elementType: 'labels.text.fill', stylers: [{color: '#9ca5b3',visibility: 'off'}]},
            {featureType: 'road.highway', elementType: 'geometry', stylers: [{color: '#746855'}]},
            {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#1f2835'}]},
            {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{visibility: 'off'}]},
            {featureType: 'transit', elementType: 'geometry', stylers: [{color: '#2f3948'}]},
            {featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{color: '#d59563',visibility: 'off'}]},
            {featureType: 'water', elementType: 'geometry', stylers: [{color: '#17263c'}]},
            {featureType: 'water', elementType: 'labels.text.fill', stylers: [{color: '#515c6d'}]},
            {featureType: 'water', elementType: 'labels.text.stroke', stylers: [{color: '#17263c',visibility: 'off'}]}
          ]


		});

//google.maps.SymbolPath.CIRCLE 	
//google.maps.SymbolPath.BACKWARD_CLOSED_ARROW 	
//google.maps.SymbolPath.FORWARD_CLOSED_ARROW 		
//google.maps.SymbolPath.BACKWARD_OPEN_ARROW 	
//google.maps.SymbolPath.FORWARD_OPEN_ARROW

	geocoder = new google.maps.Geocoder;
	infowindow = new google.maps.InfoWindow;


	ciricon={
			path: google.maps.SymbolPath.CIRCLE,
			fillColor: '#4c59a6',
			strokeColor: '#4c59a6',
			strokeWeight: 7,
			scale: 5
			}
	ciricon2={
			path: google.maps.SymbolPath.CIRCLE,
			fillColor: '#FFFFFF',

			 fillOpacity: 1,
			strokeColor: '#FFFFFF',
			strokeWeight: 2,
			scale: 2
			}



	MyMarker_Circle = new google.maps.Marker({
			  position: just_latlng,
			  map: MyMap,
			 icon: ciricon,
			  animation: google.maps.Animation.DROP,
			});
	

	
	target_icon = {
		url: "https://smartgps.ge/letsmove2/images/marker_target_"+curgametype+".png", 
		scaledSize: new google.maps.Size(60, 60),
		origin: new google.maps.Point(0,0), 
		anchor: new google.maps.Point(30, 30),  
		labelOrigin: new google.maps.Point(0,40)
		};

	logo_icon = {
		url: "https://smartgps.ge/letsmove2/images/Logo.png", 
		scaledSize: new google.maps.Size(45, 55),
		origin: new google.maps.Point(0,0), 
		anchor: new google.maps.Point(21, 55),  
		labelOrigin: new google.maps.Point(0,40)
		};
	micon = {
		url: "https://smartgps.ge/letsmove2/images/car_icon.png", 
		scaledSize: new google.maps.Size(32, 38),
		origin: new google.maps.Point(0,0), 
		anchor: new google.maps.Point(16, 38),  
		labelOrigin: new google.maps.Point(16,45)
		};
	
	myicon = {
		url: "https://smartgps.ge/letsmove2/images/myself_"+curgametype+".png", 
		scaledSize: new google.maps.Size(60, 60),
		origin: new google.maps.Point(0,0), 
		anchor: new google.maps.Point(30, 30),  
		labelOrigin: new google.maps.Point(0,30)
		};

	MyMarker = new google.maps.Marker({
		position: myLatLng,
		map: MyMap,
		icon: myicon,
		draggable: false,
		animation: google.maps.Animation.DROP,

	//	label: {text: "", color: "red", fontSize: '16px'}
		zIndex:105,
		});

	logo_marker = new google.maps.Marker({
		position: just_latlng,
		map: MyMap,
		icon: logo_icon,
		draggable: false,
		animation: google.maps.Animation.DROP,

	//	label: {text: "", color: "red", fontSize: '16px'}
		zIndex:105,
		});

	Target_marker = new google.maps.Marker({
		position: just_latlng,
		map: MyMap,
		icon: target_icon,
		draggable: false,
		animation: google.maps.Animation.DROP,
		zIndex:105,
		});

	MyMarker_pointer = new google.maps.Marker({
		position: myLatLng,
		map: MyMap,
		icon: {
		path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW, fillOpacity: 0.8, fillColor: '#205690', scale: 4, strokeColor: '#205690', strokeWeight: 1},
		zIndex:103,
		draggable: false,
		animation: google.maps.Animation.DROP,

	//	label: {text: "", color: "red", fontSize: '16px'}
		
		});

	
	MyMarker_compass = new google.maps.Marker({
		position: myLatLng,
		map: MyMap,
		icon: {
		path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW, fillOpacity: 0, fillColor: 'red', scale: 4, strokeColor: 'red', strokeWeight: 1},
		zIndex:103,
		draggable: false,
		animation: google.maps.Animation.DROP,

	//	label: {text: "", color: "red", fontSize: '16px'}
		
		});
		MyMarker_pointer.setVisible(false);
		MyMarker_compass.setVisible(false);
	
		Myminimap_marker = new google.maps.Marker({
		position: myLatLng,
		map: MyMap2,
		icon: {
		path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW , fillOpacity: 0.8, fillColor: 'white', scale: 2, strokeColor: 'white', strokeWeight: 1},
		zIndex:103,
		draggable: false,
		animation: google.maps.Animation.DROP,
draggableCursor: 'default',
	//	label: {text: "", color: "red", fontSize: '16px'}
		
		});

	   MyMap.addListener( 'click', function(event) {
			clicked=1;

			map1_click(event.latLng);
        });

	   MyMap2.addListener( 'click', function(event) {
			clicked=1;
			map2_click(event.latLng);
        });

		Myminimap_marker.addListener( 'click', function(event) {
			clicked=1;
			map2_click(event.latLng);
        });
//MyMarker.setAnimation(google.maps.Animation.BOUNCE);


for (i=0;i<20 ;i++ )
		{
		tcolor='#FF0000';
		t_circle[i] = new google.maps.Circle({
			strokeColor: tcolor,
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillOpacity: 0,
			map: MyMap,
			center: just_latlng,
			radius: 100,
				animation: google.maps.Animation.DROP
		  });

		minimap_circle[i] = new google.maps.Marker({
			  position: just_latlng,
			  map: MyMap2,
			  icon: ciricon2,
			  animation: google.maps.Animation.DROP,
			});
		
		
		}
	firststart=0;
	}

function geocodeLatLng(latlng) 
	{
//        var latlng = {lat: SelLat, lng: SelLong};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
         //     map.setZoom(11);
       //       var marker = new google.maps.Marker({
         //       position: latlng,
           //     map: map
             // });
			 if (clicked==1)
			 {
			document.getElementById("addr").value=results[0].formatted_address;
			 }

			


              infowindow.setContent(results[0].formatted_address);
              infowindow.open(MyMap, MyMarker);

            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }

var clicked=0;
function map1_click(mloc)
	{
//	MyMarker.setPosition(mloc);
	if (mouse_coords>0 && uid==1)
		{
		new_lat=mloc.lat();
		new_lng=mloc.lng();
		onSuccess(mloc);

		}
	MyMap.panTo(mloc);

//	MyMap2.panTo(myLatLng);
	//document.getElementById("mlat").value=SelLat;
	//document.getElementById("mlng").value=SelLong;


//	 geocodeLatLng(mloc);

	}

function map2_click(mloc)
	{
//	MyMarker.setPosition(mloc);
	MyMap.panTo(mloc);

//	MyMap2.panTo(myLatLng);
	//document.getElementById("mlat").value=SelLat;
	//document.getElementById("mlng").value=SelLong;


//	 geocodeLatLng(mloc);

	}
 
	
