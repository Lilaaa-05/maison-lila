const {test}=require('node:test');
const assert=require('node:assert/strict');
const shop=require('../shop-core.js');
test('four local products replace the retired sample, with complete locales and integer market prices',()=>{
  assert.equal(shop.catalog.length,4);assert.equal(new Set(shop.catalog.map(x=>x.id)).size,4);assert.equal(shop.getProduct('blue-dress'),undefined);
  for(const product of shop.catalog){for(const lang of ['en','cn','ja']){assert.ok(product.name[lang]);assert.ok(product.color[lang]);assert.ok(product.description[lang]);}for(const currency of shop.currencies)assert.ok(Number.isInteger(product.prices[currency])&&product.prices[currency]>0);assert.ok(require('node:fs').existsSync(require('node:path').join(__dirname,'..',product.image)));}
  assert.equal(shop.price('lila-crewneck-black','CNY'),300);assert.equal(shop.price('lila-crewneck-brown','USD'),45);assert.equal(shop.price('logo-sticker','JPY'),440);
});
test('mixed product totals use each SKU price in every currency',()=>{
  let cart=shop.add([],'logo-sticker','ONE SIZE',2);cart=shop.add(cart,'portrait-tote','ONE SIZE',1);cart=shop.add(cart,'lila-crewneck-black','M',1);
  assert.equal(shop.total(cart,'CNY'),520);assert.equal(shop.total(cart,'USD'),78);assert.equal(shop.total(cart,'JPY'),12180);assert.equal(shop.count(cart),4);assert.throws(()=>shop.total(cart,'EUR'));
});
test('same product and size merge while colors, different products and sizes remain separate',()=>{
  let cart=shop.add([],'lila-crewneck-black','M',2);cart=shop.add(cart,'lila-crewneck-black','M',3);cart=shop.add(cart,'lila-crewneck-brown','M',1);cart=shop.add(cart,'lila-crewneck-black','S',1);
  assert.equal(cart.length,3);assert.equal(cart[0].quantity,5);assert.equal(shop.count(cart),7);assert.equal(shop.add(cart,'lila-crewneck-black','M',99)[0].quantity,99);
});
test('restored carts reject retired IDs, invalid product-size pairs and corrupted quantities',()=>{
  assert.deepEqual(shop.normalizeCart(null),[]);assert.deepEqual(shop.normalizeCart([{size:'M',quantity:2},{productId:'logo-sticker',size:'M',quantity:1},{productId:'missing',size:'ONE SIZE',quantity:1},{productId:'portrait-tote',size:'ONE SIZE',quantity:-1},null]),[]);
  assert.deepEqual(shop.normalizeCart([{productId:'logo-sticker',size:'ONE SIZE',quantity:2,email:'private'}]),[{productId:'logo-sticker',size:'ONE SIZE',quantity:2}]);
  assert.throws(()=>shop.add([],'logo-sticker','M',1));assert.throws(()=>shop.add([],'lila-crewneck-black','ONE SIZE',1));assert.throws(()=>shop.add([],'missing','M',1));for(const quantity of [0,-1,1.5,100,NaN])assert.throws(()=>shop.add([],'portrait-tote','ONE SIZE',quantity));
});
test('all pages have complete translations and store links target product pages',()=>{
  const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../translations.js'),'utf8'),context);vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../story.js'),'utf8'),context);
  for(const file of ['index.html','clothing.html','collection.html','product.html']){const html=fs.readFileSync(path.join(__dirname,'..',file),'utf8');for(const [,key] of html.matchAll(/data-i18n="([^"]+)"/g))for(const lang of ['en','cn','ja'])assert.equal(typeof context.window.maisonTranslations[key]?.[lang],'string',file+':'+key+':'+lang);assert.ok(!html.includes('Blue Print Dress'));}
  const store=fs.readFileSync(path.join(__dirname,'../clothing.html'),'utf8');assert.equal([...store.matchAll(/data-product-card=/g)].length,4);for(const product of shop.catalog)assert.ok(store.includes('product.html?id='+product.id));for(const lang of ['en','cn','ja'])assert.ok(context.window.maisonStory[lang].length>=8);
});
