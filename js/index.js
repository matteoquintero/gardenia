const getProductsByCategory = ( name, id )=>{
    return new Promise((resolve, reject) =>{
        if(!localStorage.getItem(name)){
            fetch( 'https://api-sa-east-1.hygraph.com/v2/clf6bmruf5nal01t5ahxwbqru/master',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    query: `
                    query {
                        products(first: 6, orderBy: order_ASC, where: {category: {id: "`+ id +`"}}) {
                            id
                            name
                            description
                            price
                            content
                            measure
                            offer
                            discount
                            quantity
                            category{
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

        if(localStorage.getItem(name)){
            const topProducts = JSON.parse(localStorage.getItem(name))
            if(topProducts.length > 0){
                return resolve({data:{products:topProducts}})
            }
            return reject (404)
        }            

    });
}

const createClient = ( name, phone )=>{
    return new Promise((resolve, reject) =>{
        fetch( 'https://api-sa-east-1.hygraph.com/v2/clf6bmruf5nal01t5ahxwbqru/master',{
            method: 'POST',
            body: JSON.stringify({
                query: `
                mutation {
                    createClient(data: { name: `+ name +`, phone: `+ phone +` }) {
                        name
                        phone
                    }
                }`
        ,}),})
        .then((res) => {
            if (!res.ok) return reject(res);
            return resolve(res.json());
        })                

    });
}


const getEvents = new Promise((resolve, reject) => {
    if(!localStorage.getItem('events')){
        fetch( 'https://api-sa-east-1.hygraph.com/v2/clf6bmruf5nal01t5ahxwbqru/master',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: `
                query {
                    events(orderBy: order_ASC) {
                        id
                        title
                        description
                        order
                        date
                        image{
                            url
                        }
                    }
                }`
        ,}),})
        .then((res) => {
            if (!res.ok) return reject(res);
            return resolve(res.json());
        })
    }

    if(localStorage.getItem('events')){
        const events = JSON.parse(localStorage.getItem('events'))
        if(events.length > 0){
            return resolve({data:{events:events}})
        }
        return reject (404)
    }
});      

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

$(function () {
    "use strict";
    if(localStorage.getItem('cart')){ updateCart(JSON.parse(localStorage.getItem('cart'))) }

    // ScrollIt
    $.scrollIt({
        upKey: 38, // key code to navigate to the next section
        downKey: 40, // key code to navigate to the previous section
        easing: 'swing', // the easing function for animation
        scrollTime: 600, // how long (in ms) the animation takes
        activeClass: 'active', // class given to the active nav element
        onPageChange: null, // function(pageIndex) that is called when page is changed
        topOffset: -70 // offste (in px) for fixed top navigation
    });
    //  MenuBook Tabs
    $('.tabs .tab-links').on('click', '.item-link', function () {
        var tab_id = $(this).attr('data-tab');
        $('.tabs .tab-links .item-link').removeClass('current');
        $(this).addClass('current');
        $('.tab-content').slideUp();
        $("#" + tab_id).slideDown();
    });
    $('.tabs-fade .tab-links').on('click', '.item-link', function () {
        var tab2_id = $(this).attr('data-tab');
        $('.tabs-fade .tab-links .item-link').removeClass('current');
        $(this).addClass('current');
        $('.tab-content').fadeOut();
        $("#" + tab2_id).fadeIn();
    });    

    $('#kenburnsSliderContainer').vegas({
        slides: [{
            src: "img/inicio/1.jpg"
        }, {
            src: "img/inicio/2.jpg"
        }, {
            src: "img/inicio/3.jpg"
        }],
        overlay: true,
        transition: 'fade2',
        animation: 'kenburnsUpRight',
        transitionDuration: 1000,
        delay: 10000,
        animationDuration: 20000
    });
    
    getEvents.then((res) =>{
        const { events } = res.data;
        if(!localStorage.getItem('events')){ localStorage.setItem('events', JSON.stringify(events)) }
        const eventsList = $('#gardenia-events');

        events.map((event)=>{

            const eventDate = new Date(event.date);
            const eventDayOptions = {
              weekday: 'long',
              day: 'numeric',
            };
            const eventDay = eventDate.toLocaleDateString('es-CO', eventDayOptions)

            const eventMontOptions = {
                month: 'long',
            };
            const eventMont = eventDate.toLocaleDateString('es-CO', eventMontOptions) 

            const eventItem = $([
                "<div class='item'>",
                    "<div class='position-re o-hidden'> ",
                        "<img src='"+ event.image.url +"' alt=''>",
                        "<div class='date'>",
                            "<a href='#'> <span>"+ eventMont +"</span> <i>"+  eventDay.charAt(0).toUpperCase() + eventDay.slice(1) +"</i> </a>",
                        "</div>",
                    "</div>",
                    "<div class='con'> <span class='category'>",
                        "<a href='#'>"+ event.title +"</a>",
                        "</span>",
                    "<h5><a href='#'>"+event.description+"</a></h5>",
                    "</div>",
                "</div>"
            ].join("\n"));
            eventsList.append(eventItem);
        })

    })


    const secondData =  new Promise((resolve, reject) =>{

        getCategories.then((res) => {
            const { categories } = res.data;
            if(!localStorage.getItem('categories')){ localStorage.setItem('categories', JSON.stringify(categories)) }
    
            const categoriesList = $('#gardenia-categories');
            const categoriesTopList = $('#gardenia-top-categories');
            const productsTopList = $('#gardenia-top-products');
    
            categories.map((category) => {
                
                const categoryItem = $([
                    "<div class='col-md-4'>",
                        "<a class='item' href='"+ category.name.replace(' ', '-').toLowerCase() +"'>",
                            "<span class='"+ category.icon +"'></span>",
                            "<h5>"+ category.name +"</h5>",
                            "<p>"+ category.description +"</p>",
                            "<div class='shape'> <span class='"+ category.icon +"'></span> </div>",
                        "</a>",
                    "</div>",
                ].join("\n"));
    
                if(category.order <= 3){
    
                    const categoryTopItem = $([
                        "<li class='item-link' data-tab='tab-"+ category.order +"'>",
                        "<i class='"+category.icon+"'></i>",
                        "<span>"+category.name+"</span>",
                        "</li>",
                    ].join("\n"))
    
                    categoriesTopList.append(categoryTopItem);
    
                    const productTopContainerTab = $([
                        "<div class='tab-content' id='tab-"+ category.order +"'>",
                            "<div class='row'>",
                                "<div class='col-md-12'>",
                                    "<div class='menu-list-container'>",
                                    "</div>",
                                "</div>",
                            "</div>",
                        "</div>",
                    ].join("\n"))
    
                    productsTopList.append(productTopContainerTab)
    
                    if(category.order === 1){ 
                        productTopContainerTab.addClass('current')
                        categoryTopItem.addClass('current')
                    }
    
                    getProductsByCategory(category.name, category.id).then((res) => {
                        const { products } = res.data;
                        if(!localStorage.getItem(category.name)){ localStorage.setItem(category.name, JSON.stringify(products)) }
    
                        products.map((product) => {
                            
                            const productsTopTab = $('#tab-'+ category.order +' .menu-list-container');
                            const productTopItem = $([
                                "<div data-product='"+ product.id +"' class='menu-list home'>",
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
                            productsTopTab.append(productTopItem)
    
                        });
                    });
                
                }
                categoriesList.append(categoryItem);
            });
              
        });        
        resolve(true)

    }).catch(()=> reject(false));


    secondData.then(()=>{
        $('.menu-list.home').click(function() {
            const product = jQuery(this).data('product')
            addCart(product)
        });  
    })

});