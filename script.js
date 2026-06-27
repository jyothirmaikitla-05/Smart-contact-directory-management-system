let contacts =
JSON.parse(localStorage.getItem("contacts")) || [];

let editIndex = -1;

function saveData(){
    localStorage.setItem(
        "contacts",
        JSON.stringify(contacts)
    );
}

function showMessage(msg){

    let div =
    document.createElement("div");

    div.className =
    "notification";

    div.innerText = msg;

    document.body.appendChild(div);

    setTimeout(()=>{
        div.remove();
    },3000);
}

function clearForm(){

    let name =
    document.getElementById("name");

    if(name){

        document.getElementById("name").value="";
        document.getElementById("phone").value="";
        document.getElementById("email").value="";
        document.getElementById("address").value="";
    }
}

function saveContact(){

    let name =
    document.getElementById("name").value.trim();

    let phone =
    document.getElementById("phone").value.trim();

    let email =
    document.getElementById("email").value.trim();

    let address =
    document.getElementById("address").value.trim();

    if(name==="" || phone===""){
        alert("Name and Phone are required");
        return;
    }

    let phoneRegex =
    /^[0-9]{10}$/;

    if(!phoneRegex.test(phone)){
        alert("Enter valid 10 digit phone number");
        return;
    }

    let emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(email!=="" &&
      !emailRegex.test(email)){
        alert("Invalid Email");
        return;
    }

    if(
    contacts.some(
    c=>c.phone===phone
    )){
        alert(
        "Contact already exists"
        );
        return;
    }

    contacts.push({
        name,
        phone,
        email,
        address
    });

    saveData();

    clearForm();

    showMessage(
    "Contact Added Successfully"
    );

    setTimeout(()=>{
        window.location.href =
        "view-contacts.html";
    },1000);
}

function displayContacts(){

    let table =
    document.getElementById(
    "contactTable"
    );

    if(!table) return;

    let search =
    document.getElementById(
    "searchInput"
    ).value.toLowerCase();

    let output="";

    contacts.forEach(
    (contact,index)=>{

        if(
        contact.name
        .toLowerCase()
        .includes(search)
        ){

            output += `
            <tr>

            <td>${contact.name}</td>
            <td>${contact.phone}</td>
            <td>${contact.email}</td>
            <td>${contact.address}</td>

            <td>

            <button
            class="update"
            onclick="editContact(${index})">
            Edit
            </button>

            <button
            class="delete"
            onclick="deleteContact(${index})">
            Delete
            </button>

            </td>

            </tr>
            `;
        }
    });

    table.innerHTML = output;

    let total =
    document.getElementById(
    "total"
    );

    if(total){
        total.innerText =
        contacts.length;
    }
}

function editContact(index){

    let contact =
    contacts[index];

    localStorage.setItem(
    "editContact",
    JSON.stringify({
        index:index,
        data:contact
    }));

    window.location.href =
    "add-contact.html";
}

function loadEditContact(){

    let editData =
    JSON.parse(
    localStorage.getItem(
    "editContact"
    ));

    if(!editData) return;

    editIndex =
    editData.index;

    document.getElementById("name").value =
    editData.data.name;

    document.getElementById("phone").value =
    editData.data.phone;

    document.getElementById("email").value =
    editData.data.email;

    document.getElementById("address").value =
    editData.data.address;

    let saveBtn =
    document.querySelector(
    ".save"
    );

    if(saveBtn){

        saveBtn.innerText =
        "Update Contact";

        saveBtn.onclick =
        updateContact;
    }
}

function updateContact(){

    if(editIndex===-1) return;

    contacts[editIndex] = {

        name:
        document.getElementById("name").value,

        phone:
        document.getElementById("phone").value,

        email:
        document.getElementById("email").value,

        address:
        document.getElementById("address").value
    };

    saveData();

    localStorage.removeItem(
    "editContact"
    );

    showMessage(
    "Contact Updated Successfully"
    );

    setTimeout(()=>{
        window.location.href =
        "view-contacts.html";
    },1000);
}

function deleteContact(index){

    if(confirm(
    "Delete this contact?"
    )){

        contacts.splice(index,1);

        saveData();

        displayContacts();

        showMessage(
        "Contact Deleted Successfully"
        );
    }
}

function exportCSV(){

    let csv =
    "Name,Phone,Email,Address\n";

    contacts.forEach(c=>{

        csv +=
`${c.name},${c.phone},${c.email},${c.address}\n`;

    });

    let blob =
    new Blob(
    [csv],
    {type:'text/csv'}
    );

    let link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "contacts.csv";

    link.click();
}

displayContacts();
loadEditContact();