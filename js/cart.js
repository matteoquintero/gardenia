const formatterPeso = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  })
  
const addCart = (product, account=false) => {
    let cart = [];
    if(localStorage.getItem('cart')){ 
      cart = JSON.parse(localStorage.getItem('cart'));
    }
  
    if(cart.find(x => x.product === product)){
      const amount = cart.find(x => x.product === product).amount;
      const index = cart.findIndex(x => x.product === product);
      const item = {
        amount : amount + 1,
        product: product
      }
      cart[index] = item
  
    }else{
      const item = {
        amount : 1,
        product: product
      }
      cart.push(item)
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    if(account){
      updateAccount(cart)
    }else{
      updateCart(cart)
    }    
}

const removeCart = (product, account=false) => {
    cart = JSON.parse(localStorage.getItem('cart'));
  
    if(cart.find(x => x.product === product)){
      const amount = cart.find(x => x.product === product).amount;
      if(amount - 1 === 0){
        cart = cart.filter(x => x.product !== product);
      }else{
        const index = cart.findIndex(x => x.product === product);
        const item = {
          amount : amount - 1,
          product: product
        }
        cart[index] = item
      }
    }
  
    localStorage.setItem('cart', JSON.stringify(cart))
    if(account){
      updateAccount(cart)
    }else{
      updateCart(cart)
    }
}
  
const updateCart = (cart) => {
  const shoppingCart = $('#shopping-cart');
  
  const cartTotal = $('#shopping-cart-total');
  const cartDiscount = $('#shopping-cart-discount');
  const amountIcon =  $('#shopping-cart-amount-icon');
  const amountTitle =  $('#shopping-cart-amount-title');

  shoppingCart.html('')
  const products = JSON.parse(localStorage.getItem('products'));
  const categories = JSON.parse(localStorage.getItem('categories'));
  let total = 0
  let totalDiscount = 0
  let totalAmount = 0

  cart.forEach((item)=>{

    const product = products.find(x => x.id === item.product)
    const category = categories.find(x => x.id === product.category.id)
    const itemPrice = product.price * item.amount;
    const itemPriceWhitDiscount = (product.offer) ? (product.price - product.discount) * item.amount : product.price * item.amount;
    const itemDiscount = (product.offer) ? product.discount * item.amount : 0;
    totalAmount = totalAmount + item.amount
    total = total + itemPrice
    totalDiscount = totalDiscount + itemDiscount
    const cartItem = $([
      "<div class='item'>",
        "<div class='img'>",
          "<i class='"+category.icon+"'></i>",
        "</div>",
        "<div class='cont'>",
            "<h6>"+ product.name +"</h6>",
            "<div class='price'>"+ item.amount +" x <span>"+ formatterPeso.format(itemPrice) +"</span></div>",
        "</div>",
        "<div class='del valign'>",
            "<span data-product='"+ product.id +"' class='flaticon-gardenia-plus-2 cursor-pointer item-add'></span>",
            "<span data-product='"+ product.id +"' class='flaticon-gardenia-minus-1 cursor-pointer item-remove'></span>",
        "</div>",
      "</div>",
    ].join("\n"))
  
    shoppingCart.append(cartItem)

  })

  amountIcon.html(totalAmount)
  cartTotal.html(formatterPeso.format(total - totalDiscount))
  cartDiscount.html(formatterPeso.format(totalDiscount))
  amountTitle.html(totalAmount + ' productos')

  $('.item-add').click(function() {
    const product = jQuery(this).data('product')
    addCart(product)
  });

  $('.item-remove').click(function() {
    const product = jQuery(this).data('product')
    removeCart(product)
  });    

}

const updateAccount = (cart) => {
    const accountCart = $('#account-cart');
    const cartTotal = $('#account-cart-total');
    const cartDiscount = $('#account-cart-discount');
  
    accountCart.html('')
    const products = JSON.parse(localStorage.getItem('products'));
    const categories = JSON.parse(localStorage.getItem('categories'));
    let total = 0
    let totalDiscount = 0
    let totalAmount = 0
  
    cart.forEach((item)=>{
  
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
  
    cartTotal.html(formatterPeso.format(total - totalDiscount))
    cartDiscount.html(formatterPeso.format(totalDiscount))
   
    $('.item-add').click(function() {
      const product = jQuery(this).data('product')
      addCart(product, true)
    });
  
    $('.item-remove').click(function() {
      const product = jQuery(this).data('product')
      removeCart(product, true)
    });
  
}
