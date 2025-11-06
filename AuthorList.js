import * as d3 from "d3";

export function updateAuthorList(location_relation, works){
    console.log(location_relation)
    console.log(works)

    let currentLocations = []
    location_relation.forEach(element => {
        works.some(work =>{
            if(work.openalex_work_id.split("/")[3] === element){
                currentLocations.push(work)
                
            }
        })
    });
    console.log(currentLocations)
    let current_authors = []
    currentLocations.forEach(element =>{
        let temp_authors = element.author
        if(temp_authors != null){
            temp_authors.forEach(author =>{
                current_authors.push(author)
            })
        }
        
    })
    let list = d3.select("#authorList")
    list.selectAll("*").remove()

    new Set(current_authors).forEach(author =>{
        console.log(author)
        makeEntry(author, list)
    })
    
}


function makeEntry(author, list){
    let entry = list.append("li")
    entry.attr("class", "work-entry")
    
    let temp = entry.append("div")
    temp.attr("class", "articleWrapper")
    let summaryWrapper = temp.append("div")
    let name = summaryWrapper.append("div")
    let instution_display = author.institution_display_name
    let name_text
    if(instution_display){

        name_text = author.au_display_name +"," + author.institution_display_name
    }
    else{
        
        name_text = author.au_display_name
    }
    name.text(name_text)
    name.attr("class", "articleTitle")
    let clipBoard = name.append("img")
    clipBoard.attr("src", "./res/Bw_paste_icon_32x32.png")
    
    clipBoard.on("click", (event) =>{
        name.select()
        navigator.clipboard.writeText(name_text)
    })

    let instution = summaryWrapper.append("div")
    instution.text(author.au_affiliation_raw)

    let buttonWrapper = summaryWrapper.append("div") 

    if(author.au_orcid != null){
        let orcidWrapper = buttonWrapper.append("div")

        let orcidButton = orcidWrapper.append("img")
        orcidButton.attr("src", "./res/ORCID-iD_icon_24x24.png")
        let orcidText = orcidWrapper.append('a')
        orcidText.attr("href", author.au_orcid)
        orcidText.attr("target", "_blank")
        orcidText.text(author.au_orcid)
    }
    
}