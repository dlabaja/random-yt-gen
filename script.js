window.onload = main;

function main(){
    setElements("sus", "", "", "")
    var videos = getVideos();
    var id = getCringeVideo(setKentusValue(videos));
    var object = getParentObject(videos, id)
    setElements("https://www.youtube-nocookie.com/embed/" + id + "?fs=1&modestbranding=1&rel=0&autoplay=1", object.viewCount, getSubs(object.authorId), new Date(object.published * 1000).toLocaleString("en-GB", {timeZone: "UTC"}))
}

function setElements(src, views, subs, date){
    document.getElementById('iframe').src = src;
    document.getElementById('views').textContent = subs;
    document.getElementById('subs').textContent = views;
    document.getElementById('date').textContent = date;  
}

function getSubs(id){
    var json = getJson("https://invidio.xamh.de/api/v1/channels/" + id + "?fields=subCount&pretty=1");
    return json["subCount"];
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
    while(Object.keys(json).length === 0){
        search = getLetter() + getLetter();
        json = getJson("https://invidio.xamh.de/api/v1/search/?fields=videoId,viewCount,published,authorId&q=" + search + "&page=10&sort_by=view_count&date=today&duration=short&type=video&pretty=1");
        console.log(search);
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


