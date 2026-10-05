
/* =====================================================
   OUR LITTLE HOME
   GAME JAVASCRIPT
===================================================== */


/* =====================================================
   ROOM DATA
===================================================== */

const rooms = [

    {
        id: "hall",
        name: "Hall",
        image: "game-assets/rooms/hall.jpg",
        message: "Welcome home, love ♡",
        speech: "I'm coming with you 🥰"
    },

    {
        id: "kitchen",
        name: "Kitchen",
        image: "game-assets/rooms/kitchen.jpg",
        message: "Let's make something yummy 🍳",
        speech: "Wait for me! ❤️"
    },

    {
        id: "bedroom",
        name: "Bedroom",
        image: "game-assets/rooms/bedroom.jpg",
        message: "Our cozy little room ♡",
        speech: "Come here, sleepyhead 🥺"
    },

    {
        id: "bathroom",
        name: "Bathroom",
        image: "game-assets/rooms/bathroom.jpg",
        message: "Fresh & clean together 🚿",
        speech: "Don't take too long! 😚"
    },

    {
        id: "pooja",
        name: "Pooja",
        image: "game-assets/rooms/pooja-room.jpg",
        message: "Let's pray together 🪔",
        speech: "Come, let's pray together 🙏"
    }

];


/* =====================================================
   CHARACTER IMAGE PATHS
===================================================== */

const boyImages = {

    front:
        "game-assets/characters/boy/boy-front.png",

    left:
        "game-assets/characters/boy/boy-walk-left.png",

    right:
        "game-assets/characters/boy/boy-walk-right.png"
};


const girlImages = {

    front:
        "game-assets/characters/girl/girl-front.png",

    left:
        "game-assets/characters/girl/girl-walk-left.png",

    right:
        "game-assets/characters/girl/girl-walk-right.png"
};


/* =====================================================
   ELEMENTS
===================================================== */

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

const boySprite =
    document.getElementById("boySprite");

const girlSprite =
    document.getElementById("girlSprite");

const poojaInfo =
    document.getElementById("poojaInfo");

const actionMessage =
    document.getElementById("actionMessage");

const moveLeft =
    document.getElementById("moveLeft");

const moveRight =
    document.getElementById("moveRight");

const cuteAction =
    document.getElementById("cuteAction");

const roomButtons =
    document.querySelectorAll(".room-button");


/* =====================================================
   GAME STATE
===================================================== */

let currentRoomIndex = 0;


/*
    This is the boy's CENTER position.

    50 means center of screen.
*/

let boyPosition = 58;


/*
    Girl stays a fixed number of pixels away
    from the boy.

    This is handled in updateCharacterPositions().
*/

let walkTimer = null;

let actionTimer = null;


/* =====================================================
   INITIALIZE
===================================================== */

function initializeGame() {

    loadRoom(0);

    updateCharacterPositions();

    setIdleCharacters();
}


/* =====================================================
   LOAD ROOM
===================================================== */

function loadRoom(index) {

    if (index < 0) {

        index = rooms.length - 1;
    }


    if (index >= rooms.length) {

        index = 0;
    }


    currentRoomIndex = index;


    const room = rooms[currentRoomIndex];


    /* Change background */

    roomBackground.style.opacity = "0";


    setTimeout(() => {

        roomBackground.style.backgroundImage =
            `url("${room.image}")`;

        roomBackground.style.opacity = "1";

    }, 150);


    /* Change room name */

    roomName.textContent =
        room.name;


    /* Change top message */

    loveMessage.textContent =
        room.message;


    /* Change girl speech */

    girlSpeech.textContent =
        room.speech;


    /* Pooja */

    if (room.id === "pooja") {

        poojaInfo.classList.remove("hidden");

    } else {

        poojaInfo.classList.add("hidden");
    }


    /* Active room button */

    roomButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.room === room.id
        );

    });


    /*
        When entering a new room,
        place both characters around the middle.
    */

    boyPosition = 58;

    updateCharacterPositions();
}


/* =====================================================
   CHARACTER POSITION
===================================================== */

function updateCharacterPositions() {

    /*
        BOY

        The boy's left value is his CENTER.
    */

    boyCharacter.style.left =
        `${boyPosition}%`;


    /*
        GIRL

        IMPORTANT:

        We subtract a FIXED PIXEL amount.

        This is why the distance stays similar
        on laptop AND mobile.

        No more:

        40% vs 52%

        which causes different distances
        on different screen widths.
    */

    girlCharacter.style.left =
        `calc(${boyPosition}% - var(--couple-gap))`;
}


/* =====================================================
   CHARACTER WALKING
===================================================== */

