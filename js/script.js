// I hate snickers — Сегодня, в 9:32

const xhr = new XMLHttpRequest(),
    host = "http://localhost:8080",
    table = document.querySelector("#table"),
    submit = document.querySelector("#submit"),
    form = document.querySelector("#form"),
    createButt = document.querySelector("#createButt")

let title = document.querySelector("#title"),
    body = document.querySelector("#body"),
    createButtonState = false,
    mode = "idle"

this.id

function CreateCard({id, title, body}) {
    let card = document.createElement("div"),
        container = document.createElement("div"),
        buttContainer = document.createElement("div"),
        h1 = document.createElement("h1"),
        p = document.createElement("p"),
        order = document.createElement("button"),
        editButt = document.createElement("button"),
        deleteButt = document.createElement("button")

    card.classList.add("card")
    card.setAttribute("id", id)
    container.classList.add("container")
    buttContainer.classList.add("container", "buttContainer")
    h1.textContent = title
    p.textContent = body
    order.textContent = "Заказать"
    editButt.textContent = "Редактировать"
    deleteButt.textContent = "Удалить"
    editButt.classList.add("editButt")
    deleteButt.classList.add("deleteButt")
    buttContainer.onclick = ((e) => {
        let classButton = e.target.className
        switch (classButton) {
            case "editButt":
                if (form.classList.contains("hidden")) {
                    FormToggleVisibility()
                }
                let text = e.target.parentElement.parentElement
                mode = "editing"
                ChangeText(text.firstElementChild)
                break
            case "deleteButt":
                HandleDelete(this.id)
        }
    })
    card.onclick = ((e) => {
        const checkId = e.target.parentElement.parentElement.id
        console.log(checkId)
        this.id = checkId
        // if (checkId >= 0 && checkId < table.children.length) {
        // }
    })

    container.append(h1, p)
    buttContainer.append(order, editButt, deleteButt)
    card.append(container, buttContainer)
    table.append(card)
}

function ChangeText(text) {
    title.value = text.firstElementChild.textContent
    body.value = text.lastElementChild.textContent
}

function FormToggleVisibility() {
    form.classList.toggle("hidden")
    createButt.classList.toggle("backButton")
    if (createButtonState) {
        createButtonState = false
        createButt.textContent = "Cоздать"
        return
    }
    createButtonState = true
    createButt.textContent = "НАЗАД"
    mode = "idle"
    title.value = ""
    body.value = ""
}

createButt.addEventListener("click", () => {
    FormToggleVisibility()
    mode = "creating"
})

submit.addEventListener("click", () => {
    switch (mode) {
        case "creating":
            HandleCreate(title.value, body.value)
            FormToggleVisibility()
            break
        case "editing":
            HandleEdit(title.value, body.value)
            FormToggleVisibility()
            break
        default:
            console.log("idle")
    }
})

function HandleCreate(title, body) {
    console.log(title, body)
    xhr.open('POST', `${host}/product`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({title, body}));
    xhr.onload = function () {
        if (xhr.status != 200) {
            // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`)
        }
        HandleGetList()
    };
}

function HandleGetList() {
    xhr.open('GET', `${host}`);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status != 200) {
            // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`)
        } else {
            table.textContent = ""
            let response = JSON.parse(xhr.response)
            response.list.map((e) => {
                CreateCard(e)
            })
        }
    };
}

function HandleEdit(title, body) {
    xhr.open('PUT', `${host}/${this.id}`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({title, body}));
    xhr.onload = function () {
        if (xhr.status != 200) {
            // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`)
        }
        HandleGetList()
    };
}

function HandleDelete(id) {
    xhr.open('DELETE', `${host}/${id}`);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status != 200) {
            // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`)
        }
        HandleGetList()
    };
}

window.onload = HandleGetList