/*
To Dos
-------------------------

Commands: Attack/Use, Move

Map:
x		x	x
x	x	x	x
		S	


1	2	3	4
5	6	7	8
9	10	11	12

Room Legend
[N, E, S, W]
[-4, -1, +4, +1]

Basic idea for movement. Each room gets an ID that's a number 1-12 laid out
according to the map above. The map legend maps the directions north, east, south, and west to
integers -4, -1, +4, and +1 to "move" to the cell.

In our example, the starting room is room 11. North of room 11 is room 7, thus the -4 assigned to North would take us there.

If a cell doesn't contain a room it is assigned a 0 integer that is checked before movement is calculated.



*/

$(document).ready(function() {

/* Order Matters. Always load items that are required by other items first */
requirejs(['scripts/player','scripts/items','scripts/rooms']);

/* Player variables have moved to player.js */

/* Items have moved to items.js */

/* Rooms have moved to rooms.js */

/*
Command Functions
================================================================================
*/
	var commandArray = ["look", "move", "take", "inventory", "use"];
	// Look Command function
	window.look = function(optionalObject) {
		if (currentRoom.pitchBlack && playerHasLight == false){
			$('.message').text("It is too dark to see. Get some light first.");
		}
		else {
			if(optionalObject) {
				var isAThingCounter = false;
				for (var i = 0; i < currentRoom.things.length; i++) {
					if (currentRoom.things[i].itemName == optionalObject) {
						$('.message').text(currentRoom.things[i].itemDesc);
						isAThingCounter = true;
					}
				};
				for (var i = 0; i < backpack.length; i++) {
					if (backpack[i].itemName == optionalObject) {
						$('.message').text(backpack[i].itemDesc + " It is in your backpack.");
						isAThingCounter = true;
					}
				};
				if (isAThingCounter == false) {
					$('.message').text("Not much to see here.");
				}
			}
			else {
				$('.message').text(currentRoom.lDescModified);
			}
		}
	}

	// Take Command function
	window.take = function(optionalObject) {
		if(optionalObject) {
			for (var i = 0; i < currentRoom.things.length; i++) {
				if (currentRoom.things[i].itemName == optionalObject) {
					if(currentRoom.things[i].canBeTaken) {
						$('.message').text("You take the " + currentRoom.things[i].itemName + ".");
						backpack.push(currentRoom.things[i]);
						currentRoom.things.splice(i,1);
						updateRoomDesc();
					}
					else {
						$('.message').text("You can't take that.");
					}
				}
				else {
					$('.message').text("You can't take that.");
				}
			};
		}
		else {
			$('.message').text("Take what?");
		}
	}

	// Inventory Command function
	window.inventory = function() {
		if(backpack.length > 0) {
			var tempBackpack = [];
			for (var i = 0; i < backpack.length; i++) {
				tempBackpack.push(backpack[i].itemName);
			};
			$('.message').text("You have " + tempBackpack.join(', '));
		}
		else {
			$('.message').text("Your inventory is empty.");
		}
	}

	// Move Command function
	window.move = function(requiredObject) {
		if(requiredObject) {
			var convertedDirection;
			switch(requiredObject) {
			    case "north":
			        convertedDirection = -4;
			        break;
			    case "east":
			        convertedDirection = 1;
			        break;
			    case "south":
			        convertedDirection = 4;
			        break;
			    case "west":
			        convertedDirection = -1;
			        break;
			    default:
			        $('.message').text("That's not a direction.");
			        return
			}
			var moveMath = currentRoom.roomID + convertedDirection;
			if (moveMath == currentRoom.roomID) {
				$('.message').text("You can't move that way.");
			}
			else {
				var isThereARoom = 0;
				for (var i = 0; i < allRooms.length; i++) {
					if(allRooms[i].roomID == moveMath) {
						currentRoom = allRooms[i];
						isThereARoom++;
						if (currentRoom.pitchBlack && playerHasLight) {
							$('.message').text("You are in " + currentRoom.shortDesc);
							updateRoomDesc();
						}
						else if (currentRoom.pitchBlack && playerHasLight == false) {
							$('.message').text("The room is pitch black.");
						}
						else {
							$('.message').text("You are in " + currentRoom.shortDesc);
							updateRoomDesc();
						}
					}
				};
				if(isThereARoom == 0) {
					$('.message').text("You can't go that way.");
				}
			}
		}
		else {
			$('.message').text("Move where?");
		}
	}
	// Use Command
	window.use = function(requiredObject) {
		if (requiredObject) {
			var canUse = false;
			for (var i = 0; i < backpack.length; i++) {
				if (backpack[i].itemName == requiredObject) {
					backpack[i].activate();
					canUse = true;
				}
			};
			for (var i = 0; i < currentRoom.things.length; i++) {
				if (currentRoom.things[i].itemName == requiredObject) {
					currentRoom.things[i].activate();
					canUse = true;
				}
			};

			if (canUse == false) {
				$('.message').text("You don't have a " + requiredObject + " to use.");
			}
		}
		else {
			$('.message').text("Use what?");
		}
	}
/*
Inputs
================================================================================
*/
	$(document).keypress(function(e){
		if(e.which == 13) {
			onSubmit();
			return false;
		}
	});

	function onSubmit() {
		var enteredInputs = $('input').val().split(" ");
		for (var i = 0; i < enteredInputs.length; i++) {
			enteredInputs[i] = enteredInputs[i].toLowerCase();
		};
		var command = enteredInputs[0];
		var modifier = enteredInputs[1];

		if ($.inArray( command, commandArray) > -1) {
			$('.message').text("");
			window[command](modifier);
		}
		else {
			$('.message').text("I don't understand that command.");
		}
		$('input').val("");
	}


});