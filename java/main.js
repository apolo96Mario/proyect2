//********************************  */
//*Marketplace Shopping car */
//************************ */

async function getApi(){
    const URL = 'https://ecommercebackend.fundamentos-29.repl.co';
    try {
        const data = await fetch (URL);
        const res = await data.json();
        localStorage.setItem('products',JSON.stringify(res))
        return res;
    } catch(error){
        console.log(error);
    }
}

async function database(){
    const db ={
        products: JSON.parse(localStorage.getItem('products')) || await getApi() ,
        cart: JSON.parse(localStorage.getItem('cart')) || {},
    }
    return db;
}

function handels(){
    const btn = document.querySelector('.header_btn')
    const list = document.querySelector('.header_list')
    const car = document.querySelector('.header_car_btn')
    const modal = document.querySelector('.car_modal')
    console.log(btn);
    btn.addEventListener('click', function(){
       list.classList.toggle('active');
    });
    list.addEventListener('click', function(){
        list.classList.remove('active');
     });
    car.addEventListener('click', () => {
        modal.classList.toggle('active');
    });
}

function printProducts(products){
    const print = document.querySelector('.products')
    console.log(print);
    let html = '';
    for(const item of products){
        //console.log(item);
        const {category, id ,image ,price,quantity,name } = item; 
        html += `
        <div id="${id}" class= "product">
        <figure class="product_img if${quantity}">
            <img src="${image}" alt="image product">
        </figure>
        <h2>${name}</h2>
        <div class="singleArticle__colors">
        <section class="Color1"></section>
        <section class="Color2"></section>
        </div>
        <p class = "product_description">
        <span>Categoria:</span> ${category}<br>
        <span>Precio:</span> ${price} USD<br>
        <span>Cantidad:</span> ${quantity} Units<br>
        </p>
        <div class = "product_buttoms">
        <button class= "btn_view"> Ver Detalle </button>
        <button class= "btn_add"> Agregar al carrito </button>
        </div>
        </div>
        `
    }
    print.innerHTML = html; 
}

function addToCar(db){
    const add = document.querySelector('.products')
    add.addEventListener('click', (event) => {
        
        if(event.target.classList.contains('btn_add')){
        const id = +event.target.closest('.product').id 
        const article = db.products.find(element => element.id === id)
        
        if (article.quantity === 0) {
            return alert('Este producto se encuentra agotado');
        }
        if(article.id in db.cart){
            if (db.cart[id].amount === db.cart[id].quantity) {
                return alert('No tenemos mas en bodega')
            }
            db.cart[article.id].amount++;
        }else{
            article.amount = 1;
            db.cart[article.id] = article;  
        
        }
        //console.log(db.cart);
        localStorage.setItem('cart', JSON.stringify(db.cart));
        printCart(db.cart);
        printTotals(db)
        }
        
    })
}

function printCart(products){
    const print = document.querySelector('.car_products')
    let html = '';
    for (const key in products) {
        //console.log(products[key]);
        const {amount, category, id, image, price, quantity} = products[key];
        html += `
        <div id="${id}"  class= "car_product">
        <figure class="car_products_img">
           <img src= ${image} alt= image product> 
        </figure>
        <div class ="cart_product_container">
        <p class = "product_description">
        <span>Categoria:</span> ${category}<br>
        <span>Precio:</span> ${price} USD<br>
        <span>Cantidad:</span> ${quantity} Units<br>
        </p>
        <div class="cart_product_buttons">
        <ion-icon class="less" name="remove-circle-outline"></ion-icon>
        <span>${amount}</span>
        <ion-icon class="plus" name="add-circle-outline"></ion-icon>
        <ion-icon class="trash" name="trash-outline"></ion-icon>
        </div>
    </div>
</div>
`
    }
    print.innerHTML = html;
}

function handleCar(db){
    const car = document.querySelector('.car_products');
    car.addEventListener('click', (event)=>{
        //console.log(event.target.classList.contains('plus'));
        if(event.target.classList.contains('plus')){
            //console.log('quiero sumar');
            //console.log(event.target.closest('.car_product').id);
            const id = +event.target.closest('.car_product').id;
            if (db.cart[id].amount === db.cart[id].quantity) {
                return alert('No tenemos mas en bodega')
            }
            db.cart[id].amount++;
            
        }
        if(event.target.classList.contains('less')){
            //console.log('quiero restar');
            const id = +event.target.closest('.car_product').id;
            if (db.cart[id].amount === 1) {
                return alert('Uno es la cantidad minima que debemos comprar')
            }
            db.cart[id].amount--;
        }
        if(event.target.classList.contains('trash')){
            //console.log('quiero borrar');
            const id = +event.target.closest('.car_product').id;
            const response = confirm('Seguro que quieres borrar este producto?');
            if(!response){
                return
            }
            delete db.cart[id];
        }
        localStorage.setItem('cart', JSON.stringify(db.cart));
        printCart(db.cart);
        printTotals(db)
    })
}

