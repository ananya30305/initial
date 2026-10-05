
/* =====================================================
   OUR LITTLE HOME GAME
===================================================== */


/* -----------------------------------------------------
   ROOM ORDER
----------------------------------------------------- */

const rooms = [
    {
        id: "hall",
        name: "Hall",
        image: "game-assets/rooms/hall.png",
        message: "Welcome home, love ♡"
    },

    {
        id: "kitchen",
        name: "Kitchen",
        image: "game-assets/rooms/kitchen.png",
        message: "Let's make something yummy 🍳"
    },

    {
        id: "bedroom",
        name: "Bedroom",
        image: "game-assets/rooms/bedroom.png",
        message: "Our cozy little world ♡"
    },

    {
        id: "bathroom",
        name: "Bathroom",
        image: "game-assets/rooms/bathroom.png",
        message: "Getting ready together 🚿"
    },

    {
        id: "pooja",
        name: "Pooja",
        image: "game-assets/rooms/pooja-room.png",
        message: "Let's pray together 🪔"
    }
];


/* -----------------------------------------------------
   ELEMENTS
----------------------------------------------------- */

const boy = document.getElementById("boyCharacter");
const girl = document.getElementById("girlCharacter");

const roomBackground =
    document.getElementById("roomBackground");

const roomName =
    document.getElementById("roomName");

const loveMessage =
    document.getElementById("loveMessage");

const actionMessage =
    document.getElementById("actionMessage");


/* -----------------------------------------------------
   GAME POSITION
----------------------------------------------------- */

let currentRoom = 0;


/*
   0 = far left
   100 = far right
*/
let playerPosition = 55;


/*
   Girl follows the boy.
*/
const girlDistance = 13;


/* -----------------------------------------------------
   CUTE MESSAGES
----------------------------------------------------- */

const messages = [
    "Wait for me! ❤️",
    "I'm coming with you 🥰",
    "Don't leave me! ♡",
    "Where are you going? 😭💕",
    "Let's go together ✨",
    "I'm right behind you! 💕"
];


/* -----------------------------------------------------
   INITIAL ROOM
----------------------------------------------------- */

function loadRoom(index, startingPosition = 55) {

    currentRoom = index;

    const room = rooms[currentRoom];

    roomBackground.style.backgroundImage =
        `url("${room.image}")`;

    roomName.textContent = room.name;

    loveMessage.textContent = room.message;

    playerPosition = startingPosition;

    updateCharacters();

    updateRoomButtons();
}


/* -----------------------------------------------------
   UPDATE CHARACTER POSITIONS
----------------------------------------------------- */

function updateCharacters() {

    /*
       Keep the boy inside the room.
    */

    playerPosition =
        Math.max(8, Math.min(92, playerPosition));


    /*
       Girl stays behind him.
    */

    let girlPosition =
        playerPosition - girlDistance;


    /*
       Keep girl inside screen too.
    */

    girlPosition =
        Math.max(5, Math.min(87, girlPosition));


    boy.style.left =
        `calc(${playerPosition}% - 65px)`;

    girl.style.left =
        `calc(${girlPosition}% - 65px)`;
}


/* -----------------------------------------------------
   MOVE CHARACTER
----------------------------------------------------- */

function moveCharacter(direction) {

    const step = 5;


    if (direction === "right") {

        playerPosition += step;


        /*
           RIGHT EDGE
           Go to next room.
        */

        if (playerPosition >= 90) {

            if (currentRoom < rooms.length - 1) {

                currentRoom++;

                loadRoom(
                    currentRoom,
                    12
                );

                showAction(
                    `Entering ${rooms[currentRoom].name} ♡`
                );

                return;
            }

            /*
               Last room:
               don't leave the home.
            */

            playerPosition = 90;

            showAction("There's nowhere else to go ♡");
        }
    }


    if (direction === "left") {

        playerPosition -= step;


        /*
           LEFT EDGE
           Go to previous room.
        */

        if (playerPosition <= 8) {

            if (currentRoom > 0) {

                currentRoom--;

                loadRoom(
                    currentRoom,
                    88
                );

                showAction(
                    `Going back to ${rooms[currentRoom].name} ♡`
                );

                return;
            }

            /*
               First room:
               don't leave the home.
            */

            playerPosition = 8;

            showAction("Let's stay home ♡");
        }
    }


    updateCharacters();


    /*
       Occasionally change speech.
    */

    if (Math.random() > 0.72) {

        const randomMessage =
            messages[
                Math.floor(
                    Math.random() * messages.length
                )
            ];

        showAction(randomMessage);
    }
}


/* -----------------------------------------------------
   CHANGE ROOM FROM BUTTON
----------------------------------------------------- */

function switchRoom(index) {

    /*
       Allow buttons to directly open a room.
    */

    if (typeof index !== "number") {

        index = rooms.findIndex(
            room => room.id === index
        );
    }


    if (index < 0 || index >= rooms.length) {
        return;
    }


    loadRoom(index, 55);
}


/* -----------------------------------------------------
   ACTION MESSAGE
----------------------------------------------------- */

function showAction(message) {

    if (!actionMessage) {
        return;
    }

    actionMessage.textContent = message;

    actionMessage.classList.remove("hidden");

    /*
       Restart animation.
    */

    actionMessage.style.animation = "none";

    void actionMessage.offsetWidth;

    actionMessage.style.animation =
        "pop 0.35s ease";


    clearTimeout(
        window.actionTimeout
    );


    window.actionTimeout =
        setTimeout(() => {

            actionMessage.classList.add("hidden");

        }, 2200);
}


/* -----------------------------------------------------
   ROOM BUTTON ACTIVE STATE
----------------------------------------------------- */

function updateRoomButtons() {

    const buttons =
        document.querySelectorAll(".room-button");


    buttons.forEach(
        (button, index) => {

            button.classList.toggle(
                "active",
                index === currentRoom
            );
        }
    );
}


/* -----------------------------------------------------
   CUTE ACTION BUTTON
----------------------------------------------------- */

function doSomethingCute() {

    const cuteMessages = [
        "Come here, love 🥰",
        "I love you ❤️",
        "Give me a hug! 🤗",
        "You're my favourite person ♡",
        "Let's stay home together 🏡💕",
        "You + me = home ✨"
    ];


    const message =
        cuteMessages[
            Math.floor(
                Math.random() *
                cuteMessages.length
            )
        ];


    showAction(message);
}


/* -----------------------------------------------------
   KEYBOARD SUPPORT
----------------------------------------------------- */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "ArrowLeft") {

            moveCharacter("left");

        }

        if (event.key === "ArrowRight") {

            moveCharacter("right");

        }
    }
);


/* -----------------------------------------------------
   START GAME
----------------------------------------------------- */

loadRoom(0, 55);
