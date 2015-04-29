var sortedCards;

var rankItems = ["No/Low APR","No/Low Annual Fee","Excellent Card Benefits","No/Low Balance Transfer Fee","High Introductory Offer","High Reward Miles","High Cash Back"];
var featureNames = ["annual fee","balance transfer","cash advances","custom design","apr","introductory offer","cash back","reward miles","prestige","benefits","online experience","mobile experience"];
var featureProps = ["annualFeeFirst","balance transfer","cash advances","custom design","apr","introductory offer","cash back","reward miles","prestige","benefits","online experience","mobile experience"];
var finalFeatureNames = ["No/Low Annual Fee","No/Low Balance Transfer Fee","Cash Advances","A Custom Design","No/Low APR","A High Introductory Offer","High Cash Back","High Reward Miles","Prestige","Excellent Card Benefits","A Solid Online Experience","A Solid Mobile Experience"];
var finalTop3;
var finalTop3Weight;
var frankScore;

$(function(){
  createItems();
  function createItems(){
    for(var i=0;i<rankItems.length;i++){
      $('.answers.rank .answer').eq(i).find($('.text')).html(rankItems[i]);
    }
  }
  function createCards(){
    var shuffledCards = [];
    console.log(sortedCards.length)
    for(var i=0;i<sortedCards.length;i++){
      var id = sortedCards[i].get("card_id");
      for(var j=0;j<cards.length;j++){

        if(cards[j].cardId == id){
          var card = cards[j];
          shuffledCards.push(card)
        }  
      }
    }

    $('.cards-list .featured').append("<div class='card-image'><img src='"+shuffledCards[0].cardImage+"'><a href='#'>Try again</a></div><div class='guts'><h2>"+shuffledCards[0].name + " from " + shuffledCards[0].issuer+"</h2><button>Apply Now</button><br><br><div class='bullets'><h3>" + shuffledCards[0].APR + " APR</h3><h3>" + shuffledCards[0].annualFeeFirst + " Intro Annual Fee</h3><h3>" + shuffledCards[0].third + "</h3></div><p><a href='#'>Read More...</a></p></div>");
    $('.cards-list .ad').append("<div class='card-image'><img src='"+shuffledCards[1].cardImage+"'></div><div class='guts'><h2>"+ shuffledCards[1].name + " from " + shuffledCards[1].issuer + "</h2><button>Apply Now</button><br><br><div class='bullets'><h3>" + shuffledCards[1].APR + " APR</h3><h3>" + shuffledCards[1].annualFeeFirst + " Intro Annual Fee</h3><h3>" + shuffledCards[1].third + "</h3></div><p><a href='#'>Read More...</a></p></div>");
    for(var i=2;i<sortedCards.length;i++){
      $('.cards-list').append("<div class='card'><div class='match'>57% Match</div><div class='card-image'><img src='"+shuffledCards[i].cardImage+"'></div><div class='guts'><h2>"+shuffledCards[i].name + " from " + shuffledCards[i].issuer+"</h2><button>Apply Now</button><br><br><div class='bullets'><h3>" + shuffledCards[i].APR + " APR</h3><h3>" + shuffledCards[i].annualFeeFirst + " Intro Annual Fee</h3><h3>" + shuffledCards[i].third + "</h3></div><p><a href='#'>Read More...</a></p></div>");
    }
    
    if(shuffledCards[0].cardId == 6 || shuffledCards[0].cardId == 1){
      $('.conversation .slider-holder').eq(4).addClass('active');
      $('.conversation .slider-holder').eq(4).find($('.slider-label')).eq(0).removeClass('active');
    }
    if(shuffledCards[0].cardId == 7 || shuffledCards[0].cardId == 2 || shuffledCards[0].cardId == 3){
      $('.conversation .slider-holder').eq(9).addClass('active');
      $('.conversation .slider-holder').eq(5).addClass('active');
      $('.conversation .slider-holder').eq(9).find($('.slider-label')).eq(0).removeClass('active');
      $('.conversation .slider-holder').eq(5).find($('.slider-label')).eq(0).removeClass('active');
    }
    if(shuffledCards[0].cardId == 6 || shuffledCards[0].cardId == 8){
      $('.conversation .slider-holder').eq(6).addClass('active');
      $('.conversation .slider-holder').eq(6).find($('.slider-label')).eq(0).removeClass('active');
    }
    if(frankScore[0] > 85){
      $(".match-headline b").html("Great");
    }else if(frankScore[0] > 70){
      $(".match-headline b").html("Good");
    }else if(frankScore[0] < 75){
      $(".match-headline b").html("Fair");
    }

    var lifestyles = 0;
    for(var i=2;i<12;i++){
      if($(".conversation .slider-holder").eq(i).hasClass("active")){
        lifestyles++;
      }
    }
    if(lifestyles == 0){
      $(".conversation .category").eq(2).css({
        display: 'none'
      })
    }

    var finances = 0;
    for(var i=1;i<4;i++){
      if($(".conversation .slider-holder").eq(i).hasClass("active")){
        finances++;
      }
    }
    if(finances == 0){
      $(".conversation .category").eq(1).css({
        display: 'none'
      })
    }

    $('.conversation .slider-holder').eq(12).insertAfter($('.conversation .slider-holder').eq(0));
    $('.conversation .slider-holder').eq(13).insertAfter($('.conversation .slider-holder').eq(4));
  }
  $(".items").sortable({
    animation: 150
  });
  var WIN = $(window);
  var DOC = $(document);
  var initialized = false;
  var currentQuestion = 0;
  var rank = [];
  var rankText = [];

  // Initialize
  pageResize();

  // Page events
  WIN.on('resize',pageResize);
  $('.content').on('scroll',scrollHandler);
  $('.conversation .important').on('click',function(){
    window.location.reload();
  })
  $('.disable').on('click',function(e){
    var item = $(this);
    if($('.sort .answer').length > 3){
      e.stopPropagation();
      item.parent().addClass('disabled');
    }else{
      showMessage('Please rank your top 3 so we can find you a good match.')
    }
    
  })
  $('.question .next').on('click',function(){
    currentQuestion++;
    if(currentQuestion == 1){

      $('.question.sort').removeClass('active');
      $('.question .answer').each(function(){
        rank.push($(this).html());
        rankText.push($(this).find($('.text')).html());
      });
      //console.log(rank)
      $(".question.slider").addClass('active')
      $(".questions").animate({'scrollTop':0},500,'swing');
      if($(this).hasClass('help')){
        toggleSliders('help')
      }else{
        toggleSliders()
      }
      addScoreFromRank();

    }else if(currentQuestion == 2){
      for(var i=0;i<$('.slider .slider-holder.active').length;i++){
        var slider = $('.slider .slider-holder.active').eq(i);
        affectFeatureScoreByAnswer(slider.find($('h1')).attr('data-qid'), slider.find($('[type=range]')).eq(0).val());
        if(i==0){
          affectFeatureScoreByAnswer(slider.find($('h1')).attr('data-qid'), Number(slider.find($('[type=range]')).eq(1).val())+3);
              // console.log(slider.find($('h1')).attr('data-qid'), Number(slider.find($('[type=range]')).eq(1).val())+3)
        }
      }
      //affectFeatureScoreByAnswer(0,4)

      getTopThree();

      $('.profile .important').eq(0).html(finalFeatureNames[featureNames.indexOf(finalTop3[0].toLowerCase())]);
      $('.profile .important').eq(1).html(finalFeatureNames[featureNames.indexOf(finalTop3[1].toLowerCase())]);
      $('.profile .important').eq(2).html(finalFeatureNames[featureNames.indexOf(finalTop3[2].toLowerCase())]);
      if(finalTop3Weight[0] > 50){
        $('.conversation .adj').eq(0).html("really care about");
        $('.profile .adj').eq(0).html("really care about");
      }else if(finalTop3Weight[0] > 20){
        $('.conversation .adj').eq(0).html("would like");
        $('.profile .adj').eq(0).html("would like");
      }

      if(finalTop3Weight[1] > 50){
        $('.conversation .adj').eq(1).html("also care about");
        $('.profile .adj').eq(1).html("also care about");
      }else if(finalTop3Weight[1] > 20){
        $('.conversation .adj').eq(1).html("would also like");
        $('.profile .adj').eq(1).html("would also like");
      }else{
        $('.conversation .adj').eq(1).html("care a little about");
        $('.profile .adj').eq(1).html("care a little about");
      }

      if(finalTop3Weight[2] > 50){
        $('.conversation .adj').eq(2).html("really care about");
        $('.profile .adj').eq(2).html("really care about");
      }else if(finalTop3Weight[2] > 20){
        $('.conversation .adj').eq(2).html("would also like");
        $('.profile .adj').eq(2).html("would also like");
      }else{
        $('.conversation .adj').eq(2).html("care a little about");
        $('.profile .adj').eq(2).html("care a little about");
      }
      
      $('.profile .important').eq(1).html(finalFeatureNames[featureNames.indexOf(finalTop3[1].toLowerCase())]);
      $('.profile .important').eq(2).html(finalFeatureNames[featureNames.indexOf(finalTop3[2].toLowerCase())]);

      $('.conversation .important').eq(0).html(finalFeatureNames[featureNames.indexOf(finalTop3[0].toLowerCase())]);
      $('.conversation .important').eq(1).html(finalFeatureNames[featureNames.indexOf(finalTop3[1].toLowerCase())]);
      $('.conversation .important').eq(2).html(finalFeatureNames[featureNames.indexOf(finalTop3[2].toLowerCase())]);

      for(var i=0;i<$('.conversation .slider-holder').length;i++){
        for(var j=0;j<$('.conversation .slider-holder').eq(i).find($('.slider-container')).length;j++){
          var val = $('.question.slider .slider-holder').eq(i).find($('.slider-container')).eq(j).find($('[type=range]')).val()
          var slider = $('.conversation .slider-holder').eq(i).find($('.slider-container')).eq(j);
          slider.find($('[type=range]')).val(val);
          for(var k=0;k<3;k++){
            slider.find($('.slider-label')).eq(k).removeClass('active');
          }
          slider.find($('.slider-label')).eq(val).addClass('active');
        }
      }

      $(".question.slider").removeClass('active')
      $(".question.profile").addClass('active')
      $(".questions").animate({'scrollTop':0},500,'swing');

      // alert('hello')
      getAllFeatures();
    }else if(currentQuestion == 3){
      
      console.log('test1')
      filterCardsByScore($('.credit-score-slider').val());
      console.log('test2')
      sortedCards = getCardsOrderedByFeatureRank();
      console.log(sortedCards)
      console.log('frankie <br>')
      frankScore = getFrankenCompatibility();
      console.log("frank " + frankScore)
      createCards();

      var matchPerc = $(".match");

      for (i=0; i<matchPerc.length;i++) {
        if(i != 1){
          $(".match").eq(i).html(frankScore[i] + '% Match')
        }else{
          $(".match").eq(i).html('Featured ' + finalFeatureNames[featureNames.indexOf(finalTop3[0].toLowerCase())])
        }

      }

      console.log(matchPerc.length)
      $(".questions").addClass('hidden')
      $("body,html").animate({'scrollTop':0},1000,'swing',rotateCard);
      $(".content").removeClass('hidden')
    }
  })
  $('.yours').on('click',function(){
    $('.questions').removeClass('hidden');
    $('.question').eq(2).removeClass('active');
    $('.question').eq(3).addClass('active');
  })
  $('.questions [type=range]').on('input',function(e) {
    $(this).parent().find($('.slider-label')).removeClass('active')
    $(this).parent().find($('.slider-label')).eq($(this).val()).addClass('active')


      //addToFeatureScores();

  });

  $('.credit-score-slider').on('input',function(){
      console.log($(this).val())
   })


  $('.conversation [type=range]').on('input',function(e) {
    $(this).parent().find($('.slider-label')).removeClass('active')
    $(this).parent().find($('.slider-label')).eq($(this).val()).addClass('active')

  });
  $('.answer').on('click',function(){
    $(this).removeClass('disabled');
  })
  $('.checkout').on('click',function(){
    window.open('checkout/checkout.html','_blank');
  })
  $('.dropdown h1').on('mousedown',function(){
    $('.question input').val($(this).html())
    $('.switch').addClass('active')
    $('.checkout').removeClass('active')
    $('.switch').css({
      display: 'block'
    })
    $('.upload-button').html('Upload Card Image +')
    $('.upload p').html('We will blur the numbers before upload')
    $('.upload .or').html('or')
  })
  $('.upload-button').on('click',function(){
    $('.upload-button').html('<img src="img/cards/yours.png">')
    $('.upload p').html('Your Card')
    $('.upload .or').html('')
    $('.checkout').addClass('active')
    $('.switch').css({display: 'none'})
    $('.card.yours .card-image').html('<img src="img/cards/yours.png">').css({
      border: 'none'
    })
    $('.card.yours img').css({
      display: "block"
    })
    $('.card.yours .guts').html('<img src="img/cards/yours.png">').html('<h2>Your First National Visa® Platinum Credit Card</h2><button>Add a different card</button>')
    
  })
  $('.question input').on('keyup',function(){
    var text = $(this).val().toLowerCase();
    if(text != ""){
      $('.question .dropdown').addClass('open')
      for(var i=0;i<$('.dropdown h1').length;i++){
        if($('.dropdown h1').eq(i).html().toLowerCase().indexOf(text) != -1){
          $('.dropdown h1').eq(i).removeClass('hidden');
        }else{
          $('.dropdown h1').eq(i).addClass('hidden');
        }
      }

    }else{
      $('.question .dropdown').removeClass('open')
    }
  })
  $('.question input').on('blur',function(){
    $('.question .dropdown').removeClass('open')
  })

  function toggleSliders (argument) {
    if(argument != "help"){
      var top3 = [rankText[0],rankText[1],rankText[2]];
      if(top3.indexOf(rankItems[0]) != -1){
        $('.slider .slider-holder').eq(1).addClass("active")
        $('.conversation .slider-holder').eq(1).addClass("active")
      }
      if(top3.indexOf(rankItems[1]) != -1){
        $('.slider .slider-holder').eq(12).addClass("active")
        $('.conversation .slider-holder').eq(12).addClass("active")
      }
      if(top3.indexOf(rankItems[2]) != -1){
        $('.slider .slider-holder').eq(8).addClass("active")
        $('.conversation .slider-holder').eq(8).addClass("active")
      }
      if(top3.indexOf(rankItems[3]) != -1){
        $('.slider .slider-holder').eq(13).addClass("active")
        $('.conversation .slider-holder').eq(13).addClass("active")
      }
      if(top3.indexOf(rankItems[4])!= -1){
        $('.slider .slider-holder').eq(11).addClass("active")
        $('.conversation .slider-holder').eq(11).addClass("active")
      }
      if(top3.indexOf(rankItems[5])!= -1){
        $('.slider .slider-holder').eq(7).addClass("active")
        $('.conversation .slider-holder').eq(7).addClass("active")
        $('.slider .slider-holder').eq(2).addClass("active")
        $('.conversation .slider-holder').eq(2).addClass("active")
      }
      if(top3.indexOf(rankItems[6])!= -1){
        $('.slider .slider-holder').eq(9).addClass("active")
        $('.conversation .slider-holder').eq(9).addClass("active")
        $('.slider .slider-holder').eq(10).addClass("active")
        $('.conversation .slider-holder').eq(10).addClass("active")
      }
    }else{
      $('.slider .slider-holder').eq(1).addClass("active")
      $('.conversation .slider-holder').eq(1).addClass("active")
      $('.slider .slider-holder').eq(2).addClass("active")
      $('.conversation .slider-holder').eq(2).addClass("active")
      $('.slider .slider-holder').eq(8).addClass("active")
      $('.conversation .slider-holder').eq(8).addClass("active")
      $('.slider .slider-holder').eq(11).addClass("active")
      $('.conversation .slider-holder').eq(11).addClass("active")
      $('.slider .slider-holder').eq(12).addClass("active")
      $('.conversation .slider-holder').eq(12).addClass("active")
    }
  }
  // $('.answer, #slide-value').on('click',function(){
  //     alert('hello')
  // })

  function showMessage (message) {
    $('.alert').addClass('open');
    $('.alert .message').html(message)
    setTimeout(function(){
      $('.alert').removeClass('open')
    },4000)
  }
  function rotateCard () {
    $(window).on('mousemove',function(e){
      $('.featured .card-image').css({
        '-webkit-transform': 'perspective(1000px) rotateY('+((WIN_W/2)-e.pageX)/-50+'deg) rotateX('+((WIN_H/2)-e.pageY)/-50+'deg)'
      })
    })
  }

  function addScoreFromRank () {
//method to sort scores on initial screen
 
       var dataSrc = window.resultingData
       //var answerAffects = dataSrc[questionIndex].get("answers")[answerIndex].get("affects")
        //console.log(rank[0])
        //console.log($(rank[0]).attr( "data-feature-id" ))

        if (rank[0]) {
        var featNum = parseInt($(rank[0]).attr( "data-feature-id" ));
        //console.log('tes'+featNum);
        //var score = parseInt(features[featNum].score + 20) 
         //features[featNum].score = score;
        affectFeatureScoreByRank(featNum, 20)
        }

       if (rank[1]) {
        var featNum = parseInt($(rank[1]).attr( "data-feature-id" ));
        //console.log('tes'+featNum);
        //var score = parseInt(features[featNum].score + 20) 
         //features[featNum].score = score;
        affectFeatureScoreByRank(featNum, 15)
        }

       if (rank[2]) {
        var featNum = parseInt($(rank[2]).attr( "data-feature-id" ));
        //console.log('tes'+featNum);
        //var score = parseInt(features[featNum].score + 20) 
         //features[featNum].score = score;
        affectFeatureScoreByRank(featNum, 10)
        }

       if (rank[3]) {
        var featNum = parseInt($(rank[3]).attr( "data-feature-id" ));
        //console.log('tes'+featNum);
        //var score = parseInt(features[featNum].score + 20) 
         //features[featNum].score = score;
        affectFeatureScoreByRank(featNum, 1)
        }

       if (rank[4]) {
        var featNum = parseInt($(rank[4]).attr( "data-feature-id" ));
        //console.log('tes'+featNum);
        //var score = parseInt(features[featNum].score + 20) 
         //features[featNum].score = score;
        affectFeatureScoreByRank(featNum, 1)
        }

       if (rank[5]) {
        var featNum = parseInt($(rank[5]).attr( "data-feature-id" ));
        //console.log('tes'+featNum);
        //var score = parseInt(features[featNum].score + 20) 
         //features[featNum].score = score;
        affectFeatureScoreByRank(featNum, 1)
        }

       if (rank[6]) {
        var featNum = parseInt($(rank[6]).attr( "data-feature-id" ));
        //console.log('tes'+featNum);
        //var score = parseInt(features[featNum].score + 20) 
         //features[featNum].score = score;
        affectFeatureScoreByRank(featNum, 1)
        }


       // if (rank[1]) {
       //  var featNum = $(rank[1]).attr( "data-feature-id" );
       //  var score = parseInt(features[featNum].score + 15) 
       //   features[featNum].score = score;
       //  }

  }
     
  function addMadLib() {

    var obj = _.find(myArray, function(obj) { return obj.id == '45' });
    console.log(obj)

  }
      
  
  function pageResize (e) {
    WIN_H = WIN.height();
    WIN_W = WIN.width();
    
    initialized = true;
  }
  function scrollHandler(){
    currentCard = Math.floor(($('.content').scrollTop() - (262+$('.questions').height()-(WIN_H/4)))/280)
    console.log(currentCard)
    if(currentCard > 2){
      $('.card').removeClass('active');
      $('.card').eq(currentCard).addClass('active')
    }
  }

  // Touch Scroll
  function redraw() {
    if(isTouchDevice){
      window.requestAnimationFrame(function() {
        scrollHandler();
      });
    }
  }
})