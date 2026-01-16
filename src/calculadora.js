// ========================================
// CALCULADORA DE CONSUMO DE ENERGIA v2.0
// Versão melhorada com mais precisão e recursos
// ========================================

// Variável para armazenar o histórico de contas
var accountHistory = [];
var totalCost = 0;

// Variável para armazenar a conta de energia mensal
var contaMensal = {
    itens: [],
    taxaIluminacaoPublica: 0,
    outrasCobrancas: 0
};

// Configurações de tarifas (valores atualizados CEMIG 2024)
const CONFIG = {
    tarifaBase: 0.84,           // R$/kWh - tarifa base
    tarifaVerde: 0,             // Sem adicional
    tarifaAmarela: 0.01874,     // R$/kWh adicional
    tarifaVermelha1: 0.04463,   // R$/kWh adicional
    tarifaVermelha2: 0.07877,   // R$/kWh adicional
    economiaEnergiasSolar: 0.70, // 70% de economia
    icms: 0.30,                 // 30% de ICMS (varia por estado)
    pis: 0.0165,                // 1.65% PIS
    cofins: 0.076,              // 7.6% COFINS
    iluminacaoPublica: 0,       // Contribuição de iluminação pública (varia por município)
    horasPico: { inicio: 18, fim: 21 } // Horário de ponta
};

// Bandeira atual (pode ser alterada)
let bandeiraAtual = 'verde';

// Validação de entrada numérica
function validarNumero(valor, min = 0, max = Infinity) {
    const num = parseFloat(valor);
    if (isNaN(num) || num < min || num > max) {
        return null;
    }
    return num;
}

// Formatar moeda brasileira
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Formatar consumo em kWh
function formatkWh(valor) {
    return valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' kWh';
}

// Obter adicional por bandeira
function getAdicionalBandeira(bandeira) {
    switch (bandeira) {
        case 'verde': return CONFIG.tarifaVerde;
        case 'amarela': return CONFIG.tarifaAmarela;
        case 'vermelha1': return CONFIG.tarifaVermelha1;
        case 'vermelha2': return CONFIG.tarifaVermelha2;
        default: return 0;
    }
}

// Calcular tarifa efetiva com impostos
function calcularTarifaEfetiva(bandeira = 'verde') {
    const tarifaBase = CONFIG.tarifaBase;
    const adicionalBandeira = getAdicionalBandeira(bandeira);
    const tarifaSemImpostos = tarifaBase + adicionalBandeira;

    // Aplicar impostos
    const comPisCofins = tarifaSemImpostos * (1 + CONFIG.pis + CONFIG.cofins);
    const comIcms = comPisCofins / (1 - CONFIG.icms);

    return comIcms;
}

