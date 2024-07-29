$(document).ready(function(){

    loja.eventos.init();

})

//Variáveis
var loja = {};

var MEU_CARRINHO = [];

var VALOR_CARRINHO = 0;

var VALOR_ENTREGA = 5;

var MEU_ENDERECO = null;

var phone = '5571988624423';

var insta = 'petking_vet';

var fb = '';

var totalProdutos = 72;

var minProdutos = 8;

//Eventos de iniciação do site
loja.eventos = {

    init: () => {
        loja.metodos.obterItensloja();
        loja.metodos.carregarReserva();
        loja.metodos.carregarBotaoLigar();
        loja.metodos.carregarRedes();
    }

}

//Configuração geral do site
loja.metodos = {

// Função para obter e exibir itens da loja
obterItensloja: (categoria = 'racoes', vermais = false) => {
    var filtro = ESTOQUE[categoria];

    if (!vermais) {
        $("#itensloja").html('');
        $("#btnVerMais").removeClass('hidden');
    }

    $.each(filtro, (i, e) => {
        let temp = loja.templates.item
            .replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${dsc}/g, e.dsc)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id);

        // Exibe os itens com base na configuração
        if (vermais && i >= minProdutos && i < totalProdutos) {
            $("#itensloja").append(temp);
        } else if (!vermais && i < minProdutos) {
            $("#itensloja").append(temp);
        }
    });

    // Remove o ativo
    $(".container-menu a").removeClass('active');
    // Seta o menu para ativo
    $("#menu-" + categoria).addClass('active');
},

