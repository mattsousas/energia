document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;

            // Fecha todos os itens antes de abrir o item clicado
            faqQuestions.forEach(function(q) {
                const a = q.nextElementSibling;
                if (a !== answer && a.classList.contains('show-answer')) {
                    a.classList.remove('show-answer');
                    a.style.maxHeight = null; // Limpa o estilo inline
                    const toggleBtn = q.querySelector('.toggle-btn');
                    toggleBtn.textContent = '+';
                }
            });

            // Alterna a classe show-answer para abrir ou fechar o item clicado
            answer.classList.toggle('show-answer');
            answer.style.maxHeight = answer.classList.contains('show-answer') ? answer.scrollHeight + 'px' : null;

            // Atualiza o ícone de toggle
            const toggleBtn = this.querySelector('.toggle-btn');
            toggleBtn.textContent = toggleBtn.textContent === '+' ? '-' : '+';
        });
    });
});
