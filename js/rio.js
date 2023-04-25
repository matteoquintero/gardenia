const formatterPeso = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
})

const addAccountRio = (name) => {
  let cart = [];
  if(localStorage.getItem('cartRio')){ 
    cart = JSON.parse(localStorage.getItem('cartRio'));
  }

  if(!cart.find(x => x.name === name)){
    const item = {
      name : name,
      active: false,
      products: []
    }
    cart.push(item)
    localStorage.setItem('cartRio', JSON.stringify(cart))
    jQuery("#accountName").val(null)
  }
  makeListAccounts(cart)
}

const setActiveAccount = (name) =>{
  let cart = [];
  if(localStorage.getItem('cartRio')){ 
    cart = JSON.parse(localStorage.getItem('cartRio'));
  }
  cart.forEach((item)=>{
    item.active = false
  })
  cart.find(x => x.name === name).active = true

  $('#accounts ul li').each( function( i, li ) {
    $( li ).removeClass('active');
  });

  $('#accounts ul li[data-account="'+ name +'"]').addClass('active');
  updateAccountRio(cart)
  localStorage.setItem('cartRio', JSON.stringify(cart))
}

const makeListAccounts = (cart) =>{

  const accounts = $('#accounts ul');
  $('#accounts ul .account-link').remove();
  
  cart.forEach((item) =>{
    const itemLink = $([
      (item.active) ? "<li data-account='"+ item.name +"' class='item-link active account-link'>" : "<li data-account='"+ item.name +"' class='item-link account-link'>" ,
          "<span>Cuneta de "+ item.name +"</span>",
          "<small>$0</small>",
      "</li>",
    ].join("\n"))
    accounts.prepend(itemLink)      
  })

  $('#accounts ul li.account-link').click(function() {
    const account = jQuery(this).data('account')
    setActiveAccount(account)
  }); 

}

const addCartRio = (product) => {
    let cart = [];
    if(localStorage.getItem('cartRio')){ 
      cart = JSON.parse(localStorage.getItem('cartRio'));
    }else{
      alert('Debes crear una cuenta')
      $("#accountName").focus()
      return false
    }
    
    if(!cart.find(x => x.active === true)){
      alert('Selecciona a quién le vas a agregar productos')
      return false
    }
    if(cart.find(x => x.active === true).products.find(x => x.product === product)){
      const amount = cart.find(x => x.active === true).products.find(x => x.product === product).amount;
      const index = cart.find(x => x.active === true).products.findIndex(x => x.product === product);
      const item = {
        amount : amount + 1,
        product: product
      }
      cart.find(x => x.active === true).products[index] = item
  
    }else{
      const item = {
        amount : 1,
        product: product
      }
      cart.find(x => x.active === true).products.push(item)
    }
    console.log({cart})
    localStorage.setItem('cartRio', JSON.stringify(cart))
    updateAccountRio(cart)
}

const removeCartRio = (product) => {
    cart = JSON.parse(localStorage.getItem('cartRio'));
  
    if(cart.find(x => x.active === true).products.find(x => x.product === product)){
      const amount = cart.find(x => x.active === true).products.find(x => x.product === product).amount;
      if(amount - 1 === 0){
        cart.find(x => x.active === true).products = cart.find(x => x.active === true).products.filter(x => x.product !== product);
      }else{
      const index = cart.find(x => x.active === true).products.findIndex(x => x.product === product);
        const item = {
          amount : amount - 1,
          product: product
        }
        cart.find(x => x.active === true).products[index] = item
      }
    }
  
    localStorage.setItem('cartRio', JSON.stringify(cart))
    updateAccountRio(cart)
}

