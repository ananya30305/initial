/* =========================================================
   ROOM DATA
========================================================= */

const rooms = {

    hall: {
        name: "Hall",
        image: "game-assets/rooms/hall.jpg",
        message: "Welcome home, love ♡",
        speech: "I'm coming with you 🥰",
        type: "default"
    },

    kitchen: {
        name: "Kitchen",
        image: "game-assets/rooms/kitchen.jpg",
        message: "Let's make something yummy 🍳",
        speech: "Wait for me! ❤️",
        type: "default"
    },

    bedroom: {
        name: "Bedroom",
        image: "game-assets/rooms/bedroom.jpg",
        message: "Our cozy little room ♡",
        speech: "Come here, sleepyhead 🥺",
        type: "bed"
    },

    bathroom: {
        name: "Bathroom",
        image: "game-assets/rooms/bathroom.jpg",
        message: "Fresh & cozy together ♡",
        speech: "Don't take too long! 🫧",
        type: "bath"
    },

    pooja: {
        name: "Pooja",
        image: "game-assets/rooms/pooja-room.jpg",
        message: "Let's pray together 🪔",
        speech: "Come, let's pray together 🙏",
        type: "pooja"
    }

};


/* =========================================================
   ELEMENTS
========================================================= */

const roomBackground = document.getElementById("roomBackground");
const roomName = document.getElementById("roomName");
const loveMessage = document.getElementById("loveMessage");
const girlSpeech = document.getElementById("girlSpeech");
const boyCharacter = document.getElementById("boyCharacter");
const girlCharacter = document.getElementById("girlCharacter");
const boyImage = document.getElementById("boyImage");
const girlImage = document.getElementById("girlImage");
const poojaInfo = document.getElementById("poojaInfo");
const actionMessage = document.getElementById("actionMessage");
const cuteAction = document.getElementById("cuteAction");
const moveLeft = document.getElementById("moveLeft");
const moveRight = document.getElementById("moveRight");
const roomButtons = document.querySelectorAll(".room-button");
const actionSection = document.querySelector(".action-section");


/* =========================================================
   CREATE HUG & SPECIAL ACTION BUTTONS DYNAMICALLY
========================================================= */

const hugAction = document.createElement("button");
hugAction.className = "cute-action";
hugAction.id = "hugAction";
hugAction.innerHTML = "🤗 Hug";
hugAction.style.marginLeft = "8px";
actionSection.appendChild(hugAction);

const specialAction = document.createElement("button");
specialAction.className = "cute-action hidden";
specialAction.id = "specialAction";
specialAction.style.marginLeft = "8px";
actionSection.appendChild(specialAction);


/* =========================================================
   CHARACTER POSITIONS & STATES
========================================================= */

let boyPosition = 58;
let girlPosition = 50; 
let currentRoomIndex = 0;
let isSpecialStateActive = false;

const roomOrder = [
    "hall",
    "kitchen",
    "bedroom",
    "bathroom",
    "pooja"
];


/* =========================================================
   CHARACTER ASSET SETS PER ROOM TYPE
========================================================= */

function getCharacterAssets(roomType) {
    if (roomType === "bed") {
        return {
            front: { boy: "game-assets/characters/boy/boy-bed-front.png", girl: "game-assets/characters/girl/girl-bed-front.png" },
            left: { boy: "game-assets/characters/boy/boy-bed-left.png", girl: "game-assets/characters/girl/girl-bed-left.png" },
            right: { boy: "game-assets/characters/boy/boy-bed-right.png", girl: "game-assets/characters/girl/girl-bed-right.png" }
        };
    } else if (roomType === "bath") {
        return {
            front: { boy: "game-assets/characters/boy/boy-bath-front.png", girl: "game-assets/characters/girl/girl-bath-front.png" },
            left: { boy: "game-assets/characters/boy/boy-bath-left.png", girl: "game-assets/characters/girl/girl-bath-left.png" },
            right: { boy: "game-assets/characters/boy/boy-bath-right.png", girl: "game-assets/characters/girl/girl-bath-right.png" }
        };
    } else if (roomType === "pooja") {
        return {
            front: { boy: "game-assets/characters/boy/boy-pooja-front.png", girl: "game-assets/characters/girl/girl-pooja-front.png" },
            left: { boy: "game-assets/characters/boy/boy-pooja-left.png", girl: "game-assets/characters/girl/girl-pooja-left.png" },
            right: { boy: "game-assets/characters/boy/boy-pooja-right.png", girl: "game-assets/characters/girl/girl-pooja-right.png" }
        };
    } else {
        return {
            front: { boy: "game-assets/characters/boy/boy-front.png", girl: "game-assets/characters/girl/girl-front.png" },
            left: { boy: "game-assets/characters/boy/boy-walk-left.png", girl: "game-assets/characters/girl/girl-walk-left.png" },
            right: { boy: "game-assets/characters/boy/boy-walk-right.png", girl: "game-assets/characters/girl/girl-walk-right.png" }
        };
    }
}


