// Variável para armazenar o histórico de contas
var accountHistory = [];
var totalCost = 0;

function calculateEnergy() {
    // Exibir a animação de carregamento
    document.getElementById("loader").style.display = "block";

    var selectedAppliance = document.getElementById('appliance').value;
    var applianceName = "";
    var wattage = 0;

    if (selectedAppliance !== "") {
        applianceName = document.getElementById('appliance').options[document.getElementById('appliance').selectedIndex].text;
        wattage = parseFloat(selectedAppliance);
    } else {
        applianceName = "esse aparelho";
        wattage = parseFloat(document.getElementById('manualWattage').value);
    }

    var hours = parseFloat(document.getElementById('hours').value);
    var days = parseFloat(document.getElementById('days').value);

    // Verificar se os valores inseridos são números
    if (isNaN(wattage) || isNaN(hours) || isNaN(days)) {
        alert('Por favor, insira apenas números nos campos de entrada.');
        // Ocultar a animação de carregamento em caso de erro
        document.getElementById("loader").style.display = "none";
        return;
    }

    // Verificando se o número de dias está dentro do intervalo permitido
    if (days > 31) {
        alert('O número de dias de uso por mês não pode ser superior a 31.');
        // Ocultar a animação de carregamento em caso de erro
        document.getElementById("loader").style.display = "none";
        return;
    }

    var kwhPerDay = (wattage * hours) / 1000;
    var kwhPerMonth = kwhPerDay * days;
    var costPerMonth = kwhPerMonth * 0.84; // Valor aproximado da Cemig em Minas Gerais em 2024

    // Considerando uma economia de 70% no custo com energia solar
    var solarCostPerMonth = costPerMonth * 0.3; // 30% do custo original

    var result = document.getElementById('result');
    result.innerHTML = 'Consumo estimado por mês: ' + kwhPerMonth.toFixed(2) + ' kWh<br>' +
        'Custo estimado na conta de energia: R$ ' + costPerMonth.toFixed(2);

    // Adicionar caixa amarela com o resultado de energia solar
    var solarResult = document.getElementById('solarResult');
    solarResult.innerHTML = 'Com energia solar, você teria um custo estimado de R$ ' + solarCostPerMonth.toFixed(2) + '.';
    solarResult.style.display = "block"; // Mostrar o resultado de energia solar

    // Ocultar a animação de carregamento após o cálculo
    document.getElementById("loader").style.display = "none";

    // Adicionar explicação
    var explanation = document.getElementById('explanation');
    if (selectedAppliance !== "") {
        explanation.innerHTML = 'Isso quer dizer que com base na tarifa atual de R$ 0.84 por kWh, se você utilizar o(a) ' +
            applianceName + ' por ' + hours + ' horas durante ' + days + ' dias, você terá um custo estimado de R$ ' + costPerMonth.toFixed(2) + '.';
    } else {
        explanation.innerHTML = 'Isso quer dizer que com base na tarifa atual de R$ 0.84 por kWh, se você utilizar ' +
            applianceName + ' por ' + hours + ' horas durante ' + days + ' dias, você terá um custo estimado de R$ ' + costPerMonth.toFixed(2) + '.';
    }
    explanation.style.display = "block"; // Mostrar a explicação

    // Adicionar a conta ao histórico
    accountHistory.push({
        appliance: applianceName,
        cost: costPerMonth
    });

    // Atualizar o histórico de contas
    updateAccountHistory();

    // Atualizar o custo total
    updateTotalCost();
}

function selectAppliance() {
    var selectedAppliance = document.getElementById('appliance').value;
    var manualInputs = document.getElementById('manualInputs');

    // Verificar se o usuário selecionou um aparelho da lista
    if (selectedAppliance !== "") {
        // Ocultar o campo de entrada manual
        manualInputs.style.display = "none";
    } else {
        // Exibir o campo de entrada manual
        manualInputs.style.display = "block";
    }
}

function updateAccountHistory() {
    var historyList = document.getElementById('historyList');
    historyList.innerHTML = ''; // Limpar a lista

    accountHistory.forEach(function(item) {
        var listItem = document.createElement('li');
        listItem.textContent = item.appliance + ': R$ ' + item.cost.toFixed(2);
        historyList.appendChild(listItem);
    });
}

function updateTotalCost() {
    var totalCostElement = document.getElementById('totalCost');
    totalCost = accountHistory.reduce(function(total, item) {
        return total + item.cost;
    }, 0);
    totalCostElement.textContent = 'R$ ' + totalCost.toFixed(2);
}

function saveAccount() {
    // Esta função pode ser usada para implementar a funcionalidade de salvar contas se necessário
    // Neste exemplo, as contas são salvas automaticamente ao calcular
}