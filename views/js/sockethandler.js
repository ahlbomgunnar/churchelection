
$(function () {
  // On vote form submit
  $('form').submit(function(){
    // If nothing sumbitted
    if($('#place').val() === null && $('#party').val() === null && $('#votes').val() % 1 !== 0) Materialize.toast('Please enter stats before proceeding.', 2000);
    // If no party & votes
    else if($('#party').val() === null && $('#votes').val() % 1 !== 0) Materialize.toast('Re-check party and votes.', 2000);
    // If no place & votes
    else if($('#place').val() === null && $('#votes').val() % 1 !== 0) Materialize.toast('Re-check place and votes.', 2000);
    // If no place & party
    else if($('#place').val() === null && $('#party').val() === null ) Materialize.toast('Re-check place and party.', 2000);
    // If place not chosen
  	else if($('#place').val() === null) Materialize.toast('Choose place before proceeding.', 2000);
    // If party not chosen
    else if($('#party').val() === null) Materialize.toast('Choose party before proceeding.', 2000);
    // If votes are not a number
    else if(isNaN($('#votes').val())) Materialize.toast('Vote must be a number', 2000);
    // If votes are not a whole number
    else if($('#votes').val() % 1 !== 0) Materialize.toast('Vote must be an integer.', 2000);
    // If everything alright
    else {
      // Define data objects
      let place = $('#place'), party = $('#party'), votes = $('#votes');
      // Emit object containing updated data
  		socket.emit('update', { place:place.val(), party:party.val(), votes:votes.val() });
      // Reset values
      place.val(''); party.val(''); votes.val('')
  	}
    // Prevent callback
    return false;
  });
  // Await successful update confirmation from server
  socket.on('clientConfirmation', function(object) {
    // Give user confirmation
	  Materialize.toast(object.party + ' now has ' + object.votes + ' votes at ' + object.place + '!', 4500, 'green');
  });
});