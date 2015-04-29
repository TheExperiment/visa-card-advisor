Parse.initialize("yTDcauaM45OOCMNtx96W87jPYsZLsEnBNg6Ae0ru", "fTdyJBHcRR5GHEa7Jk8Lx21IfT9ZHqaVXTNCfuuD");

var Question = Parse.Object.extend("Question");
var Answer = Parse.Object.extend("Answer");
var FeatureAffect = Parse.Object.extend("FeatureAffect");
var Feature = Parse.Object.extend("Feature");
var CardRanking = Parse.Object.extend("CardRanking");

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
  var query = new Parse.Query(CardRanking);
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
    if (obj.get("index") == this.get("index")) match = this
  });
  return match
}

// function getFeature(obj) {
//   var features = window.featureCollection
//   var match = null
//   $(features).each(function( index ) {
//     if (obj.id == this.id) match = this
//   });
//   return match
// }

function getQuestion(questionIndex) {
  var questions = window.resultingData
  var match = null
  $(questions).each(function( index ) {
    if (questionIndex == this.get("index")) match = this
  });
  return match
}

function getAnswerForQuestion(question, answerIndex) {
  var match = null
  $(question.get("answers")).each(function( index ) {
    if (answerIndex == this.get("index")) match = this
  });
  return match
}



