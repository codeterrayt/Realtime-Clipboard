function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
  }
  
function b64_to_utf8( str ) {
return decodeURIComponent(escape(window.atob( str )));
}

const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  

  function CopyText(TextToCopy) {
    var TempText = document.createElement("input");
    TempText.value = TextToCopy;
    document.body.appendChild(TempText);
    TempText.select();
    
    document.execCommand("copy");
    document.body.removeChild(TempText);
    
    Toast.fire({
        icon: 'success',
        title: 'User Id Copied Successfully!'
      })
  }

function CopyLink(TextToCopy) {
    var TempText = document.createElement("input");
    var url = new URL(window.location.href);
    url.searchParams.append('clip', TextToCopy);
    TempText.value = url.href;
    document.body.appendChild(TempText);
    TempText.select();
    
    document.execCommand("copy");
    document.body.removeChild(TempText);
    
    Toast.fire({
        icon: 'success',
        title: 'Link Copied Successfully!'
      })
  }


let is_creator = false;

const getClip = () => {
    let url = new URL(window.location.href);
    let clip_url = url.searchParams.get("clip");
    return clip_url;
}

let timer;              // Timer identifier
const waitTime = 500;   // Wait time in milliseconds 

// Search function
const update_global_content = (text) => {
    let clip_url = getClip();
    document.getElementById("saving_text").style.opacity = "1";
    text = utf8_to_b64(text);
    if(clip_url == null) return;
    const xttp = new XMLHttpRequest();
    xttp.open('GET', `./api.php?action=update_clipboard&url=${clip_url}&data=${text}`, true);
    
    xttp.onreadystatechange = function(){
        if(xttp.readyState == 4 && xttp.status == 200){
            document.getElementById("saving_text").style.opacity = "0";
        }
    }
    
    xttp.send();
};

// Listen for `keyup` event
const input = document.querySelector('#main_clipboard');
input.addEventListener('keyup', (e) => {
    const text = e.currentTarget.value;

    // Clear timer
    clearTimeout(timer);

    // Wait for X ms and then process the request
    timer = setTimeout(() => {
        update_global_content(text);
    }, waitTime);
});

document.getElementById("delete_all_clipboards").addEventListener("click", ()=>{
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
            const xttp = new XMLHttpRequest();
            xttp.open('GET', `./api.php?action=delete_all_clipboards`, true);
            
            xttp.onreadystatechange = function(){
                if(xttp.readyState == 4 && xttp.status == 200){
                    clear_clipboard();
                    fetch_clipboards();
                }
            }
            
            xttp.send();
        }
      })
});

document.getElementById("btn-logout").addEventListener("click", async (e)=>{
    Swal.fire({
        title: 'Are you sure?',
        text: "Store the User Id or Else you will lose access to your clipboards!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Logout',
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
            const xttp = new XMLHttpRequest();
            swal.showLoading();
            xttp.open('GET', `./api.php?action=logout`, true);
            
            xttp.onreadystatechange = function(){
                if(xttp.readyState == 4 && xttp.status == 200){
                    swal.close();
                    clear_clipboard();
                    Swal.fire({
                        title: 'Enter User Id to Login',
                        input: 'text',
                        inputAttributes: {
                          autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Login',
                        showLoaderOnConfirm: true,
                        cancelButtonText : "Continue as Guest",
                        allowOutsideClick: () => !Swal.isLoading()
                      }).then((result) => {
                          result.dismiss = false;
                          console.log(result);
                          if(result.isConfirmed || result.dismiss == "cancel"){
                            fetch(`./api.php?action=login&user_id=${result.value}`).then(r=>{
                                clear_clipboard();
                                fetch_clipboards();
                            });
                            Toast.fire({
                                icon: 'success',
                                title: 'Signed in successfully'
                              })
                          }else{
                            fetch(`./api.php?action=login_as_guest`).then(r=>{
                                clear_clipboard();
                                Toast.fire({
                                    icon: 'success',
                                    title: 'Logged in as Guest User!'
                                  })
                            });
                          }
                      })
                }
            }
            
            xttp.send();
        }
      })
});

document.getElementById("show-user-id").addEventListener("click",(e)=>{

    const xttp = new XMLHttpRequest();
    xttp.open('GET', `./api.php?action=get_user_id`, true);
    
    xttp.onreadystatechange = function(){
        if(xttp.readyState == 4 && xttp.status == 200){
            const response = JSON.parse(xttp.responseText);
            const user_id = response.user_id;
            Swal.fire({
                title: 'User Id (Keep it Secret)',
                text: "Your User Id is: " + user_id,
                icon: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Copy',
                showCancelButton:true,
                cancelButtonText: 'Close'
              }).then((result) => {
                if (result.value) {
                    CopyText(user_id);
                }
              })
        }
    }
    
    xttp.send();
    
    
})

document.getElementById("open-with-clip-id-btn").addEventListener("click", async ()=>{
    const { value: clip } = await Swal.fire({
        title: 'Enter Clip ID',
        input: 'text',
        inputValue: "",
        confirmButtonText:"Open",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Enter Valid Clip ID!'
          }
        }
      })
      if(clip){
        var url = new URL(window.location.href);
        url.searchParams.append('clip', clip);
        window.open(url);
      }
})