const updateAccountRio = (cart) => {
    const accountCart = $('#account-cart');
    $('#account-cart').html('')
    const cartTotal = $('#account-cart-total');
    const cartDiscount = $('#account-cart-discount');
 
    const products = JSON.parse(localStorage.getItem('products'));
    const categories = JSON.parse(localStorage.getItem('categories'));
    let total = 0
    let totalDiscount = 0
    let totalAmount = 0

    if(cart.find(x => x.active === true) && cart.find(x => x.active === true).products.length > 0){
      cart.find(x => x.active === true).products.forEach((item)=>{
        const product = products.find(x => x.id === item.product)
        const category = categories.find(x => x.id === product.category.id)
        const itemPrice = product.price * item.amount;
        const itemPriceWhitDiscount = (product.offer) ? (product.price - product.discount) * item.amount : product.price * item.amount;
        const itemDiscount = (product.offer) ? product.discount * item.amount : 0;
        totalAmount = totalAmount + item.amount
        total = total + itemPrice
        totalDiscount = totalDiscount + itemDiscount
        const productItem = $([
          "<div class='menu-list "+ product.category.id +"' data-product='"+ product.id +"' data-category='"+ product.category.id +"'>",
              "<div class='item'>",
                  "<div class='flex'>",
                      (product.offer)?'<div class="offer-icon"> <i class="flaticon-gardenia-descuento"></i></div>':'',
                      "<div class='title'>"+ product.name +"</div>",
                      "<div class='dots'></div>",
                      "<div class='price'>"+ formatterPeso.format(product.price * item.amount) +"</div>",
                  "</div>",
                  "<p><i>"+ product.description +"</i> <span> "+ product.content +""+ product.measure +"</span></p>",
              "</div>",
              "<div class='item-2'>",
                  "<i data-product='"+ product.id +"' class='flaticon-gardenia-minus-1 cursor-pointer item-remove'></i>",
                  "<span>"+ item.amount +"</span>",
                  "<i data-product='"+ product.id +"' class='flaticon-gardenia-plus-2 cursor-pointer item-add'></i>",
              "</div>",
          "</div>",
          ].join("\n"))
          
        accountCart.append(productItem)
    
      })
      $('#accounts ul li.account-link[data-account="'+ cart.find(x => x.active === true).name +'"] small').html(formatterPeso.format(total - totalDiscount));
    }
  
    cartTotal.html(formatterPeso.format(total - totalDiscount))
    cartDiscount.html(formatterPeso.format(totalDiscount))
   
    $('.item-add').click(function() {
      const product = jQuery(this).data('product')
      addCartRio(product)
    });
  
    $('.item-remove').click(function() {
      const product = jQuery(this).data('product')
      removeCartRio(product)
    });
  
}