// Função para atualizar a exibição dos produtos
atualizarExibicaoProdutos: (produtosFiltrados) => {
    $("#itensloja").html(''); // Limpa o container
    produtosFiltrados.forEach(produto => {
        let temp = loja.templates.item
            .replace(/\${img}/g, produto.img)
            .replace(/\${name}/g, produto.name)
            .replace(/\${dsc}/g, produto.dsc)
            .replace(/\${price}/g, produto.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, produto.id);

        $("#itensloja").append(temp);
    });
},

    //clique no botão ver mais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
    
        loja.metodos.obterItensloja(ativo, true);

        $("#btnVerMais").addClass('hidden');

    },

    //diminuir quantidade do item no cardápio
    diminuirQuantidade: (id) =>{

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual > 0){
            $("#qntd-" + id).text(qntdAtual - 1);
        }

    },

    //aumentar quantidade do item no cardápio
    aumentarQuantidade: (id) =>{

        let qntdAtual = parseInt($("#qntd-" + id).text());

        $("#qntd-" + id).text(qntdAtual + 1);

    },

    //adicionar ao carrinho o item no cardápio
    adicionarAoCarrinho: (id) =>{

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual > 0){
            
            //obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //obtem a lista de itens
            let filtro = ESTOQUE[categoria];

            //obter o item
            let item = $.grep(filtro, (e, i) => {return e.id == id});

            if(item.length > 0){

                //validar se ja existe o item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => {return elem.id == id});

                //caso exista so altera a quantidade
                if(existe.length > 0){

                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;

                }
                //caso não exista, adiciona
                else{

                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])

                }

                loja.metodos.mensagem('Item adicionado ao carrinho', 'green');
                $("#qntd-" + id).text(0);

                loja.metodos.atualizarBadgeTotal();

            }

        }

    },

    //atualiza o badge total dos botões do carrinho
    atualizarBadgeTotal: () =>{

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) =>{
            total += e.qntd
        })

        if(total > 0){
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }else{
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);

    },

    //abrir o carrinho
    abrirCarrinho: (abrir) =>{

        if(abrir){

            $("#modalCarrinho").removeClass('hidden');
            loja.metodos.carregarCarrinho();
            $(".header").addClass('hidden');
            $(".banner").addClass('hidden');
            $(".servicos").addClass('hidden');
            $(".loja").addClass('hidden');
            $(".depoimentos").addClass('hidden');
            $(".reserva").addClass('hidden');
            $(".container-modal").addClass('hidden');

        }else{

            $(".header").removeClass('hidden');
            $(".banner").removeClass('hidden');
            $(".servicos").removeClass('hidden');
            $(".loja").removeClass('hidden');
            $(".depoimentos").removeClass('hidden');
            $(".reserva").removeClass('hidden');
            window.location.href = "#itensloja";
            $("#modalCarrinho").addClass('hidden');

        }

    },

    //carrega as etapas do carrinho
    carregarEtapas: (etapa) =>{

        if(etapa == 1){
            $("#lblTituloEtapa").text('Meu Carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');

        }else if(etapa == 2){
            $("#lblTituloEtapa").text('Endereço de Entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');

        }else if(etapa ==3){
            $("#lblTituloEtapa").text('Resumo do Pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');

        }

    },

    //voltar etapa no carrinho
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        loja.metodos.carregarEtapas(etapa -1);

    },

    //carrega a lista de itens no carrinho
    carregarCarrinho: () =>{

        loja.metodos.carregarEtapas(1);

        if(MEU_CARRINHO.length > 0){

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) =>{

                let temp = loja.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd);

                $("#itensCarrinho").append(temp);

                //último item
                if((i + 1) == MEU_CARRINHO.length){
                    loja.metodos.carregarValores();
                }

            })

        }else{
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu Carrinho esta vazio!</p>');
            loja.metodos.carregarValores();
        }

    },

    //diminui a quantidade de itens no carrinho
    diminuirQuantidadeCarrinho: (id) =>{

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if(qntdAtual > 1){
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            loja.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }else{
            loja.metodos.removerItensCarrinho(id);
        }

    },

    //aumenta a quantidade de itens no carrinho
    aumentarQuantidadeCarrinho: (id) =>{

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if(qntdAtual >= 1){
            $("#qntd-carrinho-" + id).text(qntdAtual + 1);
            loja.metodos.atualizarCarrinho(id, qntdAtual + 1);
        }else{
            loja.metodos.removerItensCarrinho(id);
        }

    },

    //remove itens do carrinho
    removerItensCarrinho: (id) =>{

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) =>{return e.id != id});
        loja.metodos.carregarCarrinho();

        //atualiza o botão carrinho com a quantidade atual de itens
        loja.metodos.atualizarBadgeTotal();

    },

    //atualiza a quantidade de itens no carrinho
    atualizarCarrinho: (id, qntd) =>{

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        //atualiza o botão carrinho com a quantidade atual de itens
        loja.metodos.atualizarBadgeTotal();

        //atualiza os valores (R$) totais do carrinho
        loja.metodos.carregarValores();

    },

    //carrega os valores de subtotal, entrega e total
    carregarValores:()=>{

        VALOR_CARRINHO = 0;

        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) =>{

            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if((i + 1) == MEU_CARRINHO.length){
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.' , ',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.' , ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.' , ',')}`);
            }

        })

    },

    //carregar etapa de endereço
    carregarEndereco: ()=>{

        if(MEU_CARRINHO.length <= 0){

            loja.metodos.mensagem('Seu carrinho está vazio.')
            return;

        }

        loja.metodos.carregarEtapas(2);

    },

    //API ViaCEP
    buscarCEP: ()=>{

        //cria a variável com o valor do CEP
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        if(cep != ""){

            //expressão regular para validar o CEP
            var validacep = /^[0-9]{8}$/;

            if(validacep.test(cep)){

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function(dados){

                    if(!("erro" in dados)){
                        //Atualiza os campos com os valores retornados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#txtNumero").focus();


                    }else{
                        loja.metodos.mensagem('CEP não encontrado.');
                        $("#txtCEP").focus();

                    }

                });

            }else{
                loja.metodos.mensagem('Formato do CEP inválido.');
                $("#txtCEP").focus();
            }

        }else{
            loja.metodos.mensagem('Informe o CEP.');
            $("#txtCEP").focus();
        }

    },

    //validação antes de seguir para a etapa de resumo do pedido
    resumoPedido: ()=>{

        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUf").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();
        let nome = $("#txtNome").val().trim();
        let telefone = $("#txtTelefone").val().trim();
        let pagamento = $("input[name='formaPagamento']:checked");
        let pag = "";

        if(nome.length <= 0){
            loja.metodos.mensagem('Informe o seu Nome.');
            $("#txtNome").focus();
            return;
        }

        if(telefone.length <= 0){
            loja.metodos.mensagem('Informe o seu Telefone.');
            $("#txtTelefone").focus();
            return;
        }

        if(cep.length <= 0){
            loja.metodos.mensagem('Informe o CEP.');
            $("#txtCEP").focus();
            return;
        }

        if(endereco.length <= 0){
            loja.metodos.mensagem('Informe o Endereço.');
            $("#txtEndereco").focus();
            return;
        }

        if(bairro.length <= 0){
            loja.metodos.mensagem('Informe o Bairro.');
            $("#txtBairro").focus();
            return;
        }

        if(cidade.length <= 0){
            loja.metodos.mensagem('Informe a Cidade.');
            $("#txtCidade").focus();
            return;
        }

        if(uf == "-1"){
            loja.metodos.mensagem('Informe o Estado.');
            $("#ddlUf").focus();
            return;
        }

        if(numero.length <= 0){
            loja.metodos.mensagem('Informe o Numero da moradia.');
            $("#txtNumero").focus();
            return;
        }

        if(pagamento.length <= 0){
            loja.metodos.mensagem('Informe a forma de pagamento.');
            return;
        }

        if(document.getElementById("checkCartao").checked){
            pag = "Cartão (Crédito/Débito)";

        }
        
        if(document.getElementById("checkDinheiro").checked){
            pag = "Dinheiro (Espécie)";

        }
        
        if(document.getElementById("checkPix").checked){
            pag = "Pix";
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento,
            nome: nome,
            telefone: telefone,
            pag: pag
        }

        loja.metodos.carregarEtapas(3);
        loja.metodos.carregarResumo();

    },

    //carrega a ultima etapa do pedido
    carregarResumo: () =>{

        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) =>{

            let temp = loja.templates.itemResumo.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${qntd}/g, e.qntd);

            $("#listaItensResumo").append(temp);

        })

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero} - ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf}, ${MEU_ENDERECO.cep}&nbsp;${MEU_ENDERECO.complemento}`);
        $("#formaPagamento").html(`\n\n<b>Forma de Pagamento: ${MEU_ENDERECO.pag}</b>`);

        loja.metodos.finalizarPedido();

    },

    //Envia pedido para o WhatsApp do estabelecimento 
    finalizarPedido:() =>{

        if(MEU_CARRINHO.length > 0 && MEU_ENDERECO != null){

            var texto = 'Olá! Gostaria de fazer um pedido:';
            texto += `\n\n*Itens do pedido:*\n\n\${itens}`;
            texto += `\n*Valor da Entrega: R$ ${VALOR_ENTREGA.toFixed(2).replace('.' , ',')}*`
            texto += `\n\n*Endereço de Entrega:*`;
            texto += `\n\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero} - ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf}, ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.' , ',')}*`;
            texto += `\n\n\n*Nome: ${MEU_ENDERECO.nome}*`;
            texto += `\n*Telefone: ${MEU_ENDERECO.telefone}*`;
            texto += `\n\nForma de pagamento: *${MEU_ENDERECO.pag}*`;

            if(document.getElementById("checkPix").checked){
                texto += `\n\n*----AVISO----*`;
                texto += `\n\nPagamentos no *Pix* só serão validados mediante envio do comprovante nesta conversa.`;
                texto += `\n\nNossa chave pix: *AQUI VAI A CHAVE PIX*`;
            }

            if(document.getElementById("checkCartao").checked){
                texto += `\n\n*----AVISO----*`;
                texto += `\n\nPagamentos no *Cartão* tem um acréscimo de *R$ 1,00* devido a taxa da maquininha.`;
            }

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) =>{

                itens += `*${e.qntd}x* ${e.name} ...... R$ ${e.price.toFixed(2).replace('.' , ',')} \n`;

                if((i + 1) == MEU_CARRINHO.length){

                    texto = texto.replace(/\${itens}/g, itens);

                    //converter a URL
                    let encode = encodeURI(texto);
                    let URL = `http://wa.me/${phone}?text=${encode}`;

                    $("#btnEtapaResumo").attr('href', URL);

                }

            })

        }

    },

    //carrega o link para realizar reserva
    carregarReserva: () =>{

        var texto = 'Olá! Gostaria de agendar um horário para uma *Consulta Veterinária*.';

        //converter a URL
        let encode = encodeURI(texto);
        let URL = `http://wa.me/${phone}?text=${encode}`;

        $("#btnAgenda").attr('href', URL);

    },

    //carrega o link para realizar ligação
    carregarBotaoLigar: ()=>{
        $("#fazerLigacao").attr('href' , `tel:${phone}`);
    },

    //alterna entre depoimentos
    abrirDepoimento: (depoimento)=>{

        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');
        $("#depoimento-4").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');
        $("#btnDepoimento-4").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active');

    },

    //carrega as paginas das redes sociais
    carregarRedes: ()=>{

        $(".rede-1").attr('href' , `https://www.instagram.com/${insta}`);
        $(".rede-2").attr('href' , `https://www.facebook.com/${fb}`);
        $(".rede-3").attr('href' , `http://wa.me/${phone}`);

    },