function printTotals(db){
    const cartTotal = document.querySelector('.car_totals div');
    const carIcon = document.querySelector('.header_car_btn span')
    let cantidad = 0;
    let totales = 0;
    for (const key in db.cart) {
        //console.log(db.cart[key]);
        const {amount, price} = db.cart[key]
        cantidad += amount;
        totales += amount * price;
    }
    let html = ` 
    <p><span>Cantidad:</span> ${cantidad}</p>
    <p><span>Total:</span> $${totales} USD</p>
    `;
    cartTotal.innerHTML = html;
    carIcon.innerHTML = cantidad;
}

function handleTotals(db){
    const btnBuy = document.querySelector('.btn_buy');
    btnBuy.addEventListener('click', ()=>{
    if (!Object.values(db.cart).length) {
        return alert('Debes agregar tu producto para realizar la compra');
    }
    const response = confirm('Deseas finalizar la compra?');
    if (!response) {
        return;  
    }
    for (const key in db.cart) {
        console.log(db.cart[key]);
        if (db.cart[key].id === db.products[key-1].id) {
            db.products[key-1].quantity -=db.cart[key].amount;
        }
    }
    db.cart = {};
    localStorage.setItem('products', JSON.stringify(db.products));
    localStorage.setItem('cart' ,JSON.stringify(db.cart));
    printProducts(db.products);
    printCart(db.cart);
    printTotals(db);  
    alert('Gracias por su compra!!'); 
    })
    
}

function filterProducts (products){
    const list = document.querySelector('.header_list');
    const h2 = document.querySelector('.header_list h2');
    list.addEventListener('change', ()=>{
        if(list[0].value === 'products'){
            h2.innerHTML = "Todos nuestros productos"
            printProducts(products);
        }else if(list[0].value === 'shirt'){
            const shirt = products.filter(element=>element.category==='shirt');
            h2.innerHTML = 'Nuestras camisas'
            printProducts(shirt);
        }else if(list[0].value ==='hoddie'){
            const hoddie = products.filter(element=>element.category==='hoddie');
            h2.innerHTML = 'Nuestros hoddies'
            printProducts(hoddie);
        }else if(list[0].value ==='sweater'){
            const sweater = products.filter(element=>element.category==='sweater');
            h2.innerHTML = 'Nuestros sweaters'
            printProducts(sweater);
            }  
    })
}

function showDetails(products){
    const readBtn = document.querySelector('.products');
    const showModal = document.querySelector('.view_modal');
    const closeModal = document.querySelector('.close_modal');
    const contenModal = document.querySelector('.content_modal')
    readBtn.addEventListener('click' , (event)=>{
    if (event.target.classList.contains('btn_view')) {
        const id = +event.target.closest('.product').id;
        const article = products.find(element => element.id === id);
        console.log(article);
        const {image, name, price, } = article;
        let html = `
        <div class="content_modal">
        <div class="modal_product_short">
        <h2>${name}</h2><br>
        
        <span>$</span>${price}<br><br>
        <span>${name}</span><br>
        <br>
        <span>Colores</span><br>
        <input type="img" class="color_op1" selected="academlo">
        <input type="img" class="color_op2" id="yes">
        <div class="modal_product_btn">
            <button class="btn_add">Añadir al carrito</button> 
            <figure class="modal__product__img">
            <div>a</div>
            <img src="${image}" alt="image product">
            </figure>
            </div> 
            </div>
            </div>`;
        contenModal.innerHTML= html;
        showModal.classList.add('active');
    }
    })
    closeModal.addEventListener('click', ()=>{
        showModal.classList.remove('active');
    })

}

async function main(){
    const db = await database();
    //console.log(db.products);
    handels();
    printProducts(db.products);
    addToCar(db);
    printCart(db.cart);
    handleCar(db);
    printTotals(db);
    handleTotals(db);
    filterProducts(db.products);
    showDetails(db.products);
}

main();