const getCategories = new Promise((resolve, reject) => {
    if(!localStorage.getItem('categories')){
        fetch( 'https://api-sa-east-1.hygraph.com/v2/clf6bmruf5nal01t5ahxwbqru/master',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: `
                query {
                    categories(orderBy: order_ASC) {
                        id
                        name
                        description
                        order 
                        icon
                    }
                }`
        ,}),})
      .then((res) => {
          if (!res.ok) return reject(res);
          return resolve(res.json());
      })
    }
  
    if(localStorage.getItem('categories')){
        const categories = JSON.parse(localStorage.getItem('categories'))
        if(categories.length > 0){
            return resolve({data:{categories:categories}})
        }
        return reject (404)
    }
  });
  
  const getProducts =  new Promise((resolve, reject) =>{
    if(!localStorage.getItem('products')){
        fetch( 'https://api-sa-east-1.hygraph.com/v2/clf6bmruf5nal01t5ahxwbqru/master',{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
          },
          body: JSON.stringify({
              query: `
              query {
                  products(orderBy: order_ASC) {
                      id
                      name
                      description
                      price
                      content
                      measure
                      offer
                      discount
                      category {
                        id
                      }                    
                  }
              }`
      ,}),})
      .then((res) => {
          if (!res.ok) return reject(res);
          return resolve(res.json());
      })                
    }
  
    if(localStorage.getItem('products')){
        const products = JSON.parse(localStorage.getItem('products'))
        if(products.length > 0){
            return resolve({data:{products:products}})
        }
        return reject (404)
    }
    
  
  });
  
  
    $(function () {
      "use strict";
      $.scrollIt({
        upKey: 38,
        downKey: 40,
        easing: 'swing',
        scrollTime: 600, // how long (in ms) the animation takes
        activeClass: 'active', // class given to the active nav element
        onPageChange: null, // function(pageIndex) that is called when page is changed
        topOffset: -20 // offste (in px) for fixed top navigation
      });
      if(localStorage.getItem('cartRio')){ 
        makeListAccounts(JSON.parse(localStorage.getItem('cartRio')))
        updateAccountRio(JSON.parse(localStorage.getItem('cartRio'))) 
    }
  
      const firstData =  new Promise((resolve, reject) =>{
        getCategories.then((res) => {
          const { categories } = res.data;
          if(!localStorage.getItem('categories')){ localStorage.setItem('categories', JSON.stringify(categories)) }
          const categoriesList = $('#gardenia-categories');
          
          categoriesList.append(`<li class='item-link is-checked' data-filter='*'><i class="flaticon-gardenia-category-1"></i><span>Todo</span></li>`);
          categories.map((category) => {
              const categoryItem = $([
                  "<li class='item-link' data-filter='."+ category.id +"'>",
                      "<i class='"+category.icon+"'></i>",
                      "<span>"+category.name+"</span>",
                  "</li>",
              ].join("\n"))
              categoriesList.append(categoryItem);
  
           
          });
          resolve(true)
        }).catch((e)=> reject(e));      
      });
  
      const secondData =  new Promise((resolve, reject) =>{
        getProducts.then((res) => {
          const { products } = res.data;
          if(!localStorage.getItem('products')){ localStorage.setItem('products', JSON.stringify(products)) }
  
          const productsList = $('#gardenia-products');
          const productContainerTab = $([
            "<div>",
                "<div class='row'>",
                    "<div class='col-md-12'>",
                        "<div class='menu-list-container'>",
                        "<div class='gutter-products'></div>",
                        "</div>",
                    "</div>",
                "</div>",
            "</div>",
          ].join("\n"))
          productsList.append(productContainerTab)        
  
          products.map((product) => {
              
              const productsTab = $('.menu-book .menu-list-container');
              const productItem = $([
                  "<div class='menu-list "+ product.category.id +"' data-product='"+ product.id +"' data-category='"+ product.category.id +"'>",
                      "<div class='item'>",
                          "<div class='flex'>",
                              (product.offer)?'<div class="offer-icon"> <i class="flaticon-gardenia-descuento"></i></div>':'',
                              "<div class='title'>"+ product.name +"</div>",
                              "<div class='dots'></div>",
                              (!product.offer)?"<div class='price'>"+ formatterPeso.format(product.price) +"</div>":"<div class='price'>"+ formatterPeso.format(product.price - product.discount) +"<span class='price discount'>"+ formatterPeso.format(product.price) +"</span></div>",
                              "<div class='price-hide'>"+ product.price +"</div>",
                              "<div class='measure-hide'>"+ product.content +"</div>",
                          "</div>",
                          "<p><i>"+ product.description +"</i> <span> "+ product.content +""+ product.measure +"</span></p>",
                      "</div>",
                  "</div>",
              ].join("\n"))
              productsTab.append(productItem)
  
          });
          resolve(true)
  
        }).catch(()=> reject(false));       
      });
      firstData.then((res) =>{
        if(res){
          secondData.then((res) =>{
            if(res){
              var $grid = $('.menu-book .menu-list-container').isotope({
                itemSelector: '.menu-list',
                layoutMode: 'fitRows',
                percentPosition: true,
                fitRows: {
                  gutter: '.gutter-products'
                },          
                getSortData: {
                  offer: '.offer',
                  price: '.price-hide parseInt',
                  measure: '.measure-hide parseInt',
                  category: '[data-category]'
                }
              });
              
              var filterFns = {
                numberGreaterThan50: function() {
                  var number = $(this).find('.price-hide').text();
                  return parseInt( number, 10 ) > 50;
                },
              };
              
              $('#gardenia-categories').on( 'click', 'li', function() {
                var filterValue = $( this ).attr('data-filter');
                filterValue = filterFns[ filterValue ] || filterValue;
                $grid.isotope({ filter: filterValue });
              });
              
              $('#gardenia-filters').on( 'click', 'li', function() {
                if($(this).attr('data-type') === 'sort'){
                  var sortByValue = $(this).attr('data-sort-by');
                  $grid.isotope({ sortBy: sortByValue });
                }
                if($(this).attr('data-type') === 'filter'){
                  var filterValue = $( this ).attr('data-filter');
                  filterValue = filterFns[ filterValue ] || filterValue;
                  $grid.isotope({ filter: filterValue });                
                }
              });
  
              $('.filters-product').each( function( i, li ) {
                var $li = $( li );
                $li.on( 'click', 'li', function() {
                  $li.find('.is-checked').removeClass('is-checked');
                  $( this ).addClass('is-checked');
                });
              });

              $('#gardenia-categories').owlCarousel({
                loop: true,
                mouseDrag: true,
                autoplay: false,
                dots: false,
                nav: true,
                navText: ["<span class='lnr flaticon-gardenia-left-chevron'></span>", "<span class='lnr flaticon-gardenia-left-chevron'></span>"],
                responsiveClass: true,
                responsive: {
                    600: {
                        items: 3,
                    },
                    1000: {
                        items: 6,
                    },
                    1200: {
                        items: 10,
                    }
                }
            });
            
            $('#accounts .create button').click(function() {
              if(jQuery("#accountName").val() !== ''){
                addAccountRio( jQuery("#accountName").val() )
                return true
              }
              alert('¿Para quién es la cuenta?')
              return false
            });

            $('.menu-list').click(function() {
              const product = jQuery(this).data('product')
              addCartRio(product)
            });
  
            }
          })
        }
      })
  
  
  
  });