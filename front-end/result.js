document.addEventListener('DOMContentLoaded', ()=>{
    let claim = document.getElementById('claim');
    let sentence = document.getElementById('sentence');
    let result_img = document.getElementById('result_img');
    let detailsButton = document.getElementById('details');
    let details_link = document.getElementById('hide_details');
    let loading = document.getElementById('loading');

    // when press contextMenus, loading
    const bcn = new BroadcastChannel("contextmenus_ch");
    bcn.onmessage = (msg)=>{
        if(msg.data == "press"){
            console.log(msg);
            result_img.src = "./icon.png";
            claim.innerText = "";
            sentence.style.display = "none";
            loading.style.display = "flex";
        }
    }

    // get the result from background
    const bc = new BroadcastChannel("result_ch");
    bc.onmessage = (msg)=>{
        claim.innerText = msg.data.claim;
        console.log(msg.data);   
        bc.postMessage("message_get");

        let result = msg.data.label;
        if(result == null){
            loading.style.display = "none";
        }
        else{
            // REFUTES
            if(result == "REFUTES"){
                result_img.src = "./wrong.png";
                document.getElementById('support').style.display = "none";
                document.getElementById('nei').style.display = "none";
                document.getElementById('refute').style.display = "inline";
            }
            // SUPPORTS
            else if(result == "SUPPORTS"){
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
            details_link.innerText = msg.data.evidence;
            details_link.href = encodeURI(msg.data.url);
            console.log("details link: " + details_link.href);

            // show result
            sentence.style.display = "inline";
            loading.style.display = "none";
        }    
    }   

    // details buttom function
    var is_show = false;
    detailsButton.addEventListener('click', (e)=>{
        if(!is_show){
            is_show = true;
            document.getElementById('hide_details').style.display = "flex";
            detailsButton.innerText = "Details";
        }
        else{
            is_show = false;
            // window.resizeTo(280, 450)
            document.getElementById('hide_details').style.display = "none";
            detailsButton.innerText = "Details";    
        }
        e.preventDefault();
    }, false);

    // details link function
    details_link.addEventListener('click', (e)=>{
        var link = details_link.href;
        window.open(link, '_blank');
        e.preventDefault();
    }, false);

});