function setElements(src, views, subs, date){
    document.getElementById('iframe').src = src;
    document.getElementById('views').textContent = views;
    document.getElementById('subs').textContent = subs;
    document.getElementById('date').textContent = date;  
}

function getSubs(id){
    var json = getJson("https://invidio.xamh.de/api/v1/channels/" + id + "?fields=subCount&pretty=1");
    if(json["subCount"] === 0)
        return "0 / hidden";
    return json["subCount"];
}

function setLoadingText(text){
    try{
        document.getElementById("loading").textContent = text;
    }catch{
        return;
    }
}

function getParentObject(videos, id){
    var obj;
    videos.forEach(element => {
        if(element.videoId === id){
            obj = element;
        }
    });
    return obj;
}

function getJson(url){
    var httpreq = new XMLHttpRequest();
    httpreq.open("GET", url, false);
    httpreq.send(null);
    return JSON.parse(httpreq.responseText);          
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getLetter(){
    var letters = "abcdefhijklmnoprstuvxyz" //gqw
    return letters[random(0, letters.length - 1)]
}

function getCringeVideo(object){
    var val = Object.values(object);
    var length = val.length; 
    val.sort(); 
    var sortedDict = {};

    for (i = 0; i < length; i++)
    {
        sortedDict[Object.keys(object).find(key => object[key] === val[i])] = val[i]
    }
    return Object.keys(object).find(key => object[key] === val[0]);
}

function getVideos(){   
    var json = getJson("https://invidio.xamh.de/api/v1/search/?fields=videoId,viewCount,published,authorId&q=" + getLetter() + getLetter() + "&page=20&sort_by=view_count&date=today&duration=short&type=video&pretty=1"); 
    
    //pokud je json prázdný
    var i = 1;
    setLoadingText("Generating random video (" + i + ". try)")
    while(Object.keys(json).length === 0){ 
        json = getJson("https://invidio.xamh.de/api/v1/search/?fields=videoId,viewCount,published,authorId&q=" + getLetter() + getLetter() + "&page=10&sort_by=view_count&date=today&duration=short&type=video&pretty=1");
        setLoadingText("Generating random video (" + i + ". try)")
        i++;
    }
    
    return json;
}

function setKentusValue(json){
    var dict = {};
    json.forEach(element => {
        dict[element["videoId"]] = element["published"] * (element["viewCount"] + 1) 
    });
    return dict;
}