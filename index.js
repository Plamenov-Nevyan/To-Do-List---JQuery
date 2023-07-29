$(document).ready(function(){
    $(".add-btn").on('click', function(event){
        event.preventDefault()
        let taskName = $("#taskName").val()
        let importance = $("input[name=importance]:checked", '.add-form').val()
        if(taskName !== ''){
            if(importance === 'important'){
                $(".important-list").append(createTaskElement(taskName))
            }else{
                $(".not-important-list").append(createTaskElement(taskName))
            }
        }
    })

   function createTaskElement(taskName){
    return `<li>
        <p>${taskName}</p>
        <div class="buttons">
            <button>Complete</button>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    </li>`
   }
})

