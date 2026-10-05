/* =========================================
   OUR LITTLE HOME
   Romantic Couple Mini Game
========================================= */


/* =========================
   GAME STATE
========================= */

let boyPosition = 52;
let girlPosition = 40;

let currentDirection = "front";

let currentRoom = "hall";

let movementTimer;


/* =========================
   ELEMENTS
========================= */

const boyCharacter =
    document.getElementById("boyCharacter");

const girlCharacter =
    document.getElementById("girlCharacter");

const boySprite =
    document.getElementById("boySprite");

const girlSprite =
    document.getElementById("girlSprite");

const roomBackground =
    document.getElementById("roomBackground");

const roomName =
    document.getElementById("roomName");

const girlSpeech =
    document.getElementById("girlSpeech");

const loveMessage =
    document.getElementById("loveMessage");

const poojaInfo =
    document.getElementById("poojaInfo");

const actionMessage =
    document.getElementById("actionMessage");


/* =========================
   ROOMS
========================= */

const rooms = {

    hall: {
        name: "Hall",
        image: "game-assets/rooms/hall.png",

        message: "Welcome home, love ♡",

        speech: "Come sit with me ❤️"
    },

    kitchen: {
        name: "Kitchen",
        image: "game-assets/rooms/kitchen.png",

        message: "Let's make something yummy 🍳",

        speech: "I'll cook for you! 🥰"
    },

    bedroom: {
        name: "Bedroom",
        image: "game-assets/rooms/bedroom.png",

        message: "Our little cozy room 💤",

        speech: "I just want to stay with you ❤️"
    },

    bathroom: {
        name: "Bathroom",
        image: "game-assets/rooms/bathroom.png",

        message: "Getting ready together 🫧",

        speech: "Wait for me! 😂💕"
    },

    pooja: {
        name: "Pooja Room",
        image: "game-assets/rooms/pooja-room.png",

        message: "Let's pray together 🪔",

        speech: "Let's pray together 🙏❤️"
    }

};


/* =========================
   INITIALIZE GAME
========================= */

function initializeGame() {

    roomBackground.style.backgroundImage =
        `url("${rooms.hall.image}")`;

    updatePositions();

}


initializeGame();


/* =========================
   POSITION CHARACTERS
========================= */

function updatePositions() {

    boyCharacter.style.left =
        boyPosition + "%";

    girlCharacter.style.left =
        girlPosition + "%";
}


/* =========================
   CHARACTER SPRITES
========================= */

function setCharacterDirection(direction) {

    currentDirection = direction;

    boySprite.src =
        `game-assets/characters/boy/boy-${direction}.png`;

    girlSprite.src =
        `game-assets/characters/girl/girl-${direction}.png`;
}


function setWalkingDirection(direction) {

    boySprite.src =
        `game-assets/characters/boy/boy-walk-${direction}.png`;

    girlSprite.src =
        `game-assets/characters/girl/girl-walk-${direction}.png`;
}


/* =========================
   MOVE
========================= */

function moveCharacter(direction) {

    const step = 4;


    if (direction === "right") {

        if (boyPosition < 82) {

            boyPosition += step;

            girlPosition += step;
        }

        setWalkingDirection("right");
    }


    if (direction === "left") {

        if (boyPosition > 15) {

            boyPosition -= step;

            girlPosition -= step;
        }

        setWalkingDirection("left");
    }


    updatePositions();


    clearTimeout(movementTimer);


    movementTimer = setTimeout(() => {

        setCharacterDirection("front");

    }, 300);


    randomLoveMessage();
}


/* =========================
   RANDOM GIRL DIALOGUE
========================= */

const walkingMessages = [

    "Wait for me! ❤️",

    "I'm coming with you 🥰",

    "Don't leave me behind! 😂",

    "Wherever you go, I go ❤️",

    "Heyyy, slow down! 😭💕",

    "I love following you ✨"

];


function randomLoveMessage() {

    const randomIndex =
        Math.floor(
            Math.random() * walkingMessages.length
        );

    girlSpeech.textContent =
        walkingMessages[randomIndex];
}


/* =========================
   GO TO ROOM
========================= */

function goToRoom(room) {

    const selectedRoom =
        rooms[room];

    if (!selectedRoom) return;


    currentRoom = room;


    /* Room background */

    roomBackground.style.opacity = "0";


    setTimeout(() => {

        roomBackground.style.backgroundImage =
            `url("${selectedRoom.image}")`;

        roomBackground.style.opacity = "1";

    }, 180);


    /* Room title */

    roomName.textContent =
        selectedRoom.name;


    /* Messages */

    loveMessage.textContent =
        selectedRoom.message;

    girlSpeech.textContent =
        selectedRoom.speech;


    /* Reset character positions */

    boyPosition = 52;

    girlPosition = 40;

    updatePositions();


    /* Reset direction */

    setCharacterDirection("front");


    /* Pooja room */

    if (room === "pooja") {

        poojaInfo.classList.remove("hidden");

    } else {

        poojaInfo.classList.add("hidden");

    }


    /* Active button */

    document
        .querySelectorAll(".room-button")
        .forEach(button => {

            button.classList.remove("active");

        });


    const activeButton =
        document.getElementById(
            room + "Button"
        );

    if (activeButton) {

        activeButton.classList.add("active");

    }

}


/* =========================
   CUTE INTERACTIONS
========================= */

function doCuteThing() {

    let message = "";


    if (currentRoom === "hall") {

        message =
            "You both sit together and talk for hours ❤️";

        girlSpeech.textContent =
            "I could stay like this forever 🥹❤️";
    }


    else if (currentRoom === "kitchen") {

        message =
            "She makes something yummy for you 🍳💕";

        girlSpeech.textContent =
            "Taste this! I made it for you 🥰";
    }


    else if (currentRoom === "bedroom") {

        message =
            "A quiet little moment together 💤❤️";

        girlSpeech.textContent =
            "Goodnight, my love 🌙";
    }


    else if (currentRoom === "bathroom") {

        message =
            "You both get ready together 🫧😂";

        girlSpeech.textContent =
            "Stop looking at me! 😂💕";
    }


    else if (currentRoom === "pooja") {

        message =
            "You both pray together with a little diya 🪔";

        girlSpeech.textContent =
            "May we always stay together 🙏❤️";
    }


    showActionMessage(message);

}


/* =========================
   ACTION MESSAGE
========================= */

function showActionMessage(message) {

    actionMessage.textContent =
        message;

    actionMessage.classList.remove(
        "hidden"
    );


    setTimeout(() => {

        actionMessage.classList.add(
            "hidden"
        );

    }, 3000);

}


/* =========================
   KEYBOARD CONTROLS
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "ArrowLeft") {

            moveCharacter("left");

        }


        if (event.key === "ArrowRight") {

            moveCharacter("right");

        }

    }
);
