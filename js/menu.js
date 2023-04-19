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

    const firstData =  new Promise((resolve, reject) =>{
      getCategories.then((res) => {
        const { categories } = res.data;
        if(!localStorage.getItem('categories')){ localStorage.setItem('categories', JSON.stringify(categories)) }
        const categoriesList = $('#gardenia-categories');
        
        categoriesList.append(`<li class='item-link is-checked'data-filter='*'>Todo</li>`);

        categories.map((category) => {
            const categoryItem = $([
                "<li class='item-link' data-filter='."+ category.id +"'>",
                    category.name,
                "</li>",
            ].join("\n"))
            categoriesList.append(categoryItem);
        });
        resolve(true)
      }).catch(()=> reject(false));      
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
                            (product.offer)?'<div class="offer-icon"> <i class="flaticon-gardenia-offer"></i></div>':'',
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
    console.log({firstData})
    console.log({secondData})
    firstData.then((res) =>{
      if(res){
        secondData.then((res) =>{
          if(res){
            console.log(12)
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
            
          }
        })
      }

    })



});