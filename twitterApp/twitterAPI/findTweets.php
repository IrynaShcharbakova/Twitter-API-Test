<?php
ini_set('display_errors', 1);
require_once('TwitterAPIExchange.php');
require_once('TwitterOauthSettings.php');

$twitterOauthSettings = new TwitterOauthSettings();
$settings = $twitterOauthSettings->getSettings();

$url = 'https://api.twitter.com/1.1/search/tweets.json';
$searchCriteria = $_GET['searchCriteria'];

$parameters = "";
if (isset($_GET['sinceParam']) && isset($_GET['lastTweetId'])) {
    $sinceParam = $_GET['sinceParam'];
    $lastTweetId = $_GET['lastTweetId'];
    $parameters="&".$sinceParam."=".$lastTweetId;
}

$getfield = '?count=50&q='.$searchCriteria.$parameters;
$requestMethod = 'GET';
$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();
