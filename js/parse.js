Parse.initialize("yTDcauaM45OOCMNtx96W87jPYsZLsEnBNg6Ae0ru", "fTdyJBHcRR5GHEa7Jk8Lx21IfT9ZHqaVXTNCfuuD");

var Question = Parse.Object.extend("Question");
var Answer = Parse.Object.extend("Answer");
var FeatureAffect = Parse.Object.extend("FeatureAffect");
var Feature = Parse.Object.extend("Feature");
var CardRank = Parse.Object.extend("CardRanking");
var sortedCards;


  var query = new Parse.Query(Question);
  query.include("answers.affects.feature");
  query.addAscending("index")

  query.find({
    success: function(results) {
      window.resultingData = results
      getFeatures()
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });


function getFeatures() {
  var query = new Parse.Query(Feature);
  query.addAscending("index")
  query.find({
    success: function(results) {
      window.featureCollection = results
      getCardRanks()
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}

function getCardRanks() {
  var query = new Parse.Query(CardRank);
  query.find({
    success: function(results) {
      window.rankCollection = results
      console.log("window.resultingData")
      console.log(window.resultingData)
      console.log("window.featureCollection")
      console.log(window.featureCollection)
      console.log("window.rankCollection")
      console.log(window.rankCollection)
  
    for (i=0; i<=13; i++){    
      getQuestionByIndex(i);
    }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}


function getFeature(obj) {
  var features = window.featureCollection
  var match = null
  $(features).each(function( index ) {
    if (obj.id == this.id) match = this
  });
  return match
}

function affectFeatureScoreByAnswer(questionIndex, answerIndex) {
  var dataSrc = window.resultingData
  var answerAffects = dataSrc[questionIndex].get("answers")[answerIndex].get("affects")
  $(answerAffects).each(function( index ) {
    var affect = this
    var amountToApply = affect.get("amount")
    var targetFeature = getFeature( affect.get("feature") )
    var currentScore = targetFeature.get("currentScore")

    console.log("Feature " + targetFeature.get("copy") + " current score is " + targetFeature.get("currentScore"))
    console.log("Applying amount " + affect.get("amount") + " to feature " + targetFeature.get("copy"))

    var targetFeatureScore = currentScore + amountToApply
    targetFeature.set("currentScore", targetFeatureScore)

    console.log("The new value of " + targetFeature.get("copy") + " is " + targetFeature.get("currentScore"))
  });
}

function affectFeatureScoreByRank(index, amount) {

  var features = window.featureCollection

  var feature = features[index]
  var currentScore = feature.get("currentScore")

  feature.set("currentScore", amount)

  console.log(feature.get("copy") + ' new val is ' + feature.get("currentScore"))

}


function getAllFeatures() {
  var features = window.featureCollection
  $(features).each(function( index ) {
    console.log("FINAL Feature " + this.get("copy") + " value is " + this.get("currentScore"))
  });
  return features
}

function getQuestionByIndex(index) {
  var questions = window.resultingData

    var question = questions[index]
    //console.log("Question index" + question.get("index") + " copy is: " + question.get("copy"))
    $('.data').append('<h1>'+ question.get("copy")+'111</h1>');  
    //$("h1").find("[data-qid='0']").html(question.get("copy"));
    $('h1[data-qid="'+index+'"]').html(question.get("copy"));

    var answers = question.get("answers")
    $(answers).each(function( index ) {
      var answer = this
      $('.slider-label[data-answer-id="q'+ question.get("index") +'-'+index+'"]').html(answer.get("copy"));

      //console.log("Answer index" + answer.get("index") + " copy is: " + answer.get("copy"))
    });

}

function getTopThree () {
    var sortedFeatured = getAllFeaturesOrdered()
    finalTop3 = [sortedFeatured[0].get("copy"), sortedFeatured[1].get("copy"), sortedFeatured[2].get("copy")]
    console.log(finalTop3)
    // console.log("The 1st ordered feature is " + sortedFeatured[0].get("copy") + " and score is " + sortedFeatured[0].get("currentScore"))
    sortedCards = getCardsOrderedByFeatureRank()

    // console.log("The 1st ordered card is " + sortedCards[0].get("card_name"))
  }


function getAllFeaturesOrdered() {
  var features = window.featureCollection
  var featureCollection = new Parse.Collection(features)
  featureCollection.comparator = function(object) {
    return 1000 - object.get("currentScore");
  };
  featureCollection.sort()
  return featureCollection.models
}

function getCardsOrderedByFeatureRank() {
  var cards = window.rankCollection
  var cardsCollection = new Parse.Collection(cards)
  var sortMechanism = getAllFeaturesOrdered()
  cardsCollection.comparator = function(object) {
      return 1000 - object.get(sortMechanism[0].get("rankMap")) + object.get(sortMechanism[1].get("rankMap"))+ object.get(sortMechanism[2].get("rankMap"))
  };
  cardsCollection.sort()
  return cardsCollection.models
}

function printAllQuestionsAndAnswers() {
  var questions = window.resultingData
  $(questions).each(function( index ) {
    var question = this
    console.log("Question index" + question.get("index") + " copy is: " + question.get("copy"))
      $('.slider-holder').append('<h1>'+ question.get("copy")+'111</h1>');  
 

    var answers = question.get("answers")
    $(answers).each(function( index ) {
      var answer = this
      $('.slider-holder').append('<h1>'+ answer.get("copy")+'111</h1>');  
      console.log("Answer index" + answer.get("index") + " copy is: " + answer.get("copy"))
    });
  });
  getQuestionByIndex(0);
}
