const web3 = new Web3(window.ethereum);
let flashcardContract;
let accounts;

const contractAddress = "0x1B0FcDba07ec0662bCc34E12A8dB577EE97B59E7"; 
const contractABI = [
    [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "flashcardId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "question",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "answer",
                    "type": "string"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "creator",
                    "type": "address"
                }
            ],
            "name": "FlashcardCreated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_question",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_answer",
                    "type": "string"
                }
            ],
            "name": "createFlashcard",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "flashcardCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "flashcards",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "question",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "answer",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "creator",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "createdAt",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_flashcardId",
                    "type": "uint256"
                }
            ],
            "name": "getFlashcard",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "question",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "answer",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "creator",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "createdAt",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getTotalFlashcards",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
];

async function init() {
    await window.ethereum.enable();
    accounts = await web3.eth.getAccounts();
    flashcardContract = new web3.eth.Contract(contractABI, contractAddress);
}

async function createFlashcard() {
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;

    if (!question || !answer) {
        alert("Please enter both a question and an answer.");
        return;
    }

    try {
        await flashcardContract.methods.createFlashcard(question, answer).send({ from: accounts[0] });
        alert("Flashcard created!");
        document.getElementById('question').value = '';
        document.getElementById('answer').value = '';
    } catch (error) {
        console.error("Error creating flashcard:", error);
    }
}

async function loadFlashcards() {
    const totalFlashcards = await flashcardContract.methods.getTotalFlashcards().call();
    const flashcardsList = document.getElementById('flashcards-list');
    flashcardsList.innerHTML = '';

    for (let i = 1; i <= totalFlashcards; i++) {
        const flashcard = await flashcardContract.methods.getFlashcard(i).call();
        const flashcardDiv = document.createElement('div');
        flashcardDiv.classList.add('flashcard');
        flashcardDiv.innerHTML = `
            <strong>Question:</strong> ${flashcard.question} <br>
            <strong>Answer:</strong> ${flashcard.answer} <br>
            <small>Created by: ${flashcard.creator}</small> <br>
            <small>Created at: ${new Date(flashcard.createdAt * 1000).toLocaleString()}</small>
        `;
        flashcardsList.appendChild(flashcardDiv);
    }
}

document.getElementById('create-btn').addEventListener('click', createFlashcard);
document.getElementById('load-btn').addEventListener('click', loadFlashcards);

init();
