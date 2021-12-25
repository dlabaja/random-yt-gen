//window.onload = main;

function main(){
    document.getElementById('iframe').src = "";
    dict = GetVideos();
    dict = getCringeVideo(dict);
    console.log(dict);

    document.getElementById('iframe').src = "https://www.youtube-nocookie.com/embed/" + dict + "?fs=0&modestbranding=1&rel=0";
}

function getJson(url){
    var httpreq = new XMLHttpRequest(); // a new request
    httpreq.open("GET", url, false);
    httpreq.send(null);
    return httpreq.responseText;          
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getLetter(){
    var letters = "abcdefghijklmnopqrstuvwxyz"
    return letters[random(0, letters.length)]
}

function getCringeVideo(object){
    var val = Object.values(object);
    var length = val.length; 
    val.sort(); 
    var sortedDict = {};

    for (i = 0; i < length; i++)
    {
        //sortedDict.push({"key": Object.keys(object).find(key => object[key] === val[i]), "value":val[i]});
        sortedDict[Object.keys(object).find(key => object[key] === val[i])] = val[i]
    }

    console.log(sortedDict);
    return Object.keys(object).find(key => object[key] === val[0]);
}

function GetVideos(){
    var dict = {};
    var json = JSON.parse(getJson("https://invidio.xamh.de/api/v1/search/?fields=videoId,viewCount,published,authorId&q=" + getLetter() + getLetter() + "&page=20&sort_by=view_count&date=today&duration=short&type=video&pretty=1"));
    
    //pokud je json prázdný
    while(Object.keys(json).length === 0){
        json = JSON.parse(getJson("https://invidio.xamh.de/api/v1/search/?fields=videoId,viewCount,published,authorId&q=" + getLetter() + getLetter() + "&page=20&sort_by=view_count&date=today&duration=short&type=video&pretty=1"));
    }
    
    //videoId, viewCount, published
    json.forEach(element => {
        dict[element["videoId"]] = element["published"] * (element["viewCount"] + 1) 
    });
    return dict;
}

