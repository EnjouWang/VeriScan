let claim;

document.addEventListener('DOMContentLoaded', ()=>{
    let textInput = document.getElementById('textInput');
    let verifyButton = document.getElementById('vButton');
    let backButton = document.getElementById('bButton');
    let detailsButton = document.getElementById('details');
    let searchMethod = document.getElementById('searchMethod');

    let popup_page = document.getElementById('popup');
    let result_page = document.getElementById('result');
    let result_img = document.getElementById('result_img');
    let details_link = document.getElementById('hide_details');

    const bc = new BroadcastChannel("contextMenus_ch");
    bc.onmessage = (msg)=>{
        textInput.value = msg.data;
        verifyButton.click();
        console.log(msg.data);   
        bc.postMessage("message_get");
        
        // chrome.windows.onCreated.addListener((window)=>{
        //     let text = window.getElementById('textInput');
        //     let wvButton = document.getElementById('vButton');
        //     text.value = msg.data;
        //     wvButton.click();
        // });
    }
    
    let selectedValue;
    searchMethod.addEventListener('change', ()=>{
        selectedValue = searchMethod.value;
    });

    verifyButton.addEventListener('click', ()=>{
        // send claim
        claim = textInput.value;
        console.log('User input: ' + claim);
        console.log('Method: ' + selectedValue);
        chrome.runtime.sendMessage({content: claim, method: selectedValue});
        document.getElementById('claim').innerText = claim;

        // loading block
        document.getElementById('loading').style.display = "block";

        // get result
        const bc = new BroadcastChannel("result_ch");
        bc.onmessage = (msg)=>{
            console.log(msg.data);
            let result = msg.data.label;
            if(result == null){
                document.getElementById('loading').style.display = "none";
            }
            else{
                // REFUTES
                if(result == "1"){
                    result_img.src = "./wrong.png";
                    document.getElementById('support').style.display = "none";
                    document.getElementById('nei').style.display = "none";
                    document.getElementById('refute').style.display = "inline";
                }
                // SUPPORTS
                else if(result == "0"){
                    result_img.src = "./correct.png";
                    document.getElementById('support').style.display = "inline";
                    document.getElementById('nei').style.display = "none";
                    document.getElementById('refute').style.display = "none";
                }
                // NOT ENOUGH INFO
                else{
                    result_img.src = "./warning.png";
                    document.getElementById('support').style.display = "none";
                    document.getElementById('nei').style.display = "inline";
                    document.getElementById('refute').style.display = "none";
                }

                // details            
                details_link.innerText = msg.data.evidence[0];
                details_link.href = encodeURI(msg.data.url);
                console.log("details link: " + details_link.href);

                // show result
                // chrome.windows.create({"url": "popup.html", "type": "popup"}, (window)=>{});
                popup_page.style.display = "none";
                result_page.style.display = "flex";
                document.getElementById('loading').style.display = "none";
            }              
        }             
    });

    backButton.addEventListener('click', ()=>{
        popup_page.style.display = "flex";
        result_page.style.display = "none";
        textInput.value = "";     
        searchMethod.value = 0;
    });

    var is_show = false;
    detailsButton.addEventListener('click', (e)=>{
        if(!is_show){
            is_show = true;
            document.getElementById('hide_details').style.display = "flex";
            detailsButton.innerText = "Details";
        }
        else{
            is_show = false;
            window.resizeTo(280, 450)
            document.getElementById('hide_details').style.display = "none";
            // result_page.style.display = "none";       
            // result_page.style.display = "flex";
            detailsButton.innerText = "Details";    
        }
        e.preventDefault();
    }, false);

});