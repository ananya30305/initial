/* =========================================================
   ROOM DATA
========================================================= */

const rooms = {

    hall: {
        name: "Hall",
        image: "game-assets/rooms/hall.jpg",
        message: "Welcome home, love ♡",
        speech: "I'm coming with you 🥰"
    },

    kitchen: {
        name: "Kitchen",
        image: "game-assets/rooms/kitchen.jpg",
        message: "Let's make something yummy 🍳",
        speech: "Wait for me! ❤️"
    },

    bedroom: {
        name: "Bedroom",
        image: "game-assets/rooms/bedroom.jpg",
        message: "Our cozy little room ♡",
        speech: "Come here, sleepyhead 🥺"
    },

    bathroom: {
        name: "Bathroom",
        image: "game-assets/rooms/bathroom.jpg",
        message: "Fresh & cozy together ♡",
        speech: "Don't take too long! 🫧"
    },

    pooja: {
        name: "Pooja",
        image: "game-assets/rooms/pooja-room.jpg",
        message: "Let's pray together 🪔",
        speech: "Come, let's pray together 🙏"
    }

};


/* =========================================================
   ELEMENTS
========================================================= */

const roomBackground =
    document.getElementById("roomBackground");

const roomName =
    document.getElementById("roomName");

const loveMessage =
    document.getElementById("loveMessage");

const girlSpeech =
    document.getElementById("girlSpeech");

const boyCharacter =
    document.getElementById("boyCharacter");

const girlCharacter =
    document.getElementById("girlCharacter");

const boyImage =
    document.getElementById("boyImage");

const girlImage =
    document.getElementById("girlImage");

const poojaInfo =
    document.getElementById("poojaInfo");

const actionMessage =
    document.getElementById("actionMessage");

const cuteAction =
    document.getElementById("cuteAction");

const moveLeft =
    document.getElementById("moveLeft");

const moveRight =
    document.getElementById("moveRight");

const roomButtons =
    document.querySelectorAll(".room-button");


/* =========================================================
   CHARACTER POSITIONS
========================================================= */

/*
   boyPosition is the position of the BOY.

   girlPosition is automatically kept behind him.

   The distance is calculated in pixels rather than
   using two independent percentages.

   This is why the distance stays consistent on mobile.
*/

let boyPosition = 58;

let currentRoomIndex = 0;

const roomOrder = [
    "hall",
    "kitchen",
    "bedroom",
    "bathroom",
    "pooja"
];


/* =========================================================
   CHARACTER IMAGES
========================================================= */

const characterImages = {

    front: {
        boy: "game-assets/characters/boy/boy-front.png",
        girl: "game-assets/characters/girl/girl-front.png"
    },

    left: {
        boy: "game-assets/characters/boy/boy-walk-left.png",
        girl: "game-assets/characters/girl/girl-walk-left.png"
    },

    right: {
        boy: "game-assets/characters/boy/boy-walk-right.png",
        girl: "game-assets/characters/girl/girl-walk-right.png"
    }

};


/* =========================================================
   SET CHARACTER POSITION
========================================================= */

function updateCharacterPositions() {

    boyCharacter.style.left =
        boyPosition + "%";


    /*
       Keep girl at a fixed distance behind boy.

       The actual distance is controlled in CSS with
       calc(), so we only update the boy here.
    */
}


/* =========================================================
   SET STANDING POSITION
========================================================= */

function setStandingPosition() {

    boyImage.src =
        characterImages.front.boy;

    girlImage.src =
        characterImages.front.girl;
}


/* =========================================================
   MOVE CHARACTERS
========================================================= */

