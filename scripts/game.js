const selectors = {
    gameBoard: document.querySelector(".game-board"),
    board: document.querySelector(".board"),
    win: document.querySelector(".win"),
    moves: document.querySelector(".moves"),
    time: document.querySelector(".time"),
    start: document.querySelector(".start"),
    hint: document.querySelector(".hint"),
    hintCount: document.querySelector(".hint-count")
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    hintCount: 3,
    loop: null
}

const fontSizes = {
    "4": 36,
    "6": 30,
    "8": 24,
    "10": 18
}

const generateGame = () => {
    const size = localStorage.getItem("size");
    
    if (size % 2 !== 0) {
        throw new Error("The size of the board must be an even number!");
    }

    const emojis = ["🥝", "🥥", "🍎", "🍇", "🍒", "🍑", "🍋", "🍉", "🍌", "🍈",
                    "🥑", "🥕", "🧅", "🌽", "🍄", "🍆", "🧄", "🥔", "🥒", "🥜",
                    "🍳", "🌮", "🍗", "🧂", "🧀", "🍟", "🥐", "🍞", "🥩", "🥨",
                    "🍫", "🍦", "🍩", "🍬", "🍪", "🍯", "🎂", "🍭", "🧁", "🍰",
                    "🥃", "🥂", "🍺", "☕", "🥤", "🧃", "🍾", "🍹", "🍷", "🍼"
                   ];
    const picks = pickRandom(emojis, (size * size) / 2);
    const items = shuffle([...picks, ...picks]);

    const cards = `
        <div class="board" style="grid-template-columns: repeat(${size}, minmax(20px, 250px)); grid-template-rows: repeat(${size}, minmax(20px, 250px));">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back" style="font-size: ${fontSizes[size]}px">${item}</div>
                </div>
            `).join("")}
        </div>
    `

    const parser = new DOMParser().parseFromString(cards, "text/html");

    selectors.board.replaceWith(parser.querySelector(".board"));
}

const pickRandom = (array, size) => {
    const clonedArray = [...array];
    const randomPicks = [];

    for (let i = 0; i < size; ++i) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }

    return randomPicks;
}

const shuffle = (array) => {
    const clonedArray = [...array];

    for (let i = clonedArray.length - 1; i > 0; --i) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        
        const original = clonedArray[i];
        clonedArray[i] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }

    return clonedArray;
}

const handleClick = (event) => {
    const eventTarget = event.target;
    const eventParent = eventTarget.parentElement;

    if (eventTarget.className.includes("card") && !eventParent.className.includes("flipped")) {
        flipCard(eventParent);
    } else if (eventTarget.className.includes("start") && !eventTarget.className.includes("disabled")) {
        startGame();
    } else if (eventTarget.className.includes("hint") && !eventTarget.className.includes("disabled")) {
        showHint();
    }
}

const attachEventListeners = () => {
    document.addEventListener('click', handleClick);
}

const flipCard = (card) => {
    state.flippedCards++;
    state.totalFlips++;

    if (!state.gameStarted) {
        startGame();
    }

    if (state.flippedCards <= 2) {
        card.classList.add("flipped");
    }

    if (state.flippedCards == 2) {
        const flippedCards = document.querySelectorAll(".flipped:not(.matched)");

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add("matched");
            flippedCards[1].classList.add("matched");
        }

        setTimeout(() => {
            flipBackCards();
        }, 500);
    }

    if (!document.querySelectorAll(".card:not(.flipped)").length) {
        setTimeout(() => {
            selectors.gameBoard.classList.add("flipped");
            selectors.win.innerHTML = `
                <span class="win-text">
                    Выйграли! статистика: </br>
                    карточки: ${state.totalFlips} </br>
                    время: ${state.totalTime} sec <br>
                </span>
                <div class="button-back">
                    <a href="index.html" class="button-back-link">вернуться</a>
                </div>
            `;
        
            clearInterval(state.loop);
        }, 1000);
        document.removeEventListener("click", handleClick);
    }
}

const flipCardsforHint = () => {
    cards = document.querySelectorAll(".card:not(.matched)");

    selectors.hint.classList.add("disabled");
    selectors.hintCount.classList.add("disabled");
        
    cards.forEach(card => {
        card.classList.add("flipped");
    });

    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove("flipped");
        });
        
        selectors.hint.classList.remove("disabled");
        selectors.hintCount.classList.remove("disabled");
    }, 3000);
}

const showHint = () => {
    if (state.hintCount > 0) {
        flipCardsforHint();
        state.hintCount -= 1;
    }
    
    if (state.hintCount == 0) {
        setTimeout(() => {
            selectors.hint.classList.add("disabled");
            selectors.hintCount.classList.add("disabled");
        }, 3000);
    }

    selectors.hintCount.innerText = state.hintCount;
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    });

    state.flippedCards = 0;
}

const startGame = () => {
    state.gameStarted = true;
    selectors.start.classList.add("disabled");
    

    state.loop = setInterval(() => {
        state.totalTime++;

        selectors.moves.innerText = `${state.totalFlips} карточки`;
        selectors.time.innerText = `время: ${state.totalTime} сек`
    }, 1000);
}

generateGame();
attachEventListeners();