// Função principal de cálculo
function calculateEnergy() {
    // Exibir a animação de carregamento
    const loader = document.getElementById("loader");
    const resultDiv = document.getElementById('result');

    if (loader) loader.style.display = "block";

    // Capturar valores
    var selectedAppliance = document.getElementById('appliance').value;
    var applianceName = "";
    var wattage = 0;

    if (selectedAppliance !== "") {
        applianceName = document.getElementById('appliance').options[document.getElementById('appliance').selectedIndex].text;
        wattage = validarNumero(selectedAppliance, 0.1, 50000);
    } else {
        applianceName = "esse aparelho";
        wattage = validarNumero(document.getElementById('manualWattage').value, 0.1, 50000);
    }

    var hours = validarNumero(document.getElementById('hours').value, 0, 24);
    var days = validarNumero(document.getElementById('days').value, 1, 31);

    // Validações
    if (wattage === null) {
        mostrarErro('Por favor, insira uma potência válida (entre 0.1W e 50.000W).');
        return;
    }

    if (hours === null) {
        mostrarErro('Por favor, insira um número válido de horas (entre 0 e 24).');
        return;
    }

    if (days === null) {
        mostrarErro('Por favor, insira um número válido de dias (entre 1 e 31).');
        return;
    }

    // ========================================
    // CÁLCULOS PRINCIPAIS
    // ========================================

    // Consumo em kWh
    const kwhPerDay = (wattage * hours) / 1000;
    const kwhPerMonth = kwhPerDay * days;
    const kwhPerYear = kwhPerMonth * 12;

    // Tarifa efetiva (com impostos)
    const tarifaEfetiva = calcularTarifaEfetiva(bandeiraAtual);

    // Custos
    const costPerMonth = kwhPerMonth * tarifaEfetiva;
    const costPerYear = costPerMonth * 12;
    const costPerDay = costPerMonth / days;

    // Energia solar (economia de 70%)
    const solarCostPerMonth = costPerMonth * (1 - CONFIG.economiaEnergiasSolar);
    const economiaSolar = costPerMonth - solarCostPerMonth;

    // Comparação com LED (se aplicável)
    let ledComparison = null;
    if (applianceName.toLowerCase().includes('incandescente')) {
        const ledWattage = Math.round(wattage * 0.15); // LED consome ~15% da incandescente
        const ledKwhMonth = (ledWattage * hours * days) / 1000;
        const ledCostMonth = ledKwhMonth * tarifaEfetiva;
        ledComparison = {
            wattage: ledWattage,
            consumo: ledKwhMonth,
            custo: ledCostMonth,
            economia: costPerMonth - ledCostMonth
        };
    }

    // Emissão de CO2 (média brasileira: 0.075 kg CO2/kWh)
    const co2PerMonth = kwhPerMonth * 0.075;
    const co2PerYear = co2PerMonth * 12;

    // ========================================
    // EXIBIR RESULTADOS
    // ========================================

    resultDiv.innerHTML = `
        <div class="result-main">
            <div class="result-item">
                <span class="result-label">Consumo por dia:</span>
                <span class="result-value">${formatkWh(kwhPerDay)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Consumo por mês:</span>
                <span class="result-value highlight">${formatkWh(kwhPerMonth)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Consumo por ano:</span>
                <span class="result-value">${formatkWh(kwhPerYear)}</span>
            </div>
            <hr class="result-divider">
            <div class="result-item">
                <span class="result-label">Custo por dia:</span>
                <span class="result-value">${formatarMoeda(costPerDay)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Custo por mês:</span>
                <span class="result-value highlight-money">${formatarMoeda(costPerMonth)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Custo por ano:</span>
                <span class="result-value">${formatarMoeda(costPerYear)}</span>
            </div>
            <hr class="result-divider">
            <div class="result-item eco-item">
                <span class="result-label">Emissão de CO₂/mês:</span>
                <span class="result-value">${co2PerMonth.toFixed(2)} kg</span>
            </div>
        </div>
    `;

    // Resultado de energia solar
    const solarResult = document.getElementById('solarResult');
    if (solarResult) {
        solarResult.innerHTML = `
            <div class="solar-info">
                <strong>Com energia solar:</strong><br>
                Custo mensal: <strong>${formatarMoeda(solarCostPerMonth)}</strong><br>
                Economia mensal: <strong>${formatarMoeda(economiaSolar)}</strong><br>
                Economia anual: <strong>${formatarMoeda(economiaSolar * 12)}</strong>
            </div>
        `;
        solarResult.style.display = "block";
    }

    // Explicação detalhada
    const explanation = document.getElementById('explanation');
    if (explanation) {
        let explanationText = `
            <strong>Detalhamento do cálculo:</strong><br><br>
            <strong>Aparelho:</strong> ${applianceName} (${wattage}W)<br>
            <strong>Uso:</strong> ${hours}h/dia × ${days} dias/mês<br>
            <strong>Bandeira:</strong> ${bandeiraAtual.charAt(0).toUpperCase() + bandeiraAtual.slice(1)}<br>
            <strong>Tarifa efetiva:</strong> ${formatarMoeda(tarifaEfetiva)}/kWh<br>
            <span style="font-size: 11px; color: #666;">(inclui ICMS ~30%, PIS 1.65% e COFINS 7.6%)</span><br><br>
            <strong>Fórmula:</strong><br>
            Consumo = (${wattage}W × ${hours}h × ${days} dias) ÷ 1000 = ${formatkWh(kwhPerMonth)}<br>
            Custo = ${formatkWh(kwhPerMonth)} × ${formatarMoeda(tarifaEfetiva)} = ${formatarMoeda(costPerMonth)}
        `;

        // Adicionar comparação LED se aplicável
        if (ledComparison) {
            explanationText += `
                <br><br>
                <div class="led-comparison">
                    <strong>Dica de economia:</strong><br>
                    Substituindo por LED (${ledComparison.wattage}W):<br>
                    Consumo: ${formatkWh(ledComparison.consumo)}<br>
                    Custo: ${formatarMoeda(ledComparison.custo)}<br>
                    <strong style="color: #28a745;">Economia mensal: ${formatarMoeda(ledComparison.economia)}</strong>
                </div>
            `;
        }

        explanation.innerHTML = explanationText;
        explanation.style.display = "block";
    }

    // Ocultar loader
    if (loader) loader.style.display = "none";

    // Adicionar ao histórico
    accountHistory.push({
        appliance: applianceName,
        wattage: wattage,
        hours: hours,
        days: days,
        consumo: kwhPerMonth,
        cost: costPerMonth,
        bandeira: bandeiraAtual,
        date: new Date().toLocaleDateString('pt-BR')
    });

    // Atualizar displays
    updateAccountHistory();
    updateTotalCost();

    // Mostrar dicas de economia
    mostrarDicasEconomia(wattage, hours, costPerMonth);
}

