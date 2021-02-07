const Modal1 = {
    open(){
        document
           .querySelector('.modal-overlay1')
           .classList
           .add('active')
    },
    close(){
        document
           .querySelector('.modal-overlay1')
           .classList
           .remove('active')
    }
}

const Modal2 = {
    open(){
        document
           .querySelector('.modal-overlay2')
           .classList
           .add('active')
    },
    close(){
        document
           .querySelector('.modal-overlay2')
           .classList
           .remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("Transactions:")) || []
    },

    set(transaction) {
        localStorage.setItem("Transactions:", JSON.stringify(transaction))
    }
}

const balance = {
    allTransactions: Storage.get(),

    add(transaction) {
        balance.allTransactions.push(transaction)

        Aplication.reload()
    },

    remove(index) {
        balance.allTransactions.splice(index, 1)

        Aplication.reload()
    },

    incomes() {
        let income = 0;

        balance.allTransactions.forEach(transaction => {
            if(transaction.amount > 0) {
                income += transaction.amount;
            }
        })

        return income
    },

    expenses() {
        let expense = 0;

        balance.allTransactions.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount;
            }
        })

        return expense
    },

    total() {

        return balance.incomes() + balance.expenses()

    }
}

const DOM = { // Este bloco contem os métodos que farão a estruturação html da nossa aplicação ao adicionarmos novas Entradas e/ou Saídas
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) { // Este bloco é responsável pela adição de novas linhas (<tr> ... </tr>) na estrutura <tbody> ... </tbody> do HTML sempre que novas transações forem feitas. 
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransactions(transaction,index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransactions(transaction, index) { // Esse bloco é o responsável pela estruturação html das colunas (ou o espaçamento entre os elementos das linhas, se preferir) do <tbody> ... </tbody>.
        const CSSclass = transaction.amount > 0 ? "income" : "expense" // Isto é o que pode-se chamar de "atribuição inteligente de valor", ao colocar esta estrutura ( = transactions.amount > 0 ? "income" : "expense") após a declação da variável - ou neste caso, da constante (const) - estamos pedindo ao JS que verifique se a condição "valor do atributo amount do(s) objeto(s) contido(s) no array transactions maior que zero" (transacions.amount > 0 ?) é verdadeira, caso seja a variável terá o valor "income" atribuído a si, senão (:) será atribuido a esta variável o valor "expense".

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <tr>
                <td class="${CSSclass}"> ${transaction.description} </td>
                <td class="${CSSclass}"> ${amount} </td>
                <td class="${CSSclass}"> ${transaction.date} </td>
                <td>
                    <img onclick="balance.remove(${index})" src="./assets/assets/minus.svg" alt="Remover Transação">
                </td>
            </tr>
        `

        return html
    },

    updateBalance() { // Este bloco é o respondável pela formatação visual da <section id="balance"> ... </section>.
       document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(balance.incomes())  
       
       document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(balance.expenses())  
       
       document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(balance.total())  
    },

    clearTransactions() { // Este bloco contém o método responsável pela limpeza das nossas transações ao ser executado o reload da nossa aplicação.  
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = { // Este bloco é responsável por conter os métodos que farão a formatação visual dos valores trabalhados pela/na nossa aplicação. 
    formatCurrency(value) {
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", { // Aqui estamos formatando o valor de value para o modelo de moeda (currency). Neste caso, para o real brasileiro.
            style: "currency", 
            currency: "BRL"
        })

        return value
    },

    formatAmount(value) { // Este método faz a conversão dos valores inseriods pelo usuário para o formato que será usado pelo programa.
        value = Number(value) * 100

        return Math.round(value)
    },

    formatDate(date) { // Neste bloco estamos fazendo a formatação do campo date para o formato que desejamos, no caso: dd/mm/aa.
        const splitteDate = date.split("-") // Obs: "splitte" significa "separação" (como no LoL).

        return `${splitteDate[2]}/${splitteDate[1]}/${splitteDate[0]}`
    }
}

const Form1 = {
    description: document.querySelector('#descriptionIncome'),
    amount: document.querySelector('#amountIncome'),
    date: document.querySelector('#dateIncome'),
    
    getValues1() { // Este bloco é responsável por pegar os valores do formulário de Entradas e atribuí-los à variável Ntransaction1 para que sejam usados por nossa aplicação.
        let Ntransaction1 = {
                description: Form1.description.value,
                amount: Form1.amount.value,
                date: Form1.date.value
        }

        if (Ntransaction1.amount < 0) {
            Ntransaction1.amount = Ntransaction1.amount * (-1)
        }

        if (Ntransaction1.amount === 0) {
            throw new Error('O valor da transação deve ser diferente de zero.')
        }

        return Ntransaction1
    },

    validateFields1() { // Este bloco é responsavél por validar os valores do formulário de Entradas e verificar se não há nenhuma informação faltando.
        let {description, amount, date} = Form1.getValues1()

        if(description.trim() === "" || amount === "" || date.trim() === "") {
            throw new Error('Por favor, preencha todos os campos!')
        }
    },

    formatValues1() { // Este bloco é responsável pela formatação dos valores inseridos nos campos amount e date.
        let {description, amount, date} = Form1.getValues1()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields1() { // Este bloco é responsável por limpar os atributos de Form1 após a execução do processamento dos dados.
        Form1.description.value = ""
        Form1.amount.value = ""
        Form1.date.value = ""
    },

    submit1(event) { // Este bloco executa o processamento dos dados quando o usuário clica no botão de submissão no formulário de Entradas.
        event.preventDefault()

        try {
            Form1.validateFields1()

            let transaction = Form1.formatValues1()

            balance.add(transaction)

            Form1.clearFields1()

            Modal1.close()
        } catch (error) {
            alert(error.message)
        }
    }
}

const Form2 = {
    description: document.querySelector('#descriptionExpense'),
    amount: document.querySelector('#amountExpense'),
    date: document.querySelector('#dateExpense'),
    
    getValues2() { // Este bloco é responsável por pegar os valores do formulário de Saídas e atribuí-los à variável Ntransaction2 para que sejam usados por nossa aplicação.
        let Ntransaction2 = {
                description: Form2.description.value,
                amount: Form2.amount.value,
                date: Form2.date.value
        }

        if (Ntransaction2.amount > 0) {
            Ntransaction2.amount = Ntransaction2.amount * (-1)
        }

        if (Ntransaction2.amount === 0) {
            throw new Error('O valor da transação deve ser diferente de zero.')
        }

        return Ntransaction2
    },

    validateFields2() { // Este bloco é responsavél por validar os valores do formulário de Saídas e verificar se não há nenhuma informação faltando. 
        let {description, amount, date} = Form2.getValues2()

        if(description.trim() === "" || amount === "" || date.trim() === "") {
            throw new Error('Por favor, preencha todos os campos!')
        }
    },

    formatValues2() { // Este bloco é responsável pela formatação dos valores inseridos nos campos amount e date.
        let {description, amount, date} = Form2.getValues2()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields2() { // Este bloco é responsável por limpar os atributos de Form2 após a execução do processamento dos dados.
        Form2.description.value = ""
        Form2.amount.value = ""
        Form2.date.value = ""
    },

    submit2(event) { // Este bloco executa o processamento dos dados quando o usuário clica no botão de submissão no formulário de Saídas. 
        event.preventDefault()

        try {
            Form2.validateFields2()

            let transaction = Form2.formatValues2()

            balance.add(transaction)

            Form2.clearFields2()

            Modal2.close()
        } catch (error) {
            alert(error.message)
        }
    }
}

const Aplication = {
    init() {
        balance.allTransactions.forEach((transaction, index) => { // Esta é uma funçaõ de repetição, neste caso específico, ao usarmos ela estamos dizendo que para cada objeto do array transactions executaremos o método addTransaction() do objeto (contido em) DOM em cada um desses objetos contidos em transactions.
            DOM.addTransaction(transaction,index)
        })

        DOM.updateBalance() // "Executa o método updateBalance() do elemento (contido em) DOM."
        
        Storage.set(balance.allTransactions)
    },

    reload() {
        DOM.clearTransactions()
        
        Aplication.init()
    }
}

Aplication.init()



   