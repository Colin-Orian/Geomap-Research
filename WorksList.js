import * as d3 from "d3";


export function makeModal(){
    
    let modalContent = d3.select("#modalRoot").append("div")
     
    modalContent.attr("id", "modalContent")
    let modalHeader = modalContent.append("div")
    modalHeader.attr("id", "modalHeader")
    
    let closeButton = modalHeader.append("span").text("X")
    closeButton.attr("id", "closeButton")
    closeButton.on("click", closeMoreInfo);
    closeButton.style("cursor", "pointer");


    modalHeader.append("h3") //Title
               .attr("id", "articleTitle");
    let modalBody = modalContent.append("div")
    modalBody.attr("id", "modalBody")

    modalBody.append("span") //Abstract
             .style("font-weight", "bold")
             .text("Abstract");
    modalBody.append("div")
             .attr("id", "abstractBody")


    modalBody.append("span") //authors
             .style("font-weight", "bold")
             .text("Author(s)");
    modalBody.append("div")
             .attr("id", "authorBody")
    
    
    let modalFooter = modalContent.append("div") //DOI
    modalFooter.attr("id", "modalFooter")
    modalFooter.append("span")
               .style("font-weight", "bold")
               .text("DOI: ")
    modalFooter.append("a")
               .attr("id", "doiLink")
               .attr("target", "_blank"); //clicking on the DOI will open it in another tab

}

export function updateScrollable(location_relation, works){
    console.log(location_relation)
    let currentLocations = []
    location_relation.forEach(element => {
        works.some(work =>{
            if(work.openalex_work_id.split("/")[3] === element){
                currentLocations.push(work)
                
            }
        })
    });
    let list = d3.selectAll("#articleList")
    list.selectAll("*").remove()
    new Set(currentLocations).forEach(work =>{
        makeEntry(work, list)
    })
    
}



function makeEntry(element, list){
        let entry = list.append("li")
        entry.attr("class", "work-entry")
        let temp = entry.append("div")
        temp.attr("class", "articleWrapper")
        let number = temp.append("div")
        let summaryWrapper = temp.append("div")

        let title = summaryWrapper.append("div")
        let year = summaryWrapper.append("div")
        let chapters = summaryWrapper.append("div")
        let buttonWrapper = summaryWrapper.append("div")    
            let moreInfoWrapper = buttonWrapper.append("div")
            let seedWrapper = buttonWrapper.append("div")
        let tagWrapper = summaryWrapper.append("div")
        

        number.attr("class", "score")
        title.attr("class", "articleTitle")
        year.attr("class", "yearInfo")
        chapters.attr("class", "listChapter")
        number.append("text").text(element.cited_by_count)
        title.append("text").text(element.display_name)
        year.append("text").text(element.publication_year)

        /*
        for(chapter of element.woaii_chapters){
            let chapterVis = chapters.append("div")
            chapterVis.attr("class","chapterEntry")
            chapterVis.style("background", allData.chapter_color[chapter])
            chapterVis.text(chapter)
        }*/

        let seedButton = seedWrapper.append("img")
        seedWrapper.append("text").text("Set Seed")
        seedButton.attr("src", "res/seed.svg")
        seedButton.style("cursor", "pointer")
        seedButton.attr("class", "button")
        seedButton.on("click", () =>{
            setSeed(element)
        })
        let moreInfoButton = moreInfoWrapper.append("img")
        moreInfoButton.append("text").text("More Info")
        moreInfoButton.attr("src", "res/MoreDetails.svg")
        moreInfoButton.style("cursor", "pointer")
        moreInfoButton.attr("class", "button")
        moreInfoButton.on("click", () =>{
            showMoreInfo(element)
        })
        moreInfoWrapper.append("text").text("More Info")

        //isCitedFreq
        //isNew
        //isSurvey
        //isUnnoted

        if(element.isSurvey){
            let surveyWrapper = tagWrapper.append("div")
            surveyWrapper.attr("class", "tag")
            let surveyImage = surveyWrapper.append("img")
            surveyImage.attr("src", "res/litReview.svg")
            surveyWrapper.append("text").text("Literature Review")
        }

        if(element.isNew){
            let novelWrapper = tagWrapper.append("div")
            novelWrapper.attr("class", "tag")
            let novelImage = novelWrapper.append("img")
            novelImage.attr("src", "res/new.svg")
            novelWrapper.append("text").text("New")
        }

        if(element.isCitedFreq){
            let citedWrapper = tagWrapper.append("div")
            citedWrapper.attr("class", "tag")
            let citedImage = citedWrapper.append("img")
            citedImage.attr("src", "res/citedFrequently.svg")
            citedWrapper.append("text").text("Cited Frequently")
        }

        if(element.isUnnoted){
            let unnotedWrapper = tagWrapper.append("div")
            unnotedWrapper.attr("class", "tag")
            let unnotedImage = unnotedWrapper.append("img")
            unnotedImage.attr("src", "res/unnoted.svg")
            unnotedWrapper.append("text").text("Unnoted")
            
        }

}

function showMoreInfo(element){
     d3.select("#articleTitle").text(element.display_name)

    if(element.ab === undefined){
        d3.select("#abstractBody").text("No abstract found.")
    }else{
        d3.select("#abstractBody").text(element.ab)
    }
    

    let authors = ""
    element.author.forEach((a) =>{
        authors += a.au_display_name + ", "
    })
    d3.select("#authorBody").text(authors)

    d3.select("#doiLink").text(element.doi)
                         .attr("href", element.doi);


    d3.select(".modal").style("display", "block")
    d3.select(".modal").transition().style("opacity", 1.0)
}


function closeMoreInfo(){
    d3.select(".modal").transition().style("opacity", 0.0)
    d3.select(".modal").style("display", "none")
}