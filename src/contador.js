document.addEventListener("DOMContentLoaded", function() {
    const consumptionRatePerSecond = 610; // Kilowatts consumidos por segundo no mundo
    let totalConsumption = 0;

    updateConsumption(totalConsumption); // Inicializa o contador com 0

    setInterval(function() {
        totalConsumption += consumptionRatePerSecond;
        updateConsumption(totalConsumption);
    }, 1000); // Atualizar a cada segundo

    function updateConsumption(consumption) {
        const consumedElement = document.getElementById("consumed");
        consumedElement.textContent = consumption.toLocaleString();
    }
});
