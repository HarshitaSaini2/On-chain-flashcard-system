// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FlashcardSystem {

    struct Flashcard {
        string question;
        string answer;
        address creator;
        uint256 createdAt;
    }

    mapping(uint256 => Flashcard) public flashcards;
    uint256 public flashcardCount;

    event FlashcardCreated(uint256 indexed flashcardId, string question, string answer, address indexed creator);

    constructor() {
        flashcardCount = 0;
    }

    function createFlashcard(string memory _question, string memory _answer) public {
        flashcardCount++;
        flashcards[flashcardCount] = Flashcard({
            question: _question,
            answer: _answer,
            creator: msg.sender,
            createdAt: block.timestamp
        });

        emit FlashcardCreated(flashcardCount, _question, _answer, msg.sender);
    }

    function getFlashcard(uint256 _flashcardId) public view returns (string memory question, string memory answer, address creator, uint256 createdAt) {
        require(_flashcardId > 0 && _flashcardId <= flashcardCount, "Flashcard does not exist");
        Flashcard memory fc = flashcards[_flashcardId];
        return (fc.question, fc.answer, fc.creator, fc.createdAt);
    }

    function getTotalFlashcards() public view returns (uint256) {
        return flashcardCount;
    }
}

