import * as d3 from "d3";

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
    currentLocations.forEach(work =>{
        makeEntry(work, list)
    })
    
}



function makeEntry(element, list){
        let entry = list.append("li")
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