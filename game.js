/* =========================================
   OUR LITTLE HOME
   Game JavaScript
========================================= */


/* =========================================
   ROOM DATA
========================================= */

const rooms = [

    {
        name: "Hall",
        image: "game-assets/rooms/hall.jpg",

        message: "Welcome home, love ♡",

        speech: "I'm coming with you 🥰",

        action: "Let's cuddle on the sofa 🥰"
    },

    {
        name: "Kitchen",
        image: "game-assets/rooms/kitchen.jpg",

        message: "Let's make something yummy 🍳",

        speech: "Wait for me! ❤️",

        action: "I'll cook something for you 🍳"
    },

    {
        name: "Bedroom",
        image: "game-assets/rooms/bedroom.jpg",

        message: "Our cozy little room ♡",

        speech: "Come here, sleepyhead 🥺",

        action: "Let's have a cozy moment 🧸"
    },

    {
        name: "Bathroom",
        image: "game-assets/rooms/bathroom.jpg",

        message: "Fresh and clean ✨",

        speech: "Why are you following me? 😂",

        action: "Tiny bathroom adventure 🚿"
    },

    {
        name: "Pooja",
        image: "game-assets/rooms/pooja-room.jpg",

        message: "Let's pray together 🪔",

        speech: "Come, let's pray together 🙏",

        action: "A little prayer together 🪔"
    }

];


/* =========================================
   ELEMENTS
========================================= */

const roomBackground =
    document.getElementById("roomBackground");

const roomName =
    document.getElementById("roomName");

const loveMessage =
    document.getElementById("loveMessage");

const boyCharacter =
    document.getElementById("boyCharacter");

const girlCharacter =
    document.getElementById("girlCharacter");

const boyImage =
    document.getElementById("boyImage");

const girlImage =
    document.getElementById("girlImage");

const girlSpeech =
    document.getElementById("girlSpeech");

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


/* =========================================
   GAME STATE
========================================= */

let currentRoom = 0;


/*
    Both characters move together.

    The numbers represent the CENTER position
    of the characters in percentage.
*/

let boyPosition = 58;

let girlPosition = 44;


/*
    How much they move per click.
*/

const movementStep = 5;


/*
    Limits before changing rooms.
*/

const RIGHT_EDGE = 88;

const LEFT_EDGE = 10;


/* =========================================
   CHARACTER IMAGES
========================================= */

const boyImages = {

    front:
        "game-assets/characters/boy/boy-front.png",

    back:
        "game-assets/characters/boy/boy-back.png",

    left:
        "game-assets/characters/boy/boy-left.png",

    right:
        "game-assets/characters/boy/boy-right.png",

    walkLeft:
        "game-assets/characters/boy/boy-walk-left.png",

    walkRight:
        "game-assets/characters/boy/boy-walk-right.png"

};


const girlImages = {

    front:
        "game-assets/characters/girl/girl-front.png",

    back:
        "game-assets/characters/girl/girl-back.png",

    left:
        "game-assets/characters/girl/girl-left.png",

    right:
        "game-assets/characters/girl/girl-right.png",

    walkLeft:
        "game-assets/characters/girl/girl-walk-left.png",

    walkRight:
        "game-assets/characters/girl/girl-walk-right.png"

};


/* =========================================
   INITIAL POSITION
========================================= */

function setCharacterPositions() {

    boyCharacter.style.left =
        boyPosition + "%";

    girlCharacter.style.left =
        girlPosition + "%";
}


/* =========================================
   CHARACTER DIRECTION
========================================= */

function setCharacterDirection(direction) {

    if (direction === "left") {

        boyImage.src =
            boyImages.walkLeft;

        girlImage.src =
            girlImages.walkLeft;

    }

    else if (direction === "right") {

        boyImage.src =
            boyImages.walkRight;

        girlImage.src =
            girlImages.walkRight;

    }

}


/* =========================================
   IDLE CHARACTER
========================================= */

function setIdleDirection(direction) {

    if (direction === "left") {

        boyImage.src =
            boyImages.left;

        girlImage.src =
            girlImages.left;

    }

    else if (direction === "right") {

        boyImage.src =
            boyImages.right;

        girlImage.src =
            girlImages.right;

    }

}


/* =========================================
   MOVE CHARACTERS
========================================= */