document.getElementById("create-clipboard").addEventListener("click", (e) => {
    Swal.fire({
        title: 'ClipBoard Title', 
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Create',
        showLoaderOnConfirm: true,
        preConfirm: (title) => {
            n_title = utf8_to_b64(title);
          return fetch(`./api.php?action=create_clipboard&note_title=${n_title}&data=`)
            .then(response => {
              if (!response.ok) {
                throw new Error(response.statusText)
              }
              return response.json()
            })
            .catch(error => {
              Swal.showValidationMessage(
                `Enter Valid Title`
              )
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
            clear_clipboard();
            fetch_clipboards();
        }
      })
});


const update_content = () =>{
    let clip_url = getClip();
    
    if(clip_url == null) return;

    document.getElementById("saving_text").style.opacity = "1";
    const xttp = new XMLHttpRequest();
    xttp.open('GET', `./api.php?action=get_clipboard&url=${clip_url}`, true);
    xttp.onreadystatechange = function(){
        if(xttp.readyState == 4 && xttp.status == 200){
            const response = JSON.parse(xttp.responseText);
            document.getElementById("saving_text").style.opacity = "0";
            if(!response.creator){
                document.getElementById('main_clipboard').setAttribute("readonly", "readonly");
            }

            if(response.creator){
                document.getElementById("note_title").contentEditable = "true";
                document.getElementById("note_title").classList.add("editClass");
                clearInterval(interval);
            }

            document.getElementById('main_clipboard').value = b64_to_utf8(response.data);
            document.getElementById("note_title").innerText = b64_to_utf8(response.note_title);
            document.title = b64_to_utf8(response.note_title);
        }
    }
    xttp.send();
}


const update_title = (title)=>{
    document.title = title;
    title = utf8_to_b64(title);
    let clip_url = getClip();
    if(clip_url == null) return;
    document.getElementById("saving_text").style.opacity = "1";
    const xttp = new XMLHttpRequest();
    xttp.open('GET', `./api.php?action=update_title&url=${clip_url}&title=${title}`, true);
    xttp.onreadystatechange = function(){
        if(xttp.readyState == 4 && xttp.status == 200){
            document.getElementById("saving_text").style.opacity = "0";
        }
    }
    
    xttp.send();
}

const title_input = document.querySelector('#note_title');
title_input.addEventListener('keyup', (e) => {
    const text = e.currentTarget.innerText;
    clearTimeout(timer);
    timer = setTimeout(() => {
        update_title(text);
    }, waitTime);
});


document.getElementById("note_title").addEventListener("focus",(e)=>{
    document.getElementById("note_title").classList.remove("editClass");
    document.getElementById("note_title").focus();
})

document.getElementById("note_title").addEventListener("blur",(e)=>{
    document.getElementById("note_title").classList.add("editClass");
})


// document.querySelector("#note_title_edit").addEventListener("click", (e) => {
//     this.contentEditable = "true";
// })

const create_clipboard_row = (clipboard , no) => {
    let row = document.createElement("tr");
    let url = clipboard.unique_url;
    let note_title = b64_to_utf8(clipboard.note_title);
    let id = clipboard.d_id;

    row.innerHTML = `
        <td>${no}</td>
        <td id="note_title_edit">${note_title}</td>
        <td>${url}</td>
        <td>
            <button class="btn-open" onclick="window.location.href = './index.php?clip=${url}'">Open</button>
            <button class="btn-copy-link" onclick="CopyLink('${url}')">Copy Link</button>
            <button class="btn-delete" onclick="delete_clipboard(${id})">Delete</button>
        </td>
    `;

    return row;
}

const delete_clipboard = (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            const xttp = new XMLHttpRequest();
            xttp.open('GET', `./api.php?action=delete_clipboard&d_id=${id}`, true);
            xttp.onreadystatechange = function(){
                if(xttp.readyState == 4 && xttp.status == 200){
                    if(String(xttp.responseText).length != 0){
                        const response = JSON.parse(xttp.responseText);
                        console.log(response)
                        if(response.status){
                            clear_clipboard();
                            fetch_clipboards();
                        }
                    }
                }
            }
            xttp.send();
        }
      })
}

const clear_clipboard = () => {
    while(document.querySelector('#data-table-body').firstChild) {
        document.querySelector("#data-table-body").firstChild.remove();
    }
}

const fetch_clipboards = () => {
    document.getElementById("fetching_data_progress").style.display = "block";
    const xttp = new XMLHttpRequest();
    xttp.open('GET', `./api.php?action=fetch_clipboards`, true);
    xttp.onreadystatechange = function(){
        if(xttp.readyState == 4 && xttp.status == 200){
            if(String(xttp.responseText).length != 0){
                const response = JSON.parse(xttp.responseText);
                let clipboards = response.clipboards;
                document.getElementById("fetching_data_progress").style.display = "none";
                for(let i = 0; i < clipboards.length; i++){
                    document.getElementById("data-table-body").appendChild(create_clipboard_row(clipboards[i],i+1));
                }
            }
        }
    }
    xttp.send();
}

if(getClip() != null){
    document.getElementById("dashboard_box").style.display = "none";
    document.getElementById("content-box").style.display = "block";
    update_content();
}else{
    fetch_clipboards();
}
document.getElementById("copy-btn").addEventListener("click", () => {
    document.getElementById('main_clipboard').select();
    document.execCommand('copy');
    Toast.fire({
        icon: 'success',
        title: 'Copied to clipboard',
        timer:1000
    })
})

let interval = setInterval(update_content, 1000);




