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
const all_insitutions = "./data/all_insitutions.json";
const work_to_insitutions = "./data/work_to_instution.json";
const multiLine_file = "./data/multi_line_string.json"
const tileLayer = new TileLayer({source: new OSM()})

readAllData(location_file, works_file, location_to_works_file, all_insitutions, work_to_insitutions, multiLine_file).then(d =>{
  const allData = {}
  allData.lat_long = d[0]
  allData.works = d[1]
  allData.location_relation = d[2]
  allData.all_insitutions = d[3]
  allData.work_to_insitutions = d[4]
  allData.multiLine = d[5]
  console.log(allData);
  const points = make_pins(allData.lat_long)
  
  

  const pins = points.map(entry =>{
    const temp = [entry[2], entry[1]];
    var feature = new Feature(new Point(temp));
    
    feature.setId(entry[0])
    return feature
  })

  const instution_pins = allData.all_insitutions.map(entry =>{
    const temp = [entry['longitude'], entry['latitude']]
    var feature = new Feature(new Point(temp))
    feature.setId(entry['id'])

    return feature
  })

  //let multi_line_string = new MultiLineString(allData.multiLine.coordinates)
  /*
  const canvasLayer = new CanvasLayer({
    feature: allData.multiLine
  })*/
  

  const converted_line = allData.multiLine.coordinates.map(entry =>{
    const startPoint = [entry[0][1], entry[0][0]]
    const endPoint = [entry[1][1], entry[1][0]]

    return [startPoint, endPoint]
  })

  console.log(converted_line)
  let multi_line_string = new MultiLineString(converted_line)
  
  
  /*let multi_line_string = new LineString([
    //[45.56, -76.37],
    [-76.37, 45.56 ],
    //[32.84, -117.27]
    [-117.27, 32.84]
  ])*/


  let feature_style = new Style({
    stroke: new Style({
      color: 'rgba(36, 19, 111, 1)',
      width: 10
    })
  })

  console.log(multi_line_string)
  //let multi_feature = new Feature({multi_line_string})

  let multi_feature = new Feature({
    geometry: multi_line_string,
    style: feature_style
  })

  
  //multi_feature.setStyleFunction(feature_style);
  console.log(multi_feature)
  const lineLayer = new VectorLayer({
    source: new VectorSource({
      features: [multi_feature]
    })
    
  })

  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      //features: [new Feature(point), new Feature(new Point([0, 0]))],
      features: pins
    }),

    style: {
        "circle-radius": 9,
        "circle-fill-color": 'red'
      }
  })

  const instutition_vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: instution_pins
    }),

    style: {
      "circle-radius": 9,
      "circle-fill-color": "blue"
    }
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
  

  let popover
  map.on('click', function(event){
    if(popover){
      popover.dispose()
      popover = undefined
    }
    console.log(event.coordinate)
    const feature = map.getFeaturesAtPixel(event.pixel)[0];
    if(!feature){
      return
    }
    d3.select("#selected-location").text(feature.id_)
    d3.select("#selected-location-author").text(feature.id_)

    updateScrollable(allData.location_relation[feature.id_], allData.works)
    updateAuthorList(allData.location_relation[feature.id_], allData.works)
  });
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