/* =========================================================
   SET CHARACTER POSITIONS (WIDE GAP ON MOBILE)
========================================================= */

function updateCharacterPositions() {
    // 32% gap on mobile so they are far apart; 8% on desktop
    const isMobile = window.innerWidth <= 768;
    const spacingGap = isMobile ? 48 : 10;

    girlPosition = boyPosition - spacingGap;
    boyCharacter.style.left = boyPosition + "%";
    girlCharacter.style.left = girlPosition + "%";
}
/* =========================================================
   SET STANDING POSITION
========================================================= */

function setStandingPosition() {
    if (isSpecialStateActive) return;

    girlCharacter.style.display = "flex";
    boyCharacter.style.width = ""; // Reset width back to default
    boyImage.style.width = "";
    boyImage.style.height = "";

    const currentRoomKey = roomOrder[currentRoomIndex];
    const room = rooms[currentRoomKey];
    const assets = getCharacterAssets(room.type);

    boyImage.src = assets.front.boy;
    girlImage.src = assets.front.girl;
}


/* =========================================================
   MOVE CHARACTERS
========================================================= */

function moveCharacters(direction) {
    const step = 3.5;
    const currentRoomKey = roomOrder[currentRoomIndex];
    const room = rooms[currentRoomKey];
    const assets = getCharacterAssets(room.type);

    if (isSpecialStateActive) {
        isSpecialStateActive = false;
        girlCharacter.style.display = "flex";
        boyCharacter.style.width = "";
        boyImage.style.width = "";
        boyImage.style.height = "";
    }

    if (direction === "left") {
        boyImage.src = assets.left.boy;
        girlImage.src = assets.left.girl;
        boyPosition -= step;

        if (boyPosition <= 12) {
            changeRoomAtEdge("left");
            return;
        }
    }

    if (direction === "right") {
        boyImage.src = assets.right.boy;
        girlImage.src = assets.right.girl;
        boyPosition += step;

        if (boyPosition >= 88) {
            changeRoomAtEdge("right");
            return;
        }
    }

    updateCharacterPositions();

    clearTimeout(window.walkTimer);
    window.walkTimer = setTimeout(() => {
        setStandingPosition();
    }, 250);
}


/* =========================================================
   ROOM CHANGE WHEN REACHING EDGE
========================================================= */

function changeRoomAtEdge(direction) {
    if (direction === "right") {
        currentRoomIndex++;
        if (currentRoomIndex >= roomOrder.length) {
            currentRoomIndex = roomOrder.length - 1;
            boyPosition = 85;
            updateCharacterPositions();
            setStandingPosition();
            return;
        }
        boyPosition = 20;
    }

    if (direction === "left") {
        currentRoomIndex--;
        if (currentRoomIndex < 0) {
            currentRoomIndex = 0;
            boyPosition = 15;
            updateCharacterPositions();
            setStandingPosition();
            return;
        }
        boyPosition = 75;
    }

    const nextRoom = roomOrder[currentRoomIndex];
    switchRoom(nextRoom);
}


/* =========================================================
   SWITCH ROOM
========================================================= */

function switchRoom(roomKey) {
    const room = rooms[roomKey];
    if (!room) return;

    roomBackground.style.backgroundImage = `url("${room.image}")`;
    roomName.textContent = room.name;
    loveMessage.textContent = room.message;
    girlSpeech.textContent = room.speech;
    isSpecialStateActive = false;
    girlCharacter.style.display = "flex";
    boyCharacter.style.width = "";
    boyImage.style.width = "";
    boyImage.style.height = "";

    roomButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.room === roomKey
        );
    });

    if (roomKey === "pooja") {
        poojaInfo.classList.remove("hidden");
        specialAction.textContent = "🙏 Pray";
        specialAction.classList.remove("hidden");
    } else if (roomKey === "bedroom" || roomKey === "bathroom") {
        poojaInfo.classList.add("hidden");
        specialAction.textContent = "▶️ Play";
        specialAction.classList.remove("hidden");
    } else {
        poojaInfo.classList.add("hidden");
        specialAction.classList.add("hidden");
    }

    updateCharacterPositions();
    setStandingPosition();
}


