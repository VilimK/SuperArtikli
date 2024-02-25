//Ajax funkcije koje komuniciraju sa controllerom,
//salju podatke koji se spremaju u bazu podataka

function AjaxDeleteArticle(articleID) {
    $.ajax({
        url: '/Home/DeleteArticle',
        method: 'POST',
        data: { id: articleID },
        success: function (response) {
            AjaxRefreshHomePage(); 
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function AjaxAddArticleToDatabase(name,category,price) {
    $.ajax({
        url: '/Home/AddArticle',
        method: 'POST',
        data: {
            name: name,
            category: category,
            price: price
        },
        success: function (response) {
            document.getElementById("addItemForm").reset();
            AjaxRefreshHomePage(); 
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function AjaxSendChangesOfArticleToDatabase(id,name,category,price) {
    $.ajax({
        url: '/Home/ChangeArticle',
        method: 'POST',
        data: {
            id: id,
            name: name,
            category: category,
            price: price
        },
        success: function (response) {
            document.getElementById("changeItemForm").reset();
            AjaxRefreshHomePage(); 
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function AjaxRefreshHomePage() {
    $.ajax({
        url: '/Home/Index',
        method: 'POST',
        success: function (htmlContent) {
            $('body').html(htmlContent);
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}