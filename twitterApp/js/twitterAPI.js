$(document).ready(function() {
    //get the latest 50 tweets  
    getLatestTweets('');
    
    $("#prevTweetsLinkId").hide();
        
    //search
    $('#searchButton').click(function() {
        //set the viewMode to search result
        $('#viewMode').val(1);
        $("#currentPage").val(0);
        var searchParameter = $('#searchParameter').val();
        
        if (searchParameter.length > 0 && (searchParameter.charAt(0) == "#" || searchParameter.charAt(0) == "@")  ) {
            searchParameter = searchParameter.replace("#",'%23');
            findTweets(searchParameter) ;
        } else {
            alert('the search input is invalid. Should start from # or @');
        }
    });//end search function
    
});//end ready

function findTweets(searchParameter) {
    $("#tweetContent").html("");
    $("#loadingResultMessage").show();
     $.getJSON("twitterAPI/findTweets.php?searchCriteria=" + searchParameter, function(data) {
                var currentPage = $("#currentPage").val();
                var index = 1 + 50*currentPage;
                if (data.errors) {
                    showError(data);
                } else {
                 data.statuses.forEach(function(tweet) {
                  buildTweetsView(tweet, index); 
                  index++;
                    })
                 $("#loadingResultMessage").hide();
                 $("#tweetersCountShows").html("Show (" + (1 + 50*currentPage) + " - " + (index - 1) + ") tweets");
                 };    
    });//getJSON
}

//get latest tweets
function getLatestTweets(parameters) {
    var url = "twitterAPI/getTweets.php" + parameters;
    $("#loadingResultMessage").show();
    $("#tweetContent").html("");
    $.getJSON(url, function(data) {
        if(data.errors) {
          showError(data);  
        } else {
        var currentPage = $("#currentPage").val();
        var index = 1 + 50*currentPage;
        data.forEach(function(tweet) {
             buildTweetsView(tweet, index); 
             index++;
            }
        )
            $("#loadingResultMessage").hide();
            $("#tweetersCountShows").html("Show (" + (1 + 50*currentPage) + " - " + (index - 1) + ") tweets");
        };    
    });//getJSON
    
}

function getNextTweets() {
    var currentPage = $("#currentPage").val();
    currentPage++;
    $("#currentPage").val(currentPage);
    $("#prevTweetsLinkId").show();
    var params = 'sinceParam=max_id&lastTweetId=' + $('#lastTweetId').val();
    if ($("#viewMode").val() == "0") {
        //fetch the next latest 50 tweets
        getLatestTweets('?' + params);
    } else {
        var searchParameter = $('#searchParameter').val();
        if (searchParameter.length > 0 && (searchParameter.charAt(0) == "#" || searchParameter.charAt(0) == "@")  ) {
            searchParameter = searchParameter.replace("#",'%23');
            findTweets(searchParameter+"&" + params) ;
        } else {
            alert('the search input is invalid. Should start from # or @');
        }
        
    }
}

function getPrevTweets() {
    var currentPage = $("#currentPage").val();
    currentPage--;
    $("#currentPage").val(currentPage);
    if (currentPage == 0) {
        $("#prevTweetsLinkId").hide();
    }
    
    var params = 'sinceParam=since_id&lastTweetId=' + $('#lastTweetId').val();
    if ($("#viewMode").val() == "0") {
        //fetch the next latest 50 tweets
        getLatestTweets('?' + params);
    } else {
        var searchParameter = $('#searchParameter').val();
        if (searchParameter.length > 0 && (searchParameter.charAt(0) == "#" || searchParameter.charAt(0) == "@")  ) {
            searchParameter = searchParameter.replace("#",'%23');
            findTweets(searchParameter+"&" + params) ;
        } else {
            alert('the search input is invalid. Should start from # or @');
        }
        
    }
}

function buildTweetsView(tweet, index) {
    var $div = $('<div id="' + tweet.id + '" class="tweetContainer clearfix">').append(
                $('<div class="tweetNumber floatLeftClass">').html("<p>"+ index +"</p>"),
                $('<div class="tweetContent floatLeftClass">')
                    .append( $('<img class="twitterProfileImage floatLeftClass">').attr("src", tweet.user.profile_image_url))
                    .append($('<p class="twitterName floatLeftClass">').text(tweet.user.name))
                    .append($('<p class="twitterHashtagName floatLeftClass">').text("@" + tweet.user.screen_name))
                    .append($('<p class="twitterText floatLeftClass">').text("@" + tweet.text))
                    .append($('<p class="twitterHashtags floatLeftClass">').text("Hashtag(s): " +getHashTags(tweet.entities.hashtags)))
                    .append($('<p class="twitterRetweets floatLeftClass">').text("Number of Retweets: " + tweet.retweet_count))
                    .append($('<p class="twitterFollowers floatLeftClass">').html("<p onclick='findFollowers(" + tweet.id + "," + tweet.user.id +", this);' >Show Followers</p>"))
                ).appendTo("#tweetContent");
        $('#lastTweetId').val(tweet.id);    
}


function getHashTags(hashTags) {
    var hashtag = "";    
    if (hashTags.length != 0) {
        hashTags.forEach(function(item){
            hashtag = hashtag + "#" + item.text + "  ";    
        }) ;
    } else {
        hashtag = "NO hashtags";
    }
    return hashtag;
}

function findFollowers(tweetId, userId, showHideLink) {
    if($('#folowers_'+tweetId).length == 0) {
        $('#'+tweetId).after($('<div id="loading_' + tweetId + '" class="tweetFollowersContainer">').html("<p>Loading...</p>"));
        $.getJSON("twitterAPI/getFollowers.php?userId="+ userId, function(data) {
            var tmp="";
            if (data.errors) {
                tmp = "The error occure. Please try letter.";
            } else if (data.users.length > 0) {       
                data.users.forEach(function(follower) {
                    tmp += ' @' + follower.screen_name;    
                });//cycle
            }//end if
            else {
                tmp = "Current user does not have any followers.";
            }// end else
            $('#loading_' + tweetId).remove();
            $('#'+tweetId).after($('<div id="folowers_' + tweetId + '" class="tweetFollowersContainer">').html("<p>" + tmp + "</p>"));
            $(showHideLink).text('Hide Followers');
        });
    } else {
      $('#folowers_' + tweetId).remove();  
      $(showHideLink).text('Show Followers');
    }
}

function showError(data) {
    alert('Can not obtain data. Twitter API error: ' + data.errors[0].message + ' Code: ' + data.errors[0].code);
}