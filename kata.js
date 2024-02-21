document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('scoreForm');
    const inputs = form.querySelectorAll('.score-input');
    const resultDisplay = document.getElementById('finalScore');
    const resetButton = document.getElementById('resetButton');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Transforma os valores dos inputs em números e filtra entradas inválidas
        let scores = Array.from(inputs).map(input => ({score: parseFloat(input.value.replace(',', '.')), element: input}))
            .filter(item => !isNaN(item.score) && item.score <= 9.99);

        if (scores.length === 5) {
            // Remove estilos de notas descartadas anteriores
            inputs.forEach(input => input.classList.remove('descartada'));

            // Ordena as pontuações, marca a maior e a menor, e soma as restantes
            scores.sort((a, b) => a.score - b.score);
            const sum = scores.slice(1, -1).reduce((a, b) => a + b.score, 0);

            // Aplica a classe 'descartada' às notas mais alta e mais baixa
            scores[0].element.classList.add('descartada'); // Nota mais baixa
            scores[scores.length - 1].element.classList.add('descartada'); // Nota mais alta

            resultDisplay.textContent = `Pontuação final: ${sum.toFixed(2)}`;
        } else {
            resultDisplay.textContent = 'Por favor, preencha todos os campos corretamente.';
        }
    });

    resetButton.addEventListener('click', function() {
        inputs.forEach(input => {
            input.value = '0,0';
            input.classList.remove('descartada'); // Remove estilos de notas descartadas
        });
        resultDisplay.textContent = '';
    });

    inputs.forEach((input, index) => {
        input.addEventListener('focus', function() {
            if (input.value === '0,0') {
                input.value = '';
            }
        });

        input.addEventListener('input', function(e) {
            let rawValue = e.target.value.replace(/[^0-9]/g, '');
            let value = rawValue;

            if (rawValue.length === 2 && !e.target.value.includes(',')) {
                value = rawValue[0] + ',' + rawValue[1];
            } else if (rawValue.length > 2) {
                value = rawValue[0] + ',' + rawValue.substring(1, 3);
            }

            e.target.value = value;

            if (value.length === 4 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('blur', function(e) {
            let value = e.target.value.replace(',', '.');
            if (!value) {
                e.target.value = '0,0';
            } else {
                let numericValue = parseFloat(value);
                e.target.value = (isNaN(numericValue) ? '0' : numericValue.toFixed(2)).replace('.', ',');
            }
        });
    });
});
