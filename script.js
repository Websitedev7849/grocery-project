let credentials = document.querySelectorAll('.credentials');

const bagButton = document.querySelector('.bagButton');
const editItems = document.querySelector('.edit-items');

const sendOrderBtn = document.getElementById('send-order');
const orderId = document.querySelector('.order-id');
const continueShopping = document.querySelector('.continue-shopping');

let tbody = document.querySelector('#tbody');

const firstLayer = document.querySelector('.first-layer');
const secondLayer = document.querySelector('.second-layer');
const thirdLayer = document.querySelector('.third-layer');
const fourthLayer = document.querySelector('.fourth-layer');

secondLayer.classList.remove('d-flex');
secondLayer.classList.add('d-none');

thirdLayer.classList.add('d-none');   

fourthLayer.classList.remove('d-flex');
fourthLayer.classList.add('d-none');

const confirm = document.querySelector('.confirm');

let items = [];

let selectedItems = [];

async function appendtoFirstLayer(){
    let response = await fetch("https://grocery-store-49.herokuapp.com/get-stock");
    items = await response.json();

    items.forEach(item => {
        if(item.availibility === 'y'){
            let divCard = createDivCard(item);
            firstLayer.appendChild(divCard);
        }
    });
    
    //function to create div.card element
    function createDivCard(item){
        let divCard = document.createElement('div');
        divCard.setAttribute('class', 'card m-2');

        let img = document.createElement('img');
        img.setAttribute('class', 'card-img-top');
        
        let divCardBody = document.createElement('div');
        divCardBody.setAttribute('class', 'card-body');
        
        divCard.appendChild(img);
        divCard.appendChild(divCardBody);

        let h5 = document.createElement('h5');
        h5.setAttribute('class', 'card-title');

        let p = document.createElement('p');
        p.setAttribute('class', 'card-text');

        let select = document.createElement('select');
        select.setAttribute('class', 'form-control qty');
        
        for(let i=0; i<=5; i++){
            let option = document.createElement('option');
            option.value = i;
            option.innerText = i + 'kg';
            select.appendChild(option);
        }
        
        divCardBody.appendChild(h5);
        divCardBody.appendChild(p);
        divCardBody.appendChild(select);
        
        img.setAttribute('src', item.imgSrc);
        h5.innerText = item.name;
        p.innerText = 'Rs.' + item.price;
        select.setAttribute('id', item.name);

        return divCard;
    }

    // code to update selctedItems
    const qty = document.querySelectorAll('.qty');
    qty.forEach(element => {
        element.addEventListener('change', e=>{
            let target = e.target;
            
            for (let i = 0; i < items.length; i++) {
                if (target.id === items[i].name) {
                    items[i].qty = target.value;
                    items[i].total = items[i].qty * items[i].price;
                }                
            }
        });
    });
    
}
appendtoFirstLayer();

//event listener for monitoring hashes, like router
// intit to "#first-layer" hash,
location.hash = "#first-layer";
window.addEventListener('hashchange', ()=>{
    switch (location.hash) {
        case "#first-layer":
            firstLayer.classList.remove('d-none');
            firstLayer.classList.add('d-flex');

            bagButton.style.display = "flex";

            secondLayer.classList.remove('d-flex');
            secondLayer.classList.add('d-none');

            thirdLayer.classList.add('d-none'); 
            
            fourthLayer.classList.add('d-none');
            

            //emptying table
            let tbodyChild = tbody.children;
            for (let i = tbodyChild.length - 1 ; i >=0 ; i--) {
                tbody.removeChild(tbodyChild[i]);
            }
            break;

        case "#second-layer":
            firstLayer.classList.remove('d-flex');
            firstLayer.classList.add('d-none');
        
            bagButton.style.display = "none";

            secondLayer.classList.remove('d-none');
            secondLayer.classList.add('d-flex');

            thirdLayer.classList.add('d-none');
            
            fourthLayer.classList.add('d-none');
            break;

        case "#third-layer":
            firstLayer.classList.remove('d-flex');
            firstLayer.classList.add('d-none');

            secondLayer.classList.remove('d-flex');
            secondLayer.classList.add('d-none');
        
            thirdLayer.classList.remove('d-none');

            fourthLayer.classList.add('d-none');
            break;
        
        case "#fourth-layer":
            firstLayer.classList.remove('d-flex');
            firstLayer.classList.add('d-none');
                
            secondLayer.classList.remove('d-flex');
            secondLayer.classList.add('d-none');
            
            thirdLayer.classList.add('d-none');
            
            fourthLayer.classList.remove('d-none');
            
            break;
    }
});

//event handler to create array of selected items
bagButton.addEventListener('click', ()=>{
    location.hash = "#second-layer";

    updateSelectedItem();

    appendToTable();
});

// to edit selected items
editItems.addEventListener('click', ()=>{
    location.hash = "#first-layer";
});

confirm.addEventListener('click', ()=>{
    location.hash = "#third-layer";
});

sendOrderBtn.addEventListener('click', ()=>{
    credentials = Array.from(credentials);
    let credArray = [];
    let itemsToServer = [];
    let packageToServer = {
        credArray: null,
        itemsToServer: null
    };

    credentials.forEach(cred =>{
        credArray.push(cred.value);
    });

    selectedItems.forEach(item => {

        if (item.qty === "0")
            return;

        let objToServer = {
            name : '',
            qty : 0
        };
        
        objToServer.name = item.name;
        objToServer.qty = parseInt(item.qty);

        itemsToServer.push(objToServer);

    });
    
    packageToServer.credArray = credArray;
    packageToServer.itemsToServer = itemsToServer;


    fetch("https://grocery-store-49.herokuapp.com/postOrder", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(packageToServer) 
    }).then(res => {
        return res.json();
    }).then(obj => {
        orderId.innerText = obj.docId;
        location.hash = "#fourth-layer";
    });

});

continueShopping.addEventListener('click', ()=>{
    window.location.reload();
});

function updateSelectedItem() {
    items.forEach(element => {
        let selObject = {
            name: '',
            qty: '',
            price: 0,
            total: 0
        }
        
        // REMEMBER item.qty == 0 when initialized and item.qty == "0" when changed
        if (element.qty !== 0) {
            //this for loop checks if item is already selected
            for (let i = 0; i < selectedItems.length; i++) {
                if (selectedItems[i].name == element.name) {
                    selectedItems[i].qty = element.qty;
                    selectedItems[i].price = element.price;
                    selectedItems[i].total = element.total;
                    return;
                }
            }

            //if item is not selected then it is appended here
            selObject.name = element.name;
            selObject.qty = element.qty;
            selObject.price = element.price;
            selObject.total = element.total;
            selectedItems.push(selObject);
        }
    });
}

function appendToTable() {

    // to display total amount to user. 
    // total amount will be vaildated on server too.
    let grossTotal = document.querySelector('.grossTotal');
    let total = 0;

    //adding to table
    selectedItems.forEach(item => {

        // REMEMBER item.qty == 0 when initialized and item.qty == "0" when changed
        if (item.qty !== "0") {

            let tr = document.createElement('tr');

            //loop to append to tr tag
            Object.values(item).forEach(property => {
                let td = document.createElement('td');
                td.innerText = property;
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);

        }
        
        total += item.total;
        grossTotal.innerText = "Rs. " + total;

    });    

}