function affectFeatureScoreByAnswer(questionIndex, answerIndex) {

  var question = getQuestion(questionIndex)
  var answer = getAnswerForQuestion(question, answerIndex)
  var answerAffects = answer.get("affects")

  // Apply the affects
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



function filterCardsByScore(credit) {
  if (credit == 0) return // dont filter any out on answer of "unknown"
  var cards = window.rankCollection 
  var applicableCards = $.grep(cards, function(card) {
      return card.get("credit") <= credit
  });
  window.rankCollection = applicableCards;
  console.log("Cards filtered, " + applicableCards + " cards remain")
}



function affectFeatureScoreByRank(index, amount) {

  console.log(+index + '   ' + amount)

  var features = window.featureCollection

  var feature = features[index]

  var currentScore = feature.get("currentScore")

  feature.set("currentScore", amount)

  console.log(feature.get("copy") + ' new val is ' + feature.get("currentScore"))

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


function getAllFeatures() {
  var features = window.featureCollection
  $(features).each(function( index ) {
    console.log("FINAL Feature " + this.get("copy") + " value is " + this.get("currentScore"))
  });
  return features
}

function getTopThree () {
    var sortedFeatured = getAllFeaturesOrdered()
    finalTop3 = [sortedFeatured[0].get("copy"), sortedFeatured[1].get("copy"), sortedFeatured[2].get("copy")]
    var totalWeight = sortedFeatured[0].get("currentScore")+sortedFeatured[1].get("currentScore")+sortedFeatured[2].get("currentScore")
    finalTop3Weight = [Math.floor(100*(sortedFeatured[0].get("currentScore")/totalWeight)), Math.floor(100*(sortedFeatured[1].get("currentScore")/totalWeight)), Math.floor(100*(sortedFeatured[2].get("currentScore")/totalWeight))];
    console.log(finalTop3Weight[1]);
    // console.log("The 1st ordered feature is " + sortedFeatured[0].get("copy") + " and score is " + sortedFeatured[0].get("currentScore"))
    //sortedCards = getCardsOrderedByFeatureRank()

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

/* Model
    Question
      index: Int
      copy: String
      answers: [Answer]

    Anwser
      index: Int
      copy: String
      affects: [FeatureAffect]

    FeatureAffect
      index: Int
      feature: Feature
      amount: Int

    Feature
      index: Int
      copy: String

    CardRanking
      annual fee: Int
      balance transfer: Int
      cash advances: Int
      custom design: Int
      APR: Int
      introductory offer: Int
      cash back: Int
      reward miles: Int
      prestige: Int
      benefits: Int
      online experience: Int
      mobile experience: Int
*/

function getFeatureSumForFeatures(topThreeFeatures) {
  return topThreeFeatures[0].get("currentScore") + topThreeFeatures[1].get("currentScore") + topThreeFeatures[2].get("currentScore")
}

function getWeightsForFeatures(topThreeFeatures, sumFeatureScore) {
  var weights = []
  $(topThreeFeatures).each(function( index ) {
    var weight = topThreeFeatures[index].get("currentScore") / sumFeatureScore
    weights.push(weight)
  })
  return weights
}

function applyWeightsToCards(topThreeFeatures, weights) {
  var cards = window.rankCollection // [CardRanking]
  $(cards).each(function( index ) {
    var card = this
    var score = 0
    $(topThreeFeatures).each(function( index ) {
      var feature = this
      var rankMap = feature.get("rankMap")
      score += card.get(rankMap) * weights[index]
    })
    card.set("score", score)
    // console.log("card " + card.get("card_name") + " has a score of " + card.get("score"))
  })
  return cards
}

function sortCollectionByParam(collection, param) {
  collection.comparator = function(object) {
    return 1000 - object.get(param);
  };
  return collection.sort()
}

function getFeatureScoresForCard(topThreeFeatures, card) {
  var scores = []
  $(topThreeFeatures).each(function( index ) {
    var feature = this
    var rankMap = feature.get("rankMap")
    scores.push(card.get(rankMap))
  })
  return scores
}

function getFrankenCardScores(topThreeFeatures, collection) {
  var frankenCardScores = []
  $(topThreeFeatures).each(function( index ) {
    var feature = this
    var rankMap = feature.get("rankMap")
    console.log("Sorting based on " + rankMap)
    collection.comparator = function(object) {
      return 1000 - object.get(rankMap);
    };
    collection.sort()
    var bestCard = collection.models[0]
    frankenCardScores.push(bestCard.get(rankMap))
  })
  return frankenCardScores
}

// function getCardsOrderedByFeatureRank() {

//   //Find the top 3 more important features
//   var topThreeFeatures = getAllFeaturesOrdered().slice(0, 3)

//   // Get the sum of all the feature scores
//   var sumFeatureScore = getFeatureSumForFeatures(topThreeFeatures)
  
//   // Get the weight percentages for each feature
//   var weights = getWeightsForFeatures(topThreeFeatures, sumFeatureScore)

//   // Apply the weights to the scores across all credit cards
//   var weightedCards = applyWeightsToCards(topThreeFeatures, weights)
  
//   // Cards now contain a score value, sort them
//   var weightedCardsCollection = new Parse.Collection(weightedCards)
  
//   var sortedRealCardCollection = sortCollectionByParam(weightedCardsCollection, "score")

//   var bestRealCard = sortedRealCardCollection.models[0]

//   console.log("bestRealCard: " + bestRealCard.get("card_name"))
//   console.log(bestRealCard)

//   console.log(sortedRealCardCollection.models)
//   return sortedRealCardCollection.models
// }


function getCardsOrderedByFeatureRank() {

  //Find the top 3 more important features
  window.topThreeFeatures = getAllFeaturesOrdered().slice(0, 3)

  // Get the sum of all the feature scores
  window.sumFeatureScore = getFeatureSumForFeatures(window.topThreeFeatures)

  // Get the weight percentages for each feature
  window.weights = getWeightsForFeatures(window.topThreeFeatures, window.sumFeatureScore)

  // Apply the weights to the scores across all credit cards
  window.weightedCards = applyWeightsToCards(window.topThreeFeatures, window.weights)
  
  // Cards now contain a score value, sort them
  window.weightedCardsCollection = new Parse.Collection(window.weightedCards)

  window.sortedRealCardCollection = sortCollectionByParam(window.weightedCardsCollection, "score")

  /*
  var bestRealCard = sortedRealCardCollection.models[0]

  console.log("bestRealCard: " + bestRealCard.get("card_name"))
  console.log(bestRealCard)

  var realCardScoresForFeatures = getFeatureScoresForCard(topThreeFeatures, bestRealCard)
  console.log("realCardScoresForFeatures: " + realCardScoresForFeatures)
  // Now we know the BEST CARD given that it scored the highest. Next, we need to find how COMPATIBLE the user is with this card.
  // console.log("The BEST CARD is " + bestRealCard.get("card_name") + " with a score of " + bestRealCard.get("score"))
  
  // To find this user's "Ideal Card" (this is the frankenstein card that doesn't exist in real life), we look at the top three feature ranks across all the cards to find the HIGHEST in each feature
  // Sort cards by the 3 features
  var frankenCardScores = getFrankenCardScores(topThreeFeatures, weightedCardsCollection)
  console.log("frankenCardScores: " + frankenCardScores)

  // Now we apply the weights to this frankenstein card to find a new "perfect" score
  var actualCardScore = bestRealCard.get("score")

  var idealScore = 0
  $(weights).each(function( index ) {
    var weight = this
    idealScore += frankenCardScores[index] * weight
  })

  console.log("The actual card score is " + actualCardScore)
  console.log("The frankenCard score is " + idealScore)
  console.log("The users compatibility is " + (actualCardScore/idealScore) + " percent")

  console.log(sortedRealCardCollection.models)
  */
  return window.sortedRealCardCollection.models
}

function getFrankenCompatibility() {

  // To find this user's "Ideal Card" (this is the frankenstein card that doesn't exist in real life), we look at the top three feature ranks across all the cards to find the HIGHEST in each feature
  // Sort cards by the 3 features
  var frankenCardScores = getFrankenCardScores(window.topThreeFeatures, window.weightedCardsCollection)
  console.log("frankenCardScores: " + frankenCardScores)
  
  var compatibility = []
  $(window.sortedRealCardCollection.models).each(function( index ) {
    var bestRealCard = window.sortedRealCardCollection.models[index]
    var realCardScoresForFeatures = getFeatureScoresForCard(topThreeFeatures, bestRealCard)
    // Now we apply the weights to this frankenstein card to find a new "perfect" score
    var actualCardScore = bestRealCard.get("score")
    var idealScore = 0
    $(window.weights).each(function( weightIndex ) {
      var weight = this
      idealScore += frankenCardScores[weightIndex] * weight
    })
    // console.log("The actual card score is " + actualCardScore)
    // console.log("The frankenCard score is " + idealScore)
    console.log("The users compatibility is " + (actualCardScore/idealScore) + " percent")
    compatibility.push( ((actualCardScore/idealScore)*100).toPrecision(2).toString() )

    console.log("compatibility for card " + bestRealCard.get("card_name") + " is " + (actualCardScore/idealScore) )
  })

  return compatibility.sort().reverse();

}
