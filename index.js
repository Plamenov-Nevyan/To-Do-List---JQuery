$(document).ready(function(){
    if(!sessionStorage.getItem('taskLists')){
        sessionStorage.setItem('taskLists', JSON.stringify({
            important: [],
            notImportant: []
        }))
    }else {
    populateLists(JSON.parse(sessionStorage.getItem('taskLists')))
   }

    $(".add-btn").on('click', function(event){
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
        }
    })

   function createTaskElement(taskName, taskId){
    let li = $(`<li id=${taskId}></li>`)
    let p = $(`<p>${taskName}</p>`)
    let divBtns = $(`<div class="buttons"></div>`)
    let deleteBtn = $(`<button class="delete-btn">Delete</button>`).on('click', function(event){
        let taskId = $(event.target).parent().parent().attr('id')
        $("#modal-dialog").css({display : "block"})
        $("#dialog-content").empty()
        $("#dialog-content").append(createModalContent('delete'))

        $(".accept").on('click', function(){
            deleteTask(taskId)
            $("#modal-dialog").css({display: "none"})
        })
    })
    let editBtn =  $(`<button class="edit-btn">Edit</button>`)
    let completeBtn =  $(`<button class="complete-btn">Complete</button>`)
    $(divBtns).append(deleteBtn)
    $(divBtns).append(editBtn)
    $(divBtns).append(completeBtn)

    $(li).append(p)
    $(li).append(divBtns)

    return li
    //     return `<li id=${taskId}>
    //     <p class="text">${taskName}</p>
    //     <div class="buttons">
    //         <button>Complete</button>
    //         <button>Edit</button>
    //         <button class="delete-btn">Delete</button>
    //     </div>
    // </li>`
   }

   function deleteTask(taskId){
    let taskLists = JSON.parse(sessionStorage.getItem('taskLists'))
    if(taskLists.notImportant.some(task => task.taskId === taskId)){
        let task = taskLists.notImportant.find(task => task.taskId === taskId)
        console.log(taskLists.notImportant)
        taskLists.notImportant.splice(taskLists.notImportant.indexOf(task), 1)
        console.log(taskLists.notImportant)
    }
    // if(taskLists.notImportant.some(task => task.taskId === taskId)){
    //     taskLists.notImportant = taskLists.notImportant.filter(task => task.taskId !== taskId)
    // }else if(taskLists.important.some(task => task.taskId === taskId)){
    //     taskLists.important = taskLists.important.filter(task => task.taskId !== taskId)
    // }
    sessionStorage.setItem('taskLists', JSON.stringify(taskLists))
    populateLists(taskLists)
   }

   function createUniqueId(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
   }

   function populateLists(taskLists){
    $(".not-important-list").empty()
    $(".important-list").empty()
        if(taskLists.important.length > 0){
            for(let task of taskLists.important){
                $(".important-list").append(createTaskElement(task.taskName, task.taskId))
            }
        }
        if(taskLists.notImportant.length > 0){
            for(let task of taskLists.notImportant){
                $(".not-important-list").append(createTaskElement(task.taskName, task.taskId))
            }
        }
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
    }
   }
})

