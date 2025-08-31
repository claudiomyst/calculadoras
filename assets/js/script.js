var $jq = jQuery.noConflict();
$jq(document).ready(function(){

    $jq('#btn-toggle-menu').click(function(){
        if( $jq('body').hasClass('menu-active') ){
            $jq('body').removeClass('menu-active');
        } else {
            $jq('body').addClass('menu-active');
        }
    });


    /**
     * Formata os número assim que são colocados no campo com a class "only-numbers".
     * Transforma números do tipo 29,978.30 para 29978.30
     */
    $jq(document).on("input", ".only-numbers", function() {
        this.value = this.value.replace(/[^0-9\.]/g,'');
    });


    /**
     * Retorna a quantidade de casas decimais de um número
     *
     * @param {numero} numero - O número que deseja contar as casas decimais.
     * @returns {string|boolean} - Retorna 0 se não tem casas decimais ou a quantidade de casas decimais do número.
     */
    function contarCasasDecimais(numero) {
        return numero.toString().split('.')[1]?.length || 0;
        // var numeroString = numero.toString();
        // var posicaoPontoDecimal = numeroString.indexOf(".");
        // if (posicaoPontoDecimal === -1) {
        //     return 0;
        // } else {
        //     return numeroString.length - posicaoPontoDecimal - 1;
        // }
    }

    

    function formataDinheiro(numero) {
        let valor = numero / 100;  // Divide por 100 para ajustar as casas decimais
        return valor.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');  // Formata com vírgula o número
    }
    



    /**
     * Formatando número porcentagem
     *
     * Use essa função para Formatar com vírgula e pontos valores percentuais.
     * Transforma núemros como 1764.9 em 1,764.9
     *
     * @param {number} numero - O número que deseja formatar.
     * @return {number} - O número formatado.
     */
    function formataPorcentagem(numero) {
        let porcentagem = numero / 100;  // Divide o número por 100 para transformar em porcentagem
        return porcentagem.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');  // Formata e adiciona o símbolo de porcentagem
    }
    
    

    /**
     * Função para truncar um número sem arredondamento.
     *
     * Esta função recebe um número e o número de casas decimais desejado.
     * Ela corta as casas decimais extras sem arredondar o valor.
     *
     * @param {number} numero - O número que você deseja truncar.
     * @param {number} casasDecimais - O número de casas decimais para truncar.
     * @return {number} - O número truncado sem arredondamento.
     */
    function truncarNumero(numero, casasDecimais) {
        const fator = Math.pow(10, casasDecimais);  // Fator de multiplicação para deslocar o decimal
        return Math.floor(numero * fator) / fator;  // Trunca e depois retorna o número à escala original
    }


    // Habilita o comportamento de campo number em campos text.
    $jq('.numeric-field').on('keydown', function(e) {
        const step = calculateStep($jq(this).val()); // Calcula o passo com base no valor atual
        let currentValue = parseFloat($jq(this).val()) || 0;

        if (e.key === "ArrowUp") {
            currentValue += step;
            $jq(this).val(currentValue.toFixed(contarCasasDecimais(step))).trigger('change');
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            if (currentValue - step >= 0) { // Apenas decrementa se o valor resultante não for negativo
                currentValue -= step;
                $jq(this).val(currentValue.toFixed(contarCasasDecimais(step))).trigger('change');
            }
            e.preventDefault();
        }
    });
    // Define o melhor step para o campo number com base no valor inserido.
    function calculateStep(value) {
        const decimalPlaces = (value.split('.')[1] || '').length;
        return decimalPlaces > 0 ? 1 / Math.pow(10, decimalPlaces) : 1;
    }
    // Definir o número de casas decimais
    function stepToDecimalPlaces(step) {
        return step.toString().split('.')[1]?.length || 0;
    }



    // Animando itens em cascata
    function animateItems( itens, timeout = 100 ) {
        var items = document.querySelectorAll(itens);
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('show');
            }, index * timeout);
        });
    }

    // Mostrando botões ao carregar a pagina
    setTimeout(() => {
        animateItems('.cards .card', 60);
    }, 200);



    /**
     * Copiando conteúdo para a área de transferência
     *
     * Usar:
     * <div class="new-price">1215454</div>
     * <button class="btn-copy-text" data-input="new-price"><span class="copied">Copiado</span></button>
     */
    $jq(document).on("click", ".btn-copy-text", function() {
        var $this = $jq(this);
        var inputClass = $jq(this).data("input");
        var inputElement = $jq("." + inputClass);

        if (inputElement.length > 0) {
            // Cria um input temporário e copia o valor ou o texto
            var tempInput = $jq("<input>");
            $jq("body").append(tempInput);

            if (inputElement.is("input")) {
                tempInput.val(inputElement.val());
            } else if (inputElement.is("div")) {
                tempInput.val(inputElement.text()); // Ou use .html() se quiser copiar o conteúdo HTML
            }

            tempInput.select();
            document.execCommand("copy");
            tempInput.remove();

            // Exibe a mensagem de cópia (classe 'copied')
            if (tempInput.val().trim() !== '') {
                $this.find('.copied').fadeIn(200, function() {
                    $this.addClass('active');
                });
                setTimeout(function() {
                    $this.find('.copied').fadeOut(800, function() {
                        $this.removeClass('active');
                    });
                }, 1000);
            }
        }
    });

    /**
     * Outra forma de copiar conteúdo para área de transferência
     *
     * Usar:
     * <div class="copy-text">1215454</div>
     */
    $jq(document).on("click", ".copy-text", function(){
        var $this = $jq(this);
        var eleInput = $jq("<input>");
        
        eleInput.val($this.text());
        $jq("body").append(eleInput);
    
        eleInput.select();
        document.execCommand("copy");
        eleInput.remove();

        $this.addClass('active');
        setTimeout(function() {
            $this.removeClass('active');
        }, 1000);
    });



    if( $jq('.input-range').length > 0 ){

        $jq('input[name="aceito_perder"]').ionRangeSlider({
            grid         : true,
            postfix      : "%",
            from         : 50,
            min          : 0,
            max          : 100,
            grid_num     : 4,
            hide_min_max : true,
            force_edges  : true,
            step         : 1
        });

        // $jq('input[name="grid_alavancagem"]').ionRangeSlider({
        //     grid         : true,
        //     postfix      : "x",
        //     from         : 10,
        //     min          : 0,
        //     max          : 100,
        //     grid_num     : 4,
        //     hide_min_max : true,
        //     force_edges  : true,
        //     step         : 0.5,
        //     onChange: function (data) {
        //         // Called every time handle position is changed
        //         // $jq('input[name="aceito_perder"]').val( data.from );
        //         // console.log(data.from);
        //     }
        // });
    }


    /********************
     * Calculadoras
     ********************/


    // Calculando defesa do grid
    $jq(document).on('submit', '#defesa-grid', function(e){
        e.preventDefault();

        let $this = $jq(this);
        let contratosEntrada   = parseFloat( $jq(this).find('input[name="entrada-contratos"]').val() );
        let contratoDefesa     = parseFloat( $jq(this).find('input[name="defesa-contratos"]').val() );
        let precoEntrada       = parseFloat( $jq(this).find('input[name="entrada-price"]').val() );
        let MarkPrice          = parseFloat( $jq(this).find('input[name="preco-atual"]').val() );

        if( precoEntrada < MarkPrice ){
            $this.closest('.popup').find('.text-result-erro').html('<b>Atenção:</b> O preço atual (Mark Price) está acima do seu preço de entrada. Caso sua intenção seja fazer o Grid invertido, utilize a calculadora específica para esse cálculo.').addClass('show');
            return;
        }
        $this.closest('.popup').find('.text-result-erro').empty().removeClass('show');

        // Calculando o preço de entrada
        let resultado          = ((precoEntrada * contratosEntrada) + (MarkPrice * contratoDefesa)) / (contratosEntrada + contratoDefesa);

        // Total de contratos
        let resultadoFormatado = resultado.toFixed(contarCasasDecimais(MarkPrice));
        let totalContratos     = contratosEntrada + contratoDefesa;

        // Porcentagem de distância do preço
        let distancia_pct      = Math.abs(((resultadoFormatado / MarkPrice) - 1) * 100);
        distancia_pct          = Math.round(distancia_pct * 1000) / 1000;

        if( isNaN( resultadoFormatado ) ){
            $jq('#contratos-total').text('--');
            $jq('.new-price-defesa').text('--').removeClass('has-value');
            $jq('#distancia-percentual').text('--');
        } else {
            $jq('#contratos-total').text( totalContratos.toFixed(contarCasasDecimais(contratosEntrada)) );
            $jq('.new-price-defesa').text( resultadoFormatado ).addClass('has-value');
            $jq('#distancia-percentual').text( distancia_pct.toFixed(2) + '%' );
        }

    });




    // Calculando defesa do grid
    $jq(document).on('submit change', '#piramidagem', function(e){
        e.preventDefault();

        let $this = $jq(this);
        let contratosEntrada   = parseFloat( $jq(this).find('input[name="entrada-contratos"]').val() );
        let contratoAdicionais = parseFloat( $jq(this).find('input[name="contratos-adicionais"]').val() );
        let precoEntrada       = parseFloat( $jq(this).find('input[name="entrada-price"]').val() );
        let MarkPrice          = parseFloat( $jq(this).find('input[name="preco-atual"]').val() );

        if( ! contratosEntrada || ! contratoAdicionais || ! precoEntrada || ! MarkPrice ){
            return;
        }

        if( precoEntrada > MarkPrice ){
            $this.closest('.popup').find('.text-result-erro').html('<b>Atenção:</b> O preço atual (Mark Price) está abaixo do seu preço de entrada. Caso sua intenção seja defender sua posição, utilize a calculadora específica para esse cálculo.').addClass('show');
            $jq('.nova-entrada').text('--').removeClass('has-value');
            $jq('#distancia-percentual').text('--');
            return;
        
        } else {

            $this.closest('.popup').find('.text-result-erro').empty().removeClass('show');
            
            // Calculando o preço de entrada
            let resultado          = ((precoEntrada * contratosEntrada) + (MarkPrice * contratoAdicionais)) / (contratosEntrada + contratoAdicionais);
            
            // Total de contratos
            let resultadoFormatado = resultado.toFixed(contarCasasDecimais(MarkPrice));
            
            // Porcentagem de distância do preço
            let distancia_pct      = Math.abs(((resultadoFormatado / MarkPrice) - 1) * 100);
            distancia_pct          = Math.round(distancia_pct * 1000) / 1000;
            
            if( isNaN( resultadoFormatado ) ){
                $jq('.nova-entrada').text('--').removeClass('has-value');
                $jq('.distancia-percentual').text('--');
            } else {
                $jq('.nova-entrada').text( resultadoFormatado ).addClass('has-value');
                $jq('#distancia-percentual').text( distancia_pct.toFixed(2) + '%' );
            }
        }

    });
    




    // Calculando alavancagem dinâmica
    $jq(document).on('submit change', '#alavancagem-forn', function(e){
        e.preventDefault();
        
        let $this    = $jq(this);
        let margem   = parseFloat( $this.find('input[name="margem"]').val());
        let max_loss = parseFloat( $this.find('input[name="aceito_perder"]').val());
        let entrada  = parseFloat( $this.find('input[name="entrada"]').val());
        let stop     = parseFloat( $this.find('input[name="stop_loss"]').val());

        if( margem && max_loss && entrada && stop ){
            
            // Valor que irá perder ao atingir o stop loss
            let loss_per_trade = margem * max_loss;
            
            // ROI - Percentual de perda do stop loss
            let stop_loss_pct = Math.abs(((stop / entrada) - 1) * 100);
            stop_loss_pct     = Math.round(stop_loss_pct * 1000) / 1000;
            
            // Definindo a alavancagem ideal para restringir a perda no stop loss.
            let fator_de_perda = ( 100 / max_loss );
            let alavancagem    = ( 100 / stop_loss_pct ) / fator_de_perda;
            alavancagem        = Math.abs(alavancagem).toFixed(1);


            $this.closest('div.box-cards').find('.loss_per_trade').text(`${formataDinheiro(loss_per_trade)} USDT`);
            $this.closest('div.box-cards').find('.pct_stop_loss').text( '-' + stop_loss_pct + '%' );
            $this.closest('div.box-cards').find('.alavancagem-ideal').text( alavancagem +'X');
        } else {
            $this.closest('div.box-cards').find('input[name="contratos"]').val('');
            $this.closest('div.box-cards').find('.loss_per_trade').text('--');
            $this.closest('div.box-cards').find('.pct_stop_loss').text('--');
            $this.closest('div.box-cards').find('.alavancagem-ideal').text('--');
        }

    });






    // Grid Planejado - Calculando os dados da operação que será a entrada.
    $jq(document).on('change', '#grid-planejado-forn', function(e){
        e.preventDefault();

        let $this         = $jq(this);
        let preco_entrada = parseFloat( $this.find('input[name="entrada"]').val());
        let contratos     = parseFloat( $this.find('input[name="contratos"]').val());
        let alavancagem   = parseFloat( $this.find('input[name="alavancagem"]').val());
        let taxa          = parseFloat( $this.find('input[name="taxa"]').val());
        let decimais      = contarCasasDecimais($this.find('input[name="entrada"]').val());

        taxa = ( ! taxa ) ? 0.002 : taxa;
        
        if( ! preco_entrada || ! contratos || ! alavancagem ){
            $jq('#grid-resultado').find('.grid_entrada, .grid_valor, .prox_defesa, .margem, .contratos, .pl').text('--');
            $jq('#grid-resultado').find('fieldset.defesas').slice(1).remove();
            return false;
        }

        // Definindo o valor da margem usada.
        let margem = ( contratos * preco_entrada  ) / alavancagem;
        margem *= ( 1 + taxa);
        
        // Calculando o valor real da operação.
        let valor_real = (( contratos * preco_entrada  ) / alavancagem) * alavancagem;

        // Calculando onde deverá ser a próxima defesa.
        let percentualDeQueda = 1 / alavancagem;
        let proxima_defesa = preco_entrada * (1 - percentualDeQueda);


        // Calculando a porcentagem de queda baseada na alavancagem.
        let pct_defesa = 100 / alavancagem;

        $jq('#grid-resultado').find('fieldset.entrada .grid_entrada').html('<div class="copy-text">' + preco_entrada.toFixed(decimais) + '</div> USDT');
        $jq('#grid-resultado').find('fieldset.entrada .grid_valor').text(valor_real.toFixed(2) + ' USDT');
        $jq('#grid-resultado').find('fieldset.entrada .prox_defesa').html('<div class="copy-text">' + proxima_defesa.toFixed(decimais) + '</div> USDT');
        $jq('#grid-resultado').find('fieldset.entrada .margem').text(margem.toFixed(2) + ' USD');
        $jq('#grid-resultado').find('fieldset.entrada .contratos').text(contratos);
        
        // limpa as defesas que foram adicionadas
        $jq('#grid-resultado').find('fieldset.defesas').slice(1).remove();
        $jq('#info-recomenda').empty().removeClass('active');
    });


    // Grid Planejado - Adicionando novas defesas
    $jq(document).on('click', '#add-defesa', function(e){
        
        let entrada          = parseFloat( $jq('#grid-resultado').find('fieldset.defesas:last-child').find('span.grid_entrada').text() );
        let proxDefesa       = parseFloat( $jq('#grid-resultado').find('fieldset.defesas:last-child').find('span.prox_defesa').text() );
        let contratosEntrada = parseFloat( $jq('#grid-resultado').find('fieldset.defesas:last-child').find('span.contratos').text() );
        
        let defesas          = $jq('fieldset.defesas').length;
        let initEntrada      = $jq('#entrada').val();
        let alavancagem      = parseFloat( $jq('#alavancagem').val());
        let taxa             = parseFloat( $jq('#taxa').val());
        taxa = ( ! taxa ) ? 0.002 : taxa;


        if( !entrada || !proxDefesa || !contratosEntrada ){
            return;
        }

        // Contratos adicionais
        let contratosAdicionais = contratosEntrada * 2;


        // Valor da defesa
        let percentualDeQueda = 1 / alavancagem;
        let proxima_defesa = entrada * (1 - percentualDeQueda);
        proxima_defesa = proxima_defesa.toFixed(contarCasasDecimais(initEntrada));


        // Novo preço de entrada - Necessário o preço da defesa já ter sido definido
        let novaEntrada = ((entrada * contratosEntrada) + (proxima_defesa * contratosAdicionais)) / (contratosEntrada + contratosAdicionais);
        novaEntrada = novaEntrada.toFixed(contarCasasDecimais(initEntrada));


        // Próximo preço de defesa
        let percentualQueda = 1 / alavancagem;
        proxima_defesa = novaEntrada * (1 - percentualQueda);
        proxima_defesa = proxima_defesa.toFixed(contarCasasDecimais(initEntrada));


        // Total de contratos
        contratosEntrada += contratosEntrada * 2;
        let contratos = Math.round(contratosEntrada * 1000) / 1000;


        // Calculando o valor real da operação.
        let valor_real = (( contratos * novaEntrada  ) / alavancagem) * alavancagem;


        // Definindo o valor da margem usada.
        let margem = ( novaEntrada * contratos ) / alavancagem;
        margem *= ( 1 + taxa);


        let capitalTotal = margem;
        let percentualAdicional = 40; // Percentual a ser adicionado
        capitalTotal += capitalTotal * (percentualAdicional / 100);


        // Porcentagem de queda real do ativo
        let totalQueda = Math.abs(( proxima_defesa / initEntrada ) - 1 ) * 100;
        totalQueda = Math.round(totalQueda * 1000) / 1000;


        $novaDefesa = `
            <fieldset class="defesas">
            <legend>${defesas}º Defesa - Desvalorização real de <span class="pct_queda">${totalQueda.toFixed(2)}%</span> no valor do ativo.</legend>
            <button class="remove-defesa"></button>
            
            <div class="defesas-inner columns-6">
                <div class="col col-entrada">
                    <div class="box-input">
                        <div class="input_container">
                            <label><span data-tooltip="Valor da sua nova entrada após realizar a defesa">Nova entrada:</span></label>
                            <span><span class="grid_entrada"><div class="copy-text">${novaEntrada}</div> USDT</span></span>
                        </div>
                    </div>
                </div>
            
                <div class="col col-valor">
                    <div class="box-input">
                        <div class="input_container">
                            <label><span data-tooltip="Valor nocional da posição atual">Valor:</span></label>
                            <span><span class="grid_valor">${valor_real.toFixed(2)} USDT</span></span>
                        </div>
                    </div>
                </div>

                <div class="col col-margem">
                    <div class="box-input">
                        <div class="input_container">
                            <label><span data-tooltip="O valor total da margem que estará usando">Margem:</span></label>
                            <span><span class="margem">${margem.toFixed(2)} USD</span></span>
                        </div>
                    </div>
                </div>
                <div class="col col-contratos">
                    <div class="box-input">
                        <div class="input_container">
                            <label><span data-tooltip="Adicione mais ${contratosAdicionais} contratos para realizar a defesa da posição">Contratos:</span></label>
                            <span><span class="contratos">${contratos}</span></span>
                        </div>
                    </div>
                </div>

                <div class="col col-defesa">
                    <div class="box-input">
                        <div class="input_container">
                            <label><span data-tooltip="Valor onde a defesa deverá ser realizada">Defender em:</span></label>
                            <span><span class="prox_defesa"><div class="copy-text">${proxima_defesa}</div> USDT</span></span>
                        </div>
                    </div>
                </div>

            </div>
        </fieldset>`;

        defesas++;
        $jq('#grid-resultado').append($novaDefesa);
        $jq('#info-recomenda').html(`Sua operação estruturada cobre uma queda de <span class="percent">${totalQueda.toFixed(2)}%</span> no valor do ativo, resultando em um P&L não realizado de <span class="pl-nao-realizado">-${margem.toFixed(2)} USDT</span>. Para garantir a possibilidade de utilizar hedge ou trava caso o ativo se desvalorize além do previsto, recomenda-se iniciar a operação com um capital mínimo de <span class="min">${capitalTotal.toFixed(2)} USDT</span> disponível.`).addClass('active');
        $jq('#remove-defesa').addClass('active');
    });

    $jq(document).on('click', '.remove-defesa', function(e){
        $jq(this).closest('fieldset.defesas:not(.entrada)').remove();
        $jq('#info-recomenda').empty().removeClass('active');
    });





    // Calculando ponto de equilíbrio no Hedge
    $jq(document).on('submit', '#equilibrio-hedge', function(e){
        e.preventDefault();

        let $this = $jq(this);
        let num_contratos_long  = parseFloat( $jq(this).find('input[name="num_contratos_long"]').val() );
        let num_contratos_short = parseFloat( $jq(this).find('input[name="num_contratos_short"]').val() );

        let preco_entrada_long  = parseFloat( $jq(this).find('input[name="hedge_preco_entrada_long"]').val() );
        let preco_entrada_short = parseFloat( $jq(this).find('input[name="hedge_preco_entrada_short"]').val() );

        let resultado = (preco_entrada_long * num_contratos_long - preco_entrada_short * num_contratos_short) / (num_contratos_long - num_contratos_short);

        let resultadoFormatado  = resultado.toFixed(contarCasasDecimais(preco_entrada_long));

        let percentual_lucro_long  = ( resultado - preco_entrada_long ) / preco_entrada_long * 100;
        let percentual_perda_short = ( preco_entrada_short - resultado ) / preco_entrada_short * 100;

        let formattedPercentualLong  = (percentual_lucro_long * 10).toFixed(1);
        let formattedPercentualShort = (percentual_perda_short * 10).toFixed(1);
        
        formattedPercentualLong = formataPorcentagem(formattedPercentualLong);
        formattedPercentualShort = formataPorcentagem(formattedPercentualShort);

        // Resetando os dados
        $this.closest('.popup').find('.text-result-erro').empty().removeClass('show');
        $jq('.equilibrio').text('--').removeClass('has-value');
        $jq('.porcentagem-long, .porcentagem-short').text('--');


        // Se possui campos vazios
        if( !num_contratos_long || !num_contratos_short || !preco_entrada_long || !preco_entrada_short ){
            return;
        }
        // ( Trava de lucro ) Se o short está acima do long
        if( preco_entrada_long < preco_entrada_short ){
            $this.closest('.popup').find('.text-result-erro').html('Sua entrada em (Short) está acima da sua entrada em (Long), o que provavelmente indica que você está com uma trava de lucro. Nesse caso, não há um ponto de equilíbrio entre suas operações.').addClass('show');
            $jq('.equilibrio').text('∾').addClass('has-value').addClass('color-amarelo');
            $jq('.porcentagem-long, .porcentagem-short').text('--');
            return;
        }
        // ( Hedge desequilibrado errado ) Se a quantidade de contratos em long é menor que em short
        if( num_contratos_long < num_contratos_short ){
            $this.closest('.popup').find('.text-result-erro').html('<b>Atenção:</b> A operação de hedge desequilibrada, com mais contratos no short do que no long, é extremamente perigosa. Se o preço do ativo subir, o prejuízo no short pode ser infinito e levar à perda total do seu capital. Tome muito cuidado!').addClass('show');
            $jq('.equilibrio').text( resultadoFormatado ).addClass('has-value');
            $jq('.porcentagem-long').text( formattedPercentualLong + "%" );
            $jq('.porcentagem-short').text( formattedPercentualShort + "%" );
            return;
        }
        // ( Trava de segunrança ) Se long é igual ao short
        if( num_contratos_long == num_contratos_short ){
            $this.closest('.popup').find('.text-result-erro').html('Sua operação está travada: o valor que você perde no Long é o mesmo que ganha no Short. Dessa forma, não há um ponto de equilíbrio para sair dessas operações.').addClass('show');
            $jq('.equilibrio').text('∾').removeClass('has-value').addClass('color-amarelo');
            $jq('.porcentagem-long, .porcentagem-short').text('--');
            return;
        }

        $jq('.equilibrio').text( resultadoFormatado ).addClass('has-value');
        $jq('.porcentagem-long').text( formattedPercentualLong + "%" );
        $jq('.porcentagem-short').text( formattedPercentualShort + "%" );
        

    });



/*
    // Tirando print
    $jq(document).on('click', '.get-print', function(e){
        let element = $jq(this).data('ele');
        let archiveName = $jq(this).data('archive-name');
        
        const div = $jq(element).first();

        html2canvas(div[0], {
            useCORS         : true, // Habilita suporte a imagens carregadas de outras origens
            scale           : 1.5,    // Ajusta a escala para melhorar a qualidade
            backgroundColor : null  // Usa o fundo real da página
        }).then(canvas => {
            const img = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = img;
            link.download = archiveName+'.png';
            link.click();
        });
    });
*/
});