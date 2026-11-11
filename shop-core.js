(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./catalog.js'));else root.MaisonShop=factory(root.MaisonCatalog);})(typeof globalThis!=='undefined'?globalThis:this,catalog=>{
  const currencies=Object.freeze(['CNY','USD','JPY']);
  const getProduct=id=>catalog.find(product=>product.id===id);
  function price(id,currency){const product=getProduct(id);if(!product||!currencies.includes(currency))throw new Error('Invalid product or currency');return product.prices[currency];}
  function normalizeCart(value){
    if(!Array.isArray(value))return [];
    const merged=new Map();
    value.forEach(line=>{
      const product=line&&getProduct(line.productId);
      if(!product||!product.sizes.includes(line.size)||!Number.isInteger(line.quantity)||line.quantity<1)return;
      const key=product.id+':'+line.size,previous=merged.get(key);
      merged.set(key,{productId:product.id,size:line.size,quantity:Math.min(99,(previous?.quantity||0)+line.quantity)});
    });
    return [...merged.values()];
  }
  function add(cart,productId,size,quantity){const product=getProduct(productId);if(!product||!product.sizes.includes(size)||!Number.isInteger(quantity)||quantity<1||quantity>99)throw new Error('Invalid selection');return normalizeCart([...normalizeCart(cart),{productId,size,quantity}]);}
  function total(cart,currency){if(!currencies.includes(currency))throw new Error('Invalid currency');return normalizeCart(cart).reduce((sum,line)=>sum+line.quantity*price(line.productId,currency),0);}
  const count=cart=>normalizeCart(cart).reduce((sum,line)=>sum+line.quantity,0);
  return {catalog,currencies,getProduct,price,normalizeCart,add,total,count};
});
