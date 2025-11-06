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
import { LineString } from 'ol/geom';
import {readAllData} from "/readData";
import { Vector } from 'ol/source';
import {Style} from "ol/style";
import {Stroke} from "ol/style";
import { updateScrollable, makeModal } from './WorksList';
import { updateAuthorList } from './AuthorList';
import * as d3 from "d3";
import Fill from 'ol/style/Fill';

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
const tileLayer = new TileLayer({source: new OSM()})

readAllData(location_file, works_file, location_to_works_file, all_insitutions, work_to_insitutions).then(d =>{
  const allData = {}
  allData.lat_long = d[0]
  allData.works = d[1]
  allData.location_relation = d[2]
  allData.all_insitutions = d[3]
  allData.work_to_insitutions = d[4]
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
  
  var locations = [[60.10867, -113.64258], [0, 0]];




  makeModal()

  const map = new Map({
    target: 'map',
    layers: [
      tileLayer,

      vectorLayer,

      instutition_vectorLayer,
      
     
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


function drawLines(start, end){

}