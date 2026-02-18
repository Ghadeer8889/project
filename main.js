// 1. تعاريف المتغيرات الأساسية
let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let disscount = document.getElementById('disscount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');

let mood = 'create';
let tmp;

// 2. التحقق من البيانات المحلية (Local Storage)
let dataPro;
if (localStorage.prodact != null) {
    dataPro = JSON.parse(localStorage.prodact);
} else {
    dataPro = [];
}

// 3. دالة حساب المجموع (Total)
function getTotal() {
    if (price.value != '') {
        let result = (+price.value + +taxes.value + +ads.value) - +disscount.value;
        total.innerHTML = result;
        total.style.background = "#2e7d32"; // أخضر هادئ
    } else {
        total.innerHTML = '';
        total.style.background = "#c62828"; // أحمر هادئ
    }
}

// 4. إنشاء وتحديث المنتجات (Create & Update)
submit.onclick = function() {
    let newPRO = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        disscount: disscount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
    };

    let regexText = /^[a-zA-Z\s\u0600-\u06FF]+$/; 
    let isValid = true;

    // تنظيف الكلاسات والتحقق البصري
    [title, price, category].forEach(input => input.classList.remove('invalid'));

    if (title.value == '' || !regexText.test(title.value)) {
        title.classList.add('invalid');
        isValid = false;
    }
    if (price.value == '') {
        price.classList.add('invalid');
        isValid = false;
    }
    if (category.value == '' || !regexText.test(category.value)) {
        category.classList.add('invalid');
        isValid = false;
    }

    if (isValid && newPRO.count < 101) {
        if (mood === 'create') {
            if (newPRO.count > 1) {
                for (let i = 0; i < newPRO.count; i++) {
                    dataPro.push(newPRO);
                }
            } else {
                dataPro.push(newPRO);
            }
        } else {
            dataPro[tmp] = newPRO;
            mood = 'create';
            submit.innerHTML = 'Create <i class="fa-solid fa-plus"></i>';
            count.style.display = "block";
        }
        
        localStorage.setItem('prodact', JSON.stringify(dataPro));
        clear();
        show();
    } else {
        // الفوكس على أول حقل غير صالح
        let firstInvalid = document.querySelector('.invalid');
        if(firstInvalid) firstInvalid.focus();
    }
}

// 5. مسح المدخلات (Clear)
function clear() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    disscount.value = '';
    total.innerHTML = '';
    category.value = '';
    count.value = '';
    total.style.background = "#c62828";
}

// 6. عرض البيانات (Read)
function show() {
    getTotal();
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataPro[i].title}</td>
            <td>${dataPro[i].price}</td>
            <td>${dataPro[i].taxes}</td>
            <td>${dataPro[i].ads}</td>
            <td>${dataPro[i].disscount}</td>
            <td>${dataPro[i].total}</td>
            <td>${dataPro[i].category}</td>
            <td><button onclick="updatedata(${i})" id="update"><i class="fa-solid fa-pen-to-square"></i></button></td>
            <td><button onclick="delet(${i})" id="delet"><i class="fa-solid fa-trash"></i></button></td>
        </tr>`;
    }
    document.getElementById('tbody').innerHTML = table;

    let btnDelete = document.getElementById('deletall');
    if (dataPro.length > 0) {
        btnDelete.innerHTML = `<button onclick="deletAll()">Delete All (${dataPro.length})</button>`;
    } else {
        btnDelete.innerHTML = '';
    }
}

// 7. منطق التعديل (Update Logic)
function updatedata(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    disscount.value = dataPro[i].disscount;
    category.value = dataPro[i].category;
    getTotal();
    
    count.style.display = 'none';
    submit.innerHTML = 'Update <i class="fa-solid fa-rotate"></i>';
    mood = 'update';
    tmp = i;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 8. نظام الحذف المخصص (Custom Modal Delete)
let modal = document.getElementById('customModal');
let confirmBtn = document.getElementById('confirmBtn');
let cancelBtn = document.getElementById('cancelBtn');
let deleteAction = null;

function showModal(callback) {
    modal.classList.add('show-modal');
    deleteAction = callback;
}

cancelBtn.onclick = () => modal.classList.remove('show-modal');
confirmBtn.onclick = () => {
    if (deleteAction) deleteAction();
    modal.classList.remove('show-modal');
}

function delet(i) {
    showModal(() => {
        dataPro.splice(i, 1);
        localStorage.setItem('prodact', JSON.stringify(dataPro));
        show();
    });
}

function deletAll() {
    showModal(() => {
        localStorage.clear();
        dataPro.splice(0);
        show();
    });
}

// 9. البحث (Search)
let searchMood = 'title';

function getsearch(id) {
    let search = document.getElementById('search');
    searchMood = (id == 'searchTitle') ? 'title' : 'category';
    search.placeholder = 'Search by ' + searchMood;
    search.value = '';
    search.focus();
    show();
}

function searchDtat(value) {
    let table = '';
    let val = value.toLowerCase();
    for (let i = 0; i < dataPro.length; i++) {
        let match = (searchMood == 'title') ? 
                    dataPro[i].title.includes(val) : 
                    dataPro[i].category.includes(val);
        if (match) {
            table += `
            <tr>
                <td>${i + 1}</td>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].price}</td>
                <td>${dataPro[i].taxes}</td>
                <td>${dataPro[i].ads}</td>
                <td>${dataPro[i].disscount}</td>
                <td>${dataPro[i].total}</td>
                <td>${dataPro[i].category}</td>
                <td><button onclick="updatedata(${i})" id="update"><i class="fa-solid fa-pen-to-square"></i></button></td>
                <td><button onclick="delet(${i})" id="delet"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`;
        }
    }
    document.getElementById('tbody').innerHTML = table;
}

// 10. مستمعات الأحداث (Input Observers)
[title, category].forEach(input => {
    input.oninput = function() {
        this.value = this.value.replace(/[0-9]/g, '');
        this.style.border = (this.value === '') ? "1px solid red" : "1px solid #05165b";
    }
});

[title, price, category].forEach(input => {
    input.addEventListener('input', function() {
        if (this.value != '') this.classList.remove('invalid');
    });
});

// تشغيل العرض الأولي
show();