// Mostrar erro
function mostrarErro(mensagem) {
    alert(mensagem);
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
}

// Mostrar dicas de economia baseadas no consumo
function mostrarDicasEconomia(wattage, hours, custo) {
    const dicasContainer = document.getElementById('dicas-economia');
    if (!dicasContainer) return;

    let dicas = [];

    if (wattage > 1000) {
        dicas.push("Este aparelho consome muita energia. Use com moderação.");
    }
    if (hours > 8) {
        dicas.push("Considere reduzir o tempo de uso para economizar.");
    }
    if (custo > 50) {
        dicas.push("O custo mensal é alto. Avalie alternativas mais eficientes.");
    }
    if (wattage > 2000) {
        dicas.push("Evite usar este aparelho no horário de ponta (18h às 21h).");
    }

    if (dicas.length > 0) {
        dicasContainer.innerHTML = `
            <div class="dicas-box">
                <strong>Dicas de Economia:</strong>
                <ul>${dicas.map(d => `<li>${d}</li>`).join('')}</ul>
            </div>
        `;
        dicasContainer.style.display = 'block';
    }
}

// Selecionar aparelho
function selectAppliance() {
    var selectedAppliance = document.getElementById('appliance').value;
    var manualInputs = document.getElementById('manualInputs');

    if (selectedAppliance !== "") {
        manualInputs.style.display = "none";
    } else {
        manualInputs.style.display = "block";
    }
}

// Atualizar histórico
function updateAccountHistory() {
    var historyList = document.getElementById('historyList');
    if (!historyList) return;

    historyList.innerHTML = '';

    accountHistory.forEach(function (item, index) {
        var listItem = document.createElement('li');
        listItem.className = 'history-item';
        listItem.innerHTML = `
            <div class="history-item-content">
                <strong>${item.appliance}</strong>
                <span class="history-details">${item.wattage}W × ${item.hours}h × ${item.days} dias</span>
                <span class="history-consumo">Consumo: ${formatkWh(item.consumo)}</span>
                <span class="history-cost">${formatarMoeda(item.cost)}</span>
                <span class="history-date">${item.date}</span>
            </div>
            <button class="btn-remove" onclick="removerDoHistorico(${index})" title="Remover">×</button>
        `;
        historyList.appendChild(listItem);
    });
}

// Remover item do histórico
function removerDoHistorico(index) {
    accountHistory.splice(index, 1);
    updateAccountHistory();
    updateTotalCost();
}

// Limpar todo o histórico
function limparHistorico() {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
        accountHistory = [];
        updateAccountHistory();
        updateTotalCost();
    }
}

// Atualizar custo total
function updateTotalCost() {
    var totalCostElement = document.getElementById('totalCost');
    if (!totalCostElement) return;

    totalCost = accountHistory.reduce(function (total, item) {
        return total + item.cost;
    }, 0);

    const totalConsumo = accountHistory.reduce(function (total, item) {
        return total + item.consumo;
    }, 0);

    totalCostElement.innerHTML = `
        <strong>${formatarMoeda(totalCost)}</strong>
        <span class="total-consumo">(${formatkWh(totalConsumo)})</span>
    `;
}

