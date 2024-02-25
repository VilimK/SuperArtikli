
//Funkcije koje omogucuju rad home stranice, uglavnom kreiraju i manipuliraju DOM objektima

function CloseModal() {
    document.getElementById("changeArticleModal").style.display = "none";
    document.getElementById("addArticleModal").style.display = "none";
}

function AddTextboxOnModal(labelText, name, formId) {
    const form = document.getElementById(formId);
    var label = document.createElement("label");
    label.appendChild(document.createTextNode(labelText));

    var textbox = document.createElement("input");
    textbox.type = "text";
    textbox.value = "";
    textbox.id = name;
    textbox.name = name;

    label.appendChild(textbox);
    form.appendChild(label);
}

function AddSelectOnModal(name, id, array, labelText, formId) {
    const form = document.getElementById(formId);

    var label = document.createElement("label");
    label.appendChild(document.createTextNode(labelText));

    var select = document.createElement("select");
    select.name = name;
    select.id = id;

    var option = document.createElement("option");
    option.selected = "selected";
    option.value = "Odaberite postojeću kategoriju...";
    option.textContent = "Odaberite postojeću kategoriju...";
    select.appendChild(option);

    for (let i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        option.value = array[i];
        option.textContent = array[i];
        select.appendChild(option);
    }
    label.appendChild(select);
    form.appendChild(label);
}

function DisplayAddArticleModal() {
    document.getElementById('addArticleModal').style.display = 'block';
}

function DisplayChangeArticleModal() {
    var articleID = (this.id).replace('Change', '');
    var modalHeader = document.getElementById("changeHeader");
    modalHeader.innerHTML = "Izmjena artikla sa ID-em " + articleID;
    modalHeader.value = articleID;
    document.getElementById('changeArticleModal').style.display = 'block';
}

function ExtractCategories(articlesData) {
    var categories = [];
    articlesData.forEach(function (item) {
        if (categories.indexOf(item.kategorija) === -1) categories.push(item.kategorija);
    });
    return categories;
}

function ExportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(articlesGlobal);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Super artikli");
    XLSX.writeFile(workbook, "Super artikli.xlsx", { compression: true });
}

function CreateArticlesTable(articlesData) {
    var temp_arr = ["ID", "Naziv", "Kategorija", "Cijena", "btnPromjena", "btnBrisanje"];
    const body = document.body;
    var table = document.createElement("table");
    table.id = "articleTable";

    //Prvi redak - Header
    var row = table.insertRow();
    row.className = "headRow"; 
    for (let i = 0; i < temp_arr.length - 2; i++) {
        var cell = row.insertCell();
        cell.id = "head" + temp_arr[i];
        cell.value = temp_arr[i];
        cell.textContent = temp_arr[i];
    }
    row.insertCell();
    row.insertCell();
    //Ostali retci sa podacima o pojedinim artiklima
    articlesData.forEach(function (item) {
        var row = table.insertRow();

        //Dodavanja celija u retku
        var cell = row.insertCell();
        cell.value = item.ID;
        cell.textContent = item.ID;

        var cell = row.insertCell();
        cell.value = item.naziv;
        cell.textContent = item.naziv;

        var cell = row.insertCell();
        cell.value = item.kategorija;
        cell.textContent = item.kategorija;

        var cell = row.insertCell();
        cell.value = item.cijena;
        cell.textContent = item.cijena + " €";

        //Dodavanje buttona promijeni i obrisi u svakom retku
        var cell = row.insertCell();
        AddTableButton("Change", "Promijeni", cell, item.ID);
        var cell = row.insertCell();
        AddTableButton("Delete", "Obriši", cell, item.ID);
    });
    body.appendChild(table);
}

function AddButton(name, value, id, eventFunctionName, NodeToAppend,className) {
    var btn = document.createElement("button");
    btn.id = id;
    btn.name = name;
    btn.value = value;
    btn.textContent = value;
    btn.className = className;
    NodeToAppend.appendChild(btn);
    btn.addEventListener("click", eventFunctionName)
}

function AddTableButton(name, value, cell, articleID) {
    var btn = document.createElement("button");
    btn.id = name + articleID;
    btn.name = name;
    btn.value = value;
    btn.textContent = value;
    if (name === "Change") {
        btn.addEventListener("click", DisplayChangeArticleModal);
        btn.className = "changeBtn";
    }
    else if (name === "Delete") {
        btn.addEventListener("click", DeleteArticle);
        btn.className = "deleteBtn";
    }
    cell.appendChild(btn);
}

function SendChangedArticlesParametersInDatabase() {
    var name = document.getElementById("changeArticleName").value;
    var category = document.getElementById("changeArticleCategoryBox").value;
    var price = document.getElementById("changeArticlePrice").value;
    
    if (price === "" && name === "" && category === "") {
        alert("Niste izmjenili niti jedan parametar!");
        CloseModal();
        return;
    }

    if (!AreChangedParametersValid(name, category, price)) return; 
    CloseModal();  
    var id = (document.getElementById("changeHeader")).value;
    AjaxSendChangesOfArticleToDatabase(id, name, category, price);
}

function AreChangedParametersValid(name, category, price) {
    var pricePattern = /^\d{1,8}[.,]?\d{0,2}$/;
    if ((!/^[a-zA-Z0-9\s]*$/.test(name) || name.length > 255)) {
        alert("Invalid name.");
        return false;
    }
    if ((!/^[a-zA-Z0-9\s]*$/.test(category) || category.length < 2 || category.length > 255) && category != "") {
        alert("Invalid category.");
        return false;
    }

    if (!pricePattern.test(price) && price != "") {
        alert("Invalid price!");
        return false;
    }

    return true;
}

function AreParametersValid(name, category, price) {
    var pricePattern = /^\d{1,8}[.,]?\d{0,2}$/;

    if (!/^[a-zA-Z0-9\s]+$/.test(name) || name.length < 2 || name.length > 255) {
        alert("Invalid name.");
        return false; 
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(category) || category.length < 2 || category.length > 255) {
        alert("Invalid category.");
        return false;
    }

    if (!pricePattern.test(price)) {
        alert("Invalid price!");
        return false; 
    } 
    return true;
}


function SendArticlesParametersInDatabase() {
    var name = document.getElementById("addArticleName").value;
    var category = document.getElementById("addArticleCategoryBox").value;
    var price = document.getElementById("addArticlePrice").value;

    if (!AreParametersValid(name, category, price)) return; 
    CloseModal();
    AjaxAddArticleToDatabase(name, category, price);
}

function DeleteArticle() {
    var articleID = (this.id).replace('Delete', '');
    AjaxDeleteArticle(articleID);
}