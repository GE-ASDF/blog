function closeBtns(){
    Array.from(document.getElementsByClassName("btn-close")).forEach(btn =>{
        setTimeout(() => {
            btn.parentNode.remove();
        }, 5000);
        btn.addEventListener("click", (e)=>{
            e.target.parentNode.remove();
        })
    })
}
Array.from(document.getElementsByClassName("btn-close")).forEach(btn =>{
    setTimeout(() => {
        btn.parentNode.remove();
    }, 5000);
    btn.addEventListener("click", (e)=>{
        e.target.parentNode.remove();
    })
})

Array.from(document.getElementsByClassName("delete-button")).forEach(btn =>{
    btn.addEventListener("click", (e)=>{
        let prompt = window.confirm("Deseja realmente apagar este registro?");

        if(!prompt){
            e.preventDefault();
            return;
        }
    })
})

function setModalPropeties(url, method = 'POST', name, value){
    const formDoModalDeDelecao = document.getElementById("modal-de-delecao").querySelector("form")
    const input = formDoModalDeDelecao.querySelector("input")
    formDoModalDeDelecao.action = url;
    formDoModalDeDelecao.method = method;
    input.name = name;
    input.value = value;
}

function verifyOnUpdate(e, element){
    e.preventDefault();
    let array= window.location.href.split("/");
    let id = array[array.length - 1]
    let formUpdateCategory = document.querySelector("#form-update-category")
        let inputCategory = element.querySelector("input[name='id']").value
        if(id !== inputCategory){
            document.body.innerHTML += `
                <div id="mensagem-informacional" class="form-group d-flex flex-column">
                    <span class="alert m-1 d-flex justify-content-between align-items-center alert-danger">
                        <p>As informações não coincidem.</p>
                        <button type="button" class="btn btn-light btn-close mx-1"></button>
                    </span>
                </div>
            `
            closeBtns();
            e.preventDefault();
        }else{
            formUpdateCategory.submit();
        }
    
}