// Função de pesquisa
// Função de pesquisa
search: () => {
    const input = document.getElementById('txtPesquisar').value.toLowerCase();
    
    if (!input) {
        // Se o campo de pesquisa estiver vazio, mostra apenas os itens da categoria 'racoes'
        loja.metodos.obterItensloja('racoes');
    } else {
        // Remove o ativo
        $(".container-menu a").removeClass('active');
        let produtosFiltrados = [];
        
        // Percorre todas as categorias e seus produtos
        for (const categoria in ESTOQUE) {
            if (ESTOQUE.hasOwnProperty(categoria)) {
                const produtos = ESTOQUE[categoria];
                produtosFiltrados = produtosFiltrados.concat(
                    produtos.filter(produto =>
                        produto.name.toLowerCase().includes(input)
                    )
                );
            }
        }
        
        // Atualiza a exibição com produtos filtrados
        loja.metodos.atualizarExibicaoProdutos(produtosFiltrados);
    }
},


    abrirInfo: (id) =>{

        let modal = document.getElementById('modal-content');

        modal.innerHTML = '';

        //obter a categoria ativa
        var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

        //obtem a lista de itens
        let filtro = ESTOQUE[categoria];

        //obter o item
        let item = $.grep(filtro, (e, i) => {return e.id == id});

        if(id){

            $("#modal-info").removeClass('hidden');

            for(i = 0; i < item.length; i++){
                
                $.each(item, (i, e) =>{
                    let temp = loja.templates.itemModalInfo
                    .replace(/\${img}/g, e.img)
                    .replace(/\${name}/g, e.name)
                    .replace(/\${dsc}/g, e.dsc)
                    .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                    .replace(/\${id}/g, e.id);

                    $("#modal-content").append(temp);  
                })
            }
            

        }else{
            $("#modal-info").addClass('hidden');
        }
        
        
    },

    //diminuir quantidade do item no cardápio MODAL
    diminuirQuantidadeModal: (id) =>{

        let qntdAtual = parseInt($("#qntd_Modal-" + id).text());
    
        if(qntdAtual > 0){
            $("#qntd_Modal-" + id).text(qntdAtual - 1);
        }
    
    },
    
    //aumentar quantidade do item no cardápio MODAL
    aumentarQuantidadeModal: (id) =>{
    
        let qntdAtual = parseInt($("#qntd_Modal-" + id).text());
    
        $("#qntd_Modal-" + id).text(qntdAtual + 1);
    
    },

    //adicionar ao carrinho o item no cardápio MODAL
    adicionarAoCarrinhoModal: (id) =>{

        let qntdAtual = parseInt($("#qntd_Modal-" + id).text());
    
        if(qntdAtual > 0){
                
            //obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];
            
            //obtem a lista de itens
            let filtro = ESTOQUE[categoria];
    
            //obter o item
            let item = $.grep(filtro, (e, i) => {return e.id == id});
    
            if(item.length > 0){
    
                //validar se ja existe o item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => {return elem.id == id});
    
                //caso exista so altera a quantidade
                if(existe.length > 0){
    
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
    
                }
                //caso não exista, adiciona
                else{
    
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
    
                }
    
                loja.metodos.mensagem('Item adicionado ao carrinho', 'green');
                $("#qntd_Modal-" + id).text(0);
    
                loja.metodos.atualizarBadgeTotal();
    
                }
    
            }
    
        },

    //mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) =>{

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() =>{
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() =>{
                $("#msg-" + id).remove();
            }, 800);
        }, tempo);

    },

}

