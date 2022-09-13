let cart = [];
let qtdModal = 1;
let modalKey = 0;

// abreviar funções
const Qs = (el)=>document.querySelector(el);
const QsA = (el)=>document.querySelectorAll(el);

// listagem pizzas
pizzaJson.map((item,index)=>{
    // selecionar elemento a ser clonado 
    let pizzaItem = Qs('.models .pizza-item').cloneNode(true);
    // preencher as info em pizzaItem
    pizzaItem.setAttribute('data-key', index); //insere os parametro no html do item p/controle modal
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    // cancela o evento de click da tag a permitindo substituir pela abertura do modal ao click
    pizzaItem.querySelector('a').addEventListener('click', (evento)=>{
        evento.preventDefault(); 
        // salva em key o indice de qual a pizza clicada
        let key = evento.target.closest('.pizza-item').getAttribute('data-key');
        qtdModal = 1; //reseta qtd do modal ao abrir
        modalKey = key; // salva a key em variavel p usar fora do evento
        // infos do modal
        Qs('.pizzaBig img').src = pizzaJson[key].img; // insere img no html modal
        Qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name; // insere o nome da pizza
        Qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description; // insere a descrição
        Qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`; //preço
        Qs('.pizzaInfo--size.selected').classList.remove('selected'); // reseta opção selecionada ao abrir modal
        QsA('.pizzaInfo--size').forEach((size, sizeIndex)=> { 
            if(sizeIndex == 2) {
                size.classList.add('selected'); //seleciona sempre o tamanho g ao abrir modal
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]; //insere no local correto os tamanhos mapeados
        });

        Qs('.pizzaInfo--qt').innerHTML = qtdModal;

        // cria efeito de transição do modal em conjunto com o transition css da classe
        Qs('.pizzaWindowArea').style.opacity = 0; //deixa invisivel
        Qs('.pizzaWindowArea').style.display = 'flex'; //mostra na tela invisivel 
        setTimeout(()=>{ 
            Qs('.pizzaWindowArea').style.opacity = 1; //torna visivel
        }, 200); //define intervalo entre 0 e 1 criando efeito de aparição leve
    });

    // imprime item na area
    Qs('.pizza-area').append(pizzaItem);
});

// Eventos MODAL
function closeModal() { //fechar modal
    Qs('.pizzaWindowArea').style.opacity = 0; // torna invisivel
    setTimeout(() => { 
        Qs('.pizzaWindowArea').style.display = 'none'; // faz sumir da tela
    }, 200); // define o timeout p efeito de fechamento
}
QsA('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=> {
    item.addEventListener('click', closeModal);
}); // p cada item ao clicar chama closeModal

// //fechar ao pressionar esc
// window.addEventListener('keydown', (e) => {
//     if( C('.pizzaWindowArea').style.display === 'flex'){
//         if(e.code === 'Escape') {
//             closeModal();
//         }
//     }
// }); 
//botoes menos e mais
Qs('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(qtdModal > 1) {
        --qtdModal;
        Qs('.pizzaInfo--qt').innerHTML = qtdModal;
    }
});
Qs('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    qtdModal++;
    Qs('.pizzaInfo--qt').innerHTML = qtdModal;
});
// selecionar tamanhos
QsA('.pizzaInfo--size').forEach((size)=>{
    size.addEventListener('click', ()=>{ //ao clicar em um tamanho
        Qs('.pizzaInfo--size.selected').classList.remove('selected');//remove selecao da que tiver atual
        size.classList.add('selected');// add selecao no tamanho clicado
    });
});
// add evento de click no carrinho 
Qs('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(Qs('.pizzaInfo--size.selected').getAttribute('data-key')); //salva em variavel o indice do tamanho selecionado
    // cria identificador com id e tamanho
    let identifier = pizzaJson[modalKey].id+'@'+size;
    // salva em variavel qual item possui o mesmo identificador
    let key = cart.findIndex((item)=>item.identifier == identifier);
    // condição p/ adição
    if(key > -1) { // caso tenha encontrado o identifcador
        cart[key].qt += qtdModal;
    } else { // caso não faz o push do objeto completo
        cart.push({ // add ao carrinho
            identifier,
            id:pizzaJson[modalKey].id,//pega o id no json
            size,
            qt:qtdModal
        });
    } // faz o controle de adição, para que o objeto adicione a qtd correta
    updateCart();
    closeModal();
});
// abre o carrinho mobile caso haja itens
Qs('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) {
        Qs('aside').style.left = '0';
    }
});

Qs('.menu-closer').addEventListener('click', ()=>{
    Qs('aside').style.left = '100vw';
});

// exibe o carrinho ao adicionar itens
function updateCart() {
    Qs('.menu-openner span').innerHTML = cart.length; //atualiza qt itens no icone carrinho em mobile

    if(cart.length > 0) { //caso haja itens
        Qs('aside').classList.add('show');
        Qs('.cart').innerHTML = ''; // reseta o elemento ao adicionar a mesma escolha

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);//retorna as informações da pizza adicionada
            subtotal += pizzaItem.price * cart[i].qt;
            
            let cartItem = Qs('.models .cart--item').cloneNode(true); //clona os itens do cart
            
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`; //imprime nome e tamanho no aside

            cartItem.querySelector('img').src = pizzaItem.img; //insere imagem
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; //nome
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; //qtd
            // botao menos e mais do aside
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1); //caso diminua a menos de 1 o cart some
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            

            Qs('.cart').append(cartItem);//imprime em .cart no aside o cartItem
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        Qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        Qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        Qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else { //caso não haja itens
        Qs('aside').classList.remove('show');
        Qs('aside').style.left = '100vw';
    }
}