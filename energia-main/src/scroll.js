function scrollToCalculator() {
    const calculatorSection = document.getElementById('calculadora');
    if (calculatorSection) {
        calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }
}