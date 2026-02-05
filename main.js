import './style.css';
import {Map, Overlay, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Point from "ol/geom/Point"

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Feature} from 'ol';
import { useGeographic } from 'ol/proj';
import { transform } from 'ol/proj';
import { LineString, MultiLineString } from 'ol/geom';
import {readAllData} from "/readData";
import { Vector } from 'ol/source';
import {Style} from "ol/style";
import {Stroke} from "ol/style";
import {Select} from "ol/interaction";

import { updateScrollable, makeModal } from './WorksList';
import { updateAuthorList } from './AuthorList';
import * as d3 from "d3";
import Fill from 'ol/style/Fill';
import { CanvasLayer } from './canvasLayer';

useGeographic()
//const longitude = 75.7003;

//const latitude = 45.4201;

//const latitude = 45.0
//const longitude = -110.0

const latitude = 48.56476

const longitude = -55.77879

const can_lat = 60.10867
const can_long = -113.64258

const place = [longitude, latitude]
const point = new Point(place)
const can = [can_long, can_lat]


const location_file = "./data/entity_coord_relation.json";
const works_file = "./data/works.json";
const location_to_works_file = "./data/location_to_works.json";
const all_insitutions = "./data/filtered_insitutions.json";
const work_to_insitutions = "./data/work_to_instution.json";
const multiLine_file = "./data/geo_features.json";
const author_cited_file = "./data/authors_cited.json";
const tileLayer = new TileLayer({source: new OSM()})

readAllData(location_file, works_file, location_to_works_file, all_insitutions, work_to_insitutions, multiLine_file, author_cited_file).then(d =>{
  const allData = {}
  allData.lat_long = d[0]
  allData.works = d[1]
  allData.location_relation = d[2]
  allData.all_insitutions = d[3]
  allData.work_to_insitutions = d[4]
  allData.multiLine = d[5]
  allData.author_cited = d[6]
  console.log(allData);
  const points = make_pins(allData.lat_long)
  //console.log(allData.lat_long.keys().length)
  
  let counter = 0
  const pins = points.map(entry =>{
    const temp = [entry[2], entry[1]];
    var feature = new Feature(new Point(temp));
    
    feature.setId("location_" + entry[0] + "_" + counter.toString())
    counter += 1
    return feature
  })
  

  const instution_pins = allData.all_insitutions.map(entry =>{
    const temp = [entry['longitude'], entry['latitude']]
    var feature = new Feature(new Point(temp))
    feature.setId("instution_" +entry['id'])

    return feature
  })

  for(let i in points){
    let temp_loc = points[i]
    
  }

  console.log(points.length)
  console.log(pins.length)
  let feature_style = new Style({
    stroke: new Stroke({
      color: 'rgba(5, 28, 239, 1.0)',
      width: 3
    })
  })

  let invisible_style = new Style({
    stroke: new Stroke({
      color: 'rgba(0, 255, 123, 0.0)',
      width: 1
    })
  })


  const converted_line = allData.multiLine.map(entry =>{
    
    let temp = new Feature({
      geometry: new LineString([[entry.geometry.coordinates[0][1], entry.geometry.coordinates[0][0]],
          [entry.geometry.coordinates[1][1], entry.geometry.coordinates[1][0]]]),
      //properties: entry.properties
    })

    temp.setProperties(entry.properties)

    temp.setStyle(invisible_style)
   return temp
  })

  
  
  //let multi_line_string = new MultiLineString(converted_line)
  
  
  let multi_line_string = new LineString([
    //[45.56, -76.37],
    [-76.37, 45.56 ],
    //[32.84, -117.27]
    [-117.27, 32.84]
  ])


  
  //let multi_feature = new Feature({multi_line_string})

  let multi_feature = new Feature({
    geometry: multi_line_string,
    
  })

  
  multi_feature.setStyle(feature_style);
  
  const lineLayer = new VectorLayer({
    
    source: new VectorSource({
      features: converted_line
    })
    
  })

  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      //features: [new Feature(point), new Feature(new Point([0, 0]))],
      features: pins
    }),
    
    style: {
        "circle-radius": 9,
        "circle-fill-color": 'rgb(256,0, 0, 0.5)'
      },
  })

  const instutition_vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: instution_pins
    }),

    style: {
      "circle-radius": 9,
      "circle-fill-color": 'rgb(0,0, 256, 0.5)'
    },
    
  });
  

  makeModal()

  const map = new Map({
    target: 'map',
    layers: [
      tileLayer,
      
      lineLayer,
      vectorLayer,

      instutition_vectorLayer,
      
      //canvasLayer      
     
    ],
    view: new View({
      center: can,
      zoom: 4,
    //projection: 'EPSG:4326'

    })
  });

  const element = document.getElementById('popup')
  const popup = new Overlay({
    element: element,
    stopEvent: false
  })

  map.addOverlay(popup)
  
  let selectedStyle = new Style({
    fill: new Fill({
      color: 'green'
    })
  })


  let popover

  var selectedStyleFunction = function(feature, resolution){
    console.log(feature)
    return selectedStyle
  }


  var select = new Select({
    
  })

  select.on('select', function(event) {
    console.log(event)
    let featureSelected = event.selected[0];
    const pointLong = featureSelected.getGeometry().flatCoordinates[0]
    const pointLat = featureSelected.getGeometry().flatCoordinates[1]
    

    
    //map.layers.push(instutition_vectorLayer)
    //map.changed()
    //multi_feature.setStyle(invisible_style)
    //multi_feature.changed()

    let feature_type = featureSelected.id_.split("_")[0]
    let feature_name = featureSelected.id_.split("_")[1]
    if(feature_type === "location"){
      d3.select("#selected-location").text(feature_name)
      d3.select("#selected-location-author").text(feature_name)

      updateScrollable(allData.location_relation[feature_name], allData.works)
      updateAuthorList(allData.location_relation[feature_name], allData.works, allData.author_cited)

      
      for(let entry in converted_line){
        
        let current_line = converted_line[entry]
        let line_location = current_line.getProperties()['location']
        const lineCoords = current_line.getGeometry().flatCoordinates
        
        if(line_location === feature_name){
          
          current_line.setStyle(feature_style)
        }else{
          current_line.setStyle(invisible_style)
        }
        
      }
    }
    else if(feature_type === 'instution'){
      for(let entry in converted_line){
      
      let current_line = converted_line[entry]
      let line_location = current_line.getProperties()['instution']
      
    
    
      if(line_location === feature_name){
      
        current_line.setStyle(feature_style)
      }else{
        current_line.setStyle(invisible_style)
      }

      }
    }

  })

  map.addInteraction(select)

})

function make_pins(lat_long_data){
  var data = []
  for(const [key, value] of Object.entries(lat_long_data)){
    
    for(const [id, lat_long] of Object.entries(lat_long_data[key])){
      data.push([key, lat_long[0], lat_long[1]])
    }
  }
  return data
}