// Alterar bandeira tarifária
function alterarBandeira(novaBandeira) {
    bandeiraAtual = novaBandeira;
    const bandeiraInfo = document.querySelector('.bandeira-info');
    if (bandeiraInfo) {
        const cores = {
            verde: '#5FCB20',
            amarela: '#FFD700',
            vermelha1: '#FF6B6B',
            vermelha2: '#DC3545'
        };
        const nomes = {
            verde: 'Verde',
            amarela: 'Amarela',
            vermelha1: 'Vermelha Patamar 1',
            vermelha2: 'Vermelha Patamar 2'
        };
        const adicional = getAdicionalBandeira(novaBandeira);

        bandeiraInfo.style.borderColor = cores[novaBandeira];
        bandeiraInfo.innerHTML = `
            A bandeira tarifária atual é <span style="color: ${cores[novaBandeira]}; font-weight: bold;">
            ${nomes[novaBandeira]}</span>
            ${adicional > 0 ? `<br><small>Adicional: ${formatarMoeda(adicional)}/kWh</small>` :
                '<br><small>Não há cobrança de taxa extra.</small>'}
        `;
    }
}

// Exportar histórico para JSON
function exportarHistorico() {
    if (accountHistory.length === 0) {
        alert('Não há dados para exportar.');
        return;
    }

    const dataStr = JSON.stringify(accountHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `consumo-energia-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

// Calcular comparativo de aparelhos
function calcularComparativo() {
    if (accountHistory.length < 2) {
        alert('Adicione pelo menos 2 aparelhos ao histórico para ver o comparativo.');
        return;
    }

    const sorted = [...accountHistory].sort((a, b) => b.cost - a.cost);
    let html = '<h4>Ranking de Consumo</h4><ol>';

    sorted.forEach((item, index) => {
        const porcentagem = (item.cost / totalCost * 100).toFixed(1);
        html += `
            <li>
                <strong>${item.appliance}</strong>: ${formatarMoeda(item.cost)} 
                <span class="porcentagem">(${porcentagem}% do total)</span>
            </li>
        `;
    });

    html += '</ol>';

    const comparativoDiv = document.getElementById('comparativo');
    if (comparativoDiv) {
        comparativoDiv.innerHTML = html;
        comparativoDiv.style.display = 'block';
    } else {
        alert(html.replace(/<[^>]*>/g, '\n'));
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    // Configurar campo de entrada para aceitar apenas números
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function () {
            if (this.value < 0) this.value = 0;
        });
    });

    // Mostrar/ocultar campos manuais
    selectAppliance();
});

// Função legacy para compatibilidade
function saveAccount() {
    // Mantida para compatibilidade - contas são salvas automaticamente
}

// ========================================
// CONSTRUTOR DE CONTA DE ENERGIA MENSAL
// ========================================

// Adicionar item à conta mensal
function adicionarItemConta() {
    const selectAparelho = document.getElementById('conta-aparelho');
    const inputWattage = document.getElementById('conta-wattage');
    const inputQtd = document.getElementById('conta-quantidade');
    const inputHoras = document.getElementById('conta-horas');
    const inputDias = document.getElementById('conta-dias');

    let applianceName = "";
    let wattage = 0;

    if (selectAparelho && selectAparelho.value !== "") {
        applianceName = selectAparelho.options[selectAparelho.selectedIndex].text;
        wattage = parseFloat(selectAparelho.value);
    } else if (inputWattage) {
        applianceName = "Aparelho personalizado";
        wattage = validarNumero(inputWattage.value, 0.1, 50000);
    }

    const quantidade = validarNumero(inputQtd ? inputQtd.value : 1, 1, 100) || 1;
    const horas = validarNumero(inputHoras ? inputHoras.value : 0, 0, 24);
    const dias = validarNumero(inputDias ? inputDias.value : 30, 1, 31);

    // Validações
    if (wattage === null || wattage <= 0) {
        alert('Por favor, selecione um aparelho ou insira uma potência válida.');
        return;
    }

    if (horas === null) {
        alert('Por favor, insira um número válido de horas (entre 0 e 24).');
        return;
    }

    if (dias === null) {
        alert('Por favor, insira um número válido de dias (entre 1 e 31).');
        return;
    }

    // Calcular consumo
    const consumoKwh = (wattage * quantidade * horas * dias) / 1000;
    const tarifaEfetiva = calcularTarifaEfetiva(bandeiraAtual);
    const custo = consumoKwh * tarifaEfetiva;

    // Adicionar ao array
    const item = {
        id: Date.now(),
        aparelho: applianceName,
        wattage: wattage,
        quantidade: quantidade,
        horas: horas,
        dias: dias,
        consumo: consumoKwh,
        custo: custo
    };

    contaMensal.itens.push(item);

    // Atualizar display
    atualizarContaMensal();

    // Limpar campos
    if (selectAparelho) selectAparelho.value = '';
    if (inputWattage) inputWattage.value = '';
    if (inputQtd) inputQtd.value = '1';
    if (inputHoras) inputHoras.value = '';
    if (inputDias) inputDias.value = '30';
}

// Remover item da conta
function removerItemConta(id) {
    contaMensal.itens = contaMensal.itens.filter(item => item.id !== id);
    atualizarContaMensal();
}

// Atualizar taxa de iluminação pública
function atualizarTaxaIluminacao() {
    const input = document.getElementById('taxa-iluminacao');
    if (input) {
        contaMensal.taxaIluminacaoPublica = validarNumero(input.value, 0, 1000) || 0;
        atualizarContaMensal();
    }
}

// Atualizar outras cobranças
function atualizarOutrasCobrancas() {
    const input = document.getElementById('outras-cobrancas');
    if (input) {
        contaMensal.outrasCobrancas = validarNumero(input.value, 0, 10000) || 0;
        atualizarContaMensal();
    }
}

// Atualizar display da conta mensal
function atualizarContaMensal() {
    const listaItens = document.getElementById('conta-itens-lista');
    const resumoDiv = document.getElementById('conta-resumo');

    if (!listaItens || !resumoDiv) return;

    // Renderizar lista de itens
    if (contaMensal.itens.length === 0) {
        listaItens.innerHTML = '<p class="empty-message">Nenhum aparelho adicionado. Adicione aparelhos para construir sua conta.</p>';
    } else {
        let html = '';
        contaMensal.itens.forEach(item => {
            html += `
                <div class="conta-item">
                    <div class="conta-item-info">
                        <strong>${item.aparelho}</strong>
                        <span class="conta-item-details">
                            ${item.quantidade > 1 ? item.quantidade + 'x ' : ''}${item.wattage}W × ${item.horas}h × ${item.dias} dias
                        </span>
                    </div>
                    <div class="conta-item-values">
                        <span class="conta-item-consumo">${formatkWh(item.consumo)}</span>
                        <span class="conta-item-custo">${formatarMoeda(item.custo)}</span>
                    </div>
                    <button class="btn-remove-item" onclick="removerItemConta(${item.id})" title="Remover">×</button>
                </div>
            `;
        });
        listaItens.innerHTML = html;
    }

    // Calcular totais
    const totalConsumo = contaMensal.itens.reduce((total, item) => total + item.consumo, 0);
    const totalEnergia = contaMensal.itens.reduce((total, item) => total + item.custo, 0);

    // Valores detalhados
    const tarifaBase = CONFIG.tarifaBase;
    const adicionalBandeira = getAdicionalBandeira(bandeiraAtual);
    const tarifaEfetiva = calcularTarifaEfetiva(bandeiraAtual);

    // Valores brutos (sem impostos)
    const valorConsumoBase = totalConsumo * tarifaBase;
    const valorBandeira = totalConsumo * adicionalBandeira;

    // Impostos
    const valorPIS = (valorConsumoBase + valorBandeira) * CONFIG.pis;
    const valorCOFINS = (valorConsumoBase + valorBandeira) * CONFIG.cofins;
    const baseICMS = valorConsumoBase + valorBandeira + valorPIS + valorCOFINS;
    const valorICMS = baseICMS * CONFIG.icms / (1 - CONFIG.icms);

    // Taxas adicionais
    const taxaIluminacao = contaMensal.taxaIluminacaoPublica;
    const outrasCobrancas = contaMensal.outrasCobrancas;

    // Total final
    const totalFinal = totalEnergia + taxaIluminacao + outrasCobrancas;

    // Economia com solar
    const economiaComSolar = totalEnergia * CONFIG.economiaEnergiasSolar;
    const totalComSolar = totalFinal - economiaComSolar;

    // Renderizar resumo
    resumoDiv.innerHTML = `
        <div class="fatura-container">
            <div class="fatura-header">
                <h3>Fatura de Energia Elétrica</h3>
                <p class="fatura-periodo">Período: Mensal (Estimativa)</p>
            </div>
            
            <div class="fatura-section">
                <h4>Consumo</h4>
                <div class="fatura-linha">
                    <span>Consumo total:</span>
                    <span><strong>${formatkWh(totalConsumo)}</strong></span>
                </div>
            </div>
            
            <div class="fatura-section">
                <h4>Tarifas</h4>
                <div class="fatura-linha">
                    <span>Tarifa de energia (${formatarMoeda(tarifaBase)}/kWh):</span>
                    <span>${formatarMoeda(valorConsumoBase)}</span>
                </div>
                ${adicionalBandeira > 0 ? `
                <div class="fatura-linha bandeira-${bandeiraAtual}">
                    <span>Adicional bandeira ${bandeiraAtual}:</span>
                    <span>${formatarMoeda(valorBandeira)}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="fatura-section">
                <h4>Impostos</h4>
                <div class="fatura-linha">
                    <span>PIS (1,65%):</span>
                    <span>${formatarMoeda(valorPIS)}</span>
                </div>
                <div class="fatura-linha">
                    <span>COFINS (7,6%):</span>
                    <span>${formatarMoeda(valorCOFINS)}</span>
                </div>
                <div class="fatura-linha">
                    <span>ICMS (~30%):</span>
                    <span>${formatarMoeda(valorICMS)}</span>
                </div>
            </div>
            
            <div class="fatura-section">
                <h4>Taxas e Contribuições</h4>
                <div class="fatura-linha">
                    <span>Contribuição Iluminação Pública:</span>
                    <span>${formatarMoeda(taxaIluminacao)}</span>
                </div>
                ${outrasCobrancas > 0 ? `
                <div class="fatura-linha">
                    <span>Outras cobranças:</span>
                    <span>${formatarMoeda(outrasCobrancas)}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="fatura-total">
                <div class="fatura-linha total">
                    <span>TOTAL A PAGAR:</span>
                    <span class="valor-total">${formatarMoeda(totalFinal)}</span>
                </div>
            </div>
            
            <div class="fatura-economia">
                <div class="economia-solar">
                    <span>Com energia solar você pagaria:</span>
                    <span class="valor-economia">${formatarMoeda(totalComSolar)}</span>
                </div>
                <p class="economia-destaque">Economia de ${formatarMoeda(economiaComSolar)} por mês!</p>
            </div>
            
            <div class="fatura-info">
                <p><small>* Valores aproximados. Bandeira atual: <strong>${bandeiraAtual.charAt(0).toUpperCase() + bandeiraAtual.slice(1)}</strong></small></p>
                <p><small>* Tarifa efetiva com impostos: ${formatarMoeda(tarifaEfetiva)}/kWh</small></p>
            </div>
        </div>
    `;
}

// Limpar toda a conta
function limparContaMensal() {
    if (contaMensal.itens.length === 0) {
        alert('A conta já está vazia.');
        return;
    }

    if (confirm('Tem certeza que deseja limpar todos os itens da conta?')) {
        contaMensal.itens = [];
        contaMensal.taxaIluminacaoPublica = 0;
        contaMensal.outrasCobrancas = 0;

        const inputTaxa = document.getElementById('taxa-iluminacao');
        const inputOutras = document.getElementById('outras-cobrancas');
        if (inputTaxa) inputTaxa.value = '';
        if (inputOutras) inputOutras.value = '';

        atualizarContaMensal();
    }
}

// Adicionar aparelhos comuns pré-configurados
function adicionarAparelhosComuns() {
    const aparelhosComuns = [
        { aparelho: "Geladeira Frost Free (350W)", wattage: 350, quantidade: 1, horas: 8, dias: 30 },
        { aparelho: "TV LED 42\" (100W)", wattage: 100, quantidade: 1, horas: 5, dias: 30 },
        { aparelho: "Chuveiro Elétrico (5500W)", wattage: 5500, quantidade: 1, horas: 0.5, dias: 30 },
        { aparelho: "Lâmpada LED (9W)", wattage: 9, quantidade: 8, horas: 5, dias: 30 },
        { aparelho: "Roteador Wi-Fi (20W)", wattage: 20, quantidade: 1, horas: 24, dias: 30 },
        { aparelho: "Carregador de Celular (5W)", wattage: 5, quantidade: 2, horas: 3, dias: 30 },
        { aparelho: "Máquina de Lavar 12kg (800W)", wattage: 800, quantidade: 1, horas: 1, dias: 8 },
        { aparelho: "Ferro de Passar (1000W)", wattage: 1000, quantidade: 1, horas: 1, dias: 4 },
    ];

    const tarifaEfetiva = calcularTarifaEfetiva(bandeiraAtual);

    aparelhosComuns.forEach(ap => {
        const consumoKwh = (ap.wattage * ap.quantidade * ap.horas * ap.dias) / 1000;
        const custo = consumoKwh * tarifaEfetiva;

        contaMensal.itens.push({
            id: Date.now() + Math.random(),
            aparelho: ap.aparelho,
            wattage: ap.wattage,
            quantidade: ap.quantidade,
            horas: ap.horas,
            dias: ap.dias,
            consumo: consumoKwh,
            custo: custo
        });
    });

    // Taxa de iluminação pública média
    contaMensal.taxaIluminacaoPublica = 15;
    const inputTaxa = document.getElementById('taxa-iluminacao');
    if (inputTaxa) inputTaxa.value = '15';

    atualizarContaMensal();
}

// Imprimir/Salvar a conta
function imprimirConta() {
    if (contaMensal.itens.length === 0) {
        alert('Adicione itens à conta antes de imprimir.');
        return;
    }

    const resumo = document.getElementById('conta-resumo');
    if (!resumo) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Conta de Energia - Estimativa</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
                h3 { color: #333; border-bottom: 2px solid #7edfd4; padding-bottom: 10px; }
                .fatura-section { margin: 15px 0; padding: 10px; background: #f9f9f9; border-radius: 8px; }
                .fatura-section h4 { margin: 0 0 10px; color: #666; font-size: 14px; }
                .fatura-linha { display: flex; justify-content: space-between; padding: 5px 0; }
                .fatura-total { background: #7edfd4; padding: 15px; border-radius: 8px; margin: 15px 0; }
                .fatura-total .total { font-size: 18px; font-weight: bold; }
                .valor-total { color: #fff; font-size: 24px; }
                .economia-solar { background: #fff3cd; padding: 10px; border-radius: 8px; }
                .economia-destaque { color: #28a745; font-weight: bold; text-align: center; }
                @media print { body { padding: 0; } }
            </style>
        </head>
        <body>
            ${resumo.innerHTML}
            <p style="text-align: center; margin-top: 30px; color: #999;">
                Gerado em ${new Date().toLocaleString('pt-BR')}<br>
                EVOLUX - Calculadora de Consumo de Energia
            </p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Salvar conta em JSON
function salvarContaJSON() {
    if (contaMensal.itens.length === 0) {
        alert('Adicione itens à conta antes de salvar.');
        return;
    }

    const totalConsumo = contaMensal.itens.reduce((total, item) => total + item.consumo, 0);
    const totalCusto = contaMensal.itens.reduce((total, item) => total + item.custo, 0);
    const totalFinal = totalCusto + contaMensal.taxaIluminacaoPublica + contaMensal.outrasCobrancas;

    const dados = {
        dataGeracao: new Date().toISOString(),
        bandeira: bandeiraAtual,
        itens: contaMensal.itens,
        taxaIluminacaoPublica: contaMensal.taxaIluminacaoPublica,
        outrasCobrancas: contaMensal.outrasCobrancas,
        totais: {
            consumoKwh: totalConsumo,
            custoEnergia: totalCusto,
            totalFinal: totalFinal
        }
    };

    const dataStr = JSON.stringify(dados, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `conta-energia-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
}