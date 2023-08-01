$(document).ready(function(){
    let counter
    initSessionValues()
    initDragNDrop()

    $(".add-btn").on('click', (event) => {createTask(event)})

   function createTaskElement(taskName, taskId){
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
        populateLists(taskLists)
    }
   }

   function completeTask(taskId){
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
    counter =  Number(JSON.parse(sessionStorage.getItem('completedCounter'))) + 1
    sessionStorage.setItem('completedCounter', JSON.stringify(counter))
    populateLists(taskLists, true)
    $("#star-svg").show(1000).slideDown(2000).hide(1000)
   }

   function createUniqueId(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
   }

   function populateLists(taskLists, increaseCounter){
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
    let taskId = $(event.target).parent().parent().attr('id')
    $("#modal-dialog").css({display : "block"})
    $("#dialog-content").empty()
    $("#dialog-content").append(createModalContent('delete'))

    $(".accept").on('click', function(){
        deleteTask(taskId)
        $("#modal-dialog").css({display: "none"})
    })
   }
   function editFormDialog(event){
    let taskId = $(event.target).parent().parent().attr('id')
    $("#modal-dialog").css({display : "block"})
    $("#dialog-content").empty()
    $("#dialog-content").append(createModalContent('edit'))

    $('.confirm-edit').on('click', function(){
        editTask(taskId, $('#taskNameEdit').val())
        $("#modal-dialog").css({display: "none"})
    })
   }

   function initSessionValues(){
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
        $(".task-item").on('dragstart', (event) => {
            setTimeout(() => $(event.target).addClass('dragging'), 0)
        })

        $(".task-item").on('dragend', (event) => {
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
            event.preventDefault()
            let draggingEl = [... $('.dragging')][0]
            const siblings = [...$(".task-item:not(.dragging)")]
            let nextSibling = siblings.find(sibling => {
                return event.clientY <= sibling.offsetTop + sibling.offsetHeight / 2
            })
            // event.target.insertBefore(draggingEl, nextSibling)
            $(event.currentTarget).append(draggingEl) 
           
            // if($(event.currentTarget).attr('id') === 'ul-not-important'){
            //     console.log(`aaa`)

            // }else if($(event.currentTarget).attr('id') === 'ul-important') {
            //     console.log(`bbb`)
            // }
        })
    }
})

