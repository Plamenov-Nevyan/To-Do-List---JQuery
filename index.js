$(document).ready(function(){
    let counter  // Initialize completed tasks counter
    initSessionValues() // initalize session (task lists)
    initDragNDrop() // Initialize drag'n drop functionality between lists
    $(".add-btn").on('click', (event) => {createTask(event)}) // attach click event for creating tasks on the Add Task button

   function createTaskElement(taskName, taskId){
    // Create the HTML element for new li item along with it's children (buttons and text) (task)
    let li = $(`<li id=${taskId} draggable="true" class="task-item"></li>`)
    let p = $(`<p>${taskName}</p>`)                     
    let divBtns = $(`<div class="buttons"></div>`)
    let deleteBtn = $(`<button class="delete-btn">Delete</button>`).on('click', function(event){deleteConfirmation(event)})
    let editBtn =  $(`<button class="edit-btn">Edit</button>`).on('click', function(event){editFormDialog(event)})
    let completeBtn =  $(`<button class="complete-btn">Complete</button>`).on('click', function(){completeTask($(li).attr('id'))})
    $(divBtns).append(deleteBtn)
    $(divBtns).append(editBtn)
    $(divBtns).append(completeBtn)

    $(li).append(p)
    $(li).append(divBtns)
    return li
   }  

   function deleteTask(taskId){
    // Find in which array the task resides, delete it and save the new array while passing it to be rendered
    let taskLists = JSON.parse(sessionStorage.getItem('taskLists')) 
    if(taskLists.notImportant.some(task => task.taskId === taskId)){
        let task = taskLists.notImportant.find(task => task.taskId === taskId)
        taskLists.notImportant.splice(taskLists.notImportant.indexOf(task), 1)  
    }                                                                              
    else if(taskLists.important.some(task => task.taskId === taskId)){            
        let task = taskLists.important.find(task => task.taskId === taskId)
        taskLists.important.splice(taskLists.important.indexOf(task), 1)
    }
    sessionStorage.setItem('taskLists', JSON.stringify(taskLists))
    populateLists(taskLists)
   }

   function editTask(taskId, updatedName){
    //Find in which array the task resides and replace it with the new one while passing it to be rendered
    let taskLists = JSON.parse(sessionStorage.getItem('taskLists'))
    if(taskLists.notImportant.some(task => task.taskId === taskId)){
        let task = taskLists.notImportant.find(task => task.taskId === taskId)                 
        let updatedTask = {...task, taskName: updatedName}                                    
        taskLists.notImportant.splice(taskLists.notImportant.indexOf(task), 1, updatedTask)
    }
    else if(taskLists.important.some(task => task.taskId === taskId)){
        let task = taskLists.important.find(task => task.taskId === taskId)
        let updatedTask = {...task, taskName: updatedName}
        taskLists.important.splice(taskLists.important.indexOf(task), 1, updatedTask)
    }
    sessionStorage.setItem('taskLists', JSON.stringify(taskLists))
    populateLists(taskLists)
   }

   function createTask(event){
     // Create the the task HTML li element and append it to it's corresponding list (taken from the radio inputs for importance)
     // and also save it to it's corresponding array in the session with taskName and taskId properties
    event.preventDefault()
    let taskName = $("#taskName").val()
    let importance = $("input[name=importance]:checked", '.add-form').val()      
    if(taskName !== ''){                                                           
        let taskLists = JSON.parse(sessionStorage.getItem('taskLists'))           
        let taskId = createUniqueId()                                             
        if(importance === 'important'){
            $(".important-list").append(createTaskElement(taskName, taskId))
            taskLists.important = [...taskLists.important, {taskName, taskId}]
        }else{
            $(".not-important-list").append(createTaskElement(taskName, taskId))
            taskLists.notImportant = [...taskLists.notImportant, {taskName, taskId}]
        }
        sessionStorage.setItem('taskLists', JSON.stringify(taskLists))
        $("#taskName").val('')
        populateLists(taskLists)
    }
   }

   function completeTask(taskId){
    //  Find and delete task through it's id and also update counter with it's previous saved value + 1. Render the updated arrays afterwards
    let taskLists = JSON.parse(sessionStorage.getItem('taskLists'))
    if(taskLists.notImportant.some(task => task.taskId === taskId)){
        let task = taskLists.notImportant.find(task => task.taskId === taskId)
        taskLists.notImportant.splice(taskLists.notImportant.indexOf(task), 1)
    }
    else if(taskLists.important.some(task => task.taskId === taskId)){
        let task = taskLists.important.find(task => task.taskId === taskId)
        taskLists.important.splice(taskLists.important.indexOf(task), 1)
    }
    sessionStorage.setItem('taskLists', JSON.stringify(taskLists))
    counter =  Number(JSON.parse(sessionStorage.getItem('completedCounter'))) + 1 //Update the variable in the main function so it can be rendered properly
    sessionStorage.setItem('completedCounter', JSON.stringify(counter))
    populateLists(taskLists, true) // passinng the updated arrays and true - so populateLists can also re-render the completed tasks counter
    $("#star-svg").show(1000).slideDown(2000).hide(1000)
   }

   function createUniqueId(){
    // Create unique id for every created task
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
   }

   function populateLists(taskLists, increaseCounter){
   // Empty lists and remove the header for  no tasks (if present). Append the updated arrays coming from the Create, Edit, Delete and Complete
   // functions, while using the create function  for generating li elements with task Id's and their names as text. If increaseCounter is true
   // re-render the completed tasks counter with the counter variable in the main function 
    $('.zero-tasks-header').remove()
    $(".not-important-list").empty()
    $(".important-list").empty()
        if(taskLists.important.length > 0){
            for(let task of taskLists.important){
                $(".important-list").append(createTaskElement(task.taskName, task.taskId))
            }
        }else{
            $('<h3 class="zero-tasks-header">No tasks added here yet..</h3>').insertBefore($(".important-list"))
        }
        if(taskLists.notImportant.length > 0){
            for(let task of taskLists.notImportant){
                $(".not-important-list").append(createTaskElement(task.taskName, task.taskId))
            }
        }else{
            $('<h3 class="zero-tasks-header">No tasks added here yet..</h3>').insertBefore($(".not-important-list"))
        }
        if(increaseCounter){
            $('.counter').text(`Completed Tasks: ${counter}`)
        }

        initDragNDrop()
   }

   function createModalContent(action){
    //according to the action generate content for delete confirmation or edit form
    if(action === 'delete'){
        return `<div class="wrapper">
            <p>Are you sure you want to delete this task ?</p>
            <div class="modal-btns">
                <button class="accept">Yes</button>
                <button class="cancel">No</button>
            </div>
        </div>
        `
    }else if(action === 'edit'){
        return `<div class="wrapper">
            <form class="edit-form">
                <input type="text" name="taskNameEdit" id="taskNameEdit" />
                <button class="confirm-edit">Confirm Edit</button>
                <button class="cancel">Cancel</button>
            </form>
        </div>
        `
    }
   }

   function deleteConfirmation(event){
    //attach the generated delete confirmation content to the modal and add event listeners to the accept and cancel buttons
    let taskId = $(event.target).parent().parent().attr('id')
    $("#modal-dialog").css({display : "block"})
    let closeBtn = $(".close")
    $("#dialog-content").empty()
    $("#dialog-content").append(closeBtn)
    $("#dialog-content").append(createModalContent('delete'))
    $(".close").on('click', () => closeModal())
    $(".accept").on('click', function(){
        deleteTask(taskId)
        $("#modal-dialog").css({display: "none"})
    })

    $(".cancel").on('click', () =>  closeModal())
   }
   function editFormDialog(event){
    //attach the generated edit form to the modal and add event listeners to the accept and cancel buttons
    let taskId = $(event.target).parent().parent().attr('id')
    $("#modal-dialog").css({display : "block"})
    $("#dialog-content").empty()
    $("#dialog-content").append(createModalContent('edit'))

    $('.confirm-edit').on('click', function(){
        editTask(taskId, $('#taskNameEdit').val())
        $("#modal-dialog").css({display: "none"})
    })

    $(".cancel").on('click', () => closeModal())
   }

   function initSessionValues(){
    // Check if there is session already and initialize with present values, if not generate new one
        if(!sessionStorage.getItem('completedCounter')){
            sessionStorage.setItem('completedCounter', JSON.stringify('0'))
            counter = 0
       }else {
            counter = Number(JSON.parse(sessionStorage.getItem('completedCounter')))
       }
        if(!sessionStorage.getItem('taskLists')){
            sessionStorage.setItem('taskLists', JSON.stringify({
                important: [],
                notImportant: []
            }))
        }else {
        populateLists(JSON.parse(sessionStorage.getItem('taskLists')), true)
        }

        $("#star-svg").hide()
   }

   function initDragNDrop(){
        // Using the HTML drag'n drop functionality attach event listeners to the lists and list items
        $(".task-item").on('dragstart', (event) => {
            setTimeout(() => $(event.target).addClass('dragging'), 0) // add class "dragging" to differentiate the specific li item we are 
        })                                                            // dragging from the rest 

        $(".task-item").on('dragend', (event) => {
            // When we drop the item, remove the dragging class and update the arrays in the session with the new position of the li item
            $(event.target).removeClass('dragging')
            let taskLists = JSON.parse(sessionStorage.getItem('taskLists'))
            let taskData = {
                taskName: $(event.target).children()[0].innerText,
                taskId: $(event.target).attr('id')
            }
            if($(event.target).parent().attr('id') === 'ul-not-important'){

                let task = taskLists.important.find(task => task.id === event.target.id)
                taskLists.important.splice(taskLists.important.indexOf(task), 1)
                taskLists.notImportant = [...taskLists.notImportant, taskData]

            }else if($(event.target).parent().attr('id') === 'ul-important') {

                let task = taskLists.notImportant.find(task => task.id === event.target.id)
                taskLists.notImportant.splice(taskLists.notImportant.indexOf(task), 1)
                taskLists.important = [...taskLists.important, taskData]
            }

            sessionStorage.setItem('taskLists', JSON.stringify(taskLists))
            populateLists(taskLists)
        })

        $(".not-important-list, .important-list").on('dragover', (event) => {
            //  append the li item with class "dragging" to the list we are currently hovering on
            event.preventDefault()
            let draggingEl = [... $('.dragging')][0]
            $(event.currentTarget).append(draggingEl) 
        })
    }

    function closeModal(){
        // Close the modal
        $('#modal-dialog').css({display: 'none'})
    }
})

