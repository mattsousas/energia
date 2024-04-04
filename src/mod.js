document.addEventListener("DOMContentLoaded", function() {
    // Função para exibir o modal e o balão quando o link é clicado
    document.getElementById('mostrarBalao').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'block';
        document.getElementById('balao').style.display = 'block';
    });

    // Função para fechar o modal e o balão quando o botão de fechar é clicado
    document.getElementById('fechar').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'none';
        document.getElementById('balao').style.display = 'none';
    });
});
