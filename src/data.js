    // Data alvo para a contagem regressiva (use uma data futura)
    var targetDate = new Date('2040-01-01');

    function updateCountdown() {
        var now = new Date();
        var difference = targetDate - now;

        // Calcula o número de dias restantes
        var days = Math.floor(difference / (1000 * 60 * 60 * 24));

        // Atualiza o elemento HTML com o número de dias restantes
        document.getElementById('countdown').textContent = days;
    }

    // Atualiza a contagem regressiva a cada segundo
    setInterval(updateCountdown, 1000);