function setWalkingDirection(direction) {

    /*
        LEFT
    */

    if (direction === "left") {

        boySprite.src =
            boyImages.left;

        girlSprite.src =
            girlImages.left;
    }


    /*
        RIGHT
    */

    if (direction === "right") {

        boySprite.src =
            boyImages.right;

        girlSprite.src =
            girlImages.right;
    }


    /*
        Return to front-facing idle
        after the walking movement.
    */

    clearTimeout(walkTimer);


    walkTimer = setTimeout(() => {

        setIdleCharacters();

    }, 450);
}


/* =====================================================
   IDLE CHARACTER
===================================================== */

function setIdleCharacters() {

    boySprite.src =
        boyImages.front;

    girlSprite.src =
        girlImages.front;
}


/* =====================================================
   MOVE LEFT
===================================================== */

function moveCharactersLeft() {

    /*
        FIRST change the sprites.

        This makes sure the WALK LEFT PNG
        is actually visible.
    */

    setWalkingDirection("left");


    /*
        Move both characters together.
    */

    boyPosition -= 7;


    /*
        LEFT EDGE

        If they reach the left side,
        go to the previous room.
    */

    if (boyPosition <= 10) {

        changeRoomLeft();

        return;
    }


    updateCharacterPositions();
}


/* =====================================================
   MOVE RIGHT
===================================================== */

function moveCharactersRight() {

    /*
        FIRST change sprites.
    */

    setWalkingDirection("right");


    /*
        Move both together.
    */

    boyPosition += 7;


    /*
        RIGHT EDGE

        If they reach the right side,
        enter the next room.
    */

    if (boyPosition >= 90) {

        changeRoomRight();

        return;
    }


    updateCharacterPositions();
}


/* =====================================================
   CHANGE ROOM TO LEFT
===================================================== */

function changeRoomLeft() {

    /*
        Small delay so the walk direction
        can actually be seen.
    */

    setTimeout(() => {

        let previousRoom =
            currentRoomIndex - 1;


        if (previousRoom < 0) {

            previousRoom =
                rooms.length - 1;
        }


        loadRoom(previousRoom);


        /*
            Enter from the RIGHT side
            because we travelled left.
        */

        boyPosition = 82;

        updateCharacterPositions();

        setWalkingDirection("left");

    }, 180);
}


/* =====================================================
   CHANGE ROOM TO RIGHT
===================================================== */

function changeRoomRight() {

    setTimeout(() => {

        let nextRoom =
            currentRoomIndex + 1;


        if (nextRoom >= rooms.length) {

            nextRoom = 0;
        }


        loadRoom(nextRoom);


        /*
            Enter from the LEFT side
            because we travelled right.
        */

        boyPosition = 18;

        updateCharacterPositions();

        setWalkingDirection("right");

    }, 180);
}


/* =====================================================
   ROOM BUTTONS
===================================================== */

roomButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedRoom =
            button.dataset.room;


        const roomIndex =
            rooms.findIndex(
                room => room.id === selectedRoom
            );


        if (roomIndex !== -1) {

            loadRoom(roomIndex);

            setIdleCharacters();
        }

    });

});


/* =====================================================
   CUTE ACTION
===================================================== */

const cuteActions = [

    "Hehe… come closer ❤️",

    "You are my favourite person 🥰",

    "Let's have a little date at home 💕",

    "I love being with you ♡",

    "Come here, I want a hug 🤗",

    "You make our little home happy ✨",

    "Let's stay together forever 💗",

    "Something cute is happening… 🥺❤️"
];


function doSomethingCute() {

    const randomIndex =
        Math.floor(
            Math.random() * cuteActions.length
        );


    actionMessage.textContent =
        cuteActions[randomIndex];


    actionMessage.classList.remove("hidden");


    /*
        Restart animation every time.
    */

    actionMessage.style.animation = "none";


    void actionMessage.offsetWidth;


    actionMessage.style.animation =
        "pop 0.3s ease";


    clearTimeout(actionTimer);


    actionTimer = setTimeout(() => {

        actionMessage.classList.add("hidden");

    }, 2200);
}


/* =====================================================
   BUTTON EVENTS
===================================================== */

moveLeft.addEventListener(
    "click",
    moveCharactersLeft
);


moveRight.addEventListener(
    "click",
    moveCharactersRight
);


cuteAction.addEventListener(
    "click",
    doSomethingCute
);


/* =====================================================
   KEYBOARD CONTROLS
===================================================== */

document.addEventListener("keydown", event => {

    /*
        Don't move repeatedly when
        another key is being used.
    */

    if (event.key === "ArrowLeft") {

        event.preventDefault();

        moveCharactersLeft();
    }


    if (event.key === "ArrowRight") {

        event.preventDefault();

        moveCharactersRight();
    }

});


/* =====================================================
   START GAME
===================================================== */

initializeGame();
