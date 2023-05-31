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
    const firstProducts = fetch( 'https://api-sa-east-1.hygraph.com/v2/clf6bmruf5nal01t5ahxwbqru/master',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            query: `
            query {
                products(where: {quantity_gt: 0}, first: 100, orderBy: order_ASC) {
                    id
                    name
                    description
                    price
                    content
                    measure
                    offer
                    discount
                    quantity
                    category {
                      id
                    }                    
                }
            }`
    ,}),})
    .then((res) => {
      if (!res.ok) return reject(res);
      return res.json();
    })
    firstProducts
      .then((firstProducts) => {
        const after = firstProducts.data.products.at(-1).id;
        const secondProducts = fetch( 'https://api-sa-east-1.hygraph.com/v2/clf6bmruf5nal01t5ahxwbqru/master',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: `
                query {
                    products(where: {quantity_gt: 0}, first: 100, orderBy: order_ASC, after: "${after}") {
                        id
                        name
                        description
                        price
                        content
                        measure
                        offer
                        discount
                        quantity
                        category {
                          id
                        }                    
                    }
                }`
        ,}),})
        .then((res) => {
            if (!res.ok) return reject(res);
            return res.json();
        })
        return Promise.all([firstProducts, secondProducts]);
      })
      .then(([firstProducts, secondProducts]) => {
        const products = {data:{products:[...firstProducts.data.products, ...secondProducts.data.products]}}
        resolve(products);
      })
      .catch((error) => {
        reject(error);
      });
 
  }

  if(localStorage.getItem('products')){
      const products = JSON.parse(localStorage.getItem('products'))
      if(products.length > 0){
          return resolve({data:{products:products}})
      }
      return reject (404)
  }

});
const menu = document.getElementById('sticky');
const endDiv = document.getElementById('remove-sticky');
const menuHeight = menu.offsetHeight;
let menuOffsetTop = menu.getBoundingClientRect().top + window.scrollY;
let isSticky = false;
let reachedEnd = false;

function updateMenuOffsetTop() {
  menuOffsetTop = menu.getBoundingClientRect().top + window.scrollY;
}

function handleScroll() {
  const scrollPosition = window.scrollY;
  const endDivOffsetTop = endDiv.offsetTop - menuHeight;

  if (scrollPosition >= menuOffsetTop && !isSticky && !reachedEnd) {
    menu.classList.add('sticky');
    isSticky = true;
  } else if ((scrollPosition < menuOffsetTop || scrollPosition >= endDivOffsetTop) && isSticky) {
    menu.classList.remove('sticky');
    isSticky = false;
  }

  if (scrollPosition >= endDivOffsetTop) {
    reachedEnd = true;
  } else {
    reachedEnd = false;
  }
}
window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', updateMenuOffsetTop);

  $(function () {
    "use strict";
    $.scrollIt({
      upKey: 38,
      downKey: 40,
      easing: 'swing',
      scrollTime: 600, // how long (in ms) the animation takes
      activeClass: 'active', // class given to the active nav element
      onPageChange: null, // function(pageIndex) that is called when page is changed
      topOffset: -20 // offset (in px) for fixed top navigation
    });


    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateMenuOffsetTop);

    if(localStorage.getItem('cart')){ updateCart(JSON.parse(localStorage.getItem('cart'))) }

    let activeCategory = null;
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

            if(category.name.replace(' ', '-').toLowerCase() === window.location.pathname.split("/")[2]){
              activeCategory = '.'+ category.id
              $(`#gardenia-categories li[data-filter='*']`).removeClass('is-checked');
              $(`#gardenia-categories li[data-filter='.`+ category.id+`']`).addClass('is-checked');
            }            
        });
        resolve(true)
      }).catch((e)=> reject(e));      
    });

    const secondData =  new Promise((resolve, reject) =>{
      getProducts.then((res) => {
        const {products} = res.data;
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
            if(product.category){
              const productsTab = $('.menu-list-container');
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
                      "<div class='item-icon'>",
                      "<p>",
                        "<i class='flaticon-gardenia-trolley-8'></i>",
                        "<i>"+ product.quantity +"</i>",
                      "</p>",
                  "</div>",  
                  "</div>",
              ].join("\n"))
              productsTab.append(productItem)
            }
        });
        resolve(true)

      }).catch((error)=> {  reject(false)});       
    });
    firstData.then((res) =>{
      if(res){
        secondData.then((res) =>{
          if(res){
            var $grid = $('.menu-list-container').isotope({
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

            var clearMenuList = (()=>{
              $('.menu-list').each( function( i, div ) {
                $( this ).removeClass('active');
              });
            })
            
            $('#gardenia-categories').on( 'click', 'li', function() {
              var filterValue = $( this ).attr('data-filter');
              filterValue = filterFns[ filterValue ] || filterValue;
              $grid.isotope({ filter: filterValue });
              clearMenuList()
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
              clearMenuList()
            });

            $('.filters-product').each( function( i, li ) {
              var $li = $( li );
              $li.on( 'click', 'li', function() {
                $li.find('.is-checked').removeClass('is-checked');
                $( this ).addClass('is-checked');
                clearMenuList()
              });
            });
            if(activeCategory !== null){
              $grid.isotope({ filter: activeCategory.replace(/^./, activeCategory[0].toUpperCase()) })
            }

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

          $('.menu-list').click(function() {
            const product = jQuery(this).data('product')
            jQuery(this).addClass("active")
            addCart(product)
          });

          }
        }).catch((error) =>{
          console.log({error})
        })
      }
    })



});