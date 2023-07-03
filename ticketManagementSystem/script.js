const addBtn = document.querySelector('.add-btn');
const removeBtn = document.querySelector('.remove-btn');
const modal = document.querySelector('.modal-cont');
const main = document.querySelector('.main-cont');
const textArea = document.querySelector('.textarea-cont');
const allPriorityColors = document.querySelectorAll('.priority-color');
const toolBoxColor = document.querySelectorAll('.color');
let flag = false;
let removeFlag = false;
const colors = ['one', 'two', 'three', 'four'];
let modalPriorityColor = colors[colors.length -1];

const lockClass = 'fa-lock';
const unlockClass = 'fa-unlock';

let ticketsArray = [];
//populating UI if data already stored in local storage
if (localStorage.getItem("task-ticket")) {
    // Retrieve and display tickets
    ticketsArray = JSON.parse(localStorage.getItem("task-ticket"));
    ticketsArray.forEach((ticketObj) => {
      createTicket(
        ticketObj.ticketColor,
        ticketObj.ticketTask,
        ticketObj.ticketID
      );
    });
  }

// for filtering purposes
for(let i = 0;i<toolBoxColor.length;i++){
    toolBoxColor[i].addEventListener('click', e =>{
        let currentToolBoxColor = toolBoxColor[i].classList[0];
       
        let filteredTickets = ticketsArray.filter((ticketObj, indx)=>{
            return currentToolBoxColor === ticketObj.ticketColor;
        });
        let allTicketsCount = document.querySelectorAll('.ticket-cont');
        for(let i =0;i<allTicketsCount.length;i++){
            allTicketsCount[i].remove();
        }
        filteredTickets.forEach((ticketObj, indx)=>{
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })
    //adding all tickets on dblclick
    toolBoxColor[i].addEventListener('dblclick', e=>{
        let allTicketsCount = document.querySelectorAll('.ticket-cont');
        for(let i =0;i<allTicketsCount.length;i++){
            allTicketsCount[i].remove();
        }

        ticketsArray.forEach((ticketObj, indx)=>{
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })
    
   
}

//function to add ticket to main container
function createTicket(ticketColor, ticketTask, ticketID){
    let id = ticketID || Math.floor((Math.random() * 1000));
    let ticketContent = document.createElement('div');
    ticketContent.setAttribute('class', 'ticket-cont');
    ticketContent.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`;
    main.appendChild(ticketContent);
    if(!ticketID){
    ticketsArray.push({ticketColor, ticketTask, ticketID : id});
    localStorage.setItem('task-ticket', JSON.stringify(ticketsArray));
}
    //to remove ticket 
    handleRemoval(ticketContent,id);
    handleLock(ticketContent,id);
    handleColor(ticketContent, id);
}
// function to remove ticket
function handleRemoval(ticket,id){
    ticket.addEventListener('click',e=>{
        let ticketIdx = getTicketIdx(id);
    console.log(removeFlag);
    if(!removeFlag){
        return
    }
    //db removal 
    ticketsArray.splice(ticketIdx,1);
    let stringfyArray = JSON.stringify(ticketsArray);
    localStorage.setItem('task-ticket', stringfyArray);

    ticket.remove();
    }) //removed from UI
}

//function to handle the lock functionality on a ticket
function handleLock(ticket, id){
    const taskArea = ticket.querySelector('.task-area');
    const ticketElem = ticket.querySelector('.ticket-lock');
    const ticketLock = ticketElem.children[0];
    ticketLock.addEventListener('click', (e)=>{
        let ticketIdx = getTicketIdx(id);
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            taskArea.setAttribute('contenteditable','true');
        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            taskArea.setAttribute('contenteditable','false');

        }
        ticketsArray[ticketIdx].ticketTask = taskArea.innerHTML;
        localStorage.setItem('task-ticket', JSON.stringify(ticketsArray));
    })
}

function handleColor(ticket, id){
    const ticketColor = ticket.querySelector('.ticket-color');
    ticketColor.addEventListener('click',(e)=>{
        let ticketIdx = getTicketIdx(id);

        let currentTicketColor = ticketColor.classList[1];
      
        let currentTicketColorInx = colors.findIndex(color=>{
            return currentTicketColor === color;
        })
        console.log(currentTicketColorInx);
        currentTicketColorInx++;
        let newTicketColorInx = currentTicketColorInx % colors.length;
        let newTicketColor = colors[newTicketColorInx];
     
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

        //modify data in local storage
        ticketsArray[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem('task-ticket', JSON.stringify(ticketsArray));
    })
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

allPriorityColors.forEach((colorElement, inx) =>{
    colorElement.addEventListener('click', (e)=>{
        allPriorityColors.forEach((priorityColorElements, inx)=>{
            priorityColorElements.classList.remove('border');
        })
    colorElement.classList.add('border');
    modalPriorityColor = colorElement.classList[0];

    })
})


modal.addEventListener('keydown', e =>{
    key = e.key;
    if(key=='Shift'){
        createTicket(modalPriorityColor, textArea.value);
        
        flag = false;
        setDefaultModalColor();
        
    }
})


// event listener to handle the remove btn
removeBtn.addEventListener('click', (e)=>{
    removeFlag = !removeFlag;
   
})


//setting default modal priority color
function setDefaultModalColor(){
    modal.style.display = 'none';
    textArea.value = '';
    modalPriorityColor = colors[colors.length -1];
    allPriorityColors.forEach(colorElem=>{
        colorElem.classList.remove('border');
    })
    allPriorityColors[allPriorityColors.length -1].classList.add('border');
}


//function to get tickets id
function getTicketIdx(id){
    let ticketIdx = ticketsArray.findIndex((ticketObj)=>{
        return ticketObj.ticketID === id;
    })
    return ticketIdx;
}
