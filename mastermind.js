/*  Kevin Kraaijveld CSS Mastermind
============================================================================

1. Variabelen lijst
2. Submit knop
3. Kleur knoppen
4. answer

============================================================================ */

// Laat de functie pas wanneer het document in geladen is
$(document).ready(function() {
  console.log('Mastermind spel van Kevin Kraaijveld');

/* 1. Variabelen lijst
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

  var guess = 0;
  var selectedColor = ''; // 87, 88, 100, 103
  var bGround = ''; // 113

  var isSelected =false; // 84 / 93
  var answerRay = makeAnswer() // 154

  var tempRay = $('.code-pegs'); // 32
  var guessBoxArray = []; // 32 / 37
  var nextGrade = $($('.first-grade')[0]).parent()[0]; // 180 / 181


//Geeft een nummer aan elke rij
  for(var i=9; i>=0; i--){
    guessBoxArray.push(tempRay[i]);
  }

// Geeft aan elke peg een id
    for(var i=0; i<10; i++){
      var guessArray = guessBoxArray[i].getElementsByClassName("code-peg");
      for(var j=0; j<4; j++){
        $(guessArray[j]).attr('id',`c-${i}-${j}`);
      }
    }


// Alle pegs zijn standaard -1 omdat ze van kleur veranderen zodra ze een waarde van 0 tot 5 krijgen
    var masterGuessArray = [[-1,-1,-1,-1],
                            [-1,-1,-1,-1],
                            [-1,-1,-1,-1],
                            [-1,-1,-1,-1],
                            [-1,-1,-1,-1],
                            [-1,-1,-1,-1],
                            [-1,-1,-1,-1],
                            [-1,-1,-1,-1],
                            [-1,-1,-1,-1],
                            [-1,-1,-1,-1]];

/* 2. Submit knop
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

// submit knop
  $('.submit-button').click(function(){
// Dit zorgt er voor dat je alleen de actieve rij kleur kunt geven
    $('.active').removeClass('active');
    var gradeRay = getGrade();
    checkwon(gradeRay);
    var gradeBox = getGradeBox();
    placePegs(gradeRay, gradeBox);
    guess++;
    for(var i=0; i<4; i++){
      $(`#c-${guess}-${i}`).addClass('active');
    }
    $('.submit-button').hide();
  });

// Hide knop
  $('.submit-button').hide();
  var clickCount = 0;


/* 3. Kleur optie knoppen onderin
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

// Wanneer je de kleur knop aanklikt
  $('.selector-inner').click(function () {
    isSelected=true;
    $('.selector-outer').css('background-color' , '#825406'); // Reset kleur
    var peg = ($(this).parent())[0];
    selectedColor = $(this).css('background-color');
    $(peg).css('background-color' , selectedColor);
  });

// Wanneer je de peg aanklikt
  $('.code-peg').click(function(){
    if (isSelected){
// Je kunt alleen de actieve rij een kleur toewijzen
    if ($(this).hasClass('active')) {
      var number = parseInt($(this).css('border')); // Veranderd de border naar een nummer
      //Dit geeft de kleur
      if(number ===1){ // Als de border 1 is:
      $(this).css('background' , 'none'); // Omdat er geen achtergrond is kunnen we er een toewijzen
      $(this).css('background-color', selectedColor);
      $(this).css('border', '2px solid white'); //114
      var coord = $(this).attr('id');
      updateMasterArray(selectedColor, coord);
      clickCount++;
// Toont submit bij 4 clicks
      if(clickCount === 4){
        $('.submit-button').show();
        clickCount = 0;
      }
    }
//Dit verwijderd de  kleur bij een tweede onclick
    else{ // Als de border niet 1 is:
      $(this).css('background',bGround);
      $(this).css('border', '1px solid white');
      clickCount--;
        }
      }
    }
  });


/* 4. Antwoord
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// Genereert antwoord
function makeAnswer(){
  var ray =[];
  for(var i=0; i<4; i++){
    ray.push(Math.floor(Math.random() * 6));
  }
    console.log(ray);
  return ray;

  }

// Dit pakt de coordinaten, haalt de - er uit zodat ik de kleuren van de id's een nummer kan toewijzen
  function updateMasterArray(col, xy) {
    var ray=xy.split('-');
    var x = ray[1];
    var y = ray[2];
    masterGuessArray[x][y] = makeColorANumber(col);
  }
  // Dit geeft aan alle kleuren een nummer zodat ik kan controleren of mijn antwoord klopt met het antwoord van de computer. (129)
  function makeColorANumber(col){
    if (col === 'rgb(255, 0, 0)')return 0; //Rood
    if (col === 'rgb(0, 128, 0)')return 1; //Groen
    if (col === 'rgb(255, 255, 0)')return 2; // Geel
    if (col === 'rgb(128, 0, 128)')return 3; // Paars
    if (col === 'rgb(255, 255, 255)')return 4; // Wit
    if (col === 'rgb(255, 165, 0)')return 5; // Oranje
  }

  function getGrade(){
    var gradRay=[];
    var aRay = [];
    for(var i=0; i<4; i++){
      aRay.push(answerRay[i]);
    }

//  Controleert zwarte pionnen
    for(var i=0; i<4; i++){
      if (masterGuessArray[guess][i] === aRay[i]){
        gradRay.push('black-peg');
        aRay[i] = -1;
        masterGuessArray[guess][i] = -2;
      }
    }

// Contorleert witte pionnen
    for(var i=0; i<4; i++){
      for(var j=0; j<4; j++){
        if(masterGuessArray[guess][i] === aRay[j]){
          gradRay.push('white-peg');
          aRay[j] = -1;
          masterGuessArray[guess][i] = -2;
        }
      }
    }
    return gradRay;
  }

    function getGradeBox(){
      var activeGrade = nextGrade.getElementsByClassName("score-pegs")[0];
      nextGrade = $(nextGrade).prev()[0];
      return activeGrade;
    }

// Plaats de score-pegs als de code-peg de goede kleur heeft
    function placePegs(ray, box){
      var pegArray = box.getElementsByClassName("score-peg");
      for(var i=0; i< ray.length; i++){
        $(pegArray[i]).addClass(`${ray[i]}`);
      }
      $('.white-peg').css('background', 'none').css('background-color', 'white');;
      $('.black-peg').css('background', 'none').css('background-color', 'black');;
}

// Contorleert of alle pionnen zwart zijn
function checkwon(ray){
  var rayStr = ray.join();
  if (rayStr === "black-peg,black-peg,black-peg,black-peg"){
    $('.won').fadeIn(200);
  }
}
});