function moveCharacters(direction) {

    /*
        Change to walking sprite
    */

    setCharacterDirection(direction);


    /*
        RIGHT
    */

    if (direction === "right") {

        boyPosition += movementStep;

        girlPosition += movementStep;


        /*
            Reached right edge.
            Move into next room.
        */

        if (boyPosition >= RIGHT_EDGE) {

            changeRoom(1);

            return;
        }

    }


    /*
        LEFT
    */

    if (direction === "left") {

        boyPosition -= movementStep;

        girlPosition -= movementStep;


        /*
            Reached left edge.
            Move into previous room.
        */

        if (boyPosition <= LEFT_EDGE) {

            changeRoom(-1);

            return;
        }

    }


    /*
        Update positions
    */

    setCharacterPositions();


    /*
        Return to normal standing image
        after walking.
    */

    setTimeout(() => {

        setIdleDirection(direction);

    }, 180);

}


/* =========================================
   CHANGE ROOM
========================================= */

function changeRoom(direction) {

    /*
        Calculate next room
    */

    currentRoom += direction;


    /*
        If moving right from last room,
        return to Hall.
    */

    if (currentRoom >= rooms.length) {

        currentRoom = 0;

    }


    /*
        If moving left from Hall,
        go to Pooja.
    */

    if (currentRoom < 0) {

        currentRoom = rooms.length - 1;

    }


    /*
        When entering from LEFT:

        characters appear near LEFT side.

        When entering from RIGHT:

        characters appear near RIGHT side.
    */

    if (direction === 1) {

        boyPosition = 15;

        girlPosition = 7;

    }

    else {

        boyPosition = 85;

        girlPosition = 77;

    }


    loadRoom();

}


/* =========================================
   LOAD ROOM
========================================= */

function loadRoom() {

    const room =
        rooms[currentRoom];


    /*
        Change background
    */

    roomBackground.style.opacity = "0.15";


    setTimeout(() => {

        roomBackground.style.backgroundImage =
            `url("${room.image}")`;

        roomBackground.style.opacity = "1";

    }, 120);


    /*
        Text
    */

    roomName.textContent =
        room.name;

    loveMessage.textContent =
        room.message;

    girlSpeech.textContent =
        room.speech;


    /*
        Update buttons
    */

    roomButtons.forEach((button, index) => {

        button.classList.toggle(
            "active",
            index === currentRoom
        );

    });


    /*
        Put characters in position
    */

    setCharacterPositions();


    /*
        Make them face front
    */

    boyImage.src =
        boyImages.front;

    girlImage.src =
        girlImages.front;


    /*
        Hide action message
    */

    hideActionMessage();


    /*
        Scroll active room button into view
    */

    const activeButton =
        roomButtons[currentRoom];

    if (activeButton) {

        activeButton.scrollIntoView({

            behavior: "smooth",

            block: "nearest",

            inline: "center"

        });

    }

}


/* =========================================
   DIRECT ROOM BUTTON
========================================= */

roomButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const selectedRoom =
            Number(button.dataset.room);


        /*
            If same room, do nothing.
        */

        if (selectedRoom === currentRoom) {

            return;

        }


        currentRoom =
            selectedRoom;


        /*
            Place characters in the middle
            when user directly selects room.
        */

        boyPosition = 58;

        girlPosition = 44;


        loadRoom();

    });

});


/* =========================================
   CUTE ACTION
========================================= */

cuteAction.addEventListener("click", () => {

    const room =
        rooms[currentRoom];


    actionMessage.textContent =
        room.action;


    actionMessage.classList.remove(
        "hidden"
    );


    /*
        Change girl's speech too.
    */

    girlSpeech.textContent =
        room.action;


    /*
        Hide automatically.
    */

    setTimeout(() => {

        hideActionMessage();

    }, 2500);

});


/* =========================================
   HIDE ACTION
========================================= */

function hideActionMessage() {

    actionMessage.classList.add(
        "hidden"
    );

}


/* =========================================
   MOVEMENT BUTTONS
========================================= */

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


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "ArrowLeft"
        ) {

            moveCharacters("left");

        }


        if (
            event.key === "ArrowRight"
        ) {

            moveCharacters("right");

        }

    }
);


/* =========================================
   TOUCH / MOBILE SWIPE
========================================= */

let touchStartX = 0;

let touchEndX = 0;


document
    .getElementById("gameWorld")
    .addEventListener(
        "touchstart",
        (event) => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        {
            passive: true
        }
    );


document
    .getElementById("gameWorld")
    .addEventListener(
        "touchend",
        (event) => {

            touchEndX =
                event.changedTouches[0].screenX;


            const difference =
                touchEndX - touchStartX;


            /*
                Swipe left
            */

            if (difference < -50) {

                moveCharacters("right");

            }


            /*
                Swipe right
            */

            if (difference > 50) {

                moveCharacters("left");

            }

        },
        {
            passive: true
        }
    );


/* =========================================
   START GAME
========================================= */

loadRoom();
