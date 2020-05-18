
(function(){
    
    //create map in leaflet and tie it to the div called 'theMap'
    var map = L.map('theMap').setView([44.650627, -63.597140], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    // L.marker([44.650690, -63.596537]).addTo(map)
    //     .bindPopup('This is a sample popup. You can put any html structure in this including extra bus data. You can also swap this icon out for a custom icon. A png file has been provided for you to use if you wish.')
    //     .openPopup();
  
    var url ='https://hrmbuses.herokuapp.com/';
   
    var layer;
   function routeMap(){
    
    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        console.log(json);
        if(layer){
            map.removeLayer(layer);
        }
        
        let myArray = json.entity.filter(function(result){ return result.vehicle.trip.routeId <10 || result.vehicle.trip.routeId ==="9A"|| result.vehicle.trip.routeId ==="9B"});
        
        myArray = myArray.map(function(result)
        {
                return{
                "type": "Feature",
                "properties": {
                    "RouteID": result.vehicle.trip.routeId,
                    "TripID":result.vehicle.trip.tripId,
                    "BusNo" : result.vehicle.vehicle.id,
                    "BusLevel": result.vehicle.vehicle.label,
                    "longitude":result.vehicle.position.longitude,
                    "latitude":result.vehicle.position.latitude,
                    "bearing":result.vehicle.position.bearing

                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        result.vehicle.position.longitude,
                        result.vehicle.position.latitude]
                }
            }
            
        });

        let FeatureCollection= 
        {
            type : "FeatureCollection",
            features : myArray 
        };
        console.log(FeatureCollection);

        var busIcon = L.icon({
            iconUrl:'bus.png',
            iconSize:[30,30],
            iconAnchor:[15,15],
            popupAnchor:[0,-30]
        });

        
        layer = L.geoJson(FeatureCollection,{
            style : function(Feature){
                return{
                    colour: '#000',
                    weight:0.5
                }
            },
            pointToLayer: function(geoJsonPoint, latlng){
                return L.marker(latlng,{
                    icon: busIcon, 
                    rotationAngle: geoJsonPoint.properties.bearing
                })
            },
            onEachFeature: function(feature, layer){
                
                if(feature.geometry.type === 'Point'){
                    layer.bindPopup("route ID: "+feature.properties.RouteID+"<br>Bus no:"+feature.properties.BusNo+"<br>Trip ID:"+feature.properties.TripID)
                }
            }

        }).addTo(map);

        setTimeout(routeMap,7000);
        
    });

    
   }
   routeMap();

   
    
    


})()