function moveCharacters(direction) {

    const step = 4;

    /*
       LEFT
    */

    if (direction === "left") {

        boyImage.src =
            characterImages.left.boy;

        girlImage.src =
            characterImages.left.girl;

        boyPosition -= step;

        /*
           If they reach the left edge,
           go to previous room.
        */

        if (boyPosition <= 15) {

            changeRoomAtEdge("left");

            return;
        }
    }


    /*
       RIGHT
    */

    if (direction === "right") {

        boyImage.src =
            characterImages.right.boy;

        girlImage.src =
            characterImages.right.girl;

        boyPosition += step;

        /*
           If they reach the right edge,
           go to next room.
        */

        if (boyPosition >= 82) {

            changeRoomAtEdge("right");

            return;
        }
    }


    updateCharacterPositions();


    /*
       Return to standing image shortly
       after the movement.
    */

    clearTimeout(window.walkTimer);

    window.walkTimer = setTimeout(() => {

        setStandingPosition();

    }, 300);
}


/* =========================================================
   ROOM CHANGE WHEN REACHING EDGE
========================================================= */

function changeRoomAtEdge(direction) {

    if (direction === "right") {

        currentRoomIndex++;

        /*
           Don't go beyond final room.
        */

        if (currentRoomIndex >= roomOrder.length) {

            currentRoomIndex =
                roomOrder.length - 1;

            boyPosition = 78;

            updateCharacterPositions();

            setStandingPosition();

            return;
        }


        /*
           Enter new room from left side.
        */

        boyPosition = 25;
    }


    if (direction === "left") {

        currentRoomIndex--;

        /*
           Don't go before first room.
        */

        if (currentRoomIndex < 0) {

            currentRoomIndex = 0;

            boyPosition = 20;

            updateCharacterPositions();

            setStandingPosition();

            return;
        }


        /*
           Enter new room from right side.
        */

        boyPosition = 70;
    }


    const nextRoom =
        roomOrder[currentRoomIndex];

    switchRoom(nextRoom);

}


/* =========================================================
   SWITCH ROOM
========================================================= */

function switchRoom(roomKey) {

    const room =
        rooms[roomKey];

    if (!room) {
        return;
    }


    /*
       Change background
    */

    roomBackground.style.backgroundImage =
        `url("${room.image}")`;


    /*
       Change room title
    */

    roomName.textContent =
        room.name;


    /*
       Change top message
    */

    loveMessage.textContent =
        room.message;


    /*
       Change girl's speech
    */

    girlSpeech.textContent =
        room.speech;


    /*
       Active button
    */

    roomButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.room === roomKey
        );

    });


    /*
       Pooja information
    */

    if (roomKey === "pooja") {

        poojaInfo.classList.remove("hidden");

    } else {

        poojaInfo.classList.add("hidden");
    }


    updateCharacterPositions();

    setStandingPosition();
}


/* =========================================================
   ROOM BUTTONS
========================================================= */

roomButtons.forEach(button => {

    button.addEventListener("click", () => {

        const roomKey =
            button.dataset.room;

        currentRoomIndex =
            roomOrder.indexOf(roomKey);

        /*
           Put characters at a comfortable
           position when manually selecting room.
        */

        boyPosition = 58;

        switchRoom(roomKey);

    });

});


/* =========================================================
   MOVE BUTTONS
========================================================= */

moveLeft.addEventListener(
    "click",
    () => {

        moveCharacters("left");

    }
);


moveRight.addEventListener(
    "click",
    () => {

        moveCharacters("right");

    }
);


/* =========================================================
   CUTE ACTION
========================================================= */

const cuteMessages = [

    "Hehe, come closer ❤️",

    "You are my favorite person 🥰",

    "Let's stay together forever ♡",

    "Give me a hug 🤗",

    "You're so cute! 💕",

    "I love our little home 🏡❤️",

    "Come here, baby 🥺💕",

    "Let's do something cute ✨"

];


cuteAction.addEventListener(
    "click",
    () => {

        const randomIndex =
            Math.floor(
                Math.random() *
                cuteMessages.length
            );

        actionMessage.textContent =
            cuteMessages[randomIndex];

        actionMessage.classList.remove(
            "hidden"
        );


        clearTimeout(
            window.actionTimer
        );


        window.actionTimer =
            setTimeout(() => {

                actionMessage.classList.add(
                    "hidden"
                );

            }, 2500);

    }
);


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            moveCharacters("left");

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            moveCharacters("right");

        }

    }
);


/* =========================================================
   INITIAL ROOM
========================================================= */

switchRoom("hall");
