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
      upKey: 38, // key code to navigate to the next section
      downKey: 40, // key code to navigate to the previous section
      easing: 'swing', // the easing function for animation
      scrollTime: 600, // how long (in ms) the animation takes
      activeClass: 'active', // class given to the active nav element
      onPageChange: null, // function(pageIndex) that is called when page is changed
      topOffset: -20 // offste (in px) for fixed top navigation
  });    
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
            
            const formatterPeso = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            })

            const productsTab = $('.menu-list-container');
            const productItem = $([
                "<div class='menu-list "+ product.category.id +"' data-category='"+ product.category.id +"'>",
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



          }
        })
      }

    })



});