// Função para formatar o campo "Telefone"
const formatarTelefone = {

    formatarNumero(value) {
        return value
            .replace(/\D/g, '') // Remove todos os caracteres não numéricos
            .replace(/(\d{2})(\d)/, '($1) $2') // Adiciona parênteses ao DDD
            .replace(/(\d{4,5})(\d{4})/, '$1-$2') // Adiciona um traço após os primeiros 4 ou 5 dígitos
            .replace(/(-\d{5})\d+?$/, '$1'); // Mantém o formato final
    }

};

// Função para adicionar evento de input a todos os campos de telefone
function adicionarEventosDeFormato() {
    document.querySelectorAll("input[type='tel']").forEach(($input) => {
        $input.addEventListener("input", (e) => {
            e.target.value = formatarTelefone.formatarNumero(e.target.value);
        });
    });
}

// Executa a função para adicionar eventos de formatação ao carregar a página
document.addEventListener("DOMContentLoaded", adicionarEventosDeFormato);


// Templates dos produtos
loja.templates = {

    item:
        `

                    <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeIn produto">

                        <div class="card card-item" id="\${id}">

                            <div class="img-produto" onclick="loja.metodos.abrirInfo(\${id})">
                                <img src="\${img}">
                            </div>

                            <p class="title-produto text-center mt-4">
                                <b>\${name}</b>
                            </p>

                            <p class="price-produto text-center">
                                <b>R$ \${price}</b>
                            </p>

                            <div class="add-carrinho">
                                <span class="btn-menos" onclick="loja.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                                <span class="add-numero-itens" id="qntd-\${id}">0</span>
                                <span class="btn-mais" onclick="loja.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                                <span class="btn btn-add" onclick="loja.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                            </div>

                        </div>

                    </div>

        `,

    itemCarrinho:
        `
                    <div class="col-12 item-carrinho">

                        <div class="img-produto">
                            <img src="\${img}">
                        </div>

                        <div class="dados-produto">
                            <p class="title-produto"><b>\${name}</b></p>
                            <p class="price-produto"><b>R$ \${price}</b></p>
                        </div>

                        <div class="add-carrinho">
                            <span class="btn-menos" onclick="loja.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                            <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                            <span class="btn-mais" onclick="loja.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                            <span class="btn btn-remove" onclick="loja.metodos.removerItensCarrinho('\${id}')"><i class="fas fa-times"></i></span>
                        </div>

                    </div>

        `,
    itemResumo:
        `
                    <div class="col-12 item-carrinho resumo">
                        <div class="img-produto-resumo">
                            <img src="\${img}">
                        </div>
                        <div class="dados-produto">
                            <p class="title-produto-resumo"><b>\${name}</b></p>
                            <p class="price-produto-resumo"><b>R$ \${price}</b></p>
                        </div>
                        <p class="quantidade-produto-resumo">x <b>\${qntd}</b></p>
                    </div>

        `,
    itemModalInfo:
        `
                    <div class="modal-produto" id="\${id}">
                        
                        <div class="img-produto">
                            <img src="\${img}">
                        </div>

                        <p class="title-produto text-center mt-4">
                            <b>\${name}</b>
                        </p>

                        <div class="dsc-produto mt-4">
                            <p>Descrição:</p>
                            <ul>
                                \${dsc}
                            </ul>
                        </div>

                        <p class="price-produto text-center">
                            <b>R$ \${price}</b>
                        </p>

                        <div class="add-carrinho">
                            <span class="btn-menos" onclick="loja.metodos.diminuirQuantidadeModal('\${id}')"><i class="fas fa-minus"></i></span>
                            <span class="add-numero-itens" id="qntd_Modal-\${id}">0</span>
                            <span class="btn-mais" onclick="loja.metodos.aumentarQuantidadeModal('\${id}')"><i class="fas fa-plus"></i></span>
                            <span class="btn btn-add" onclick="loja.metodos.adicionarAoCarrinhoModal('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                        </div>
                    </div>
        `

}

// Controle dos botões de navegação do site
$(document).ready(function() {
    var $buttonTop = $('#buttonTop');

    // Inicialmente, adiciona a classe 'hidden' para ocultar o botão
    $buttonTop.addClass('hidden');

    // Evento de rolagem para mostrar ou ocultar o botão
    $(document).on('scroll', function() {
        if ($(window).scrollTop() > 0) {
            $buttonTop.addClass('fixar').removeClass('hidden');
        } else {
            $buttonTop.removeClass('fixar').addClass('hidden');
        }
    });

    // Evento de clique para rolar a página para o topo
    $buttonTop.on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });

    // Função para rolar a página até uma div específica
    function scrollToDiv(divId) {
        $('html, body').animate({ scrollTop: $(divId).offset().top }, 'slow');
    }

    // Adiciona eventos de clique para os botões
    $('.buttonServicos').on('click', function() {
        scrollToDiv('#servicos');
    });

    $('.buttonClinica').on('click', function() {
        scrollToDiv('#clinica');
    });

    $('.buttonDepoimentos').on('click', function() {
        scrollToDiv('#depoimentos');
    });

    $('.buttonAgenda').on('click', function() {
        scrollToDiv('#agenda');
    });
});




