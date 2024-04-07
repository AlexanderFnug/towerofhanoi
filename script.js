'use strict'

document.addEventListener('DOMContentLoaded', initGame);

function initGame() {
    const rod1 = document.getElementById('rod-1');
    let bottomPosition = 0; // Initialize bottom position for the first disk

    for (let i = 5; i > 0; i--) {
        const disk = document.createElement('div');
        disk.className = 'disk';
        disk.style.width = `${i * 20 + 40}px`; // Incremental width for different disk sizes
        disk.setAttribute('data-size', i); // We'll use this attribute to prevent placing larger disks on smaller ones
        disk.style.bottom = `${bottomPosition}px`; // Set bottom dynamically
        bottomPosition += 22; // Increment bottom position for the next disk. Adjust based on disk height + some margin
        rod1.appendChild(disk);
    }
}


let selectedRod = null;

document.querySelectorAll('.rod').forEach(rod => {
    rod.addEventListener('click', handleRodClick);
});

function handleRodClick(event) {
    const rod = event.currentTarget;
    if (!selectedRod) {
        if (rod.children.length > 0) {
            selectedRod = rod; // Select the rod if it has disks
            rod.lastElementChild.style.backgroundColor = '#f00'; // Change color to indicate selection
        }
    } else {
        if (selectedRod.lastElementChild) {
            selectedRod.lastElementChild.style.backgroundColor = '#0f0'; // Reset color after moving
        }
        moveDisk(selectedRod, rod);
        selectedRod = null; // Reset after moving
    }
}


function moveDisk(fromRod, toRod) {
    const fromDisk = fromRod.lastElementChild;
    const toDisk = toRod.lastElementChild;
    
    if (!toDisk || parseInt(fromDisk.dataset.size) < parseInt(toDisk.dataset.size)) {
        toRod.appendChild(fromDisk); // Move the disk if the move is legal
    }
}

function checkForWin() {
    const rod2 = document.getElementById('rod-2');
    const rod3 = document.getElementById('rod-3');
    
    // Check if all 5 disks have been moved to rod 2 or rod 3
    if (rod2.children.length === 5 || rod3.children.length === 5) {
        alert('Congratulations, you won!');
    }
}


// Corrected moveDisk function with integrated win check
function moveDisk(fromRod, toRod) {
    const fromDisk = fromRod.lastElementChild;
    const toDisk = toRod.lastElementChild;
    
    // Check if the move is legal (either the toRod is empty or the top disk on toRod is larger)
    if (!toDisk || parseInt(fromDisk.dataset.size) < parseInt(toDisk.dataset.size)) {
        toRod.appendChild(fromDisk); // Move the disk
        checkForWin(); // Check for a win after each move
    }
}

document.getElementById('play-button').addEventListener('click', function() {
    solveHanoiVisual(5, 'rod-1', 'rod-2', 'rod-3', 1000); // Adjust delay as needed
});


function solveHanoi(n, fromRod, toRod, auxRod) {
    if (n === 0) return;
    
    solveHanoi(n - 1, fromRod, auxRod, toRod);
    setTimeout(() => {
        console.log(`Move disk from ${fromRod} to ${toRod}`);
        const fromRodEl = document.getElementById(fromRod);
        const toRodEl = document.getElementById(toRod);
        moveDisk(fromRodEl, toRodEl);
    }, 1000 * n);
    solveHanoi(n - 1, auxRod, toRod, fromRod);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function moveDiskVisual(fromRodId, toRodId) {
    const fromRod = document.getElementById(fromRodId);
    const toRod = document.getElementById(toRodId);
    const movingDisk = fromRod.lastElementChild;

    if (!movingDisk) return; // No disk to move

    // Visual indication of selection (optional)
    movingDisk.style.backgroundColor = '#f00'; // Highlight

    await delay(500); // Short delay for visual effect

    // Move the disk
    toRod.appendChild(movingDisk);

    movingDisk.style.backgroundColor = '#0f0'; // Reset color after move
}

async function solveHanoiVisual(n, sourceId, auxiliaryId, targetId, delayMs) {
    if (n === 0) return;
    await solveHanoiVisual(n - 1, sourceId, targetId, auxiliaryId, delayMs);
    await moveDiskVisual(sourceId, targetId);
    await delay(delayMs);
    await solveHanoiVisual(n - 1, auxiliaryId, sourceId, targetId, delayMs);
}


async function solveHanoiVisual(n, source, auxiliary, target, delayMs) {
    if (n === 0) return;
    await solveHanoiVisual(n - 1, source, target, auxiliary, delayMs);
    await moveDiskVisual(source, target); // Move the top disk from source to target
    await delay(delayMs); // Wait for the move animation to complete
    await solveHanoiVisual(n - 1, auxiliary, source, target, delayMs);
}



