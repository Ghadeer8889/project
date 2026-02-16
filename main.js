let title = document.getElementById('title')
let price = document.getElementById('price')
let taxes = document.getElementById('taxes')
let ads = document.getElementById('ads')
let disscount = document.getElementById('disscount')
let total = document.getElementById('total')
let count = document.getElementById('count')
let category = document.getElementById('category')
let submit = document.getElementById('submit')
let mood = 'create'
let tmp = ''

// get total
function getTotal(){
  if (price.value != ''){
    let result = (+price.value + +taxes.value + +ads.value) - +disscount.value;
    total.innerHTML = result
    total.style.background = "green"
    
  }
  else{
        total.innerHTML=''
        total.style.background= "red"
    }
}

// creat product
// save localStorage
let dataPro ;
if(localStorage.prodact != null ){
    dataPro = JSON.parse(localStorage.prodact)
}
else{
     dataPro = [];
}
    
    submit.onclick = function(){
        let newPRO = {
            title: title.value.toLowerCase(),
            price: price.value,
            taxes: taxes.value,
            ads: ads.value,
            disscount: disscount.value,
            total: total.innerHTML,
            count: count.value,
            category: category.value.toLowerCase(),
    
    }
    if(title.value !=  '' && price.value != '' && category.value != '' && newPRO.count <101){
         if (mood == 'create'){
        if(newPRO.count>1){
        for(let i = 0 ; i<newPRO.count ; i++){
            dataPro.push(newPRO)
        }
    }
    else{
         dataPro.push(newPRO)
    }
    }
    else{
dataPro[tmp] = newPRO
mood= 'create'
submit.innerHTML= 'create'
count.style.display= "block"

    }
    clear()
    }
   
    
    localStorage.setItem('prodact', JSON.stringify(dataPro))
    
    show()
}

// clear inputs 
function clear(){
         title.value ='',
         price.value = '',
         taxes.value = '',
         ads.value = '',
         disscount.value = '',
         total.innerHTML = '',
         count.value = '',
        category.value = ''
}

// read 
function show(){
    getTotal()
let table = ''
for( let i = 0; i<dataPro.length ; i++ ){
    table += `
    <tr>
                        <td>${i+1}</td>
                        <td>${dataPro[i].title}</td>
                        <td>${dataPro[i].price}</td>
                        <td>${dataPro[i].taxes}</td>
                        <td>${dataPro[i].ads}</td>
                        <td>${dataPro[i].disscount}</td>
                        <td>${dataPro[i].total}</td>
                        <td>${dataPro[i].category}</td>
                        <td><button id="update" onclick = "updatedata(${i})">update</button></td>
                        <td><button id="delet" onclick = "delet(${i})">delet</button></td>
                    </tr>
`   
}
document.getElementById('tbody').innerHTML = table
// delet all
let btn = document.getElementById('deletall')
if(dataPro.length>0){
    btn.innerHTML= `<button onclick = "deletAll()"> Delet all (${dataPro.length}) </button>
    `
}
else{
    btn.innerHTML= ''
}

}
function deletAll(){
    localStorage.clear()
    dataPro.splice(0)
    show()
}


// update 
function updatedata(i){
    title.value =dataPro[i].title,
         price.value = dataPro[i].price,
         taxes.value = dataPro[i].taxes,
         ads.value = dataPro[i].ads,
         disscount.value = dataPro[i].disscount,
        count.style.display= 'none'
        category.value = dataPro[i].category
        getTotal()
        submit.innerHTML='Update'
        mood = 'update'
        tmp = i;
        scroll({
            top:0,
            behavior:'smooth'
        })
}

// delet 

function delet(i){
    dataPro.splice(i,1)
    localStorage.prodact = JSON.stringify(dataPro)
show()
}

show()

// search
let searchMood = 'title'

function getsearch(id){
    let search = document.getElementById('search')
    if(id == 'searchTitle'){
        searchMood = 'title'
    }
    else{
        searchMood = 'category'
    }
    search.placeholder = 'Search by '+ searchMood
    search.focus()
    search.value= ''
    show()

}




function searchDtat(value){
    let table = ''
    for(let i =0 ; i<dataPro.length ; i++){
    if(searchMood == 'title' ){

        
            if( dataPro[i].title.includes(value.toLowerCase())){
    table += `
    <tr>
                        <td>${i}</td>
                        <td>${dataPro[i].title}</td>
                        <td>${dataPro[i].price}</td>
                        <td>${dataPro[i].taxes}</td>
                        <td>${dataPro[i].ads}</td>
                        <td>${dataPro[i].disscount}</td>
                        <td>${dataPro[i].total}</td>
                        <td>${dataPro[i].category}</td>
                        <td><button id="update" onclick = "updatedata(${i})">update</button></td>
                        <td><button id="delet" onclick = "delet(${i})">delet</button></td>
                    </tr>
`   
}   

            }
    else{
       if( dataPro[i].category.includes(value.toLowerCase())){
    table += `
            
    <tr>
                        <td>${i}</td>
                        <td>${dataPro[i].title}</td>
                        <td>${dataPro[i].price}</td>
                        <td>${dataPro[i].taxes}</td>
                        <td>${dataPro[i].ads}</td>
                        <td>${dataPro[i].disscount}</td>
                        <td>${dataPro[i].total}</td>
                        <td>${dataPro[i].category}</td>
                        <td><button id="update" onclick = "updatedata(${i})">update</button></td>
                        <td><button id="delet" onclick = "delet(${i})">delet</button></td>
                    </tr>
`   

    
}
    }
 document.getElementById('tbody').innerHTML = table
    }
}