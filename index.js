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
                $(".important-list").append(createTaskElement(taskName))
                taskLists.important = [...taskLists.important, {taskName, taskId}]
            }else{
                $(".not-important-list").append(createTaskElement(taskName))
                taskLists.notImportant = [...taskLists.notImportant, {taskName, taskId}]
            }
            sessionStorage.setItem('taskLists', JSON.stringify(taskLists))
        }
    })

   function createTaskElement(taskName, taskId){
    return `<li id=${taskId}>
        <p>${taskName}</p>
        <div class="buttons">
            <button>Complete</button>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    </li>`
   }

   function createUniqueId(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
   }

   function populateLists(taskLists){
    console.log(taskLists)
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
})

