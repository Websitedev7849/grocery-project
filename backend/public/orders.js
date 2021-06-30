let deleteBtn = document.querySelectorAll('.delete-btn');
deleteBtn = Array.from(deleteBtn);

let deleteDetails = {};
const modalBody = document.querySelector('.modal-body');
const crossModal = document.querySelector('.cross-modal');
const closeModal = document.querySelector('.close-modal');
const promptDeleteBtn = document.querySelector('.delete-modal');
let orderIdElement = document.querySelector('.order-id');

deleteBtn.forEach(btn=>{
    btn.addEventListener('click', e=>{
        let target = e.target;
        let collapsableBody = target.parentElement.parentElement;
        let cardHeader = collapsableBody.previousElementSibling;
        let customerDetails = cardHeader.firstElementChild.firstElementChild;
        let grossTotal = target.previousElementSibling;
        
        deleteDetails.card = cardHeader.parentElement;
        deleteDetails.customerDetails = customerDetails.cloneNode(true);
        deleteDetails.grossTotal = grossTotal.cloneNode(true);
        deleteDetails.docId = collapsableBody.id;

        renderModal(deleteDetails);
    });
});

promptDeleteBtn.addEventListener('click', ()=>{
    deleteConfirmed(deleteDetails.card, deleteDetails.docId);
    resetModal();
});

crossModal.addEventListener('click', ()=>{
    resetModal();
})

closeModal.addEventListener('click', ()=>{
    resetModal();
});

function resetModal() {
    orderIdElement.innerHTML = "";
    modalBody.removeChild(modalBody.lastChild);
    modalBody.removeChild(modalBody.lastChild);
}

function renderModal(details) {
    orderIdElement.innerHTML = details.docId;
    modalBody.appendChild(details.customerDetails);
    modalBody.appendChild(details.grossTotal);
}

function deleteConfirmed(card, docId) {
    fetch('/get-orders',{
        method: 'delete',
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify({ docId: docId })
    })
    .then(res=> res.json() )
    .then(data=>{
        card.remove();
    });
}