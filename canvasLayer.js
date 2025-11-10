import * as d3 from 'd3'
import {Layer} from 'ol/layer';
import { fromLonLat, toLonLat } from 'ol/proj';
import { getCenter, getWidth } from 'ol/extent';

export class CanvasLayer extends Layer{
  constructor(options){
    super(options)
    this.feature = options.feature;
    console.log(this.feature)
    this.svg = d3.select(document.createElement('div'))
               .append('svg')
               .style('position', 'absolute');
    //console.log(this.feature.coordinates)
    this.svg.append('path').datum(this.feature).attr('class', 'boundary')
                            .style("stroke", "green")
                            .style('stroke-width', 4);
  }

  getSourceState(){
    return 'ready';
  }

  render(frameState){
    const width = frameState.size[0]
    const height = frameState.size[1]
    const projection = frameState.viewState.projection;
    const d3Projection = d3.geoMercator().scale(1).translate([0, 0]);
    let d3Path = d3.geoPath().projection(d3Projection);
    
    

    const pixelBounds = d3Path.bounds(this.feature);
    const pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0];
    const pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1];
    
    
    const bounds = d3.geoBounds(this.feature);
    
    let leftBottom = [bounds[0][1], bounds[0][0]]
    let rightTop = [bounds[1][1], bounds[1][0]]
    
    //const geoBoundsLeftBottom = fromLonLat(leftBottom, projection);
    //const geoBoundsRightTop = fromLonLat(rightTop, projection);

    const geoBoundsLeftBottom = leftBottom
    const geoBoundsRightTop = rightTop
    
    //const geoBoundsLeftBottom = bounds[0]
    //const geoBoundsRightTop = bounds[1]
    let geoBoundsWidth = geoBoundsRightTop[0] - geoBoundsLeftBottom[0]
    if (geoBoundsWidth < 0) {
      geoBoundsWidth += getWidth(projection.getExtent());
    }
    const geoBoundsHeight = geoBoundsRightTop[1] - geoBoundsLeftBottom[1]

    const widthResolution = geoBoundsWidth / pixelBoundsWidth
    const heightResolution = geoBoundsHeight / pixelBoundsHeight
    const r = Math.max(widthResolution, heightResolution)
    const scale = r / frameState.viewState.resolution;

    console.log(frameState)
    console.log(getCenter(frameState.extent))
    const center = toLonLat(getCenter(frameState.extent), projection);
    
    const angle = (-frameState.viewState.rotation * 180) / Math.PI;
    
    d3Projection
        .scale(scale)
        .center(center)
        .translate([width /2, height /2])
        .angle(angle)
    
    d3Path = d3Path.projection(d3Projection);
    d3Path(this.feature);
    
    this.svg.attr("width", width);
    this.svg.attr("height", height);
    
    this.svg.select('path').attr('d', d3Path);
    

    return this.svg.node();
  }
}