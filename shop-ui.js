(() => {
  const core=window.MaisonShop;
  const productId=new URLSearchParams(location.search).get('id')||'logo-sticker';
  const product=document.body.dataset.page==='product'?core.getProduct(productId):null;
  let language='en',currency='USD',currencyExplicit=false,cart=[],wishlist=[];
  try {
    cart=core.normalizeCart(JSON.parse(localStorage.getItem('maison-cart')||'[]'));
    const saved=localStorage.getItem('maison-currency');if(core.currencies.includes(saved)){currency=saved;currencyExplicit=true;}
    const wishes=JSON.parse(localStorage.getItem('maison-wishlist')||'[]');if(Array.isArray(wishes))wishlist=[...new Set(wishes.filter(id=>core.getProduct(id)))];
  }catch{}
  const t=key=>window.maisonTranslations[key]?.[language]||key;
  const name=item=>item.name[language],color=item=>item.color[language];
  const money=amount=>({CNY:'CNY ¥',USD:'US$',JPY:'JPY ¥'}[currency])+new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(amount);
  const sizeName=size=>size==='ONE SIZE'?t('onesize'):size;
  const cartDialog=document.querySelector('#cart-dialog'),checkoutDialog=document.querySelector('#checkout-dialog');
  const form=document.querySelector('#purchase-form'),checkoutForm=document.querySelector('#checkout-form'),status=document.querySelector('#purchase-status');
  const productUrl=id=>'product.html?id='+encodeURIComponent(id);
  function persist(){try{localStorage.setItem('maison-cart',JSON.stringify(cart));}catch{}}
  function createCard(item){
    const card=document.createElement('article');card.className='product-card';card.dataset.productCard=item.id;
    card.innerHTML=`<a class="product-link" href="${productUrl(item.id)}"><span class="product-image"><img src="${item.image}" alt="" loading="lazy" width="1086" height="1448"><span class="quick-view" data-card-view></span></span><span class="product-info"><span class="product-name"></span><span class="product-price"></span></span><span class="product-colour"><span class="colour-dot" style="background:${item.swatch}" aria-hidden="true"></span><span class="product-color-name"></span></span></a>`;
    return card;
  }
  const related=document.querySelector('#related-grid');if(related&&product)core.catalog.filter(item=>item.id!==product.id).forEach(item=>related.append(createCard(item)));
  let galleryView=0;
  function updateGallery(){
    if(!product)return;
    const stage=document.querySelector('.gallery-stage');stage.classList.toggle('is-detail',galleryView===1);stage.style.setProperty('--detail-origin',product.origin);
    const main=document.querySelector('#product-main-image');main.src=product.image;main.alt=name(product)+' — '+t(galleryView?'gallerydetail':'galleryfull');
    document.querySelectorAll('[data-gallery-view]').forEach(button=>{
      button.setAttribute('aria-pressed',String(Number(button.dataset.galleryView)===galleryView));
      button.querySelector('img').src=product.image;
      button.querySelector('.thumbnail-detail')?.style.setProperty('--detail-origin',product.origin);
    });
    document.querySelectorAll('[data-gallery-step]').forEach(button=>button.setAttribute('aria-label',t(Number(button.dataset.galleryStep)<0?'previousimage':'nextimage')));
  }
  document.querySelectorAll('[data-gallery-view]').forEach(button=>button.addEventListener('click',()=>{galleryView=Number(button.dataset.galleryView);updateGallery();}));
  document.querySelectorAll('[data-gallery-step]').forEach(button=>button.addEventListener('click',()=>{galleryView=galleryView?0:1;updateGallery();}));
  function renderWishlist(){
    const button=document.querySelector('#wishlist-toggle');if(!button||!product)return;
    const saved=wishlist.includes(product.id);button.setAttribute('aria-pressed',String(saved));button.querySelector('.wishlist-heart').textContent=saved?'♥':'♡';document.querySelector('#wishlist-label').textContent=t(saved?'wishlisted':'wishlist');
  }
  document.querySelector('#wishlist-toggle')?.addEventListener('click',()=>{
    if(!product)return;wishlist=wishlist.includes(product.id)?wishlist.filter(id=>id!==product.id):[...wishlist,product.id];
    try{localStorage.setItem('maison-wishlist',JSON.stringify(wishlist));}catch{}renderWishlist();
  });
  function renderProduct(){
    if(document.body.dataset.page!=='product')return;
    document.querySelector('#product-not-found').hidden=!!product;document.querySelector('#product-found').hidden=!product;
    if(!product){document.title=t('productnotfound')+' — Maison Lila';return;}
    document.title=name(product)+' — Maison Lila';document.querySelector('meta[name="description"]').content=product.description[language];
    document.querySelectorAll('[data-current-product]').forEach(el=>{
      const field=el.dataset.currentProduct;
      el.textContent=field==='name'?name(product):field==='color'?color(product):field==='description'?product.description[language]:field==='kind'?t(product.kind==='clothing'?'apparel':'goods'):field==='sizes'?product.sizes.map(sizeName).join(' / '):field==='material'?(product.material?.[language]||t('confirmedlater')):field==='productionOrigin'?(product.productionOrigin?.[language]||t('confirmedlater')):product.id.toUpperCase();
    });
    const colors=document.querySelector('#product-color-options');colors.replaceChildren();
    const variants=product.kind==='clothing'?core.catalog.filter(item=>item.kind==='clothing'):[product];
    variants.forEach(item=>{const link=document.createElement('a');link.href=productUrl(item.id);link.className='product-color-link';link.setAttribute('aria-label',color(item));link.title=color(item);if(item.id===product.id)link.setAttribute('aria-current','page');const image=document.createElement('img');image.src=item.image;image.alt=color(item);link.append(image);colors.append(link);});
    const root=document.querySelector('#product-sizes');
    if(root.dataset.product!==product.id){
      root.replaceChildren();root.dataset.product=product.id;
      if(product.sizes.length===1){const hidden=document.createElement('input');hidden.type='hidden';hidden.name='size';hidden.value=product.sizes[0];root.append(hidden);}
      else product.sizes.forEach(size=>{const label=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');input.type='radio';input.name='size';input.value=size;input.required=true;span.textContent=size;label.append(input,span);root.append(label);});
    }
    document.querySelector('#product-size-picker').hidden=product.sizes.length===1;document.querySelector('#single-size').hidden=product.sizes.length!==1;
    document.querySelectorAll('[data-product-quantity]').forEach(button=>button.setAttribute('aria-label',t(Number(button.dataset.productQuantity)<0?'decrease':'increase')));
    form.querySelector('[name="quantity"]').setAttribute('aria-label',t('quantity'));
    updateGallery();renderWishlist();
  }
  function render(){
    renderProduct();
    document.querySelectorAll('[data-product-card]').forEach(card=>{
      const item=core.getProduct(card.dataset.productCard);if(!item)return;
      card.querySelector('.product-name').textContent=name(item);card.querySelector('.product-price').textContent=money(item.prices[currency]);card.querySelector('.product-color-name').textContent=color(item);card.querySelector('.product-image>img').alt=name(item);card.querySelector('.quick-view').textContent=t('quickview');
    });
    document.querySelectorAll('[data-price="unit"]').forEach(el=>{if(product)el.textContent=money(product.prices[currency]);});
    document.querySelectorAll('.cart-count').forEach(el=>el.textContent=core.count(cart));
    document.querySelector('.currency-select').value=currency;document.querySelector('.currency-select').setAttribute('aria-label',t('currency'));
    document.querySelectorAll('[data-price="cart"]').forEach(el=>el.textContent=money(core.total(cart,currency)));
    const root=document.querySelector('#cart-lines');root.replaceChildren();
    if(!cart.length){const empty=document.createElement('p');empty.className='empty-cart';empty.textContent=t('empty');root.append(empty);}
    cart.forEach(line=>{
      const item=core.getProduct(line.productId),row=document.createElement('article');row.className='cart-line';
      row.innerHTML=`<img src="${item.image}" alt=""><div><h3><a href="${productUrl(item.id)}">${name(item)}</a></h3><p>${t('size')}: ${sizeName(line.size)} · ${color(item)}</p><div class="cart-quantity"><button type="button" data-action="decrease" data-product-id="${item.id}" data-size="${line.size}" aria-label="${t('decrease')} ${name(item)} ${line.size}" ${line.quantity===1?'disabled':''}>−</button><span>${line.quantity}</span><button type="button" data-action="increase" data-product-id="${item.id}" data-size="${line.size}" aria-label="${t('increase')} ${name(item)} ${line.size}" ${line.quantity===99?'disabled':''}>+</button><button type="button" class="remove-line" data-action="remove" data-product-id="${item.id}" data-size="${line.size}">${t('remove')}</button></div></div><strong>${money(line.quantity*item.prices[currency])}</strong>`;
      root.append(row);
    });
    document.querySelector('#go-checkout').disabled=!cart.length;
  }
  const tabs=[...document.querySelectorAll('[data-product-tab]')];
  function selectTab(button,focus=false){tabs.forEach(tab=>{const active=tab===button;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=!active;});if(focus)button.focus();}
  tabs.forEach((button,index)=>{button.addEventListener('click',()=>selectTab(button));button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();selectTab(tabs[next],true);}});});
  document.querySelectorAll('[data-product-quantity]').forEach(button=>button.addEventListener('click',()=>{const input=form.querySelector('[name="quantity"]');const value=Math.max(1,Math.min(99,Number(input.value)||1));input.value=Math.max(1,Math.min(99,value+Number(button.dataset.productQuantity)));}));
  let lastOpener;
  function openDialog(dialog,opener){lastOpener=opener||document.querySelector('.cart-open');document.querySelectorAll('dialog[open]').forEach(el=>el.close());dialog.showModal();document.body.classList.add('shop-open');}
  [cartDialog,checkoutDialog].forEach(dialog=>{
    dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('shop-open');lastOpener?.focus({preventScroll:true});});
    dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  });
  document.querySelectorAll('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>document.getElementById(button.dataset.closeDialog).close()));
  document.querySelector('.cart-open').addEventListener('click',event=>{render();openDialog(cartDialog,event.currentTarget);});
  function addSelection(){
    if(!product||!form.reportValidity())return false;
    const data=new FormData(form);
    try{cart=core.add(cart,product.id,data.get('size'),Number(data.get('quantity')));}catch{status.textContent=t('selecterror');return false;}
    persist();render();status.textContent=t('added');return true;
  }
  form?.addEventListener('submit',event=>{event.preventDefault();if(addSelection())openDialog(cartDialog,event.submitter);});
  form?.addEventListener('change',()=>status.textContent='');
  document.querySelector('#buy-now')?.addEventListener('click',()=>{if(addSelection())startCheckout();});
  document.querySelector('.currency-select').addEventListener('change',event=>{currency=event.target.value;currencyExplicit=true;try{localStorage.setItem('maison-currency',currency);}catch{}render();if(status)status.textContent='';});
  document.querySelector('#cart-lines').addEventListener('click',event=>{
    const button=event.target.closest('[data-action]');if(!button)return;
    const {productId,size,action}=button.dataset,index=cart.findIndex(line=>line.productId===productId&&line.size===size);if(index<0)return;
    if(action==='remove')cart.splice(index,1);else cart[index].quantity=Math.max(1,Math.min(99,cart[index].quantity+(action==='increase'?1:-1)));
    persist();render();
    const focus=[...document.querySelectorAll('#cart-lines [data-action]')].find(el=>el.dataset.productId===productId&&el.dataset.size===size&&el.dataset.action===action&&!el.disabled);
    const heading=document.querySelector('#cart-title');heading.tabIndex=-1;(focus||heading).focus({preventScroll:true});
  });
  function startCheckout(){
    if(!cart.length)return;
    checkoutForm.reset();checkoutForm.hidden=false;document.querySelector('#checkout-success').hidden=true;
    const root=document.querySelector('#checkout-lines');root.replaceChildren();
    cart.forEach(line=>{const item=core.getProduct(line.productId),row=document.createElement('p');row.className='checkout-row';const description=document.createElement('span');description.textContent=`${name(item)} · ${sizeName(line.size)} × ${line.quantity}`;const price=document.createElement('strong');price.textContent=money(line.quantity*item.prices[currency]);row.append(description,price);root.append(row);});
    document.querySelector('#checkout-total').textContent=money(core.total(cart,currency));openDialog(checkoutDialog);
  }
  document.querySelector('#go-checkout').addEventListener('click',startCheckout);
  checkoutForm.addEventListener('submit',event=>{event.preventDefault();if(!cart.length||!checkoutForm.reportValidity())return;checkoutForm.reset();checkoutForm.hidden=true;document.querySelector('#checkout-success').hidden=false;cart=[];persist();render();document.querySelector('#checkout-success').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});document.querySelector('#back-to-shop').focus({preventScroll:true});});
  checkoutDialog.addEventListener('close',()=>checkoutForm.reset());
  document.querySelector('#back-to-shop').addEventListener('click',()=>{checkoutDialog.close();location.href='clothing.html';});
  window.maisonCommerce={setLocale(next){language=next;if(!currencyExplicit)currency={en:'USD',cn:'CNY',ja:'JPY'}[language];if(status)status.textContent='';render();}};
  render();
})();
