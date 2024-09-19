const searchEngineID = '50d4182e5b50446da';
const apiKey = '';
const wikipageURL = "https://en.wikipedia.org/?curid=";

let claim, query, method, evidence_link, result;

function gverify(claim){
    query = claim;
    // google
    const googleapisUrl = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${searchEngineID}`;
    fetch(googleapisUrl)
        .then((response)=>{
            if(!response.ok){
                throw new Error("Network response is not ok.");
            }
            return response.json();
        })
        .then((data)=>{
            evidence_link = [];
            for(let i=0; i<5; i++){
                console.log(data.items[i].link);
                evidence_link.push(data.items[i].link);                
            }

            item = {claim: claim, links: evidence_link}

        // verification
            // const veriUrl = `http://140.115.54.36/everify/?claim=${claim}&url=${evidence_link}`;
            const veriUrl = `http://127.0.0.1:8000/everify/`;
            return fetch(veriUrl, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(item)});
        })
        .then((response)=>{
            if(!response.ok){
                throw new Error("Network response is not ok.");
            }
            return response.json();
        })
        .then((data)=>{
            console.log(data);
            result = data.label;
            evidence = data.evidence;
            link = data.link
            const bc = new BroadcastChannel("result_ch");
            bc.postMessage({label: result, claim: claim, evidence: evidence, url: link});
            bc.onmessage = (msg) => {
                console.log(msg)
            }
        })
        .catch((error)=>{console.error(error);
            const bc = new BroadcastChannel("result_ch");
            bc.postMessage({label: "fetch error"});
        });

}

function wverify(claim){
    query = claim;

    // query
    const queryUrl = `http://140.115.54.36/equery/?claim=${claim}`;
    fetch(queryUrl, {method: 'GET'})
        .then((response)=>{
            if(!response.ok){
                throw new Error("Network response is not ok.");
            }
            return response.json();
        })
        .then((data)=>{
            console.log(data);
            query = data.equery;
            console.log(query);

        // wiki
            const wikiapisUrl = "https://en.wikipedia.org/w/api.php";
            console.log("wiki search query: " + query);
            let params = new URLSearchParams({
                action: "query",
                list: "search",
                srsearch: query,
                format: "json",
                origin: "*",
                srlimit: 5
            });
            return fetch(`${wikiapisUrl}?${params}`);
        })
        .then((response)=>{
            if(!response.ok){
                throw new Error("Network response is not ok.");
            }
            return response.json();
        })
        .then((data)=>{
            evidence_link = {};
            for(let i=0; i<5; i++){
                console.log(encodeURI(wikipageURL + data.query.search[i].pageid));
            }
            evidence_link = encodeURI(wikipageURL + data.query.search[0].pageid);

            // verification
            const veriUrl = `http://140.115.54.36/everify/?claim=${claim}&url=${evidence_link}`;
            return fetch(veriUrl, {method: 'GET'});
        })
        .then((response)=>{
            if(!response.ok){
                throw new Error("Network response is not ok.");
            }
            return response.json();
        })
        .then((data)=>{
            console.log(data);
            result = data.label;
            evidence = data.evidence;
            const bc = new BroadcastChannel("result_ch");
            bc.postMessage({label: result, evidence: evidence, url: evidence_link});
        })
        .catch((error)=>{
            console.log(error);
            const bc = new BroadcastChannel("result_ch");
            bc.postMessage({label: "fetch error"});
        })
}

// contextMenus
var parent = chrome.contextMenus.create({
    "title": "VeriScan",
    "id": "VeriScan",
    "contexts": ['all']
});

// var google = chrome.contextMenus.create({
//     "title": "google",
//     "id": "google search",
//     "contexts": ['all'],
//     "parentId": "VeriScan"
// });

// var wiki = chrome.contextMenus.create({
//     "title": "wikipedia",
//     "id": "wiki search",
//     "contexts": ['all'],
//     "parentId": "VeriScan"
// });

// when click contextMenus
chrome.contextMenus.onClicked.addListener((info, tab)=>{
    claim = ((info.selectionText ? info.selectionText : "") + "\n");
    console.log("clicked the context menus!\n" + 
                "selected: " + claim);
    
    const bcn = new BroadcastChannel("contextmenus_ch");
    bcn.postMessage({data: "press"});

    gverify(claim);
    chrome.sidePanel.open({ windowId: tab.windowId });
    
    // if(info.menuItemId === "google search"){
    //     console.log("google search!");
    //     gverify(claim);
    //     chrome.sidePanel.open({ windowId: tab.windowId });
    // }
    // else if(info.menuItemId === "wiki search"){
    //     console.log("wiki search!");
    //     wverify(claim);
    //     chrome.sidePanel.open({ windowId: tab.windowId });
    // }

});