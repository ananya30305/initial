/* =========================================================
   OUR LITTLE HOME
   Game JavaScript
========================================================= */


/* =========================================================
   ROOM DATA
========================================================= */

const rooms = [
    {
        id: "hall",
        name: "Hall",
        image: "game-assets/rooms/hall.jpg",

        message: "Welcome home, love ♡",

        girlMessage: "I'm coming with you 🥰",

        cuteMessages: [
            "You make our little home so happy ♡",
            "Come sit with me for a while 🥰",
            "I just want to stay with you ❤️"
        ]
    },

    {
        id: "kitchen",
        name: "Kitchen",
        image: "game-assets/rooms/kitchen.jpg",

        message: "Let's make something yummy 🍳",

        girlMessage: "Wait for me! ❤️",

        cuteMessages: [
            "I'll cook something yummy for you 🍳",
            "Don't eat everything before I come! 😂❤️",
            "Come help me in the kitchen 🥰"
        ]
    },

    {
        id: "bedroom",
        name: "Bedroom",
        image: "game-assets/rooms/bedroom.jpg",

        message: "Our cozy little room ♡",

        girlMessage: "Come here, sleepyhead 🥺",

        cuteMessages: [
            "Come here, sleepyhead 🥺❤️",
            "This is my favourite place with you ♡",
            "Let's stay here forever 🥰"
        ]
    },

    {
        id: "bathroom",
        name: "Bathroom",
        image: "game-assets/rooms/bathroom.jpg",

        message: "Fresh and happy together 🚿",

        girlMessage: "Don't take too long! 😂",

        cuteMessages: [
            "Hurry up! 😂❤️",
            "Okay, this room is not romantic at all 😭😂",
            "Come on, let's go somewhere cute ♡"
        ]
    },

    {
        id: "pooja",
        name: "Pooja",
        image: "game-assets/rooms/pooja-room.jpg",

        message: "Let's pray together 🪔",

        girlMessage: "Let's pray together 🙏❤️",

        cuteMessages: [
            "May we always stay happy together 🙏❤️",
            "Let's thank God for bringing us together ♡",
            "A little prayer for our love 🪔✨"
        ]
    }
];


/* =========================================================
   ELEMENTS
========================================================= */

const gameWorld = document.getElementById("gameWorld");

const roomBackground =
    document.getElementById("roomBackground");

const currentRoomLabel =
    document.getElementById("currentRoomLabel");

const loveMessage =
    document.getElementById("loveMessage");

const girlCharacter =
    document.getElementById("girlCharacter");

const boyCharacter =
    document.getElementById("boyCharacter");

const girlSpeech =
    document.getElementById("girlSpeech");

const boySpeech =
    document.getElementById("boySpeech");

const actionMessage =
    document.getElementById("actionMessage");

const poojaInfo =
    document.getElementById("poojaInfo");


/* =========================================================
   GAME STATE
========================================================= */

let currentRoomIndex = 0;


/*
   Character positions are stored in PIXELS.

   This is the important fix.

   If we used:
       girl = 40%
       boy = 52%

   they would become too close on a phone.

   Instead, we keep a fixed physical distance.
*/

let girlX = 0;
let boyX = 0;


/*
   Distance between the LEFT sides of the characters.

   Character width = 110px.

   Therefore:
   155 - 110 = 45px gap.

   So they will always have approximately
   45px of space between them.
*/

const CHARACTER_DISTANCE = 155;


/*
   Movement amount.
*/

const MOVE_STEP = 32;


/*
   How close to an edge before changing room.
*/

const EDGE_DISTANCE = 18;


/* =========================================================
   INITIALIZE
========================================================= */

function initializeGame() {

    setCharacterPositions();

    loadRoom(currentRoomIndex);

}


/* =========================================================
   SET INITIAL CHARACTER POSITIONS
========================================================= */

function setCharacterPositions() {

    const worldWidth = gameWorld.clientWidth;


    /*
       Start the girl around 28% of the world.
    */

    girlX = Math.round(worldWidth * 0.28);


    /*
       Boy stays a fixed distance to her right.
    */

    boyX = girlX + CHARACTER_DISTANCE;


    /*
       Make sure the pair fits inside the screen.

       This is especially important on mobile.
    */

    const totalPairWidth =
        CHARACTER_DISTANCE + 110;


    const maxLeft =
        worldWidth - totalPairWidth - 15;


    if (boyX > worldWidth - 110 - 15) {

        boyX = worldWidth - 110 - 15;

        girlX =
            boyX - CHARACTER_DISTANCE;
    }


    if (girlX < 15) {

        girlX = 15;

        boyX =
            girlX + CHARACTER_DISTANCE;
    }


    updateCharacterPositions();
}


/* =========================================================
   UPDATE CHARACTER POSITIONS
========================================================= */

function updateCharacterPositions() {

    girlCharacter.style.left =
        `${girlX}px`;

    boyCharacter.style.left =
        `${boyX}px`;
}


/* =========================================================
   LOAD ROOM
========================================================= */

