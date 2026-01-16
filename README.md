# EVOLUX - Calculadora de Consumo de Energia

[![Demo](https://img.shields.io/badge/Demo-Acesse%20o%20Site-7edfd4?style=for-the-badge)](https://mattsousas.github.io/energia/)

🔗 **[Acesse o site ao vivo](https://mattsousas.github.io/energia/)**

---

Desenvolvido pelos alunos do curso Técnico em Informática do Colégio Universitário - UNIPAM.

## Sobre o Projeto

O EVOLUX é uma plataforma educativa que ajuda você a entender e calcular o consumo de energia elétrica dos seus aparelhos domésticos. Com ferramentas intuitivas, você pode estimar seus gastos mensais e aprender a economizar na conta de luz.

## Funcionalidades

### Calculadora de Consumo
- Cálculo preciso com tarifas reais (ICMS, PIS, COFINS)
- Suporte a bandeiras tarifárias (verde, amarela, vermelha)
- Mais de 70 aparelhos pré-cadastrados organizados por categoria
- Comparativo automático com economia de LED
- Histórico de cálculos com exportação para JSON
- Estimativa de emissão de CO₂

### Monte Sua Conta Mensal
- Adicione todos os aparelhos da sua casa
- Visualize a fatura detalhada com impostos discriminados
- Carregue uma "casa típica" com aparelhos comuns
- Compare economia com energia solar
- Imprima ou salve sua conta estimada

### Conteúdo Educativo
- Informações sobre fontes de energia tradicionais e renováveis
- Perguntas frequentes sobre tarifas e impostos
- Dicas práticas de economia de energia
- Contador de consumo mundial em tempo real

## Tecnologias Utilizadas

- HTML5
- CSS3 (design responsivo)
- JavaScript (vanilla)

## Como Usar

1. Acesse a página principal
2. Role até a **Calculadora de Consumo** para calcular aparelhos individualmente
3. Ou use **Monte Sua Conta Mensal** para simular sua fatura completa
4. Consulte as **Perguntas Frequentes** para tirar dúvidas

## Estrutura do Projeto

```
energia-main/
├── index.html          # Página principal
├── style.css           # Estilos principais
├── responsive.css      # Responsividade
└── src/
    ├── calculadora.js  # Lógica das calculadoras
    ├── contador.js     # Contador de consumo mundial
    ├── sanfona.js      # Accordion do FAQ
    └── scroll.js       # Scroll suave
```

## Valores de Referência

- **Tarifa base:** R$ 0,84/kWh (CEMIG - MG)
- **ICMS:** ~30%
- **PIS:** 1,65%
- **COFINS:** 7,6%

*Os valores são aproximados e podem variar conforme a região.*

## Licença

Projeto educacional desenvolvido para fins acadêmicos.

---

**Colégio Universitário - UNIPAM**  
Curso Técnico em Informática
