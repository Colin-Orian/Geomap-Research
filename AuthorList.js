import * as d3 from "d3";

export function updateAuthorList(location_relation, works, author_cited){

    let currentLocations = []
    location_relation.forEach(element => {
        works.some(work =>{
            if(work.openalex_work_id.split("/")[3] === element){
                currentLocations.push(work)
                
            }
        })
    });
    
    let current_authors = []
    currentLocations.forEach(element =>{
        let temp_authors = element.author
        if(temp_authors != null){
            temp_authors.forEach(author =>{
                current_authors.push(author)
            })
        }
        
    })

    let author_ids = new Set(current_authors.map(element => element['au_id'].split("/")[3]))
    
    let filtered_author_cited = {}
    author_ids.forEach(author => {
        if(author_cited[author]){
            filtered_author_cited[author] =author_cited[author]
        }
    })


    console.log(filtered_author_cited)
    let list = d3.select("#authorList")
    list.selectAll("*").remove()

    new Set(current_authors).forEach(author =>{
        
        makeEntry(author, list, filtered_author_cited[author['au_id'].split("/")[3]])
    })
    
}


function makeEntry(author, list, citation_count){
    let entry = list.append("li")
    entry.attr("class", "work-entry")
    console.log(author)
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
    let tagWrapper = summaryWrapper.append("div")
    let cited_count = tagWrapper.append('text');
    cited_count.attr("id", "cited_count");
    cited_count.text(citation_count['cited_by_count']);


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