function loadRoom(index) {

    const room = rooms[index];


    currentRoomLabel.textContent =
        room.name;


    loveMessage.textContent =
        room.message;


    girlSpeech.textContent =
        room.girlMessage;


    /*
       Change background.
    */

    roomBackground.style.backgroundImage =
        `url("${room.image}")`;


    /*
       Active room button.
    */

    document
        .querySelectorAll(".room-button")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.room === room.id
            );

        });


    /*
       Pooja information.
    */

    if (room.id === "pooja") {

        poojaInfo.classList.remove("hidden");

    } else {

        poojaInfo.classList.add("hidden");

    }


    /*
       Reset positions after changing room.
    */

    setCharacterPositions();
}


/* =========================================================
   GO TO A SPECIFIC ROOM
========================================================= */

function goToRoom(roomId) {

    const newIndex =
        rooms.findIndex(
            room => room.id === roomId
        );


    if (newIndex === -1) {
        return;
    }


    currentRoomIndex = newIndex;


    loadRoom(currentRoomIndex);


    /*
       Small cute transition message.
    */

    showActionMessage(
        `Welcome to our ${rooms[currentRoomIndex].name.toLowerCase()} ♡`
    );
}


/* =========================================================
   MOVE CHARACTERS
========================================================= */

function moveCharacter(direction) {

    const worldWidth =
        gameWorld.clientWidth;


    if (direction === "right") {

        /*
           Move both characters together.
        */

        boyX += MOVE_STEP;

        girlX += MOVE_STEP;


        /*
           If boy reaches the right edge,
           move to the next room.
        */

        const boyRightEdge =
            boyX + 110;


        if (
            boyRightEdge >=
            worldWidth - EDGE_DISTANCE
        ) {

            changeRoomByEdge("right");

            return;
        }

    }


    if (direction === "left") {

        /*
           Move both characters together.
        */

        boyX -= MOVE_STEP;

        girlX -= MOVE_STEP;


        /*
           If girl reaches the left edge,
           move to previous room.
        */

        if (
            girlX <= EDGE_DISTANCE
        ) {

            changeRoomByEdge("left");

            return;
        }
    }


    updateCharacterPositions();
}


/* =========================================================
   CHANGE ROOM WHEN EDGE IS REACHED
========================================================= */

function changeRoomByEdge(direction) {

    if (direction === "right") {

        currentRoomIndex++;

        /*
           Optional looping:
           Last room -> first room.
        */

        if (
            currentRoomIndex >= rooms.length
        ) {

            currentRoomIndex = 0;
        }

    } else {

        currentRoomIndex--;

        /*
           First room -> last room.
        */

        if (currentRoomIndex < 0) {

            currentRoomIndex =
                rooms.length - 1;
        }
    }


    loadRoom(currentRoomIndex);


    /*
       Put characters on the correct side
       after entering the new room.
    */

    const worldWidth =
        gameWorld.clientWidth;


    if (direction === "right") {

        /*
           Enter new room from left.
        */

        girlX = 25;

        boyX =
            girlX + CHARACTER_DISTANCE;

    } else {

        /*
           Enter new room from right.
        */

        boyX =
            worldWidth - 135;

        girlX =
            boyX - CHARACTER_DISTANCE;
    }


    updateCharacterPositions();
}


/* =========================================================
   DO SOMETHING CUTE
========================================================= */

function doSomethingCute() {

    const room =
        rooms[currentRoomIndex];


    const messages =
        room.cuteMessages;


    const randomIndex =
        Math.floor(
            Math.random() * messages.length
        );


    showActionMessage(
        messages[randomIndex]
    );


    /*
       Change the girl speech bubble too.
    */

    girlSpeech.textContent =
        messages[randomIndex];


    /*
       Show boy bubble sometimes.
    */

    boySpeech.textContent =
        "❤️";


    boySpeech.classList.remove("hidden");


    /*
       Hide boy bubble after a moment.
    */

    setTimeout(() => {

        boySpeech.classList.add("hidden");

    }, 2200);
}


/* =========================================================
   ACTION MESSAGE
========================================================= */

let actionTimer = null;


function showActionMessage(message) {

    actionMessage.textContent =
        message;


    actionMessage.classList.remove(
        "hidden"
    );


    clearTimeout(actionTimer);


    actionTimer = setTimeout(() => {

        actionMessage.classList.add(
            "hidden"
        );

    }, 2300);
}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "ArrowLeft") {

            event.preventDefault();

            moveCharacter("left");
        }


        if (event.key === "ArrowRight") {

            event.preventDefault();

            moveCharacter("right");
        }


        if (event.key === " ") {

            event.preventDefault();

            doSomethingCute();
        }

    }
);


/* =========================================================
   RESPONSIVE RESIZE
========================================================= */

window.addEventListener(
    "resize",
    function() {

        /*
           Keep the same character distance
           when the phone rotates or browser resizes.
        */

        const worldWidth =
            gameWorld.clientWidth;


        /*
           Keep girl inside the screen.
        */

        if (girlX < 15) {

            girlX = 15;

            boyX =
                girlX + CHARACTER_DISTANCE;
        }


        /*
           Keep boy inside the screen.
        */

        if (
            boyX + 110 >
            worldWidth - 15
        ) {

            boyX =
                worldWidth - 125;

            girlX =
                boyX - CHARACTER_DISTANCE;
        }


        /*
           On extremely narrow screens,
           keep the pair together safely.
        */

        if (girlX < 10) {

            girlX = 10;

            boyX =
                girlX + CHARACTER_DISTANCE;
        }


        updateCharacterPositions();

    }
);


/* =========================================================
   START GAME
========================================================= */

initializeGame();
