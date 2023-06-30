const addBtn = document.querySelector('.add-btn');
const modal = document.querySelector('.modal-cont');
const main = document.querySelector('.main-cont');
const textArea = document.querySelector('.textarea-cont');
let flag = false;


//function to add ticket to main container

function createTicket(){
    let ticketContent = document.createElement('div');
    ticketContent.setAttribute('class', 'ticket-cont');
    ticketContent.innerHTML = `<div class="ticket-color"></div>
    <div class="ticket-id">someID</div>
    <div class="task-area">Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, magnam sunt?</div>`;
    main.appendChild(ticketContent);
}


// Event listeners
addBtn.addEventListener('click', (e)=>{



    //display Modal only when flag is true
    flag = !flag;
    if(flag){
        modal.style.display = 'flex';
    }
    else{
        modal.style.display = 'none';
    }
})

// event listener to add main content when shift gets pressesd in modal

modal.addEventListener('keydown', e =>{
    key = e.key;
    if(key=='Shift'){
        createTicket();
        flag = false;
        modal.style.display = 'none';
        textArea.value = '';
    }
})



