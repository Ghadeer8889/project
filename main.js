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
let dataPro = localStorage.prodact ? JSON.parse(localStorage.prodact) : [];

// 3. دالة حساب المجموع (Total)
function getTotal() {
    if (price.value != '') {
        let result = (+price.value + +taxes.value + +ads.value) - +disscount.value;
        total.innerHTML = result;
        total.style.background = "#2e7d32"; // أخضر عند النجاح
    } else {
        total.innerHTML = '';
        total.style.background = "#c62828"; // أحمر عند الفراغ
    }
}

// 4. إنشاء وتحدث المنتجات
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

    // تنظيف الكلاسات
    [title, price, category].forEach(input => input.classList.remove('invalid'));

    if (title.value == '' || !regexText.test(title.value)) { title.classList.add('invalid'); isValid = false; }
    if (price.value == '') { price.classList.add('invalid'); isValid = false; }
    if (category.value == '' || !regexText.test(category.value)) { category.classList.add('invalid'); isValid = false; }

    if (isValid && newPRO.count < 101) {
        if (mood === 'create') {
            if (newPRO.count > 1) {
                for (let i = 0; i < newPRO.count; i++) { dataPro.push(newPRO); }
            } else { dataPro.push(newPRO); }
        } else {
            dataPro[tmp] = newPRO;
            resetToCreate();
        }
        localStorage.setItem('prodact', JSON.stringify(dataPro));
        clear();
        show();
    } else {
        let firstInvalid = document.querySelector('.invalid');
        if(firstInvalid) firstInvalid.focus();
    }
}

// 5. مسح المدخلات
function clear() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    disscount.value = '';
    total.innerHTML = '';
    category.value = '';
    count.value = '';
    getTotal(); // لإعادة لون التوتال للأحمر
}

// 6. عرض البيانات
function show() {
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

// 7. التعديل
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

function resetToCreate() {
    mood = 'create';
    submit.innerHTML = 'Create <i class="fa-solid fa-plus"></i>';
    count.style.display = "block";
}

// 8. نظام الحذف (Modal)
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
        if (mood === 'update' && tmp === i) resetToCreate();
        show();
    });
}

function deletAll() {
    showModal(() => {
        localStorage.prodact = JSON.stringify([]);
        dataPro = [];
        resetToCreate();
        show();
    });
}

// 9. البحث
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
        let match = (searchMood == 'title') ? dataPro[i].title.includes(val) : dataPro[i].category.includes(val);
        if (match) {
            table += `<tr>
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

// 10. الوضع الليلي (Dark Mode) والحفظ في الذاكرة
let darkModeToggle = document.getElementById("darkModeToggle");
let modeIcon = document.getElementById("modeIcon");

// فحص الحالة المخزنة مسبقاً
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    modeIcon.classList.replace("fa-moon", "fa-sun");
}

darkModeToggle.onclick = function() {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
        modeIcon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("theme", "light");
    } else {
        modeIcon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("theme", "dark");
    }
};

// 11. زر العودة للأعلى (Back to Top)
let mybutton = document.getElementById("toTopBtn");
window.onscroll = function() {
    if (document.documentElement.scrollTop > 300) {
        mybutton.classList.add("show-btn");
    } else {
        mybutton.classList.remove("show-btn");
    }
};

function backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// تشغيل العرض الأولي
show();