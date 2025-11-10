import { json, dsvFormat, text, csv } from "d3";


export function readCSV(fileName, delim){
    csv = d3.dsvFormat(delim)
    const result = d3.text(fileName).then(t=>{
        return csv.parse(t)
    })
    return result
}


export async function readAllData(geoMap, works, location_to_works, all_insitutions, work_to_insitutions, multi_line_string){
    let geo_data
    try{
       geo_data = await json(geoMap)
    }catch(error){
        console.log("Map Error")
        console.error(error)
    }
    let works_data
    try{
        works_data = await json(works)
    }catch(error){
        console.log("Works Error")
        console.error(error)
    }

    let location_to_works_data
    try{
        location_to_works_data = await json(location_to_works)
    }catch(error){
        console.log("location Error")
        console.error(error)
    }
    let all_insitutions_data
    try{
        all_insitutions_data = await json(all_insitutions)
    }catch(error){
        console.log("Instutition Error")
        console.log(error)
    }

    let work_to_insitutions_data;
    try{
        work_to_insitutions_data = await json(work_to_insitutions)
    }catch(error){
        console.log("Work to Inst. error")
        console.log(error)
    }

    let multi_line_string_data;
    try{
        multi_line_string_data = await json(multi_line_string)
    }catch(error){
        console.log("multi line error")
        console.log(error)
    }
//https://data.opendatasoft.com/explore/dataset/georef-canada-province%40public/export/?disjunctive.prov_name_en
//https://gist.github.com/M1r1k/d5731bf39e1dfda5b53b4e4c560d968d    
//https://observablehq.com/@saneef/geojson-from-openstreetmap
//https://geo2day.com/north_america/canada.geojson
    return [geo_data, works_data, location_to_works_data, all_insitutions_data, work_to_insitutions_data, multi_line_string_data]
}