/* =========================================================
   ROOM BUTTONS
========================================================= */

roomButtons.forEach(button => {
    button.addEventListener("click", () => {
        const roomKey = button.dataset.room;
        currentRoomIndex = roomOrder.indexOf(roomKey);
        boyPosition = 58;
        switchRoom(roomKey);
    });
});


/* =========================================================
   MOVE BUTTONS
========================================================= */

moveLeft.addEventListener("click", () => {
    moveCharacters("left");
});

moveRight.addEventListener("click", () => {
    moveCharacters("right");
});


/* =========================================================
   CUTE ACTION BUTTON
========================================================= */

cuteAction.addEventListener("click", () => {
    const cuteMessages = [
        "Hehe, come closer ❤️",
        "You are my favorite person 🥰",
        "Let's stay together forever ♡",
        "You're so cute! 💕",
        "I love our little home 🏡❤️"
    ];
    const randomIndex = Math.floor(Math.random() * cuteMessages.length);
    actionMessage.textContent = cuteMessages[randomIndex];
    actionMessage.classList.remove("hidden");

    clearTimeout(window.actionTimer);
    window.actionTimer = setTimeout(() => {
        actionMessage.classList.add("hidden");
    }, 2500);
});


/* =========================================================
   HUG BUTTON LOGIC (LARGER SIZE)
========================================================= */

hugAction.addEventListener("click", () => {
    const currentRoomKey = roomOrder[currentRoomIndex];
    isSpecialStateActive = true;
    girlCharacter.style.display = "none"; 

    // Make the display container and image larger for special coupled poses
    boyCharacter.style.width = "220px";
    boyImage.style.width = "220px";
    boyImage.style.height = "250px";

    let hugImage = "";
    if (currentRoomKey === "hall" || currentRoomKey === "kitchen") {
        hugImage = "game-assets/characters/both/hallkitchen-hug.png";
    } else if (currentRoomKey === "bedroom") {
        hugImage = "game-assets/characters/both/bed-hug.png";
    } else if (currentRoomKey === "bathroom") {
        hugImage = "game-assets/characters/both/bath-hug.png";
    } else if (currentRoomKey === "pooja") {
        hugImage = "game-assets/characters/both/pooja-hug.png";
    }

    boyImage.src = hugImage;
    actionMessage.textContent = "I love you 💕";
    actionMessage.classList.remove("hidden");

    clearTimeout(window.actionTimer);
    window.actionTimer = setTimeout(() => {
        actionMessage.classList.add("hidden");
    }, 2500);
});


/* =========================================================
   SPECIAL ACTION BUTTON LOGIC (PLAY / PRAY - LARGER SIZE)
========================================================= */

specialAction.addEventListener("click", () => {
    const currentRoomKey = roomOrder[currentRoomIndex];
    isSpecialStateActive = true;
    girlCharacter.style.display = "none"; 

    // Make the display container and image larger for special coupled poses
    boyCharacter.style.width = "220px";
    boyImage.style.width = "220px";
    boyImage.style.height = "250px";

    let specialImage = "";
    let msg = "";

    if (currentRoomKey === "bedroom") {
        specialImage = "game-assets/characters/both/pillow-attack.png";
        msg = "Pillow fight attack! Take this! 🛏️💥";
    } else if (currentRoomKey === "bathroom") {
        specialImage = "game-assets/characters/both/us-bath.png";
        msg = "Fresh & cozy together in bath 🫧";
    } else if (currentRoomKey === "pooja") {
        specialImage = "game-assets/characters/both/us-pooja.png";
        msg = "God keep us happy, healthy and united always 🙏✨";
    }

    boyImage.src = specialImage;
    actionMessage.textContent = msg;
    actionMessage.classList.remove("hidden");

    clearTimeout(window.actionTimer);
    window.actionTimer = setTimeout(() => {
        actionMessage.classList.add("hidden");
    }, 2500);
});


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        moveCharacters("left");
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        moveCharacters("right");
    }
});


/* =========================================================
   INITIAL ROOM
========================================================= */

switchRoom("hall");